"use client";

/* Lightweight inline SVG charts, gradient-stroked to match the brand. */

function buildPath(points: number[], w: number, h: number, pad = 2) {
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const step = (w - pad * 2) / (points.length - 1);
  return points.map((p, i) => {
    const x = pad + i * step;
    const y = pad + (h - pad * 2) * (1 - (p - min) / range);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  });
}

export function Sparkline({
  points,
  w = 132,
  h = 30,
  uid,
}: {
  points: number[];
  w?: number;
  h?: number;
  uid: string;
}) {
  const seg = buildPath(points, w, h);
  const line = seg.join(" ");
  const area = `${line} L${w - 2},${h - 2} L2,${h - 2} Z`;
  const gid = `sl-${uid}`;
  const fid = `sf-${uid}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7fe9f0" />
          <stop offset="0.55" stopColor="#a6a6f2" />
          <stop offset="1" stopColor="#c89bee" />
        </linearGradient>
        <linearGradient id={fid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fe9f0" stopOpacity="0.22" />
          <stop offset="1" stopColor="#7fe9f0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${fid})`} />
      <path d={line} fill="none" stroke={`url(#${gid})`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AreaChart({
  points,
  w = 640,
  h = 150,
  uid,
}: {
  points: number[];
  w?: number;
  h?: number;
  uid: string;
}) {
  const pad = 4;
  const seg = buildPath(points, w, h, pad);
  const line = seg.join(" ");
  const area = `${line} L${w - pad},${h - pad} L${pad},${h - pad} Z`;
  const gid = `al-${uid}`;
  const fid = `af-${uid}`;
  const max = Math.max(...points, 1);
  const step = (w - pad * 2) / (points.length - 1);
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7fe9f0" />
          <stop offset="0.55" stopColor="#a6a6f2" />
          <stop offset="1" stopColor="#c89bee" />
        </linearGradient>
        <linearGradient id={fid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fe4f0" stopOpacity="0.2" />
          <stop offset="1" stopColor="#8fe4f0" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* faint gridlines */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={pad} x2={w - pad} y1={h * g} y2={h * g} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      <path d={area} fill={`url(#${fid})`} />
      <path d={line} fill="none" stroke={`url(#${gid})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* endpoint node */}
      <circle
        cx={w - pad}
        cy={pad + (h - pad * 2) * (1 - points[points.length - 1] / max)}
        r="3.5"
        fill="#8fe4f0"
      />
    </svg>
  );
}
