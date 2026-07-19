// =========================================================================
// MAU STUDIO OS · Domain model
// =========================================================================

export type ColumnId = "backlog" | "active" | "review" | "shipped";

export const COLUMNS: { id: ColumnId; label: string; hint: string }[] = [
  { id: "backlog", label: "Backlog", hint: "Queued / scoped" },
  { id: "active", label: "In Progress", hint: "Being built" },
  { id: "review", label: "Review", hint: "Client / QA" },
  { id: "shipped", label: "Shipped", hint: "Delivered" },
];

export type Priority = "low" | "med" | "high" | "critical";

export type ActorKind = "human" | "agent";

export interface Task {
  id: string;
  title: string;
  clientId: string | null;
  column: ColumnId;
  priority: Priority;
  assignee: string; // person name or agent id-label
  assigneeKind: ActorKind;
  due: string | null; // ISO date
  tags: string[];
  note?: string;
  order: number;
  updatedAt: string;
}

export type ClientStatus = "active" | "onboarding" | "paused" | "archived";

export interface Client {
  id: string;
  name: string;
  code: string; // 2-4 letter mono badge
  sector: string;
  status: ClientStatus;
  lead: string;
  since: string; // ISO date
  engagement: string; // e.g. "Retainer", "Project", "Advisory"
  mrr: number; // monthly value, USD
  health: number; // 0-100
  summary: string;
  systemIds: string[];
  tags: string[];
}

export type SystemStatus = "live" | "beta" | "internal" | "concept";

export interface ProductSystem {
  id: string;
  name: string;
  category: string;
  status: SystemStatus;
  summary: string;
  bornFrom: string | null; // clientId it was first built for
  deployments: string[]; // clientIds using it
  stack: string[];
  reusability: number; // 0-100, how packaged/repurposable
  model: string; // pricing / delivery model
  demo?: string;
}

export type AgentStatus = "live" | "idle" | "paused";

export interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  status: AgentStatus;
  summary: string;
  owner: string;
  runsToday: number;
  totalRuns: number;
  successRate: number; // 0-100
  lastRun: string; // relative-ish label
  systemId: string | null;
}

export interface Activity {
  id: string;
  actor: string;
  actorKind: ActorKind;
  text: string;
  ts: string; // ISO datetime
}
