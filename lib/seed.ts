import type { Activity, Agent, Client, ProductSystem, Task } from "./types";

// =========================================================================
// Seed data: the studio on day one. Editable & persisted after first load.
// =========================================================================

// Counters used by the t()/a() builders below. Declared first so the data
// arrays (which invoke those builders at module-eval time) stay out of the
// temporal dead zone.
let _order = 0;
let _act = 0;

export const CLIENTS: Client[] = [
  {
    id: "dentist-nerds",
    name: "Dentist Nerds",
    code: "DN",
    sector: "Dental / Healthcare",
    status: "active",
    lead: "Mau",
    since: "2026-06-15",
    engagement: "Retainer",
    mrr: 8000,
    health: 80,
    summary:
      "AI operating layer for practice growth. Patient acquisition creative, intake follow-up, and recall sequences running on agents.",
    systemIds: ["creative-engine"],
    tags: ["ai-agents", "healthcare", "growth"],
  },
  {
    id: "comrad",
    name: "Comrad OS",
    code: "CM",
    sector: "DTC / Apparel",
    status: "active",
    lead: "Mau",
    since: "2026-05-18",
    engagement: "Project",
    mrr: 12000,
    health: 82,
    summary:
      "AI agent build for Andrew Ferenci. Phase 1 Blueprint + a live Creative Engine producing on-brand ad variants at volume.",
    systemIds: ["creative-engine", "blueprint-deck"],
    tags: ["ai-agents", "creative", "blueprint"],
  },
  {
    id: "avtech",
    name: "AVTECH",
    code: "AV",
    sector: "Industrial / IoT",
    status: "active",
    lead: "Mau",
    since: "2026-04-02",
    engagement: "Retainer",
    mrr: 9500,
    health: 88,
    summary:
      "Attribution intelligence platform. Phase 1 delivered: multi-touch revenue attribution across paid, organic and field sales.",
    systemIds: ["attribution-os"],
    tags: ["attribution", "analytics", "phase-1"],
  },
  {
    id: "parah",
    name: "Parah OS",
    code: "PH",
    sector: "Beauty / CPG",
    status: "active",
    lead: "Louie",
    since: "2026-06-01",
    engagement: "Advisory",
    mrr: 7000,
    health: 74,
    summary:
      "CRO + competitive intelligence layer. Monochrome intelligence console tracking category share of voice and competitor teardowns.",
    systemIds: ["intelligence-os"],
    tags: ["cro", "intelligence", "demo"],
  },
  {
    id: "ai-leverage-lab",
    name: "AI Leverage Lab",
    code: "AL",
    sector: "Education / Enablement",
    status: "onboarding",
    lead: "Louie",
    since: "2026-07-06",
    engagement: "Project",
    mrr: 5500,
    health: 70,
    summary:
      "Productized AI enablement program. Turning the studio's agent playbooks into a teachable system with its own cockpit.",
    systemIds: ["agent-os", "blueprint-deck"],
    tags: ["ai-agents", "education", "productized"],
  },
];

