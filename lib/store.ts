"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Activity, Agent, Client, ColumnId, ProductSystem, Task } from "./types";
import { ACTIVITY, AGENTS, CLIENTS, SYSTEMS, TASKS } from "./seed";

interface State {
  tasks: Task[];
  clients: Client[];
  systems: ProductSystem[];
  agents: Agent[];
  activity: Activity[];
  _hydrated: boolean;

  // task ops
  addTask: (partial: Partial<Task> & { title: string }) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (activeId: string, toColumn: ColumnId, toIndex: number) => void;

  // client ops
  addClient: (c: Client) => void;
  updateClient: (id: string, patch: Partial<Client>) => void;

  // agent ops
  cycleAgent: (id: string) => void;

  logActivity: (actor: string, actorKind: Activity["actorKind"], text: string) => void;
  resetAll: () => void;
}

const now = () => new Date(Date.UTC(2026, 6, 19, 14, 0)).toISOString();

export const useStore = create<State>()(
  persist(
    (set) => ({
      tasks: TASKS,
      clients: CLIENTS,
      systems: SYSTEMS,
      agents: AGENTS,
      activity: ACTIVITY,
      _hydrated: false,

      addTask: (partial) =>
        set((s) => {
          const maxOrder = s.tasks.reduce((m, t) => Math.max(m, t.order), 0);
          const task: Task = {
            id: `task-${Math.round(maxOrder + 1)}-${s.tasks.length}`,
            title: partial.title,
            clientId: partial.clientId ?? null,
            column: partial.column ?? "backlog",
            priority: partial.priority ?? "med",
            assignee: partial.assignee ?? "Unassigned",
            assigneeKind: partial.assigneeKind ?? "human",
            due: partial.due ?? null,
            tags: partial.tags ?? [],
            note: partial.note,
            order: maxOrder + 1,
            updatedAt: now(),
          };
          return {
            tasks: [...s.tasks, task],
            activity: [
              { id: `act-${s.activity.length + 1}-${maxOrder}`, actor: "You", actorKind: "human" as const, text: `created "${task.title}"`, ts: now() },
              ...s.activity,
            ].slice(0, 40),
          };
        }),

      updateTask: (id, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: now() } : t)),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      moveTask: (activeId, toColumn, toIndex) =>
        set((s) => {
          const active = s.tasks.find((t) => t.id === activeId);
          if (!active) return {};
          // build the destination column list without the active card
          const dest = s.tasks
            .filter((t) => t.column === toColumn && t.id !== activeId)
            .sort((a, b) => a.order - b.order);
          const moved = { ...active, column: toColumn, updatedAt: now() };
          dest.splice(Math.max(0, Math.min(toIndex, dest.length)), 0, moved);
          const reordered = dest.map((t, i) => ({ ...t, order: i }));
          const others = s.tasks.filter((t) => t.column !== toColumn && t.id !== activeId);
          return { tasks: [...others, ...reordered] };
        }),

      addClient: (c) =>
        set((s) => ({
          clients: [c, ...s.clients],
          activity: [
            { id: `act-c-${s.clients.length + 1}`, actor: "You", actorKind: "human" as const, text: `added client ${c.name}`, ts: now() },
            ...s.activity,
          ].slice(0, 40),
        })),

      updateClient: (id, patch) =>
        set((s) => ({ clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),

      cycleAgent: (id) =>
        set((s) => ({
          agents: s.agents.map((ag) => {
            if (ag.id !== id) return ag;
            const next: Agent["status"] =
              ag.status === "live" ? "idle" : ag.status === "idle" ? "paused" : "live";
            return { ...ag, status: next };
          }),
        })),

      logActivity: (actor, actorKind, text) =>
        set((s) => ({
          activity: [
            { id: `act-${Date.parse(now())}-${s.activity.length}`, actor, actorKind, text, ts: now() },
            ...s.activity,
          ].slice(0, 40),
        })),

      resetAll: () =>
        set({ tasks: TASKS, clients: CLIENTS, systems: SYSTEMS, agents: AGENTS, activity: ACTIVITY }),
    }),
    {
      name: "mau-studio-os-v1",
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
    },
  ),
);
