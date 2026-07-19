"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import type { ColumnId, Task } from "@/lib/types";
import { useMounted } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Board } from "@/components/kanban";
import { TaskDialog } from "@/components/task-dialog";
import { Chip } from "@/components/ui";

export default function WorkPage() {
  const mounted = useMounted();
  const clients = useStore((s) => s.clients);
  const tasks = useStore((s) => s.tasks);

  const [filter, setFilter] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [defaultCol, setDefaultCol] = useState<ColumnId>("backlog");

  function openNew(col: ColumnId) {
    setEditing(null);
    setDefaultCol(col);
    setDialogOpen(true);
  }
  function openEdit(t: Task) {
    setEditing(t);
    setDialogOpen(true);
  }

  return (
    <div>
      <PageHeader index="01 · Work" title="The board." lead="Drag work across stages. Every card ties to a client and an owner, human or agent.">
        <button
          onClick={() => openNew("backlog")}
          className="grad-cta flex items-center gap-2 rounded-md px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider"
        >
          <Plus size={15} /> New Task
        </button>
      </PageHeader>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2 px-8 pt-6">
        <span className="mono-label mr-1">Filter</span>
        <Chip active={filter === null} onClick={() => setFilter(null)}>
          All · {tasks.length}
        </Chip>
        {clients.map((c) => {
          const n = tasks.filter((t) => t.clientId === c.id).length;
          if (n === 0) return null;
          return (
            <Chip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
              {c.name} · {n}
            </Chip>
          );
        })}
      </div>

      <div className="pt-6">
        {mounted ? (
          <Board onOpen={openEdit} onAdd={openNew} filterClient={filter} />
        ) : (
          <div className="px-8 py-20 text-center mono-meta text-ink-4">Loading board…</div>
        )}
      </div>

      <TaskDialog open={dialogOpen} task={editing} defaultColumn={defaultCol} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
