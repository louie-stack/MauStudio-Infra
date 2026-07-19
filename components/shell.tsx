"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bot, Boxes, LayoutDashboard, SquareKanban, Users } from "lucide-react";
import { cn, useMounted } from "@/lib/utils";
import { StatusDot } from "@/components/ui";

const NAV = [
  { href: "/", label: "Overview", code: "00", icon: LayoutDashboard },
  { href: "/work", label: "Work", code: "01", icon: SquareKanban },
  { href: "/clients", label: "Clients", code: "02", icon: Users },
  { href: "/systems", label: "Systems", code: "03", icon: Boxes },
  { href: "/agents", label: "Agents", code: "04", icon: Bot },
];

function Clock() {
  const mounted = useMounted();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!mounted) return <span className="mono-meta tabular-nums">--:--:--</span>;
  return (
    <span className="mono-meta tabular-nums text-ink-2">
      {now.toLocaleTimeString("en-US", { hour12: false })}
    </span>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const section = NAV.find((n) => (n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)));

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-line bg-panel">
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-line px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-ink font-mono text-[13px] font-medium text-paper">
            M/
          </div>
          <div className="leading-none">
            <div className="text-[15px] font-semibold tracking-tight">Mau Studio</div>
            <div className="mono-label mt-1">Studio OS</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <div className="mono-label px-2 pb-3 pt-1">Navigate</div>
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] transition-colors",
                      active ? "bg-ink text-paper" : "text-ink-2 hover:bg-panel-2 hover:text-ink",
                    )}
                  >
                    <Icon size={16} strokeWidth={1.75} className={active ? "opacity-100" : "opacity-70"} />
                    <span className="flex-1 font-medium tracking-tight">{item.label}</span>
                    <span
                      className={cn(
                        "font-mono text-[10px] tracking-widest",
                        active ? "text-paper/50" : "text-ink-4",
                      )}
                    >
                      {item.code}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* System status */}
        <div className="border-t border-line px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <StatusDot tone="live" pulse />
              <span className="mono-label">Sys.Online</span>
            </span>
            <Clock />
          </div>
          <div className="mono-meta mt-3 flex items-center justify-between text-ink-4">
            <span>SYS.UPDATED // 2026</span>
            <span>v1.0</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-[240px] flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Top strip */}
        <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-line bg-paper/85 px-8 backdrop-blur-md">
          <div className="mono-meta flex items-center gap-2">
            <span className="text-ink-4">MAU-OS</span>
            <span className="text-ink-4">/</span>
            <span className="text-ink-2">{section?.label ?? "·"}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="mono-meta hidden text-ink-4 sm:inline">41.8781°N / 87.6298°W</span>
            <span className="h-3.5 w-px bg-line-2" />
            <span className="mono-meta text-ink-3">STUDIO OS</span>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
