"use client";

import { Activity, Cpu } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "@/lib/store";
import type { AgentStatus } from "@/lib/types";
import { series, useMounted } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Card, Label, Meter, StatusDot } from "@/components/ui";
import { AgentSigil } from "@/components/agent-art";
import { Sparkline } from "@/components/spark";
import { CountUp } from "@/components/count-up";

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
              {mounted ? <CountUp value={live} /> : "·"}
            </div>
          </div>
          <span className="h-10 w-px bg-line-2" />
          <div className="text-right">
            <Label>Runs Today</Label>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{mounted ? <CountUp value={runsToday} /> : "·"}</div>
          </div>
          <span className="h-10 w-px bg-line-2" />
          <div className="text-right">
            <Label>Avg. Success</Label>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{mounted ? <CountUp value={avgRate} format={(n) => `${Math.round(n)}%`} /> : "·"}</div>
          </div>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-5 px-8 py-8 lg:grid-cols-2">
        {(mounted ? agents : []).map((a, i) => {
          const sys = systems.find((s) => s.id === a.systemId);
          const trend = series(a.id + "runs", 24, 20, 100);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="p-7">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <AgentSigil id={a.id} size={52} radius={13} />
                    <div>
                      <h3 className="text-[20px] font-semibold tracking-tight">{a.name}</h3>
                      <div className="mono-meta mt-0.5 text-ink-3">{a.role}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => cycleAgent(a.id)}
                    className="flex items-center gap-2 rounded-full border border-line-2 px-3 py-1.5 transition-colors hover:border-accent/40"
                    title="Cycle status"
                  >
                    <StatusDot tone={TONE[a.status]} pulse={a.status === "live"} />
                    <span className="mono-label">{a.status}</span>
                  </button>
                </div>

                <p className="mt-4 text-[14px] leading-relaxed text-ink-2">{a.summary}</p>

                {/* activity sparkline */}
                <div className="mt-5 flex items-center justify-between rounded-lg border border-line bg-white/[0.015] px-4 py-3">
                  <div>
                    <Label>Activity · 24h</Label>
                    <div className="mono-meta mt-1 text-ink-4">peak {Math.max(...trend)} runs/hr</div>
                  </div>
                  <Sparkline points={trend} uid={a.id} w={150} h={34} />
                </div>

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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
