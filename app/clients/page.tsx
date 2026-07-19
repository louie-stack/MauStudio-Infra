"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Plus, X } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Client, ClientStatus } from "@/lib/types";
import { cn, currency, monthsSince, useMounted } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { ClientDialog } from "@/components/client-dialog";
import { Card, Label, Meter, StatusDot } from "@/components/ui";

const STATUS_TONE: Record<ClientStatus, "live" | "idle" | "paused" | "muted"> = {
  active: "live",
  onboarding: "idle",
  paused: "paused",
  archived: "muted",
};

export default function ClientsPage() {
  const mounted = useMounted();
  const clients = useStore((s) => s.clients);
  const systems = useStore((s) => s.systems);
  const tasks = useStore((s) => s.tasks);
  const cycleClientStatus = useStore((s) => s.updateClient);
  const [selected, setSelected] = useState<Client | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const sel = selected ? clients.find((c) => c.id === selected.id) ?? null : null;

  return (
    <div>
      <PageHeader index="02 · Clients" title="The roster." lead="Who the studio serves, what we run for them, and how each account is doing.">
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-paper transition-opacity hover:opacity-90"
        >
          <Plus size={15} /> Add Client
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-5 px-8 py-8 md:grid-cols-2 xl:grid-cols-3">
        {(mounted ? clients : []).map((c) => {
          const openTasks = tasks.filter((t) => t.clientId === c.id && t.column !== "shipped").length;
          return (
            <Card key={c.id} interactive onClick={() => setSelected(c)} className="flex flex-col p-6">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-ink font-mono text-[15px] font-medium text-paper">
                  {c.code}
                </div>
                <span className="flex items-center gap-2">
                  <StatusDot tone={STATUS_TONE[c.status]} pulse={c.status === "active"} />
                  <span className="mono-label">{c.status}</span>
                </span>
              </div>

              <h3 className="mt-5 text-[22px] font-semibold tracking-tight">{c.name}</h3>
              <div className="mono-meta mt-1 text-ink-3">{c.sector}</div>

              <p className="mt-3 line-clamp-2 text-[13.5px] leading-relaxed text-ink-2">{c.summary}</p>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <Label>Monthly</Label>
                  <div className="mt-1.5 text-lg font-semibold tabular-nums">{currency(c.mrr)}</div>
                </div>
                <div>
                  <Label>Open Work</Label>
                  <div className="mt-1.5 text-lg font-semibold tabular-nums">{openTasks}</div>
                </div>
                <div className="w-24">
                  <div className="mono-meta mb-1.5 flex justify-between text-ink-4">
                    <span>Health</span>
                    <span className="tabular-nums text-ink-2">{c.health}</span>
                  </div>
                  <Meter value={c.health} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {sel && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-ink/20 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-panel"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-ink font-mono text-[14px] text-paper">{sel.code}</div>
                  <div>
                    <div className="text-lg font-semibold tracking-tight">{sel.name}</div>
                    <div className="mono-meta text-ink-3">{sel.sector}</div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-ink-3 hover:text-ink"><X size={18} /></button>
              </div>

              <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
                {/* status control */}
                <div className="flex items-center justify-between rounded-lg border border-line bg-panel-2 px-4 py-3">
                  <span className="flex items-center gap-2">
                    <StatusDot tone={STATUS_TONE[sel.status]} pulse={sel.status === "active"} />
                    <span className="text-[13px] font-medium capitalize">{sel.status}</span>
                  </span>
                  <button
                    onClick={() => cycleClientStatus(sel.id, { status: nextStatus(sel.status) })}
                    className="mono-label text-ink-2 hover:text-ink"
                  >
                    Advance →
                  </button>
                </div>

                <div>
                  <Label>Overview</Label>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">{sel.summary}</p>
                </div>

                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
                  {[
                    ["Engagement", sel.engagement],
                    ["Monthly Value", currency(sel.mrr)],
                    ["Studio Lead", sel.lead],
                    ["Tenure", `${monthsSince(sel.since)} mo`],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-panel px-4 py-3.5">
                      <Label>{k}</Label>
                      <div className="mt-1.5 text-[14px] font-semibold tabular-nums">{v}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label>Account Health</Label>
                    <span className="mono-meta tabular-nums text-ink-2">{sel.health}/100</span>
                  </div>
                  <Meter value={sel.health} />
                </div>

                {sel.systemIds.length > 0 && (
                  <div>
                    <Label>Systems Deployed</Label>
                    <div className="mt-3 space-y-2">
                      {sel.systemIds.map((id) => {
                        const sys = systems.find((s) => s.id === id);
                        if (!sys) return null;
                        return (
                          <Link key={id} href="/systems" className="flex items-center justify-between rounded-md border border-line px-3.5 py-2.5 transition-colors hover:border-line-3">
                            <span className="text-[13.5px] font-medium">{sys.name}</span>
                            <ArrowUpRight size={14} className="text-ink-3" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <Label>Open Work</Label>
                  <div className="mt-3 space-y-1.5">
                    {tasks.filter((t) => t.clientId === sel.id && t.column !== "shipped").map((t) => (
                      <div key={t.id} className="flex items-center gap-3 rounded-md border border-line px-3.5 py-2.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", t.column === "review" ? "bg-ink" : "bg-ink-3")} />
                        <span className="min-w-0 flex-1 truncate text-[13px]">{t.title}</span>
                        <span className="mono-meta capitalize text-ink-4">{t.column}</span>
                      </div>
                    ))}
                    {tasks.filter((t) => t.clientId === sel.id && t.column !== "shipped").length === 0 && (
                      <div className="mono-meta text-ink-4">No open work.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-line px-6 py-4">
                <Link href="/work" className="flex items-center justify-center gap-2 rounded-md bg-ink py-3 font-mono text-[11px] uppercase tracking-wider text-paper hover:opacity-90">
                  Open board <ArrowUpRight size={14} />
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <ClientDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

function nextStatus(s: ClientStatus): ClientStatus {
  const order: ClientStatus[] = ["onboarding", "active", "paused", "archived"];
  const i = order.indexOf(s);
  return order[(i + 1) % order.length];
}
