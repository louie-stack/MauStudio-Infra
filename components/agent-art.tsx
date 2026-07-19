"use client";

/* =========================================================================
   Bespoke agent sigils. Each agent gets a unique gradient glyph on a dark
   brand tile — matching the Mau monogram's tile + iridescent mark language.
   ========================================================================= */

const GLYPHS: Record<string, React.ReactNode> = {
  // Atlas — Deep Research: orbital rings around a core
  atlas: (
    <g>
      <ellipse cx="20" cy="20" rx="12" ry="5" />
      <ellipse cx="20" cy="20" rx="12" ry="5" transform="rotate(60 20 20)" />
      <ellipse cx="20" cy="20" rx="12" ry="5" transform="rotate(-60 20 20)" />
      <circle cx="20" cy="20" r="2.6" className="fill-glyph" />
      <circle cx="31.2" cy="18.4" r="1.5" className="fill-glyph" />
    </g>
  ),
  // Forge — Creative Production: a four-point spark
  forge: (
    <g>
      <path d="M20 6 L22.6 17.4 L34 20 L22.6 22.6 L20 34 L17.4 22.6 L6 20 L17.4 17.4 Z" />
      <circle cx="30.5" cy="10" r="1.1" className="fill-glyph" />
      <circle cx="10.5" cy="29.5" r="0.9" className="fill-glyph" />
    </g>
  ),
  // Ledger — Analytics & Attribution: ascending bars
  ledger: (
    <g>
      <path d="M8 29 H32" />
      <rect x="11" y="23" width="3.6" height="6" rx="1" className="fill-glyph stroke-none" />
      <rect x="18.2" y="17.5" width="3.6" height="11.5" rx="1" className="fill-glyph stroke-none" />
      <rect x="25.4" y="12.5" width="3.6" height="16.5" rx="1" className="fill-glyph stroke-none" />
      <circle cx="27.2" cy="9.4" r="1.5" className="fill-glyph stroke-none" />
    </g>
  ),
  // Envoy — Client Comms & Outreach: a paper plane / signal
  envoy: (
    <g>
      <path d="M9 19 L31 11 L22.5 30 L18.5 22 Z" />
      <path d="M31 11 L18.5 22" />
      <path d="M9 19 L18.5 22" />
    </g>
  ),
  // Sentinel — Design QA: shield with a scan check
  sentinel: (
    <g>
      <path d="M20 6.5 L31 10.5 V20.5 C31 26.5 26 30.8 20 33 C14 30.8 9 26.5 9 20.5 V10.5 Z" />
      <path d="M15 20 L18.6 23.6 L25.5 15.5" />
    </g>
  ),
};

export const SIGIL_IDS = ["atlas", "forge", "ledger", "envoy", "sentinel"] as const;

export function sigilIdForName(name: string): string | null {
  const key = name.trim().toLowerCase();
  return (SIGIL_IDS as readonly string[]).includes(key) ? key : null;
}

export function AgentSigil({
  id,
  size = 40,
  radius = 10,
}: {
  id: string;
  size?: number;
  radius?: number;
}) {
  const glyph = GLYPHS[id] ?? GLYPHS.atlas;
  const gid = `agrad-${id}`;
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: "linear-gradient(135deg,#0B1118 0%,#050508 55%,#111022 100%)",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 6px 16px -10px rgba(120,220,240,0.5)",
      }}
    >
      <svg
        viewBox="0 0 40 40"
        width={size * 0.78}
        height={size * 0.78}
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <linearGradient id={gid} x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E8FBFF" />
            <stop offset="0.42" stopColor="#9BDFF0" />
            <stop offset="1" stopColor="#C4B5FD" />
          </linearGradient>
          <style>{`.fill-glyph{fill:url(#${gid});}.stroke-none{stroke:none;}`}</style>
        </defs>
        {glyph}
      </svg>
    </span>
  );
}
