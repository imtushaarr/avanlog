"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * A small, shared "beat" engine for per-service animated line diagrams.
 * Four capability nodes draw in along a line in sequence, each capability's
 * glyph scaling in as its node activates, synced to a caption underneath and
 * to the capability chip list rendered alongside it (via onStep).
 *
 * Deliberately simpler than a fully bespoke scene per service: one engine,
 * swapped glyphs and accent color per service, rather than six hand-tuned
 * 300-line illustrations for six unrelated categories.
 */

const W = 480;
const H = 180;
const NODE_Y = 96;
const NODE_X = [70, 190, 310, 430];
const STEP_DURATION = 2;
const LOOP = STEP_DURATION * NODE_X.length;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const inOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
const back = (p: number) => 1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2;
const fade = (t: number) => prog(t, 0, 0.2) * (1 - prog(t, LOOP - 0.4, LOOP));

export type GlyphName =
  | "grid"
  | "arrow-right"
  | "arrow-left"
  | "layers"
  | "shield"
  | "pulse"
  | "clock"
  | "gauge"
  | "box"
  | "check"
  | "refresh"
  | "doc"
  | "scale"
  | "bolt";

function Glyph({ name }: { name: GlyphName }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (name) {
    case "grid":
      return (
        <>
          <rect x={-9} y={-9} width={8} height={8} rx={1.5} {...stroke} />
          <rect x={1} y={-9} width={8} height={8} rx={1.5} {...stroke} />
          <rect x={-9} y={1} width={8} height={8} rx={1.5} {...stroke} />
          <rect x={1} y={1} width={8} height={8} rx={1.5} {...stroke} />
        </>
      );
    case "arrow-right":
      return <path d="M-10 0H10M4 -6L10 0L4 6" {...stroke} />;
    case "arrow-left":
      return <path d="M10 0H-10M-4 -6L-10 0L-4 6" {...stroke} />;
    case "layers":
      return (
        <>
          <path d="M-11 -7H11" {...stroke} />
          <path d="M-8 0H8" {...stroke} />
          <path d="M-5 7H5" {...stroke} />
        </>
      );
    case "shield":
      return <path d="M0 -11L10 -6V2C10 8 5 11 0 12C-5 11 -10 8 -10 2V-6Z" {...stroke} />;
    case "pulse":
      return <path d="M-12 0H-5L-2 -8L2 8L5 0H12" {...stroke} />;
    case "clock":
      return (
        <>
          <circle r={11} {...stroke} />
          <path d="M0 -6V0L4 3" {...stroke} />
        </>
      );
    case "gauge":
      return (
        <>
          <path d="M-10 4A10 10 0 0 1 10 4" {...stroke} />
          <path d="M0 4L5 -5" {...stroke} />
        </>
      );
    case "box":
      return <rect x={-9} y={-9} width={18} height={18} rx={2} {...stroke} />;
    case "check":
      return <path d="M-8 0L-2 6L9 -7" {...stroke} />;
    case "refresh":
      return (
        <path
          d="M9 0A9 9 0 1 1 6.4 -6.4M9 0L9 -5M9 0L4 -1"
          {...stroke}
        />
      );
    case "doc":
      return (
        <>
          <path d="M-7 -11H4L8 -7V11H-7Z" {...stroke} />
          <path d="M-4 -2H5M-4 2H5M-4 6H2" {...stroke} />
        </>
      );
    case "scale":
      return <path d="M0 10V-10M-5 -5L0 -10L5 -5M-5 5L0 10L5 5" {...stroke} />;
    case "bolt":
      return <path d="M2 -11L-7 2H0L-2 11L8 -2H1Z" {...stroke} />;
  }
}

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const m = window.matchMedia(REDUCED);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

export function ServiceScene({
  accent,
  capabilities,
  glyphs,
  onStep,
}: {
  accent: string;
  capabilities: string[];
  glyphs: GlyphName[];
  onStep?: (capability: string | undefined) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [clock, setClock] = useState(0);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false
  );

  useEffect(() => {
    const el = svgRef.current;
    if (!el || reduced) return;
    let raf = 0;
    let last = 0;
    let elapsed = 0;
    const tick = (now: number) => {
      if (last) elapsed += Math.min(0.1, (now - last) / 1000);
      last = now;
      setClock(elapsed % LOOP);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const t = reduced ? LOOP - 0.5 : clock;
  const activeIndex = Math.min(Math.floor(t / STEP_DURATION), NODE_X.length - 1);
  const step = capabilities[activeIndex];

  useEffect(() => {
    onStep?.(step);
  }, [step, onStep]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="block h-auto w-full text-fog"
      role="img"
      aria-label={capabilities.join(", ")}
    >
      <g opacity={reduced ? 1 : fade(t)}>
        {NODE_X.slice(0, -1).map((x, i) => {
          const segStart = i * STEP_DURATION + 0.9;
          const segEnd = i * STEP_DURATION + STEP_DURATION;
          const p = inOut(prog(t, segStart, segEnd));
          return (
            <line
              key={i}
              x1={x}
              y1={NODE_Y}
              x2={NODE_X[i + 1]}
              y2={NODE_Y}
              stroke="currentColor"
              strokeWidth={1.5}
              strokeOpacity={0.25}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
            />
          );
        })}

        {NODE_X.map((x, i) => {
          const start = i * STEP_DURATION;
          const ringP = inOut(prog(t, start, start + 0.5));
          const iconP = back(prog(t, start + 0.2, start + 0.7));
          const isActive = i === activeIndex;
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={NODE_Y}
                r={22}
                fill="none"
                stroke={isActive ? accent : "currentColor"}
                strokeOpacity={isActive ? 1 : 0.3}
                strokeWidth={2}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - ringP}
              />
              {iconP > 0 && (
                <g
                  transform={`translate(${x} ${NODE_Y}) scale(${Math.max(iconP, 0)})`}
                  style={{ color: isActive ? accent : "var(--fog)" }}
                >
                  <Glyph name={glyphs[i]} />
                </g>
              )}
            </g>
          );
        })}
      </g>

      {capabilities.map((label, i) => {
        const start = i * STEP_DURATION;
        const o = prog(t, start + 0.3, start + 0.6) * (1 - prog(t, start + STEP_DURATION - 0.3, start + STEP_DURATION));
        return o > 0 ? (
          <text
            key={label}
            x={W / 2}
            y={H - 18}
            textAnchor="middle"
            fontSize={13}
            fill="var(--paper)"
            opacity={reduced && i === activeIndex ? 1 : o}
            style={{ fontFamily: "var(--font-plex-mono), monospace" }}
          >
            {label}
          </text>
        ) : null;
      })}
    </svg>
  );
}