export const SYSTEMS: ProductSystem[] = [
  {
    id: "creative-engine",
    name: "Creative Engine",
    category: "Ad Production",
    status: "live",
    summary:
      "Keyword-driven ad factory. Scans a brand + competitors, then generates on-brand creative concepts and asset variants at volume. Swap the dataset, ship for any client.",
    bornFrom: "comrad",
    deployments: ["comrad", "parah", "dentist-nerds"],
    stack: ["Next.js", "Pollinations", "Claude", "Live datasets"],
    reusability: 92,
    model: "Setup + monthly license",
    demo: "Ad-Pipeline-Creative-Factory",
  },
  {
    id: "intelligence-os",
    name: "Intelligence OS",
    category: "Market Intelligence",
    status: "live",
    summary:
      "Competitive teardown + CRO intelligence surface. Multi-keyword scanning, live share-of-voice, and competitor ad teardown lanes in a single monochrome console.",
    bornFrom: "parah",
    deployments: ["parah"],
    stack: ["Single-file HTML", "Claude", "Live scan"],
    reusability: 78,
    model: "Per-engagement demo",
    demo: "Intelligence OS.html",
  },
  {
    id: "attribution-os",
    name: "Attribution OS",
    category: "Analytics",
    status: "beta",
    summary:
      "Multi-touch revenue attribution across paid, organic and field sales. Privacy-first: aggregates only, no raw client rows. Built for AVTECH, packaging underway.",
    bornFrom: "avtech",
    deployments: ["avtech"],
    stack: ["Aggregation pipeline", "Dashboard", "Privacy boundary"],
    reusability: 64,
    model: "Implementation + retainer",
  },
  {
    id: "blueprint-deck",
    name: "Blueprint Deck System",
    category: "Strategy / Sales",
    status: "internal",
    summary:
      "House-style pitch + blueprint deck framework. Turns a discovery call into a phased AI-agent roadmap in Mau's visual language. Reusable across every new engagement.",
    bornFrom: "comrad",
    deployments: ["comrad", "ai-leverage-lab"],
    stack: ["Deck framework", "Mau house style"],
    reusability: 88,
    model: "Internal accelerator",
  },
  {
    id: "pricing-ladder",
    name: "Engagement Ladder",
    category: "Strategy / Sales",
    status: "live",
    summary:
      "The studio's productized pricing structure: free fit call, $1,500 paid AI Workflow Audit capped at 3 calls, then separately scoped implementation. Ships as a branded clickable one-pager for prospects.",
    bornFrom: null,
    deployments: [],
    stack: ["One-pager", "Print-to-PDF", "Mau house style"],
    reusability: 96,
    model: "Internal accelerator",
    demo: "Open one-pager",
    demoHref: "/deliverables/pricing-one-pager.html",
  },
  {
    id: "agent-os",
    name: "Agent OS",
    category: "Automation",
    status: "concept",
    summary:
      "The studio's flagship offer: a bespoke AI operating layer per client, running strategy, ops and delivery 24/7. This dashboard is its cockpit.",
    bornFrom: null,
    deployments: ["ai-leverage-lab"],
    stack: ["Agents", "Orchestration", "Dashboards"],
    reusability: 70,
    model: "Bespoke build + license",
  },
];

export const AGENTS: Agent[] = [
  {
    id: "atlas",
    name: "Atlas",
    role: "Deep Research",
    model: "claude-opus-4-8",
    status: "live",
    summary:
      "Fan-out web research, adversarial fact-checking, and cited synthesis. Feeds intelligence briefs into every active engagement.",
    owner: "Louie",
    runsToday: 14,
    totalRuns: 1180,
    successRate: 96,
    lastRun: "12m ago",
    systemId: "intelligence-os",
  },
  {
    id: "forge",
    name: "Forge",
    role: "Creative Production",
    model: "claude-opus-4-8",
    status: "live",
    summary:
      "Drives the Creative Engine, generating ad concepts, variants, and teardown-informed hooks on brand for each client dataset.",
    owner: "Mau",
    runsToday: 31,
    totalRuns: 2640,
    successRate: 91,
    lastRun: "3m ago",
    systemId: "creative-engine",
  },
  {
    id: "ledger",
    name: "Ledger",
    role: "Analytics & Attribution",
    model: "claude-sonnet-5",
    status: "idle",
    summary:
      "Rolls up attribution aggregates and surfaces anomalies. Respects the AVTECH privacy boundary: aggregates only.",
    owner: "Mau",
    runsToday: 4,
    totalRuns: 520,
    successRate: 98,
    lastRun: "1h ago",
    systemId: "attribution-os",
  },
  {
    id: "envoy",
    name: "Envoy",
    role: "Client Comms & Outreach",
    model: "claude-haiku-4-5",
    status: "live",
    summary:
      "Drafts client updates, follow-ups, and outreach in each account's voice. Never sends without a human check.",
    owner: "Mau",
    runsToday: 9,
    totalRuns: 870,
    successRate: 89,
    lastRun: "27m ago",
    systemId: null,
  },
  {
    id: "sentinel",
    name: "Sentinel",
    role: "Design QA",
    model: "claude-sonnet-5",
    status: "paused",
    summary:
      "Hunts AI tells (misaligned text, off-center elements, weak contrast) before any UI ships. Design-precision guardrail.",
    owner: "Louie",
    runsToday: 0,
    totalRuns: 340,
    successRate: 94,
    lastRun: "yesterday",
    systemId: null,
  },
];

