"use client";

import { cn, initials } from "@/lib/utils";
import type { Priority } from "@/lib/types";

/* --- Mono section label ------------------------------------------------ */
export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("mono-label", className)}>{children}</span>;
}

/* --- Status dot -------------------------------------------------------- */
export function StatusDot({
  tone = "live",
  pulse = false,
  className,
}: {
  tone?: "live" | "idle" | "paused" | "muted";
  pulse?: boolean;
  className?: string;
}) {
  const styles: Record<string, string> = {
    live: "bg-ink",
    idle: "bg-ink-3",
    paused: "bg-transparent border border-line-3",
    muted: "bg-ink-4",
  };
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 shrink-0 rounded-full",
        styles[tone],
        pulse && tone === "live" && "pulse",
        className,
      )}
    />
  );
}

/* --- Chip -------------------------------------------------------------- */
export function Chip({
  children,
  className,
  onClick,
  active,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line-2 text-ink-2 hover:border-ink hover:text-ink",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

/* --- Priority glyph (signal bars) ------------------------------------- */
const P_LEVEL: Record<Priority, number> = { low: 1, med: 2, high: 3, critical: 4 };
const P_LABEL: Record<Priority, string> = { low: "Low", med: "Med", high: "High", critical: "Crit" };

export function PriorityTag({ p, withLabel = true }: { p: Priority; withLabel?: boolean }) {
  const level = P_LEVEL[p];
  return (
    <span className="inline-flex items-center gap-1.5" title={`Priority: ${P_LABEL[p]}`}>
      <span className="flex items-end gap-[2px]">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn("w-[3px] rounded-[1px]", i <= level ? "bg-ink" : "bg-line-2")}
            style={{ height: `${4 + i * 2}px` }}
          />
        ))}
      </span>
      {withLabel && <span className="mono-meta text-ink-2">{P_LABEL[p]}</span>}
    </span>
  );
}

/* --- Avatar ------------------------------------------------------------ */
export function Avatar({
  name,
  kind = "human",
  size = 26,
}: {
  name: string;
  kind?: "human" | "agent";
  size?: number;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-mono uppercase",
        kind === "agent" ? "rounded-md bg-ink text-paper" : "rounded-full border border-line-2 bg-panel-2 text-ink-2",
      )}
      style={{ width: size, height: size, fontSize: size * 0.34, letterSpacing: "0.02em" }}
      title={`${name}${kind === "agent" ? " · agent" : ""}`}
    >
      {kind === "agent" ? name.slice(0, 2).toUpperCase() : initials(name)}
    </span>
  );
}

/* --- Meter (health / reusability / rate) ------------------------------ */
export function Meter({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("relative block h-[3px] w-full overflow-hidden rounded-full bg-line-2", className)}>
      <span
        className="absolute inset-y-0 left-0 rounded-full bg-ink transition-[width] duration-700"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </span>
  );
}

/* --- Card shell -------------------------------------------------------- */
export function Card({
  children,
  className,
  interactive,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "panel",
        interactive && "cursor-pointer transition-all duration-200 hover:border-line-3 hover:shadow-[0_1px_0_rgba(12,12,11,0.04),0_12px_28px_-18px_rgba(12,12,11,0.25)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
