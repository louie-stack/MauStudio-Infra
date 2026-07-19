"use client";

import { useEffect, useState } from "react";

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** Gate store-derived UI until after mount to avoid hydration mismatch. */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function currency(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `$${n}`;
}

const DAY = 86400000;

export function relTime(iso: string) {
  const then = Date.parse(iso);
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(then).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Due-date label relative to a fixed studio "today" (2026-07-19). */
export function dueLabel(iso: string | null): { label: string; tone: "over" | "soon" | "ok" | "none" } {
  if (!iso) return { label: "No date", tone: "none" };
  const TODAY = Date.UTC(2026, 6, 19);
  const due = Date.parse(iso);
  const days = Math.round((due - TODAY) / DAY);
  if (days < 0) return { label: `${Math.abs(days)}d ago`, tone: "over" };
  if (days === 0) return { label: "Today", tone: "soon" };
  if (days === 1) return { label: "Tomorrow", tone: "soon" };
  if (days <= 3) return { label: `In ${days}d`, tone: "soon" };
  return { label: `In ${days}d`, tone: "ok" };
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function monthsSince(iso: string) {
  const TODAY = Date.UTC(2026, 6, 19);
  const start = Date.parse(iso);
  const months = Math.max(1, Math.round((TODAY - start) / (DAY * 30)));
  return months;
}
