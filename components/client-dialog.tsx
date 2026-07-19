"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Client, ClientStatus } from "@/lib/types";
import { Label } from "@/components/ui";

const field =
  "w-full rounded-md border border-line-2 bg-white/[0.03] px-3 py-2 text-[14px] outline-none transition-colors focus:border-accent placeholder:text-ink-4";
const STATUSES: ClientStatus[] = ["active", "onboarding", "paused", "archived"];

export function ClientDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addClient = useStore((s) => s.addClient);
  const [f, setF] = useState({ name: "", code: "", sector: "", engagement: "Retainer", mrr: "", status: "onboarding" as ClientStatus, summary: "", tags: "" });

  function save() {
    if (!f.name.trim()) return;
    const client: Client = {
      id: f.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `client-${Date.now()}`,
      name: f.name.trim(),
      code: (f.code.trim() || f.name.trim().slice(0, 2)).toUpperCase().slice(0, 3),
      sector: f.sector.trim() || "General",
      status: f.status,
      lead: "Studio",
      since: new Date(Date.UTC(2026, 6, 19)).toISOString().slice(0, 10),
      engagement: f.engagement,
      mrr: Number(f.mrr) || 0,
      health: 70,
      summary: f.summary.trim() || "New engagement.",
      systemIds: [],
      tags: f.tags.split(",").map((s) => s.trim()).filter(Boolean),
    };
    addClient(client);
    setF({ name: "", code: "", sector: "", engagement: "Retainer", mrr: "", status: "onboarding", summary: "", tags: "" });
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}
        >
          <motion.div
            className="panel w-full max-w-lg overflow-hidden shadow-[0_30px_80px_-30px_rgba(12,12,11,0.5)]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <Label>New Client</Label>
              <button onClick={onClose} className="text-ink-3 hover:text-ink"><X size={18} /></button>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div className="grid grid-cols-[1fr_100px] gap-4">
                <div>
                  <Label>Name</Label>
                  <input autoFocus value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Client name" className={`${field} mt-2`} />
                </div>
                <div>
                  <Label>Code</Label>
                  <input value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} placeholder="AV" maxLength={3} className={`${field} mt-2 uppercase`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sector</Label>
                  <input value={f.sector} onChange={(e) => setF({ ...f, sector: e.target.value })} placeholder="e.g. DTC / Apparel" className={`${field} mt-2`} />
                </div>
                <div>
                  <Label>Status</Label>
                  <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as ClientStatus })} className={`${field} mt-2`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Engagement</Label>
                  <input value={f.engagement} onChange={(e) => setF({ ...f, engagement: e.target.value })} className={`${field} mt-2`} />
                </div>
                <div>
                  <Label>Monthly Value (USD)</Label>
                  <input type="number" value={f.mrr} onChange={(e) => setF({ ...f, mrr: e.target.value })} placeholder="0" className={`${field} mt-2`} />
                </div>
              </div>
              <div>
                <Label>Summary</Label>
                <textarea value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} rows={2} placeholder="What are we doing for them?" className={`${field} mt-2 resize-none`} />
              </div>
              <div>
                <Label>Tags</Label>
                <input value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} placeholder="comma, separated" className={`${field} mt-2`} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-line px-6 py-4">
              <button onClick={onClose} className="rounded-md px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-ink-2 hover:bg-panel-2">Cancel</button>
              <button onClick={save} className="grad-cta rounded-md px-4 py-2 font-mono text-[11px] uppercase tracking-wider">Add Client</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
