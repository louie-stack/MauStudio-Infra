"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Bot,
  Boxes,
  CornerDownLeft,
  LayoutDashboard,
  Plus,
  Search,
  SquareKanban,
  UserPlus,
  Users,
} from "lucide-react";
import { useUI } from "@/lib/ui";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Cmd {
  id: string;
  label: string;
  hint: string;
  group: string;
  icon: React.ReactNode;
  keywords?: string;
  run: () => void;
}

export function CommandPalette() {
  const open = useUI((s) => s.paletteOpen);
  const close = useUI((s) => s.closePalette);
  const requestTask = useUI((s) => s.requestTask);
  const requestClient = useUI((s) => s.requestClient);
  const clients = useStore((s) => s.clients);
  const agents = useStore((s) => s.agents);
  const systems = useStore((s) => s.systems);
  const router = useRouter();

  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const go = (href: string) => {
    close();
    router.push(href);
  };

  const commands: Cmd[] = useMemo(() => {
    const nav: Cmd[] = [
      { id: "nav-0", label: "Overview", hint: "Command center", group: "Navigate", icon: <LayoutDashboard size={15} />, run: () => go("/") },
      { id: "nav-1", label: "Work", hint: "The board", group: "Navigate", icon: <SquareKanban size={15} />, run: () => go("/work") },
      { id: "nav-2", label: "Clients", hint: "The roster", group: "Navigate", icon: <Users size={15} />, run: () => go("/clients") },
      { id: "nav-3", label: "Systems", hint: "Productized library", group: "Navigate", icon: <Boxes size={15} />, run: () => go("/systems") },
      { id: "nav-4", label: "Agents", hint: "AI workforce", group: "Navigate", icon: <Bot size={15} />, run: () => go("/agents") },
    ];
    const actions: Cmd[] = [
      { id: "act-task", label: "Create task", hint: "Add to the board", group: "Actions", icon: <Plus size={15} />, keywords: "new add", run: () => { requestTask("backlog"); router.push("/work"); } },
      { id: "act-client", label: "Add client", hint: "New engagement", group: "Actions", icon: <UserPlus size={15} />, keywords: "new create", run: () => { requestClient(); router.push("/clients"); } },
    ];
    const clientCmds: Cmd[] = clients.map((c) => ({
      id: `cl-${c.id}`, label: c.name, hint: `${c.sector} · client`, group: "Clients", icon: <Users size={15} />, keywords: c.sector, run: () => go("/clients"),
    }));
    const agentCmds: Cmd[] = agents.map((a) => ({
      id: `ag-${a.id}`, label: a.name, hint: `${a.role} · agent`, group: "Agents", icon: <Bot size={15} />, keywords: a.role, run: () => go("/agents"),
    }));
    const systemCmds: Cmd[] = systems.map((s) => ({
      id: `sy-${s.id}`, label: s.name, hint: `${s.category} · system`, group: "Systems", icon: <Boxes size={15} />, keywords: s.category, run: () => go("/systems"),
    }));
    return [...nav, ...actions, ...clientCmds, ...agentCmds, ...systemCmds];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients, agents, systems]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return commands;
    return commands.filter((c) => (c.label + " " + c.hint + " " + (c.keywords ?? "")).toLowerCase().includes(t));
  }, [q, commands]);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => setSel(0), [q]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); filtered[sel]?.run(); }
    else if (e.key === "Escape") { e.preventDefault(); close(); }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${sel}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  // group the filtered list, preserving order
  const groups: { name: string; items: { cmd: Cmd; idx: number }[] }[] = [];
  filtered.forEach((cmd, idx) => {
    let g = groups.find((x) => x.name === cmd.group);
    if (!g) { g = { name: cmd.group, items: [] }; groups.push(g); }
    g.items.push({ cmd, idx });
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={close}
        >
          <motion.div
            className="glass w-full max-w-xl overflow-hidden rounded-xl shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={16} className="text-ink-3" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Search or jump to…"
                className="w-full bg-transparent py-4 text-[15px] outline-none placeholder:text-ink-4"
              />
              <kbd className="rounded border border-line-2 px-1.5 py-0.5 font-mono text-[10px] text-ink-4">ESC</kbd>
            </div>

            <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <div className="px-3 py-8 text-center mono-meta text-ink-4">No matches</div>
              )}
              {groups.map((g) => (
                <div key={g.name} className="mb-1">
                  <div className="mono-label px-3 pb-1.5 pt-2">{g.name}</div>
                  {g.items.map(({ cmd, idx }) => (
                    <button
                      key={cmd.id}
                      data-idx={idx}
                      onMouseEnter={() => setSel(idx)}
                      onClick={cmd.run}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                        sel === idx ? "bg-white/[0.07]" : "hover:bg-white/[0.03]",
                      )}
                    >
                      <span className={cn("shrink-0", sel === idx ? "text-accent" : "text-ink-3")}>{cmd.icon}</span>
                      <span className="flex-1 text-[14px] font-medium text-ink">{cmd.label}</span>
                      <span className="mono-meta text-ink-4">{cmd.hint}</span>
                      {sel === idx && <CornerDownLeft size={13} className="text-ink-3" />}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
