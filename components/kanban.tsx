"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { COLUMNS, type ColumnId, type Task } from "@/lib/types";
import { cn, dueLabel } from "@/lib/utils";
import { Avatar, PriorityTag } from "@/components/ui";

const DUE_TONE: Record<string, string> = {
  over: "text-ink border-line-3 bg-panel-2",
  soon: "text-ink-2 border-line-2",
  ok: "text-ink-4 border-line",
  none: "text-ink-4 border-line",
};

/* --- Card face (shared by sortable + overlay) -------------------------- */
function CardFace({ task, dragging }: { task: Task; dragging?: boolean }) {
  const clients = useStore((s) => s.clients);
  const client = clients.find((c) => c.id === task.clientId);
  const due = dueLabel(task.due);
  return (
    <div
      className={cn(
        "select-none rounded-lg border border-line bg-panel p-4 transition-shadow",
        dragging
          ? "rotate-[1.5deg] border-accent/30 shadow-[0_0_0_1px_rgba(95,227,238,0.2),0_24px_50px_-18px_rgba(95,227,238,0.45)]"
          : "hover:border-accent/25 hover:shadow-[0_16px_34px_-24px_rgba(95,227,238,0.4)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <PriorityTag p={task.priority} withLabel={false} />
        {client ? (
          <span className="mono-label truncate">{client.name}</span>
        ) : (
          <span className="mono-label text-ink-4">Internal</span>
        )}
      </div>

      <p className="mt-3 text-[14px] font-medium leading-snug tracking-tight">{task.title}</p>

      {task.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {task.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded border border-line-2 px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-ink-3">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <span className={cn("rounded-full border px-2 py-1 font-mono text-[10px] tracking-wide", DUE_TONE[due.tone])}>
          {due.label}
        </span>
        <Avatar name={task.assignee} kind={task.assigneeKind} size={24} />
      </div>
    </div>
  );
}

/* --- Sortable wrapper -------------------------------------------------- */
function SortableCard({ task, onOpen }: { task: Task; onOpen: (t: Task) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { column: task.column },
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn("cursor-grab active:cursor-grabbing", isDragging && "opacity-40")}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(task)}
    >
      <CardFace task={task} />
    </div>
  );
}

/* --- Column ------------------------------------------------------------ */
function Column({
  id,
  label,
  hint,
  tasks,
  onOpen,
  onAdd,
}: {
  id: ColumnId;
  label: string;
  hint: string;
  tasks: Task[];
  onOpen: (t: Task) => void;
  onAdd: (c: ColumnId) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `col:${id}` });
  return (
    <div className="flex min-w-[258px] flex-1 flex-col">
      <div className="flex items-center justify-between px-1 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="mono-label text-ink">{label}</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-line-2 px-1.5 font-mono text-[11px] text-ink-2 tabular-nums">
            {tasks.length}
          </span>
        </div>
        <button onClick={() => onAdd(id)} className="text-ink-3 transition-colors hover:text-ink" title={`Add to ${label}`}>
          <Plus size={16} />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-2.5 rounded-xl border border-dashed p-2.5 transition-colors",
          isOver ? "border-accent/40 bg-accent/[0.06]" : "border-line bg-white/[0.015]",
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => (
            <SortableCard key={t.id} task={t} onOpen={onOpen} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <button
            onClick={() => onAdd(id)}
            className="flex flex-1 items-center justify-center rounded-lg py-10 mono-meta text-ink-4 transition-colors hover:text-ink-2"
          >
            {hint}
          </button>
        )}
      </div>
    </div>
  );
}

/* --- Board ------------------------------------------------------------- */
export function Board({
  onOpen,
  onAdd,
  filterClient,
}: {
  onOpen: (t: Task) => void;
  onAdd: (c: ColumnId) => void;
  filterClient?: string | null;
}) {
  const tasks = useStore((s) => s.tasks);
  const moveTask = useStore((s) => s.moveTask);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const grouped = useMemo(() => {
    const g: Record<ColumnId, Task[]> = { backlog: [], active: [], review: [], shipped: [] };
    const scoped = filterClient ? tasks.filter((t) => t.clientId === filterClient) : tasks;
    for (const t of scoped) g[t.column].push(t);
    for (const k of Object.keys(g) as ColumnId[]) g[k].sort((a, b) => a.order - b.order);
    return g;
  }, [tasks, filterClient]);

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) ?? null : null;

  function colOf(id: string): ColumnId | null {
    if (id.startsWith("col:")) return id.slice(4) as ColumnId;
    return tasks.find((t) => t.id === id)?.column ?? null;
  }

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const toCol = colOf(String(over.id));
    if (!toCol) return;
    let toIndex: number;
    if (String(over.id).startsWith("col:")) {
      toIndex = grouped[toCol].length;
    } else {
      toIndex = grouped[toCol].findIndex((t) => t.id === over.id);
      if (toIndex < 0) toIndex = grouped[toCol].length;
    }
    moveTask(String(active.id), toCol, toIndex);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex gap-3 overflow-x-auto px-8 pb-10">
        {COLUMNS.map((c) => (
          <Column
            key={c.id}
            id={c.id}
            label={c.label}
            hint={c.hint}
            tasks={grouped[c.id]}
            onOpen={onOpen}
            onAdd={onAdd}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.16,1,0.3,1)" }}>
        {activeTask ? (
          <div className="w-[280px]">
            <CardFace task={activeTask} dragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
