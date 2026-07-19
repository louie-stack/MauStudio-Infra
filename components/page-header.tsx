"use client";

import { Label } from "@/components/ui";

export function PageHeader({
  index,
  title,
  lead,
  children,
}: {
  index: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line px-8 pb-8 pt-9">
      <div className="max-w-2xl">
        <Label>{index}</Label>
        <h1 className="display mt-3 text-[42px] font-semibold">{title}</h1>
        {lead && <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{lead}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
