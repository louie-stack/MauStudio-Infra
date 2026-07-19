# Mau Studio OS

The studio's operating surface. One place to run clients, work, AI agents, and the
productized systems the studio repurposes across engagements.

Built as an operator console in Mau's visual language: strict monochrome, warm paper,
hairline structure, and mono "systems" microtype.

## Pages

| Route       | What it is                                                                       |
| ----------- | -------------------------------------------------------------------------------- |
| `/`         | **Command Center**: studio at a glance, KPIs, pipeline, live agents, activity    |
| `/work`     | **The Board**: Trello-style kanban, drag work across stages, per-client filter   |
| `/clients`  | **The Roster**: client cards + slide-over detail with health, systems, open work |
| `/systems`  | **Systems**: the productized / repurposable builds library with reusability      |
| `/agents`   | **Agents**: the AI workforce; toggle each agent live / idle / paused             |

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** with a custom monochrome token set (`app/globals.css`)
- **zustand** + `localStorage` persistence, so every edit survives a refresh
- **@dnd-kit** for the drag-and-drop board
- **Motion** (Framer Motion) for dialogs and drawers
- **Geist Sans / Geist Mono**, **lucide-react** icons

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm run start      # serve the production build
```

## Data & state

The app ships with realistic seed data (`lib/seed.ts`) so it feels alive on first load.
All state lives client-side in a persisted zustand store (`lib/store.ts`) under the key
`mau-studio-os-v1`. There is no backend yet: this is the cockpit shell, ready to be wired
to real services (agents, billing, project data) as those come online.

To wipe local edits back to seed, clear that key from `localStorage`, or run
`useStore.getState().resetAll()` in the console.

## Project layout

```
app/            route segments (overview, work, clients, systems, agents)
components/      shell, page header, UI primitives, kanban, dialogs
lib/            types, seed data, store, formatting utilities
```
