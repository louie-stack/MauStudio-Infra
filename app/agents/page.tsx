"use client";

import { Activity, Cpu } from "lucide-react";
import { useStore } from "@/lib/store";
import type { AgentStatus } from "@/lib/types";
import { useMounted } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Card, Label, Meter, StatusDot } from "@/components/ui";

const TONE: Record<AgentStatus, "live" | "idle" | "paused"> = {
  live: "live",
  idle: "idle",
  paused: "paused",
};

export default function AgentsPage() {
  const mounted = useMounted();
  const agents = useStore((s) => s.agents);
  const systems = useStore((s) => s.systems);
  const cycleAgent = useStore((s) => s.cycleAgent);

  const live = agents.filter((a) => a.status === "live").length;
  const runsToday = agents.reduce((a, x) => a + x.runsToday, 0);
  const avgRate = Math.round(agents.reduce((a, x) => a + x.successRate, 0) / (agents.length || 1));

  return (
    <div>
      <PageHeader
        index="04 · Agents"
        title="The workforce that never sleeps."
        lead="Bespoke AI agents running strategy, production and ops across every account. Toggle a status to bring one on or offline."
      >
        <div className="hidden items-center gap-6 md:flex">
          <div className="text-right">
            <Label>Live</Label>
            <div className="mt-1 flex items-center justify-end gap-2 text-2xl font-semibold tabular-nums">
              <StatusDot tone="live" pulse />
              {mounted ? live : "·"}
            </div>
          </div>
          <span className="h-10 w-px bg-line-2" />
          <div className="text-right">
            <Label>Runs Today</Label>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{mounted ? runsToday : "·"}</div>
          </div>
          <span className="h-10 w-px bg-line-2" />
          <div className="text-right">
            <Label>Avg. Success</Label>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{mounted ? `${avgRate}%` : "·"}</div>
          </div>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-5 px-8 py-8 lg:grid-cols-2">
        {(mounted ? agents : []).map((a) => {
          const sys = systems.find((s) => s.id === a.systemId);
          return (
            <Card key={a.id} className="p-7">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink font-mono text-[16px] text-paper">
                    {a.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-[20px] font-semibold tracking-tight">{a.name}</h3>
                    <div className="mono-meta mt-0.5 text-ink-3">{a.role}</div>
                  </div>
                </div>

                <button
                  onClick={() => cycleAgent(a.id)}
                  className="flex items-center gap-2 rounded-full border border-line-2 px-3 py-1.5 transition-colors hover:border-ink"
                  title="Cycle status"
                >
                  <StatusDot tone={TONE[a.status]} pulse={a.status === "live"} />
                  <span className="mono-label">{a.status}</span>
                </button>
              </div>

              <p className="mt-4 text-[14px] leading-relaxed text-ink-2">{a.summary}</p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded border border-line-2 px-2 py-1 font-mono text-[10px] tracking-wide text-ink-3">
                  <Cpu size={11} /> {a.model}
                </span>
                {sys && (
                  <span className="inline-flex items-center gap-1.5 rounded border border-line-2 px-2 py-1 font-mono text-[10px] tracking-wide text-ink-3">
                    <Activity size={11} /> {sys.name}
                  </span>
                )}
                <span className="ml-auto mono-meta text-ink-4">last run {a.lastRun}</span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line">
                <div className="bg-panel px-4 py-3.5">
                  <Label>Today</Label>
                  <div className="mt-1.5 text-lg font-semibold tabular-nums">{a.runsToday}</div>
                </div>
                <div className="bg-panel px-4 py-3.5">
                  <Label>Total Runs</Label>
                  <div className="mt-1.5 text-lg font-semibold tabular-nums">{a.totalRuns.toLocaleString()}</div>
                </div>
                <div className="bg-panel px-4 py-3.5">
                  <Label>Owner</Label>
                  <div className="mt-1.5 text-lg font-semibold">{a.owner}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <Label>Success Rate</Label>
                  <span className="mono-meta tabular-nums text-ink-2">{a.successRate}%</span>
                </div>
                <Meter value={a.successRate} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