export const TASKS: Task[] = [
  t("Ship Attribution OS phase-2 packaging", "avtech", "active", "high", "Ledger", "agent", 3, ["analytics"]),
  t("Comrad Creative Engine: 12 hero variants", "comrad", "active", "high", "Forge", "agent", 1, ["creative"]),
  t("Parah OS competitor teardown refresh", "parah", "review", "med", "Atlas", "agent", 0, ["intelligence"]),
  t("Dentist Nerds recall sequence build", "dentist-nerds", "review", "med", "Envoy", "agent", 2, ["comms", "growth"]),
  t("AI Leverage Lab curriculum outline", "ai-leverage-lab", "backlog", "med", "Louie", "human", 5, ["education"]),
  t("Blueprint deck template v3", "comrad", "shipped", "low", "Mau", "human", -4, ["strategy"]),
  t("Draft July client health updates", null, "active", "low", "Envoy", "agent", 1, ["comms"]),
  t("Agent OS cockpit: internal dashboard", null, "active", "critical", "Louie", "human", 0, ["internal"]),
  t("AVTECH privacy boundary audit", "avtech", "backlog", "high", "Ledger", "agent", 4, ["privacy"]),
  t("Dentist Nerds patient-acquisition creative set", "dentist-nerds", "active", "high", "Forge", "agent", 3, ["creative"]),
  t("Intelligence OS multi-keyword QA", "parah", "shipped", "med", "Sentinel", "agent", -2, ["qa"]),
  t("Comrad blueprint: phase 2 scope", "comrad", "review", "high", "Mau", "human", 2, ["strategy"]),
  t("AI Leverage Lab cockpit scoping", "ai-leverage-lab", "backlog", "med", "Louie", "human", 6, ["internal"]),
  t("New-business: outreach sequence", null, "backlog", "med", "Envoy", "agent", 3, ["growth"]),
];

export const ACTIVITY: Activity[] = [
  a("Forge", "agent", "generated 12 ad variants for Comrad OS", -6),
  a("Atlas", "agent", "completed competitor teardown for Parah OS", -34),
  a("Louie", "human", "moved Dentist Nerds recall sequence to Review", -58),
  a("Ledger", "agent", "rolled up AVTECH attribution aggregates", -95),
  a("Envoy", "agent", "drafted 4 client health updates for approval", -140),
  a("Mau", "human", "shipped Blueprint deck template v3", -210),
  a("Sentinel", "agent", "flagged 2 alignment issues on Intelligence OS", -280),
];

// --- helpers --------------------------------------------------------------
function t(
  title: string,
  clientId: string | null,
  column: Task["column"],
  priority: Task["priority"],
  assignee: string,
  assigneeKind: Task["assigneeKind"],
  dueInDays: number | null,
  tags: string[],
): Task {
  const due =
    dueInDays === null
      ? null
      : new Date(Date.UTC(2026, 6, 19) + dueInDays * 86400000).toISOString().slice(0, 10);
  return {
    id: `task-${(_order += 1)}`,
    title,
    clientId,
    column,
    priority,
    assignee,
    assigneeKind,
    due,
    tags,
    order: _order,
    updatedAt: new Date(Date.UTC(2026, 6, 19)).toISOString(),
  };
}

function a(actor: string, actorKind: Activity["actorKind"], text: string, minsAgo: number): Activity {
  return {
    id: `act-${(_act += 1)}`,
    actor,
    actorKind,
    text,
    ts: new Date(Date.UTC(2026, 6, 19, 14, 0) + minsAgo * 60000).toISOString(),
  };
}
