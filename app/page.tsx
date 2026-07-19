"use client";

import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { COLUMNS } from "@/lib/types";
import { cn, currency, relTime, useMounted } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Avatar, Card, Label, Meter, PriorityTag, StatusDot } from "@/components/ui";

const P_RANK = { critical: 0, high: 1, med: 2, low: 3 } as const;

export default function OverviewPage() {
  const mounted = useMounted();
  const { tasks, clients, agents, systems, activity } = useStore();

  const activeClients = clients.filter((c) => c.status === "active");
  const wip = tasks.filter((t) => t.column === "active" || t.column === "review");
  const liveAgents = agents.filter((a) => a.status === "live");
  const mrr = activeClients.reduce((s, c) => s + c.mrr, 0);
  const liveSystems = systems.filter((s) => s.status === "live");

  const colCounts = COLUMNS.map((c) => ({
    ...c,
    n: tasks.filter((t) => t.column === c.id).length,
  }));
  const total = tasks.length || 1;

  const focus = [...tasks]
    .filter((t) => t.column !== "shipped")
    .sort((a, b) => P_RANK[a.priority] - P_RANK[b.priority] || (a.due ?? "9").localeCompare(b.due ?? "9"))
    .slice(0, 5);

  const stats = [
    { label: "Active Clients", value: String(activeClients.length), sub: `${clients.length} total`, meter: (activeClients.length / clients.length) * 100 },
    { label: "Work In Progress", value: String(wip.length), sub: `${tasks.length} tasks tracked`, meter: (wip.length / total) * 100 },
    { label: "Agents Live", value: `${liveAgents.length}/${agents.length}`, sub: "operating now", meter: (liveAgents.length / agents.length) * 100 },
    { label: "Monthly Value", value: currency(mrr), sub: "active retainers", meter: 76 },
    { label: "Systems Live", value: String(liveSystems.length), sub: `${systems.length} in library`, meter: (liveSystems.length / systems.length) * 100 },
  ];

  return (
    <div>
      <PageHeader
        index="00 · Command Center"
        title="Studio at a glance."
        lead="Everything the studio is running: clients, work in flight, and the agents doing the work, in one operating surface."
      >
        <span className="mono-meta hidden items-center gap-2 rounded-full border border-line-2 px-3 py-2 md:inline-flex">
          <StatusDot tone="live" pulse />
          All systems operational
        </span>
      </PageHeader>

      <div className="px-8 py-8">
        {/* Stat tiles */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3 lg:grid-cols-5">
          {stats.map((s, i) => (
            <div key={s.label} className="bg-panel p-5">
              <Label>{s.label}</Label>
              <div className="mt-4 flex items-end gap-2">
                <span className="display text-[38px] font-semibold tabular-nums">
                  {mounted ? s.value : "·"}
                </span>
              </div>
              <div className="mt-3">
                <Meter value={mounted ? s.meter : 0} />
              </div>
              <div className="mono-meta mt-2 flex items-center gap-1.5 text-ink-4">
                {i === 3 && <TrendingUp size={11} strokeWidth={2} />}
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column: pipeline + focus */}
          <div className="space-y-6 lg:col-span-2">
            {/* Pipeline */}
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

              {/* distribution bar */}
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

            {/* Focus list */}
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
                      className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-panel-2"
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
