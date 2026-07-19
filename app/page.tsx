"use client";

import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "@/lib/store";
import { COLUMNS } from "@/lib/types";
import { cn, currency, relTime, series, useMounted } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Avatar, Card, Label, Meter, PriorityTag, StatusDot } from "@/components/ui";
import { AreaChart } from "@/components/spark";
import { CountUp } from "@/components/count-up";

const P_RANK = { critical: 0, high: 1, med: 2, low: 3 } as const;

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "burning the midnight oil";
  if (h < 12) return "good morning";
  if (h < 18) return "good afternoon";
  return "good evening";
}

export default function OverviewPage() {
  const mounted = useMounted();
  const { tasks, clients, agents, systems, activity } = useStore();

  const activeClients = clients.filter((c) => c.status === "active");
  const wip = tasks.filter((t) => t.column === "active" || t.column === "review");
  const liveAgents = agents.filter((a) => a.status === "live");
  const mrr = activeClients.reduce((s, c) => s + c.mrr, 0);
  const liveSystems = systems.filter((s) => s.status === "live");

  const colCounts = COLUMNS.map((c) => ({ ...c, n: tasks.filter((t) => t.column === c.id).length }));
  const total = tasks.length || 1;

  const focus = [...tasks]
    .filter((t) => t.column !== "shipped")
    .sort((a, b) => P_RANK[a.priority] - P_RANK[b.priority] || (a.due ?? "9").localeCompare(b.due ?? "9"))
    .slice(0, 5);

  // 14-day studio throughput (deterministic, reads as a trend)
  const flow = series("studio-throughput", 14, 3, 21);
  const flowTotal = flow.reduce((a, b) => a + b, 0);
  const flowAvg = Math.round(flowTotal / flow.length);
  const flowPeak = Math.max(...flow);

  const stats: { label: string; node: React.ReactNode; sub: string; meter: number; up?: boolean }[] = [
    { label: "Active Clients", node: <CountUp value={activeClients.length} />, sub: `${clients.length} total`, meter: (activeClients.length / clients.length) * 100 },
    { label: "Work In Progress", node: <CountUp value={wip.length} />, sub: `${tasks.length} tasks tracked`, meter: (wip.length / total) * 100 },
    { label: "Agents Live", node: `${liveAgents.length}/${agents.length}`, sub: "operating now", meter: (liveAgents.length / agents.length) * 100 },
    { label: "Monthly Value", node: <CountUp value={mrr} format={currency} />, sub: "active retainers", meter: 76, up: true },
    { label: "Systems Live", node: <CountUp value={liveSystems.length} />, sub: `${systems.length} in library`, meter: (liveSystems.length / systems.length) * 100 },
  ];

  return (
    <div>
      <PageHeader
        index="00 · Command Center"
        title="Studio at a glance."
        lead="Everything the studio is running: clients, work in flight, and the agents doing the work, in one operating surface."
      >
        <div className="flex flex-col items-end gap-2">
          <span className="mono-meta text-ink-3">{mounted ? `// ${greeting()}` : "//"}</span>
          <span className="mono-meta inline-flex items-center gap-2 rounded-full border border-line-2 px-3 py-2">
            <StatusDot tone="live" pulse />
            All systems operational
          </span>
        </div>
      </PageHeader>

      <div className="px-8 py-8">
        {/* Stat tiles */}
        <motion.div
          className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3 lg:grid-cols-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-panel p-5">
              <Label>{s.label}</Label>
              <div className="mt-4 flex items-end gap-2">
                <span className="display text-[38px] font-semibold tabular-nums">{mounted ? s.node : "·"}</span>
              </div>
              <div className="mt-3">
                <Meter value={mounted ? s.meter : 0} />
              </div>
              <div className="mono-meta mt-2 flex items-center gap-1.5 text-ink-4">
                {s.up && <TrendingUp size={11} strokeWidth={2} className="text-accent" />}
                {s.sub}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Throughput */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="mt-6 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Label>14-Day Throughput</Label>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">Work shipped &amp; advanced</h3>
              </div>
              <div className="flex items-center gap-6">
                {[
                  ["Total", String(flowTotal)],
                  ["Avg / day", String(flowAvg)],
                  ["Peak", String(flowPeak)],
                ].map(([k, v]) => (
                  <div key={k} className="text-right">
                    <Label>{k}</Label>
                    <div className="mt-1 text-xl font-semibold tabular-nums">{mounted ? v : "·"}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">{mounted && <AreaChart points={flow} uid="throughput" h={140} />}</div>
          </Card>
        </motion.div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column: pipeline + focus */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Work Pipeline</Label>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight">Everything in flight</h3>
                </div>
                <Link href="/work" className="mono-label flex items-center gap-1 text-ink-2 hover:text-ink">
                  Open board <ArrowUpRight size={13} />
                </Link>
              </div>

              <div className="mt-6 flex h-2 w-full overflow-hidden rounded-full bg-white/10">
                {colCounts.map((c, i) => (
                  <div
                    key={c.id}
                    className={cn("h-full", i % 2 === 0 ? "grad-fill" : "bg-white/25")}
                    style={{ width: `${(c.n / total) * 100}%` }}
                    title={`${c.label}: ${c.n}`}
                  />
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4">
                {colCounts.map((c) => (
                  <div key={c.id} className="bg-panel px-4 py-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-semibold tabular-nums">{mounted ? c.n : "·"}</span>
                    </div>
                    <div className="mono-label mt-2">{c.label}</div>
                    <div className="mono-meta mt-1 text-ink-4">{c.hint}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-6">
                <div>
                  <Label>Focus</Label>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight">Needs attention next</h3>
                </div>
              </div>
              <div className="mt-4 divide-y divide-line">
                {(mounted ? focus : []).map((t) => {
                  const client = clients.find((c) => c.id === t.clientId);
                  return (
                    <Link
                      key={t.id}
                      href="/work"
                      className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-white/[0.02]"
                    >
                      <PriorityTag p={t.priority} withLabel={false} />
                      <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{t.title}</span>
                      {client && <span className="mono-meta hidden text-ink-3 sm:inline">{client.name}</span>}
                      <Avatar name={t.assignee} kind={t.assigneeKind} size={24} />
                    </Link>
                  );
                })}
                {!mounted && <div className="px-6 py-10 text-center mono-meta text-ink-4">Loading…</div>}
              </div>
            </Card>
          </div>

          {/* Right column: agents + activity */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-6">
                <Label>Agents</Label>
                <Link href="/agents" className="mono-label text-ink-2 hover:text-ink">
                  Manage
                </Link>
              </div>
              <div className="mt-4 divide-y divide-line">
                {(mounted ? agents : []).map((a) => (
                  <div key={a.id} className="flex items-center gap-3 px-6 py-3.5">
                    <Avatar name={a.name} kind="agent" size={30} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] font-semibold">{a.name}</div>
                      <div className="mono-meta truncate text-ink-3">{a.role}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusDot tone={a.status === "live" ? "live" : a.status === "idle" ? "idle" : "paused"} pulse={a.status === "live"} />
                      <span className="mono-meta w-10 text-right text-ink-3">{a.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="px-6 pt-6">
                <Label>Activity</Label>
              </div>
              <div className="mt-4 space-y-4 px-6 pb-6">
                {(mounted ? activity.slice(0, 6) : []).map((ev) => (
                  <div key={ev.id} className="flex gap-3">
                    <div className="relative mt-1.5">
                      <StatusDot tone={ev.actorKind === "agent" ? "live" : "muted"} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] leading-snug text-ink-2">
                        <span className="font-semibold text-ink">{ev.actor}</span> {ev.text}
                      </p>
                      <span className="mono-meta text-ink-4">{relTime(ev.ts)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
