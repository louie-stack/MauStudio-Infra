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
    id: "comrad",
    name: "Comrad Socks",
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
    id: "salt-stone",
    name: "Salt & Stone",
    code: "SS",
    sector: "Beauty / CPG",
    status: "active",
    lead: "Louie",
    since: "2026-06-01",
    engagement: "Advisory",
    mrr: 7000,
    health: 74,
    summary:
      "CRO + competitive intelligence demo via Parah Group. Monochrome intelligence dashboard tracking category share of voice.",
    systemIds: ["intelligence-os"],
    tags: ["cro", "intelligence", "demo"],
  },
  {
    id: "american-fortress",
    name: "American Fortress",
    code: "AF",
    sector: "Security / Gov",
    status: "active",
    lead: "Louie",
    since: "2026-03-10",
    engagement: "Retainer",
    mrr: 6500,
    health: 91,
    summary:
      "Homepage rebuild on Astro with a live Figma-governed redesign. Premium motion + chrome polish across the funnel.",
    systemIds: [],
    tags: ["web", "astro", "figma"],
  },
  {
    id: "litvm",
    name: "LitVM",
    code: "LV",
    sector: "Developer / Infra",
    status: "onboarding",
    lead: "Louie",
    since: "2026-07-08",
    engagement: "Project",
    mrr: 5000,
    health: 68,
    summary:
      "Marketing site rebuild. Premium scrollytelling pass over a Webflow export, kickoff in progress.",
    systemIds: [],
    tags: ["web", "scrollytelling"],
  },
  {
    id: "ludio",
    name: "Ludio",
    code: "LU",
    sector: "Creative Studio",
    status: "paused",
    lead: "Louie",
    since: "2026-05-02",
    engagement: "Project",
    mrr: 0,
    health: 55,
    summary:
      "Creative studio site on Next.js + GSAP, cloning a high-craft motion design language. Paused pending client assets.",
    systemIds: [],
    tags: ["web", "gsap", "motion"],
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
    deployments: ["comrad", "salt-stone"],
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
    bornFrom: "salt-stone",
    deployments: ["salt-stone"],
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
    deployments: ["comrad"],
    stack: ["Deck framework", "Mau house style"],
    reusability: 88,
    model: "Internal accelerator",
  },
  {
    id: "agent-os",
    name: "Agent OS",
    category: "Automation",
    status: "concept",
    summary:
      "The studio's flagship offer: a bespoke AI operating layer per client, running strategy, ops and delivery 24/7. This dashboard is its cockpit.",
    bornFrom: null,
    deployments: [],
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
  t("Salt & Stone competitor teardown refresh", "salt-stone", "review", "med", "Atlas", "agent", 0, ["intelligence"]),
  t("American Fortress hero motion polish", "american-fortress", "review", "med", "Louie", "human", 2, ["web", "motion"]),
  t("LitVM scrollytelling kickoff + moodboard", "litvm", "backlog", "med", "Louie", "human", 5, ["web"]),
  t("Blueprint deck template v3", "comrad", "shipped", "low", "Mau", "human", -4, ["strategy"]),
  t("Draft July client health updates", null, "active", "low", "Envoy", "agent", 1, ["comms"]),
  t("Agent OS cockpit: internal dashboard", null, "active", "critical", "Louie", "human", 0, ["internal"]),
  t("AVTECH privacy boundary audit", "avtech", "backlog", "high", "Ledger", "agent", 4, ["privacy"]),
  t("Ludio site: awaiting client assets", "ludio", "backlog", "low", "Louie", "human", null, ["blocked"]),
  t("Intelligence OS multi-keyword QA", "salt-stone", "shipped", "med", "Sentinel", "agent", -2, ["qa"]),
  t("Comrad blueprint: phase 2 scope", "comrad", "review", "high", "Mau", "human", 2, ["strategy"]),
  t("American Fortress partners page parity", "american-fortress", "backlog", "med", "Louie", "human", 6, ["web"]),
  t("New-business: outreach sequence", null, "backlog", "med", "Envoy", "agent", 3, ["growth"]),
];

export const ACTIVITY: Activity[] = [
  a("Forge", "agent", "generated 12 ad variants for Comrad Socks", -6),
  a("Atlas", "agent", "completed competitor teardown for Salt & Stone", -34),
  a("Louie", "human", "moved American Fortress hero polish to Review", -58),
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
