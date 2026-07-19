"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Layers } from "lucide-react";
import { useStore } from "@/lib/store";
import type { SystemStatus } from "@/lib/types";
import { cn, useMounted } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Card, Chip, Label, Meter, StatusDot } from "@/components/ui";

const STATUS_TONE: Record<SystemStatus, "live" | "idle" | "paused" | "muted"> = {
  live: "live",
  beta: "idle",
  internal: "paused",
  concept: "muted",
};

const FILTERS: { key: SystemStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "beta", label: "Beta" },
  { key: "internal", label: "Internal" },
  { key: "concept", label: "Concept" },
];

export default function SystemsPage() {
  const mounted = useMounted();
  const systems = useStore((s) => s.systems);
  const clients = useStore((s) => s.clients);
  const [filter, setFilter] = useState<SystemStatus | "all">("all");

  const shown = filter === "all" ? systems : systems.filter((s) => s.status === filter);
  const avgReuse = Math.round(systems.reduce((a, s) => a + s.reusability, 0) / (systems.length || 1));
  const totalDeploys = systems.reduce((a, s) => a + s.deployments.length, 0);

  return (
    <div>
      <PageHeader
        index="03 · Systems"
        title="What we've built, packaged to reuse."
        lead="Every engagement leaves an asset. These are the productized systems the studio can redeploy for the next client."
      >
        <div className="hidden items-center gap-6 md:flex">
          <div className="text-right">
            <Label>Avg. Reusability</Label>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{mounted ? `${avgReuse}%` : "·"}</div>
          </div>
          <span className="h-10 w-px bg-line-2" />
          <div className="text-right">
            <Label>Deployments</Label>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{mounted ? totalDeploys : "·"}</div>
          </div>
        </div>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2 px-8 pt-6">
        {FILTERS.map((f) => (
          <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 px-8 py-8 lg:grid-cols-2">
        {(mounted ? shown : []).map((sys, i) => {
          const bornClient = clients.find((c) => c.id === sys.bornFrom);
          return (
            <motion.div
              key={sys.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
            <Card className="flex h-full flex-col p-7">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-line-2 bg-panel-2">
                    <Layers size={18} strokeWidth={1.75} />
                  </div>
                  <div>
                    <div className="mono-label">{sys.category}</div>
                    <h3 className="mt-1 text-[20px] font-semibold tracking-tight">{sys.name}</h3>
                  </div>
                </div>
                <span className="flex items-center gap-2 rounded-full border border-line-2 px-2.5 py-1">
                  <StatusDot tone={STATUS_TONE[sys.status]} pulse={sys.status === "live"} />
                  <span className="mono-label">{sys.status}</span>
                </span>
              </div>

              <p className="mt-4 text-[14px] leading-relaxed text-ink-2">{sys.summary}</p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {sys.stack.map((s) => (
                  <span key={s} className="rounded border border-line-2 px-2 py-1 font-mono text-[10px] tracking-wide text-ink-3">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-6 border-t border-line pt-5">
                <div className="mb-2 flex items-center justify-between">
                  <Label>Reusability</Label>
                  <span className="mono-meta tabular-nums text-ink-2">{sys.reusability}%</span>
                </div>
                <Meter value={sys.reusability} />
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <Label>Born From</Label>
                  <div className="mt-1.5 text-[13.5px] font-medium">{bornClient?.name ?? "Studio R&D"}</div>
                </div>
                <div className="text-right">
                  <Label>Deployed</Label>
                  <div className="mt-1.5 flex items-center justify-end gap-1">
                    {sys.deployments.length === 0 ? (
                      <span className="mono-meta text-ink-4">·</span>
                    ) : (
                      sys.deployments.map((id) => {
                        const c = clients.find((x) => x.id === id);
                        return (
                          <span key={id} className="glass flex h-6 w-6 items-center justify-center rounded font-mono text-[9px] text-ink" title={c?.name}>
                            {c?.code ?? "?"}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-lg bg-panel-2 px-4 py-3">
                <span className={cn("mono-meta", "text-ink-2")}>{sys.model}</span>
                {sys.demo && <span className="mono-meta text-ink-4">{sys.demo}</span>}
              </div>
            </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
