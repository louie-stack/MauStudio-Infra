"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Trash2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { COLUMNS, type ColumnId, type Priority, type Task } from "@/lib/types";
import { Label } from "@/components/ui";

const PRIORITIES: Priority[] = ["low", "med", "high", "critical"];

const field =
  "w-full rounded-md border border-line-2 bg-panel px-3 py-2 text-[14px] outline-none transition-colors focus:border-ink placeholder:text-ink-4";

export function TaskDialog({
  open,
  task,
  defaultColumn,
  onClose,
}: {
  open: boolean;
  task: Task | null;
  defaultColumn: ColumnId;
  onClose: () => void;
}) {
  const { clients, addTask, updateTask, deleteTask } = useStore();
  const [form, setForm] = useState(() => blank(defaultColumn));

  useEffect(() => {
    if (open) {
      setForm(
        task
          ? {
              title: task.title,
              note: task.note ?? "",
              clientId: task.clientId ?? "",
              column: task.column,
              priority: task.priority,
              assignee: task.assignee,
              assigneeKind: task.assigneeKind,
              due: task.due ?? "",
              tags: task.tags.join(", "),
            }
          : blank(defaultColumn),
      );
    }
  }, [open, task, defaultColumn]);

  function save() {
    if (!form.title.trim()) return;
    const payload = {
      title: form.title.trim(),
      note: form.note.trim() || undefined,
      clientId: form.clientId || null,
      column: form.column,
      priority: form.priority,
      assignee: form.assignee.trim() || "Unassigned",
      assigneeKind: form.assigneeKind,
      due: form.due || null,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (task) updateTask(task.id, payload);
    else addTask(payload);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/20 p-4 backdrop-blur-sm sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="panel w-full max-w-lg overflow-hidden shadow-[0_30px_80px_-30px_rgba(12,12,11,0.5)]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <Label>{task ? "Edit Task" : "New Task"}</Label>
              <button onClick={onClose} className="text-ink-3 transition-colors hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <Label>Title</Label>
                <input
                  autoFocus
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && e.metaKey && save()}
                  placeholder="What needs to happen?"
                  className={`${field} mt-2`}
                />
              </div>

              <div>
                <Label>Note</Label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Optional detail…"
                  rows={2}
                  className={`${field} mt-2 resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client</Label>
                  <select
                    value={form.clientId}
                    onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                    className={`${field} mt-2`}
                  >
                    <option value="">Internal / none</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Stage</Label>
                  <select
                    value={form.column}
                    onChange={(e) => setForm({ ...form, column: e.target.value as ColumnId })}
                    className={`${field} mt-2`}
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                    className={`${field} mt-2`}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Due</Label>
                  <input
                    type="date"
                    value={form.due}
                    onChange={(e) => setForm({ ...form, due: e.target.value })}
                    className={`${field} mt-2`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Assignee</Label>
                  <input
                    value={form.assignee}
                    onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                    placeholder="Name or agent"
                    className={`${field} mt-2`}
                  />
                </div>
                <div>
                  <Label>Owner Type</Label>
                  <div className="mt-2 flex overflow-hidden rounded-md border border-line-2">
                    {(["human", "agent"] as const).map((k) => (
                      <button
                        key={k}
                        onClick={() => setForm({ ...form, assigneeKind: k })}
                        className={`flex-1 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                          form.assigneeKind === k ? "bg-ink text-paper" : "text-ink-2 hover:bg-panel-2"
                        }`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="comma, separated"
                  className={`${field} mt-2`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line px-6 py-4">
              {task ? (
                <button
                  onClick={() => {
                    deleteTask(task.id);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-3 transition-colors hover:text-ink"
                >
                  <Trash2 size={14} /> Delete
                </button>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="rounded-md px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-ink-2 transition-colors hover:bg-panel-2"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  className="rounded-md bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-paper transition-opacity hover:opacity-90"
                >
                  {task ? "Save" : "Create"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function blank(column: ColumnId) {
  return {
    title: "",
    note: "",
    clientId: "",
    column,
    priority: "med" as Priority,
    assignee: "",
    assigneeKind: "human" as Task["assigneeKind"],
    due: "",
    tags: "",
  };
}
