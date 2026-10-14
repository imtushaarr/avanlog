# Avanlog Landing Page Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `avanlog.dev`'s landing page onto a new navy/blue/cyan design system with Inter typography, replacing every section component with a version matching the approved design spec, and deleting superseded duplicate components.

**Architecture:** Next.js App Router site, one route (`src/app/page.tsx`) composed of ~15 section components under `src/components/`. No backend, no CMS, no test runner (`package.json` has no jest/vitest/playwright — verification is `tsc --noEmit`, `eslint`, `next build`, and manual browser checks at three breakpoints). All new/rebuilt components are client components using `motion/react` for animation and `lucide-react` for icons, matching the project's existing conventions.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (`@theme inline` tokens in `globals.css`), `motion/react` (already installed as `motion`), `lucide-react`, TypeScript, ESLint (`eslint-config-next`). No new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-14-avanlog-rebuild-design.md` — this plan implements every section (§5.1–§5.15) of that spec; executors should read both documents. Exact marketing copy, data arrays, and per-section requirements live in the spec and are not re-typed in full here except where a task's code needs them directly or where planning uncovered a correction to the spec (see Task 17).

## Global Constraints

- No new npm dependencies — use only `motion/react`, `lucide-react`, native React/DOM APIs already in `package.json`.
- Every rebuilt/new component uses only the new tokens from Task 1 (`bg`, `bg-secondary`, `surface`, `surface-line`, `text`, `text-muted`, `accent`, `accent-cyan`) plus `font-sans`/`font-mono` — no `graphite`, `steel`, `steel-line`, `fog`, `paper`, `signal`, `amber`, `wire`, `wire-dark`, old `surface`/`ink`/`ink-fog` class names anywhere in a file this plan touches.
- No fabricated client names, testimonials, results, percentages, certifications, partnership badges, publication dates, or contact details. Where the spec calls for an "honest" or "clearly labeled" state (demo data, coming-soon articles, unconnected form), implement exactly that — never a fake success/positive state.
- No real deployment commands are executed by the Deployment Pipeline section; it is explanatory only.
- Every continuous/looping animation must be wrapped so it is disabled under `prefers-reduced-motion: reduce` (via the shared hook built in Task 2), while all interactive functionality keeps working in that mode.
- Every interactive element (nav, mobile drawer, pipeline stages, accordion, form) must be keyboard-operable with a visible focus state, not just mouse/hover-operable.
- `src/app/pipeline/page.tsx` and its `src/components/pipeline/` and `src/components/ui/build-pipeline.tsx` dependencies are out of scope — do not modify them, and do not delete anything they still import.
- After each task, run `cd /Users/tushargupta/Documents/avanlog && npx tsc --noEmit && npx eslint <changed files>` and confirm both are clean before committing.

## Review Focus

- **Deleting a file still imported elsewhere breaks the build silently until `next build` runs.** Before deleting any component in Tasks 4–8 and 15, grep the whole repo (`src/app`, `src/components`, including `src/app/pipeline/page.tsx`) for its import, not just `page.tsx`.
- **The footer's contact info.** Planning found the current `Footer.tsx` already has a real, live `hello@avanlog.com` mailto and a real `orynticlabs.com` link with an existing copyright line — the spec's assumption that "no verified contact info exists" was wrong. Task 17 must carry these forward, not invent a vaguer placeholder.
- **The existing `ConversionSection.tsx` already sets a fake `submitted` success state on form submit with no backend call** — a reasonable person would read that as "message sent" when nothing happened. Task 16 must replace this with the honest not-yet-connected state from spec §5.14, not just restyle the existing fake-success flow.
- **Keyboard users on the Deployment Pipeline and FAQ accordion.** A mouse-hover-only or click-only implementation would leave keyboard users unable to see stage descriptions or expand FAQ answers — both need real button semantics and visible focus, not `onMouseEnter`-only handlers.
- **Mobile nav focus trap.** Opening a drawer without trapping focus lets Tab leave the drawer into content behind it while it's visually open — Task 2 must verify Tab wraps within the open drawer and Escape/backdrop-click closes it and returns focus to the trigger.

---

## File Structure

New files:
- `src/lib/useReducedMotion.ts` — shared hook, `prefers-reduced-motion` boolean.
- `src/components/MobileNav.tsx` — mobile drawer, driven by `Nav.tsx`.
- `src/components/InfrastructureVisual.tsx` — hero SVG topology animation.
- `src/components/ReliabilityMetrics.tsx`
- `src/components/TechnologyStack.tsx`
- `src/components/ServicesSection.tsx`
- `src/components/ServiceCard.tsx`
- `src/components/ObservabilityShowcase.tsx` (replaces current file of the same name — see Task 9, counted as new content)
- `src/components/SecuritySection.tsx`
- `src/components/InsightsSection.tsx`
- `src/components/FAQSection.tsx`

Rewritten in place (same path, new content):
- `src/app/globals.css`, `src/app/layout.tsx`
- `src/components/Nav.tsx`
- `src/components/Hero.tsx`
- `src/components/DeploymentPipeline.tsx`
- `src/components/HowWeWork.tsx`
- `src/components/CaseStudies.tsx`
- `src/components/EngagementModels.tsx`
- `src/components/ConversionSection.tsx`
- `src/components/Footer.tsx`
- `src/app/page.tsx`

Deleted (superseded, after import audit):
- `src/components/MetricsStrip.tsx`, `ReliabilityMetricsStrip.tsx`
- `src/components/TechnologyEcosystem.tsx`, `TechnologyGrid.tsx`
- `src/components/Services.tsx`, `CoreServicesGrid.tsx`
- `src/components/ObservabilityBentoGrid.tsx`, `ArchitectureShowcase.tsx`, `IncidentWalkthrough.tsx`
- `src/components/Process.tsx`
- `src/components/CTASection.tsx`
- `src/components/StackRow.tsx`, `MessageBotsCard.tsx` (only if unused after audit — Task 18)

---

### Task 1: Design tokens and typography

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: Tailwind utility classes `bg-bg`, `bg-bg-secondary`, `bg-surface`, `border-surface-line`, `text-text`, `text-text-muted`, `text-accent`, `text-accent-cyan`, `bg-accent`, `border-accent`, `font-sans`/`font-display` (both map to Inter), `font-mono` (IBM Plex Mono) — every later task consumes these.

- [ ] **Step 1: Replace the token block in `globals.css`**

Replace the existing `:root { --graphite: ...}` and `@theme inline { ... }` blocks (currently `globals.css:1-33`) with:

```css
@import "tailwindcss";

:root {
  --bg: #070b12;
  --bg-secondary: #0b1220;
  --surface: #101a29;
  --surface-line: #243247;
  --text: #f4f7fb;
  --text-muted: #99a7ba;
  --accent: #3987ff;
  --accent-cyan: #40d9f2;
}

@theme inline {
  --color-bg: var(--bg);
  --color-bg-secondary: var(--bg-secondary);
  --color-surface: var(--surface);
  --color-surface-line: var(--surface-line);
  --color-text: var(--text);
  --color-text-muted: var(--text-muted);
  --color-accent: var(--accent);
  --color-accent-cyan: var(--accent-cyan);

  --font-display: var(--font-inter);
  --font-sans: var(--font-inter);
  --font-mono: var(--font-plex-mono);
}

html,
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
}

::selection {
  background: var(--accent);
  color: var(--bg);
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
```

Keep every other rule below that point in the file (`@keyframes marquee`, `.no-scrollbar`, `@keyframes word-appear`, etc.) untouched — only the token block and the `html, body`/`::selection`/`:focus-visible` rules change.

- [ ] **Step 2: Swap the font import in `layout.tsx`**

Replace the `Josefin_Sans` import and config (`layout.tsx:2,6-11`) with:

```ts
import { Inter, IBM_Plex_Mono } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});
```

Update the `<html>` className from `${josefinSans.variable} ${plexMono.variable}` to `${inter.variable} ${plexMono.variable}`, and the `<body>` className from `bg-graphite text-paper` to `bg-bg text-text`.

- [ ] **Step 3: Verify**

Run: `cd /Users/tushargupta/Documents/avanlog && npx tsc --noEmit`
Expected: passes (no component code changed yet, so no new type errors; this just confirms the edit didn't break syntax).

Run: `npm run dev` in the background, open `http://localhost:3000` in a browser, confirm the page background is near-black navy and body text renders in Inter (not the old rounded Josefin look). Existing components will still reference old token classes at this point (e.g. `bg-graphite`) — those classes will simply resolve to nothing until later tasks migrate them; this is expected and corrected section-by-section in Tasks 4–16.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: switch design tokens to navy/blue palette and Inter font"
```

---

### Task 2: Shared reduced-motion hook

**Files:**
- Create: `src/lib/useReducedMotion.ts`

**Interfaces:**
- Produces: `useReducedMotion(): boolean` — default export is a named export `useReducedMotion`, importable as `import { useReducedMotion } from "@/lib/useReducedMotion"`. Returns `true` when the user has `prefers-reduced-motion: reduce` set, `false` otherwise (and `false` during SSR/first client render before the media query is read, to avoid a hydration mismatch — the hook updates to the real value in a `useEffect`).
- Consumed by: Hero/InfrastructureVisual (Task 3), DeploymentPipeline (Task 9), HowWeWork (Task 11), ObservabilityShowcase (Task 10).

- [ ] **Step 1: Write the hook**

```ts
"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: passes.

Manual check: in Chrome DevTools, open the Rendering tab, set "Emulate CSS media feature prefers-reduced-motion" to "reduce", and confirm no errors are thrown by importing this hook into a throwaway test usage is not needed yet — this is exercised for real in Task 3 onward. For this task, it's sufficient that it type-checks and exports correctly.

- [ ] **Step 3: Commit**

```bash
git add src/lib/useReducedMotion.ts
git commit -m "feat: add shared prefers-reduced-motion hook"
```

---

### Task 3: Nav rebuild + mobile drawer

**Files:**
- Modify: `src/components/Nav.tsx`
- Create: `src/components/MobileNav.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks beyond the tokens (Task 1).
- Produces: `MobileNav` default export, props `{ open: boolean; onClose: () => void; links: { href: string; label: string }[] }` — self-contained, renders `null` when `open` is `false` (not just hidden via CSS) so it never traps focus while closed.

- [ ] **Step 1: Write `MobileNav.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

type Link = { href: string; label: string };

export default function MobileNav({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: Link[];
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      triggerFocusRef.current = document.activeElement as HTMLElement;
      const firstLink = panelRef.current?.querySelector<HTMLElement>("a,button");
      firstLink?.focus();
    } else {
      triggerFocusRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        "a[href],button:not([disabled])"
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-bg/80"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="absolute inset-y-0 right-0 flex w-full max-w-xs flex-col gap-1 border-l border-surface-line bg-bg-secondary p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-surface-line text-text-muted transition-colors hover:text-text"
            >
              <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <nav className="mt-6 flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="rounded-lg px-3 py-3 text-base text-text-muted transition-colors hover:bg-surface hover:text-text"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Rewrite `Nav.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import MobileNav from "@/components/MobileNav";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#services", label: "Solutions" },
  { href: "#how-we-work", label: "How We Work" },
  { href: "#case-studies", label: "Case Studies" },
  { href: "#insights", label: "Insights" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-surface-line bg-bg/90 backdrop-blur" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <a href="#top" className="flex items-center gap-2">
          <Image
            src="/avanlog__1_-removebg-preview.png"
            alt="Avanlog"
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 object-contain"
          />
          <span className="font-display text-xl font-bold tracking-tight text-text">
            avanlog
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-bg transition-colors hover:bg-accent-cyan md:inline-flex"
          >
            Book an Audit
          </a>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-line text-text md:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={[...LINKS, { href: "#contact", label: "Book an Audit" }]}
      />
    </header>
  );
}
```

Note the "Solutions" link points at `#services` per spec §5.1 (no dedicated Solutions section exists yet) — this is intentional, not a bug.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/Nav.tsx src/components/MobileNav.tsx`
Expected: both clean.

Manual check in the browser at 390px width: tap the menu button, confirm the drawer slides in from the right, Tab cycles only within it (test by tabbing past the last link — focus should return to the close button, not escape to page content), Escape closes it, clicking the backdrop closes it, and focus returns to the menu button after closing. At 1470px width, confirm the header is transparent at the top of the page and gains the `bg-bg/90` background + bottom border after scrolling past 8px.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.tsx src/components/MobileNav.tsx
git commit -m "feat: rebuild nav with accessible mobile drawer on new design system"
```

---

### Task 4: Hero + infrastructure visual

**Files:**
- Modify: `src/components/Hero.tsx` (rewrite)
- Create: `src/components/InfrastructureVisual.tsx`

**Interfaces:**
- Consumes: `useReducedMotion` from Task 2.
- Produces: `Hero` default export, no props (same as current usage in `page.tsx`).

- [ ] **Step 1: Write `InfrastructureVisual.tsx`**

```tsx
"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Node = { id: string; x: number; y: number; label: string };

const NODES: Node[] = [
  { id: "api", x: 40, y: 40, label: "API" },
  { id: "worker", x: 40, y: 160, label: "Worker" },
  { id: "db", x: 260, y: 40, label: "Database" },
  { id: "cache", x: 260, y: 160, label: "Cache" },
  { id: "core", x: 150, y: 100, label: "Production" },
];

const EDGES: [string, string][] = [
  ["api", "core"],
  ["worker", "core"],
  ["core", "db"],
  ["core", "cache"],
];

function nodeById(id: string) {
  return NODES.find((node) => node.id === id)!;
}

export default function InfrastructureVisual() {
  const reducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 300 200"
      className="h-auto w-full max-w-md"
      role="img"
      aria-label="Diagram of application services connected to a central production environment"
    >
      {EDGES.map(([from, to], index) => {
        const a = nodeById(from);
        const b = nodeById(to);
        return (
          <motion.line
            key={`${from}-${to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="var(--surface-line)"
            strokeWidth={1.5}
            initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: "easeOut" }}
          />
        );
      })}

      {!reducedMotion && (
        <motion.circle
          r={3}
          fill="var(--accent-cyan)"
          animate={{
            cx: [nodeById("api").x, nodeById("core").x, nodeById("db").x],
            cy: [nodeById("api").y, nodeById("core").y, nodeById("db").y],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />
      )}

      {NODES.map((node, index) => (
        <motion.g
          key={node.id}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <circle
            cx={node.x}
            cy={node.y}
            r={node.id === "core" ? 14 : 10}
            fill="var(--surface)"
            stroke={node.id === "core" ? "var(--accent)" : "var(--surface-line)"}
            strokeWidth={1.5}
          />
          <text
            x={node.x}
            y={node.y + (node.id === "core" ? 26 : 22)}
            textAnchor="middle"
            fontSize={9}
            fill="var(--text-muted)"
            fontFamily="var(--font-mono)"
          >
            {node.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
```

- [ ] **Step 2: Rewrite `Hero.tsx`**

Keep the existing `AnimatedStat` count-up helper if `Hero.tsx` currently has one in active use elsewhere in this file only (check before deleting it — spec §5.3 moves the stats strip into `ReliabilityMetrics.tsx`, so remove any stats block from `Hero.tsx` itself). Replace the component body with:

```tsx
"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import InfrastructureVisual from "@/components/InfrastructureVisual";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-bg pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-surface-line bg-surface px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-accent-cyan"
          >
            Cloud Infrastructure / DevOps / SRE
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-6 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight text-text"
          >
            Production infrastructure. Engineered for reliability.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-text-muted"
          >
            We help ambitious teams automate deployments, engineer resilient
            cloud infrastructure, and keep production systems running with
            confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-accent-cyan"
            >
              Book an Infrastructure Audit
            </a>
            <a
              href="#services"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-text transition-colors hover:text-accent-cyan"
            >
              Explore Our Services
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={2}
                aria-hidden="true"
              />
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-6 text-sm text-text-muted"
          >
            Built for teams that cannot afford unreliable releases.
          </motion.p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <InfrastructureVisual />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/Hero.tsx src/components/InfrastructureVisual.tsx`
Expected: both clean.

Manual check: load the page, confirm the headline, supporting text, and CTAs reveal in sequence within roughly a second, the SVG nodes fade/scale in and connecting lines draw, and the small cyan dot pulses along one path on a loop. Enable `prefers-reduced-motion: reduce` in DevTools, reload, and confirm all content is immediately visible with no looping pulse animation (the lines may still do their one-time entrance — only the `Infinity`-repeat pulse must stop, per the `!reducedMotion &&` guard above).

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.tsx src/components/InfrastructureVisual.tsx
git commit -m "feat: rebuild hero with bespoke infrastructure SVG visualization"
```

---

### Task 5: Reliability metrics strip

**Files:**
- Create: `src/components/ReliabilityMetrics.tsx`
- Delete: `src/components/MetricsStrip.tsx`, `src/components/ReliabilityMetricsStrip.tsx` (after import audit)

**Interfaces:**
- Produces: `ReliabilityMetrics` default export, no props.

- [ ] **Step 1: Audit for imports before deleting**

Run: `cd /Users/tushargupta/Documents/avanlog && grep -rn "MetricsStrip\|ReliabilityMetricsStrip" src/`
Expected: only the two component files themselves (no importers), since neither is referenced in the current `page.tsx`. If an importer turns up, stop and resolve it manually before deleting (do not delete a file something still imports).

- [ ] **Step 2: Write `ReliabilityMetrics.tsx`**

```tsx
"use client";

import { motion, type Variants } from "motion/react";

type Metric = { value: string; label: string };

const METRICS: Metric[] = [
  { value: "99.95%", label: "Uptime SLA" },
  { value: "24/7", label: "On-call coverage" },
  { value: "<15m", label: "Time to acknowledge" },
  { value: "24/7", label: "Operational visibility" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ReliabilityMetrics() {
  return (
    <section className="border-y border-surface-line bg-bg-secondary py-10">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {METRICS.map((metric, index) => (
            <motion.div
              key={metric.label}
              variants={item}
              className={`flex flex-col gap-1 ${
                index === 0 ? "items-start text-left" : index === METRICS.length - 1 ? "items-start text-left md:items-end md:text-right" : "items-start text-left"
              }`}
            >
              <span className="font-mono text-3xl font-semibold text-text">
                {metric.value}
              </span>
              <span className="text-xs uppercase tracking-[0.1em] text-text-muted">
                {metric.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
        <p className="mt-6 text-xs text-text-muted">
          Representative targets — confirmed per engagement.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Delete the superseded files**

```bash
git rm src/components/MetricsStrip.tsx src/components/ReliabilityMetricsStrip.tsx
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/ReliabilityMetrics.tsx`
Expected: clean (the two deleted files must not be imported anywhere, confirmed in Step 1).

Manual check at 1470px: the first metric sits flush with the container's left edge and the fourth flush with the right edge (use the `md:items-end`/`md:text-right` only on the last cell — the middle two stay left-aligned within their grid cell, which still reads as evenly distributed since the grid itself spans full width). At 390px: metrics wrap into a 2x2 grid with no overlap.

- [ ] **Step 5: Commit**

```bash
git add src/components/ReliabilityMetrics.tsx
git commit -m "feat: add reliability metrics strip, remove duplicate metrics components"
```

---

### Task 6: Technology stack section

**Files:**
- Create: `src/components/TechnologyStack.tsx`
- Delete: `src/components/TechnologyEcosystem.tsx`, `src/components/TechnologyGrid.tsx` (after import audit)

**Interfaces:**
- Produces: `TechnologyStack` default export, no props.

- [ ] **Step 1: Audit for imports**

Run: `grep -rn "TechnologyEcosystem\|TechnologyGrid" src/`
Expected: only the two files' own definitions. Resolve any other importer before deleting.

- [ ] **Step 2: Write `TechnologyStack.tsx`**

```tsx
const TECHNOLOGIES = [
  "AWS",
  "Microsoft Azure",
  "Google Cloud",
  "Cloudflare",
  "Docker",
  "Kubernetes",
  "Terraform",
  "GitHub Actions",
  "GitLab CI/CD",
  "Prometheus",
  "Grafana",
  "OpenTelemetry",
];

export default function TechnologyStack() {
  return (
    <section className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="max-w-xl">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-text">
            Built around your existing stack.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-muted">
            Practical infrastructure engineering that works with the tools
            your team already trusts.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {TECHNOLOGIES.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center rounded-xl border border-surface-line px-4 py-5 text-center text-sm text-text-muted transition-colors hover:border-accent hover:text-text"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Delete superseded files**

```bash
git rm src/components/TechnologyEcosystem.tsx src/components/TechnologyGrid.tsx
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/TechnologyStack.tsx`
Expected: clean.

Manual check: grid is 2 columns at 390px, 6 at 1470px, no overflow; hovering a chip brightens its border/text.

- [ ] **Step 5: Commit**

```bash
git add src/components/TechnologyStack.tsx
git commit -m "feat: add technology stack grid, remove duplicate tech components"
```

---

### Task 7: Services section

**Files:**
- Create: `src/components/ServicesSection.tsx`
- Create: `src/components/ServiceCard.tsx`
- Delete: `src/components/Services.tsx`, `src/components/CoreServicesGrid.tsx` (after import audit)

**Interfaces:**
- Produces: `ServicesSection` default export, no props, renders `<section id="services">`. `ServiceCard` default export, props `{ icon: LucideIcon; title: string; description: string; capabilities: string[]; href: string }`.

- [ ] **Step 1: Audit for imports**

Run: `grep -rn "\bServices\b\|CoreServicesGrid" src/components src/app`
Expected: only the two target files' own definitions (note: grep loosely for `Services` will also match `ServicesSection`/`ReliabilityMetrics` wording in comments — confirm matches are real imports of the old files, i.e. lines containing `from "@/components/Services"` or `from "@/components/CoreServicesGrid"`). Resolve any other importer before deleting.

- [ ] **Step 2: Write `ServiceCard.tsx`**

```tsx
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Check } from "lucide-react";

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  capabilities,
  href,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  capabilities: string[];
  href: string;
}) {
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-surface-line bg-surface p-6 transition-colors duration-200 hover:border-accent">
      <Icon className="h-6 w-6 text-accent-cyan" strokeWidth={1.75} aria-hidden="true" />
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="text-sm leading-relaxed text-text-muted">{description}</p>
      <ul className="flex flex-col gap-1.5">
        {capabilities.map((capability) => (
          <li key={capability} className="flex items-center gap-2 text-sm text-text-muted">
            <Check className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2} aria-hidden="true" />
            {capability}
          </li>
        ))}
      </ul>
      <a
        href={href}
        className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-text transition-colors hover:text-accent-cyan"
      >
        Learn more
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
      </a>
    </div>
  );
}
```

- [ ] **Step 3: Write `ServicesSection.tsx`**

```tsx
import { Cloud, GitBranch, Boxes, LayoutGrid, Activity, Server } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";

const SERVICES = [
  {
    icon: Cloud,
    title: "Cloud Infrastructure Engineering",
    description:
      "Design, provision, and manage secure cloud environments built around your application's performance, availability, and growth requirements.",
    capabilities: [
      "Cloud architecture",
      "Infrastructure provisioning",
      "AWS, Azure, and Google Cloud",
      "Infrastructure as Code",
      "Networking and IAM",
      "Cloud migration",
    ],
    href: "#services",
  },
  {
    icon: GitBranch,
    title: "DevOps and CI/CD Automation",
    description:
      "Replace fragile manual releases with repeatable delivery pipelines that help teams ship changes with confidence.",
    capabilities: [
      "CI/CD pipeline design",
      "Automated testing integration",
      "Build and release automation",
      "Environment management",
      "Deployment strategies",
      "Rollback automation",
    ],
    href: "#pipeline-section",
  },
  {
    icon: Boxes,
    title: "Kubernetes and Container Platforms",
    description:
      "Build and operate container platforms that make application deployment, scaling, and lifecycle management more predictable.",
    capabilities: [
      "Docker",
      "Kubernetes",
      "Container orchestration",
      "Cluster configuration",
      "Helm",
      "Workload scaling",
    ],
    href: "#pipeline-section",
  },
  {
    icon: LayoutGrid,
    title: "Platform Engineering",
    description:
      "Create reusable infrastructure patterns and deployment workflows that reduce developer friction and operational overhead.",
    capabilities: [
      "Internal developer platforms",
      "Deployment templates",
      "Self-service infrastructure workflows",
      "Standardized environments",
      "Developer experience",
      "Platform automation",
    ],
    href: "#how-we-work",
  },
  {
    icon: Activity,
    title: "Site Reliability Engineering",
    description:
      "Improve service reliability through observability, sensible reliability targets, incident response, and continuous operational improvement.",
    capabilities: [
      "Service-level objectives",
      "Monitoring and alerting",
      "Incident management",
      "Performance engineering",
      "Reliability reviews",
      "Disaster recovery planning",
    ],
    href: "#observability",
  },
  {
    icon: Server,
    title: "Managed Cloud Operations",
    description:
      "Get consistent operational support for the cloud environments your business depends on, with clear ownership and transparent processes.",
    capabilities: [
      "Infrastructure monitoring",
      "Maintenance and patching",
      "Backup management",
      "Incident escalation",
      "Cost optimization",
      "Operational reporting",
    ],
    href: "#engagement",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="max-w-xl">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-text">
            Everything your production environment needs.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-muted">
            From the first deployment pipeline to dependable day-to-day
            operations, we engineer the systems behind reliable software
            delivery.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

Note `href="#pipeline-section"` and `href="#observability"` are the ids Task 15 assigns to `DeploymentPipeline` and `ObservabilityShowcase` respectively — confirm those ids exist once Task 15 lands (they're added there).

- [ ] **Step 4: Delete superseded files**

```bash
git rm src/components/Services.tsx src/components/CoreServicesGrid.tsx
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/ServicesSection.tsx src/components/ServiceCard.tsx`
Expected: clean.

Manual check: 3-column grid at 1470px, 2-column at ~820px, 1-column at 390px; hovering a card brightens its border and lifts slightly; each "Learn more" arrow shifts right on hover.

- [ ] **Step 6: Commit**

```bash
git add src/components/ServicesSection.tsx src/components/ServiceCard.tsx
git commit -m "feat: add six-service grid, remove duplicate services components"
```

---

### Task 8: Deployment pipeline (interactive, rebuilt)

**Files:**
- Modify: `src/components/DeploymentPipeline.tsx` (full rewrite)

**Interfaces:**
- Consumes: nothing new.
- Produces: `DeploymentPipeline` default export, renders `<section id="pipeline-section">` (id consumed by Task 7's "Learn more" links).

- [ ] **Step 1: Replace the file**

```tsx
"use client";

import { useState } from "react";
import {
  GitCommit,
  Hammer,
  FlaskConical,
  ShieldCheck,
  Rocket,
  Activity,
  type LucideIcon,
} from "lucide-react";

type Stage = {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  tools: string;
};

const STAGES: Stage[] = [
  {
    id: "commit",
    title: "Code Commit",
    icon: GitCommit,
    description: "A code change enters version control and triggers the delivery workflow.",
    tools: "Git, pull request checks",
  },
  {
    id: "build",
    title: "Build",
    icon: Hammer,
    description: "The application is compiled or packaged into a consistent deployable artifact.",
    tools: "Docker, build caching",
  },
  {
    id: "test",
    title: "Automated Tests",
    icon: FlaskConical,
    description: "Automated checks validate expected behavior before release.",
    tools: "Unit, integration, contract tests",
  },
  {
    id: "security",
    title: "Security Checks",
    icon: ShieldCheck,
    description: "Relevant dependency, configuration, and vulnerability checks run before deployment.",
    tools: "Dependency scanning, IaC policy checks",
  },
  {
    id: "deploy",
    title: "Deployment",
    icon: Rocket,
    description: "Changes are released using a deployment strategy appropriate to the application's requirements.",
    tools: "Blue-green, canary, rolling",
  },
  {
    id: "monitor",
    title: "Production Monitoring",
    icon: Activity,
    description: "Observability and health checks help teams understand the impact of the release.",
    tools: "Health checks, error rate, latency",
  },
];

export default function DeploymentPipeline() {
  const [activeId, setActiveId] = useState(STAGES[0].id);
  const activeIndex = STAGES.findIndex((stage) => stage.id === activeId);
  const active = STAGES[activeIndex];

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActiveId(STAGES[(index + 1) % STAGES.length].id);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveId(STAGES[(index - 1 + STAGES.length) % STAGES.length].id);
    }
  };

  return (
    <section id="pipeline-section" className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="max-w-xl">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-text">
            From commit to production. Without the chaos.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-muted">
            Create a repeatable path from code changes to production
            releases with automated checks, controlled deployment, and
            clear operational visibility.
          </p>
        </div>

        <div
          role="group"
          aria-label="Deployment pipeline stages"
          className="mt-14 flex flex-col gap-2 md:mt-20 md:flex-row md:items-start md:gap-0"
        >
          {STAGES.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = stage.id === activeId;
            return (
              <div key={stage.id} className="flex flex-1 flex-col md:items-center">
                <div className="flex items-center md:w-full">
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveId(stage.id)}
                    onKeyDown={(event) => onKeyDown(event, index)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors md:flex-col md:items-center md:gap-2 md:text-center ${
                      isActive
                        ? "border-accent bg-surface text-text"
                        : "border-surface-line text-text-muted hover:border-accent/50"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                    <span className="text-sm font-medium">{stage.title}</span>
                  </button>
                  {index < STAGES.length - 1 && (
                    <div
                      aria-hidden="true"
                      className={`hidden h-px flex-1 md:block ${
                        index < activeIndex ? "bg-accent" : "bg-surface-line"
                      }`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-surface-line bg-surface p-6 md:p-8">
          <h3 className="text-lg font-semibold text-text">{active.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
            {active.description}
          </p>
          <p className="mt-3 font-mono text-xs text-accent-cyan">{active.tools}</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/DeploymentPipeline.tsx`
Expected: clean.

Manual check: click each stage, confirm the description panel below updates and the connecting line up to that stage turns accent-colored on desktop width. Tab to the stage buttons and use ArrowRight/ArrowLeft to move between them, confirming the description panel updates on arrow-key navigation too (not only click). Confirm `aria-pressed="true"` is present on the active stage's button (inspect via DevTools Accessibility pane or `outerHTML`). At 390px width, confirm stages stack vertically and no label is clipped or truncated.

- [ ] **Step 3: Commit**

```bash
git add src/components/DeploymentPipeline.tsx
git commit -m "feat: rebuild deployment pipeline as accessible explanatory stage selector"
```

---

### Task 9: Observability showcase

**Files:**
- Modify: `src/components/ObservabilityShowcase.tsx` (full rewrite)
- Delete: `src/components/ObservabilityBentoGrid.tsx`, `src/components/ArchitectureShowcase.tsx`, `src/components/IncidentWalkthrough.tsx` (after import audit)

**Interfaces:**
- Produces: `ObservabilityShowcase` default export, renders `<section id="observability">` (id consumed by Task 7).

- [ ] **Step 1: Audit for imports**

Run: `grep -rn "ObservabilityBentoGrid\|ArchitectureShowcase\|IncidentWalkthrough" src/`
Expected: only each file's own definition. Resolve any other importer (including `src/app/pipeline/page.tsx`, which is out of scope and must not be broken) before deleting.

- [ ] **Step 2: Rewrite `ObservabilityShowcase.tsx`**

```tsx
"use client";

import { motion } from "motion/react";

const LATENCY_POINTS = [40, 44, 38, 52, 48, 60, 55, 50, 46, 42];
const ERROR_POINTS = [2, 3, 2, 4, 2, 5, 3, 2, 2, 1];

function sparklinePath(points: number[], width: number, height: number) {
  const max = Math.max(...points);
  const step = width / (points.length - 1);
  return points
    .map((value, index) => {
      const x = index * step;
      const y = height - (value / max) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

const DEPLOYS = [
  { label: "avanlog-api #482", time: "2m ago", status: "Stable" },
  { label: "avanlog-worker #118", time: "41m ago", status: "Stable" },
  { label: "avanlog-api #481", time: "3h ago", status: "Rolled back" },
];

const EVENTS = [
  "p99 latency returned to baseline after #482",
  "Alert: error rate exceeded 1% for 4 minutes, auto-resolved",
  "Scheduled scale-up ahead of traffic peak",
];

export default function ObservabilityShowcase() {
  return (
    <section id="observability" className="bg-bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="max-w-xl">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-text">
            Know what is happening in production.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-muted">
            Make infrastructure health, application behavior, and
            operational events easier to understand.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="relative mt-12 overflow-hidden rounded-2xl border border-surface-line bg-surface p-6 md:p-8"
        >
          <span className="absolute right-4 top-4 rounded-full border border-surface-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Demonstration data
          </span>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-surface-line p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Service health</p>
              <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-text">
                <span className="h-2.5 w-2.5 rounded-full bg-accent-cyan" aria-hidden="true" />
                Operational
              </p>
            </div>

            <div className="rounded-xl border border-surface-line p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Request latency (p99, ms)</p>
              <svg viewBox="0 0 100 32" className="mt-2 h-8 w-full">
                <path d={sparklinePath(LATENCY_POINTS, 100, 32)} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
              </svg>
              <p className="mt-1 font-mono text-sm text-text">284ms</p>
            </div>

            <div className="rounded-xl border border-surface-line p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Error rate (%)</p>
              <svg viewBox="0 0 100 32" className="mt-2 h-8 w-full">
                <path d={sparklinePath(ERROR_POINTS, 100, 32)} fill="none" stroke="var(--accent-cyan)" strokeWidth={1.5} />
              </svg>
              <p className="mt-1 font-mono text-sm text-text">0.03%</p>
            </div>

            <div className="rounded-xl border border-surface-line p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">CPU utilization</p>
              <div className="mt-3 h-2 rounded-full bg-bg">
                <div className="h-2 rounded-full bg-accent" style={{ width: "42%" }} />
              </div>
              <p className="mt-1 font-mono text-xs text-text-muted">42%</p>
            </div>

            <div className="rounded-xl border border-surface-line p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Memory utilization</p>
              <div className="mt-3 h-2 rounded-full bg-bg">
                <div className="h-2 rounded-full bg-accent-cyan" style={{ width: "61%" }} />
              </div>
              <p className="mt-1 font-mono text-xs text-text-muted">61%</p>
            </div>

            <div className="rounded-xl border border-surface-line p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Deployment history</p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {DEPLOYS.map((deploy) => (
                  <li key={deploy.label} className="flex items-center justify-between text-xs text-text-muted">
                    <span className="truncate text-text">{deploy.label}</span>
                    <span>{deploy.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-surface-line p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-text-muted">Service dependency map</p>
              <svg viewBox="0 0 200 60" className="mt-3 h-14 w-full">
                <line x1="20" y1="30" x2="100" y2="30" stroke="var(--surface-line)" strokeWidth={1.5} />
                <line x1="100" y1="30" x2="180" y2="15" stroke="var(--surface-line)" strokeWidth={1.5} />
                <line x1="100" y1="30" x2="180" y2="45" stroke="var(--surface-line)" strokeWidth={1.5} />
                <circle cx="20" cy="30" r="8" fill="var(--bg)" stroke="var(--accent-cyan)" strokeWidth={1.5} />
                <circle cx="100" cy="30" r="10" fill="var(--bg)" stroke="var(--accent)" strokeWidth={1.5} />
                <circle cx="180" cy="15" r="8" fill="var(--bg)" stroke="var(--surface-line)" strokeWidth={1.5} />
                <circle cx="180" cy="45" r="8" fill="var(--bg)" stroke="var(--surface-line)" strokeWidth={1.5} />
              </svg>
            </div>

            <div className="rounded-xl border border-surface-line p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Recent events</p>
              <ul className="mt-2 flex flex-col gap-2 text-xs text-text-muted">
                {EVENTS.map((event) => (
                  <li key={event}>{event}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <a
          href="#services"
          className="mt-6 inline-block text-sm font-semibold text-text transition-colors hover:text-accent-cyan"
        >
          Explore our observability approach
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Delete superseded files**

```bash
git rm src/components/ObservabilityBentoGrid.tsx src/components/ArchitectureShowcase.tsx src/components/IncidentWalkthrough.tsx
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/ObservabilityShowcase.tsx`
Expected: clean.

Manual check: "Demonstration data" label is visibly present in the panel corner at all widths; sparkline paths render without console errors (an `SVGPathElement` with a valid `d` attribute — check DevTools console for any NaN-related warnings, which would indicate a division issue in `sparklinePath`); bento grid reflows to 1 column at 390px without overlap.

- [ ] **Step 5: Commit**

```bash
git add src/components/ObservabilityShowcase.tsx
git commit -m "feat: rebuild observability showcase as labeled illustrative dashboard"
```

---

### Task 10: Process timeline (How We Work)

**Files:**
- Modify: `src/components/HowWeWork.tsx`
- Delete: `src/components/Process.tsx` (after import audit)

**Interfaces:**
- Consumes: existing alternating-timeline mechanic already in this file (scroll-synced progress line via `useScroll`/`useTransform`, numbered nodes) — keep the mechanic, replace content and colors.
- Produces: `HowWeWork` default export, renders `<section id="how-we-work">` (rename the existing `id="process"` to `id="how-we-work"` to match Task 3's nav link and Task 7's "Learn more" link).

- [ ] **Step 1: Audit for imports**

Run: `grep -rn "\bProcess\b" src/components src/app | grep -v "process\.env"`
Expected: only `Process.tsx`'s own definition (watch for false positives from unrelated words containing "process" — confirm matches are `from "@/components/Process"`).

- [ ] **Step 2: Update `HowWeWork.tsx`**

Keep the file's existing structure (`TimelineNode`, scroll-synced line, alternating left/right cards) exactly as built previously, and make these targeted edits:

1. Change `<section id="process" ...>` to `<section id="how-we-work" ...>`.
2. Replace the `STEPS` array with:

```ts
const STEPS: Step[] = [
  {
    title: "Assess",
    description:
      "Understand the existing infrastructure, deployment workflow, operational pain points, security requirements, and reliability expectations.",
    icon: Search,
    from: "#3987ff",
    to: "#40d9f2",
    glow: "rgba(57,135,255,0.3)",
  },
  {
    title: "Architect",
    description:
      "Define an appropriate architecture, infrastructure plan, automation strategy, and measurable delivery goals.",
    icon: PencilRuler,
    from: "#3987ff",
    to: "#40d9f2",
    glow: "rgba(57,135,255,0.3)",
  },
  {
    title: "Automate",
    description:
      "Implement repeatable infrastructure provisioning, CI/CD pipelines, environment configuration, and operational workflows.",
    icon: Wrench,
    from: "#3987ff",
    to: "#40d9f2",
    glow: "rgba(57,135,255,0.3)",
  },
  {
    title: "Deploy",
    description:
      "Validate the release process, test deployment and rollback procedures, and establish production readiness.",
    icon: PlayCircle,
    from: "#3987ff",
    to: "#40d9f2",
    glow: "rgba(57,135,255,0.3)",
  },
  {
    title: "Operate and Improve",
    description:
      "Monitor the environment, review operational performance, address incidents, and continuously improve reliability and efficiency.",
    icon: Eye,
    from: "#3987ff",
    to: "#40d9f2",
    glow: "rgba(57,135,255,0.3)",
  },
];
```

3. Replace every old-token class in the file (`bg-graphite` → `bg-bg`, `border-surface-line` stays as-is since that name carries over, `text-paper` → `text-text`, `text-fog` → `text-text-muted`, `border-steel-line` → `border-surface-line`, `text-wire` → `text-accent-cyan`, `bg-white`/card background → `bg-surface`, card text `text-paper`→`text-text`) so the section uses only Task 1's tokens.
4. Add a caption under the heading's supporting paragraph:

```tsx
<p className="mt-2 text-sm text-text-muted">
  The approach below adapts to each client&rsquo;s existing infrastructure
  and requirements.
</p>
```

5. Update the heading/supporting copy to:

```tsx
<h2 className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-text">
  A clear path to reliable production.
</h2>
<p className="mt-4 text-base leading-relaxed text-text-muted">
  Every engagement starts with understanding your environment, identifying
  risk, and building a practical plan.
</p>
```

- [ ] **Step 3: Delete superseded file**

```bash
git rm src/components/Process.tsx
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/HowWeWork.tsx`
Expected: clean.

Manual check: scroll through the section, confirm the progress line still draws in blue/cyan only (no purple/amber/teal), all five steps show the brief's new copy, and `grep -n "graphite\|steel\|text-fog\|text-paper\|text-wire\|text-signal\|text-amber" src/components/HowWeWork.tsx` returns nothing.

- [ ] **Step 5: Commit**

```bash
git add src/components/HowWeWork.tsx
git commit -m "feat: update process timeline copy and recolor onto new design system"
```

---

### Task 11: Case studies → engineering in practice

**Files:**
- Modify: `src/components/CaseStudies.tsx`

**Interfaces:**
- Produces: `CaseStudies` default export, renders `<section id="case-studies">` (add this id — the current file has no id).

- [ ] **Step 1: Replace the data and remove the count-up metric usage**

Keep the file's existing bento layout mechanic (`FeaturedCard`/`CompactCard`, `GlowEdge`, `Badge`, `ReadLink`) but make these changes:

1. Add `id="case-studies"` to the `<section>`.
2. Replace the `CASE_STUDIES` array (and remove the `Metric`/`MetricPill`/`useCountUp` usage from the two card components — replace the `metrics` grid with a `tags` list) with:

```ts
type CaseStudy = {
  category: string;
  title: string;
  summary: string;
  tags: string[];
  featured?: boolean;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    category: "Demonstration",
    title: "Designing a production-ready deployment pipeline",
    summary:
      "A deployment pipeline architecture for a team moving off manual releases: build artifact strategy, automated test gating, security scanning, and a blue-green release path with fast rollback.",
    tags: ["Blue-green releases", "Automated rollback", "Policy-gated deploys"],
    featured: true,
  },
  {
    category: "Demonstration",
    title: "Building a repeatable cloud infrastructure setup",
    summary:
      "An Infrastructure-as-Code baseline for standing up consistent, reviewable cloud environments across dev, staging, and production.",
    tags: ["Terraform modules", "Environment parity", "IAM least-privilege"],
  },
  {
    category: "Demonstration",
    title: "Implementing a monitoring and alerting strategy",
    summary:
      "A practical approach to service-level objectives, alert routing, and incident response for a team with no existing observability practice.",
    tags: ["SLOs", "Alert routing", "On-call runbooks"],
  },
];
```

3. Replace each card's metric-pill grid with a tag list:

```tsx
<div className="mt-auto flex flex-wrap gap-2 pt-2">
  {study.tags.map((tag) => (
    <span
      key={tag}
      className="rounded-full border border-surface-line px-3 py-1 text-xs text-text-muted"
    >
      {tag}
    </span>
  ))}
</div>
```

4. Change the "Read the engagement" link text to "Read the approach" and keep it pointed at `#contact`.
5. Change the section heading/supporting copy to:

```tsx
<span className="... text-accent-cyan">Engineering in practice</span>
<h2 className="...">Engineering in practice.</h2>
<p className="...">
  No invented client logos or numbers — here&rsquo;s how we&rsquo;d approach
  problems like these. Real engagement case studies will appear here as
  they are published.
</p>
```

6. Replace the `Zap`-icon industry badge with a plain "Demonstration" chip (drop the `Zap` icon import if no longer used elsewhere in the file) and swap all remaining old-token classes (`bg-black` section background → `bg-bg`, `bg-steel` card → `bg-surface`, `border-steel-line` → `border-surface-line`, `text-paper` → `text-text`, `text-fog` → `text-text-muted`, per-study `from`/`to`/`glow` gradient colors → `#3987ff`/`#40d9f2`/`rgba(57,135,255,0.3)` for all three, since no purple/amber/teal is allowed) to match the new tokens.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/CaseStudies.tsx`
Expected: clean. (If `useCountUp`/`MetricPill` become unused after this edit, delete them from the file — an unused export/function will fail `eslint`'s no-unused-vars rule.)

Manual check: all three cards show "Demonstration" badges and tag chips (no percentage/number claims), bento layout still renders (one large + two compact), and `grep -n "bg-black\|bg-steel\|text-paper\|text-fog\|border-steel-line" src/components/CaseStudies.tsx` returns nothing.

- [ ] **Step 3: Commit**

```bash
git add src/components/CaseStudies.tsx
git commit -m "feat: reframe case studies as labeled engineering demonstrations"
```

---

### Task 12: Engagement models

**Files:**
- Modify: `src/components/EngagementModels.tsx` (full rewrite)

**Interfaces:**
- Produces: `EngagementModels` default export, renders `<section id="engagement">` (id consumed by Task 7).

- [ ] **Step 1: Replace the file**

```tsx
const MODELS = [
  {
    title: "Infrastructure Audit",
    description:
      "For businesses that want to understand their current cloud setup, deployment process, security posture, or reliability risks.",
    cta: "Request an Audit",
  },
  {
    title: "Deployment Engineering",
    description:
      "For teams that need CI/CD pipelines, automated releases, environment configuration, or a repeatable deployment process.",
    cta: "Discuss a Deployment",
  },
  {
    title: "Cloud Migration and Modernization",
    description:
      "For businesses moving applications, improving infrastructure architecture, or standardizing environments.",
    cta: "Plan Your Migration",
  },
  {
    title: "Managed DevOps and Production Operations",
    description:
      "For businesses that need ongoing infrastructure maintenance, monitoring, operational support, and reliability improvements.",
    cta: "Discuss Ongoing Support",
  },
];

export default function EngagementModels() {
  return (
    <section id="engagement" className="bg-bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <h2 className="max-w-xl text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-text">
          Bring us in where you need us.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {MODELS.map((model) => (
            <div
              key={model.title}
              className="flex flex-col gap-4 rounded-2xl border border-surface-line bg-surface p-6"
            >
              <h3 className="text-lg font-semibold text-text">{model.title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">{model.description}</p>
              <a
                href="#contact"
                className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-accent px-4 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent hover:text-bg"
              >
                {model.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-text-muted">
          Scope, availability, response times, and pricing are defined per
          engagement.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/EngagementModels.tsx`
Expected: clean.

Manual check: 2x2 grid at 1470px collapses to a single column at 390px with no overlap; each CTA scrolls to `#contact`.

- [ ] **Step 3: Commit**

```bash
git add src/components/EngagementModels.tsx
git commit -m "feat: rebuild engagement models on new design system"
```

---

### Task 13: Security and operational trust section

**Files:**
- Create: `src/components/SecuritySection.tsx`

**Interfaces:**
- Produces: `SecuritySection` default export, no props.

- [ ] **Step 1: Write the file**

```tsx
import {
  KeyRound,
  Lock,
  ShieldCheck,
  ScanSearch,
  DatabaseBackup,
  FileClock,
  Layers,
  Siren,
  type LucideIcon,
} from "lucide-react";

type Practice = { icon: LucideIcon; label: string; description: string };

const PRACTICES: Practice[] = [
  { icon: KeyRound, label: "Least-privilege access", description: "Access scoped to what each role actually needs." },
  { icon: Lock, label: "Secrets management", description: "Credentials and keys handled outside application code." },
  { icon: ShieldCheck, label: "Secure infrastructure configuration", description: "Hardened defaults across environments." },
  { icon: ScanSearch, label: "Dependency and vulnerability scanning", description: "Automated checks before release." },
  { icon: DatabaseBackup, label: "Backup and recovery planning", description: "Tested restore paths, not just backups." },
  { icon: FileClock, label: "Monitoring and audit trails", description: "Visibility into who changed what, and when." },
  { icon: Layers, label: "Environment separation", description: "Clear boundaries between dev, staging, and production." },
  { icon: Siren, label: "Incident escalation procedures", description: "A defined path from alert to resolution." },
];

export default function SecuritySection() {
  return (
    <section className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <h2 className="max-w-xl text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-text">
          Built with operational responsibility in mind.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRACTICES.map((practice) => (
            <div key={practice.label} className="flex flex-col gap-3">
              <practice.icon className="h-5 w-5 text-accent-cyan" strokeWidth={1.75} aria-hidden="true" />
              <h3 className="text-sm font-semibold text-text">{practice.label}</h3>
              <p className="text-sm leading-relaxed text-text-muted">{practice.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/SecuritySection.tsx`
Expected: clean.

Manual check: 4-column grid at 1470px, 2-column at ~820px, 1-column at 390px.

- [ ] **Step 3: Commit**

```bash
git add src/components/SecuritySection.tsx
git commit -m "feat: add security and operational trust section"
```

---

### Task 14: Insights and FAQ sections

**Files:**
- Create: `src/components/InsightsSection.tsx`
- Create: `src/components/FAQSection.tsx`

**Interfaces:**
- Produces: `InsightsSection` default export, renders `<section id="insights">`. `FAQSection` default export, renders `<section id="faq">`.

- [ ] **Step 1: Write `InsightsSection.tsx`**

```tsx
const ARTICLES = [
  { title: "Building reliable CI/CD pipelines", category: "CI/CD", readTime: "6 min" },
  { title: "Docker and Kubernetes deployment patterns", category: "Containers", readTime: "8 min" },
  { title: "Infrastructure as Code with Terraform", category: "IaC", readTime: "7 min" },
  { title: "Cloud cost optimization", category: "Cost", readTime: "5 min" },
  { title: "Observability fundamentals", category: "Monitoring", readTime: "6 min" },
  { title: "Production incident preparedness", category: "Reliability", readTime: "7 min" },
  { title: "Blue-green and canary deployment strategies", category: "Deployment", readTime: "6 min" },
  { title: "Cloud backup and disaster recovery", category: "Resilience", readTime: "5 min" },
];

export default function InsightsSection() {
  return (
    <section id="insights" className="bg-bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <h2 className="max-w-xl text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-text">
          Better infrastructure starts with better decisions.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ARTICLES.map((article) => (
            <div
              key={article.title}
              className="flex flex-col gap-3 rounded-xl border border-surface-line bg-surface p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-accent-cyan">
                  {article.category}
                </span>
                <span className="rounded-full border border-surface-line px-2 py-0.5 text-[10px] text-text-muted">
                  Coming soon
                </span>
              </div>
              <h3 className="text-sm font-semibold leading-snug text-text">{article.title}</h3>
              <span className="mt-auto text-xs text-text-muted">{article.readTime} read</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write `FAQSection.tsx`**

```tsx
"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "What does Avanlog do?",
    answer:
      "We help teams design, build, and operate the infrastructure behind their production applications: cloud architecture, CI/CD automation, Kubernetes, and ongoing operations.",
  },
  {
    question: "Which cloud platforms do you support?",
    answer:
      "AWS, Microsoft Azure, and Google Cloud, along with Cloudflare for edge and network needs.",
  },
  {
    question: "Can you work with our existing development team?",
    answer:
      "Yes. Most engagements work alongside an existing team rather than replacing it, handling the infrastructure and operations layer.",
  },
  {
    question: "Can you improve our current deployment pipeline?",
    answer:
      "Yes. We regularly audit and rebuild existing CI/CD pipelines rather than starting over unnecessarily.",
  },
  {
    question: "Do you offer ongoing DevOps and cloud support?",
    answer: "Yes, through our Managed DevOps and Production Operations engagement model.",
  },
  {
    question: "Can you help migrate our infrastructure?",
    answer: "Yes. Migration scope and approach depend on your current architecture and constraints.",
  },
  {
    question: "How do you approach security and access management?",
    answer:
      "Through least-privilege access, secrets management, environment separation, and regular configuration review — see our security practices above.",
  },
  {
    question: "How is an infrastructure engagement scoped?",
    answer:
      "Through an initial audit or discovery conversation that defines scope, priorities, and timeline before work begins.",
  },
  {
    question: "Can you support applications already running in production?",
    answer: "Yes. Many engagements start with an existing production system rather than a greenfield build.",
  },
  {
    question: "How do we get started?",
    answer:
      "Book an infrastructure audit or reach out through the contact form below, and we'll follow up to discuss your environment.",
  },
];

function FAQItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();

  return (
    <div className="border-b border-surface-line py-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-sm font-medium text-text">{question}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        role="region"
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="pt-3 text-sm leading-relaxed text-text-muted">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-text">
          Frequently asked questions.
        </h2>

        <div className="mt-10">
          {FAQS.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              open={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

The `grid-template-rows: 0fr/1fr` transition animates height without ever setting `height: auto` mid-transition, and works under `prefers-reduced-motion` because the CSS transition is instant unless the browser/OS also disables CSS transitions — no JS animation library involved, so no extra reduced-motion handling is needed here.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/InsightsSection.tsx src/components/FAQSection.tsx`
Expected: clean.

Manual check: click a FAQ question, confirm it expands and the chevron rotates, click another, confirm the first collapses (single-open behavior) — click the open one again and confirm it collapses. Tab to a question with keyboard and press Enter/Space to toggle it (native `<button>` gives this for free — confirm it actually works, don't just assume). Confirm `aria-expanded` flips in DevTools. On Insights, confirm no card has a visible date and every card shows "Coming soon."

- [ ] **Step 4: Commit**

```bash
git add src/components/InsightsSection.tsx src/components/FAQSection.tsx
git commit -m "feat: add insights grid and accessible FAQ accordion"
```

---

### Task 15: Final conversion section (honest form state)

**Files:**
- Modify: `src/components/ConversionSection.tsx` (full rewrite)
- Delete: `src/components/CTASection.tsx` (after import audit)

**Interfaces:**
- Produces: `ConversionSection` default export, renders `<section id="contact">` (already has this id — keep it, every other section's CTAs/nav links depend on it).

- [ ] **Step 1: Audit for imports**

Run: `grep -rn "CTASection" src/`
Expected: only `CTASection.tsx`'s own definition (not imported in current `page.tsx`).

- [ ] **Step 2: Replace `ConversionSection.tsx`**

```tsx
"use client";

import { useId, useState, type FormEvent } from "react";

const CLOUD_PROVIDERS = ["AWS", "Azure", "Google Cloud", "Multiple", "Other / none"];
const INTEREST_AREAS = [
  "Infrastructure Audit",
  "Deployment Engineering",
  "Cloud Migration and Modernization",
  "Managed DevOps and Production Operations",
  "Not sure yet",
];

type FieldErrors = Partial<Record<"name" | "email" | "company" | "description", string>>;

const inputClass =
  "rounded-xl border border-surface-line bg-bg px-4 py-3 text-sm text-text outline-none placeholder:text-text-muted/60 focus:border-accent";
const labelClass = "text-sm text-text-muted";

export default function ConversionSection() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const honeypotId = useId();

  const validate = (form: HTMLFormElement): FieldErrors => {
    const data = new FormData(form);
    const next: FieldErrors = {};

    const name = String(data.get("name") ?? "").trim();
    if (!name) next.name = "Enter your name.";

    const email = String(data.get("email") ?? "").trim();
    if (!email) next.email = "Enter your work email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";

    const company = String(data.get("company") ?? "").trim();
    if (!company) next.company = "Enter your company name.";

    const description = String(data.get("description") ?? "").trim();
    if (description.length < 20) next.description = "Add a few more details (at least 20 characters).";

    return next;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    // Honeypot: a real visitor never fills this hidden field.
    if (String(new FormData(form).get("company-website") ?? "")) return;

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    // No submission backend is configured yet. Replace this block with a
    // real POST to an API route or form provider once one exists — do not
    // claim the message was sent until it actually is.
    window.setTimeout(() => setStatus("done"), 600);
  };

  return (
    <section id="contact" className="bg-bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="rounded-3xl border border-surface-line bg-surface px-6 py-12 md:px-14 md:py-16">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
            <div className="flex max-w-md flex-col gap-6">
              <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-text">
                Let&rsquo;s make your infrastructure ready for what comes next.
              </h2>
              <p className="text-lg leading-relaxed text-text-muted">
                Tell us about your application, deployment challenges, or
                cloud environment. We&rsquo;ll discuss the engineering work
                needed to move forward with confidence.
              </p>
            </div>

            {status === "done" ? (
              <p className="self-start rounded-xl border border-surface-line bg-bg p-6 text-sm leading-relaxed text-text-muted">
                Thanks for the details — this form isn&rsquo;t connected to a
                live inbox yet, so please reach out to{" "}
                <a href="mailto:hello@avanlog.com" className="text-accent-cyan hover:underline">
                  hello@avanlog.com
                </a>{" "}
                directly in the meantime.
              </p>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
                <input
                  type="text"
                  name="company-website"
                  id={honeypotId}
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute h-0 w-0 opacity-0"
                  aria-hidden="true"
                />

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className={labelClass}>Name</label>
                  <input id="name" name="name" type="text" required className={inputClass} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
                  {errors.name && <p id="name-error" className="text-xs text-accent-cyan">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className={labelClass}>Work email</label>
                  <input id="email" name="email" type="email" required className={inputClass} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
                  {errors.email && <p id="email-error" className="text-xs text-accent-cyan">{errors.email}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="company" className={labelClass}>Company name</label>
                  <input id="company" name="company" type="text" required className={inputClass} aria-invalid={!!errors.company} aria-describedby={errors.company ? "company-error" : undefined} />
                  {errors.company && <p id="company-error" className="text-xs text-accent-cyan">{errors.company}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cloud-provider" className={labelClass}>Current cloud provider</label>
                  <select id="cloud-provider" name="cloudProvider" className={inputClass} defaultValue={CLOUD_PROVIDERS[0]}>
                    {CLOUD_PROVIDERS.map((provider) => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="interest" className={labelClass}>Area of interest</label>
                  <select id="interest" name="interest" className={inputClass} defaultValue={INTEREST_AREAS[0]}>
                    {INTEREST_AREAS.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="description" className={labelClass}>Short project description</label>
                  <textarea id="description" name="description" required rows={4} className={inputClass} aria-invalid={!!errors.description} aria-describedby={errors.description ? "description-error" : undefined} />
                  {errors.description && <p id="description-error" className="text-xs text-accent-cyan">{errors.description}</p>}
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-accent-cyan disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending…" : "Book an Infrastructure Audit"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Delete superseded file**

```bash
git rm src/components/CTASection.tsx
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/ConversionSection.tsx`
Expected: clean.

Manual check: submit the form empty, confirm inline errors appear under each required field (not a browser-native popup, since `noValidate` is set) and focus/ARIA (`aria-invalid`, `aria-describedby`) are wired — inspect via DevTools. Fill it out validly and submit; confirm the button shows "Sending…" briefly then the form is replaced by the honest not-connected message with the real `hello@avanlog.com` mailto link — never a "message sent" claim. Type into the hidden honeypot field via DevTools console (`document.querySelector('[name="company-website"]').value = "x"`) and submit — confirm the submit silently no-ops (status stays `"idle"`, no done-state shown).

- [ ] **Step 5: Commit**

```bash
git add src/components/ConversionSection.tsx
git commit -m "feat: rebuild contact form with honest no-backend state and honeypot"
```

---

### Task 16: Footer rebuild (keep verified contact info)

**Files:**
- Modify: `src/components/Footer.tsx` (full rewrite)

**Interfaces:**
- Produces: `Footer` default export, no props.

- [ ] **Step 1: Replace the file**

This correction to spec §5.15: the existing footer already has real, verified contact info (`hello@avanlog.com` mailto, `orynticlabs.com` link, and an existing subsidiary copyright line) — carry these forward instead of omitting them.

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowUp } from "lucide-react";

const COLUMNS = [
  {
    heading: "Services",
    links: [
      { label: "Cloud Infrastructure", href: "/#services" },
      { label: "DevOps & CI/CD", href: "/#pipeline-section" },
      { label: "Kubernetes", href: "/#pipeline-section" },
      { label: "Platform Engineering", href: "/#how-we-work" },
      { label: "Site Reliability Engineering", href: "/#observability" },
      { label: "Managed Cloud Operations", href: "/#engagement" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#top" },
      { label: "How We Work", href: "/#how-we-work" },
      { label: "Case Studies", href: "/#case-studies" },
      { label: "Insights", href: "/#insights" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Technical Guides", href: "/#insights" },
      { label: "Infrastructure Checklist", href: "/#contact" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Contact",
    links: [{ label: "hello@avanlog.com", href: "mailto:hello@avanlog.com" }],
  },
];

const pillClass =
  "flex items-center justify-center rounded-xl border border-dotted border-surface-line p-2.5 text-text-muted transition-all hover:-translate-y-1 hover:border-accent/50 hover:text-text";

function handleScrollTop() {
  window.scroll({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  return (
    <footer className="border-t border-surface-line bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 pt-16 text-center xl:max-w-[1400px] 2xl:max-w-[1800px] sm:flex-row sm:text-left md:px-10">
        <Link href="/#top" className="shrink-0">
          <Image
            src="/avanlog__1_-removebg-preview.png"
            alt="Avanlog"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
        </Link>
        <div className="max-w-xl">
          <p className="text-sm leading-relaxed text-text-muted">
            Avanlog helps teams automate deployments, engineer cloud
            infrastructure, and improve production reliability.
          </p>
          <p className="mt-1 text-sm font-medium text-accent-cyan">
            From Deployment to Reliability.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="border-t border-dotted border-surface-line" />
        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading} className="text-center sm:text-left">
              <p className="text-sm font-medium text-text">{col.heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-text-muted transition-colors hover:text-text">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-dotted border-surface-line" />
      </div>

      <div className="flex items-center justify-center gap-4 px-6 pb-10">
        <a href="mailto:hello@avanlog.com" aria-label="Email Avanlog" className={pillClass}>
          <Mail className="h-4 w-4" strokeWidth={1.5} />
        </a>
        <button type="button" onClick={handleScrollTop} aria-label="Back to top" className={pillClass}>
          <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="border-t border-surface-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-center text-xs text-text-muted xl:max-w-[1400px] 2xl:max-w-[1800px] sm:flex-row sm:items-center sm:justify-between md:px-10">
          <p>
            &copy; 2026 Avanlog, A specialized subsidiary of{" "}
            <a
              href="https://orynticlabs.com"
              target="_blank"
              rel="noreferrer"
              className="text-accent-cyan hover:underline"
            >
              Oryntic Labs Private Limited.
            </a>
          </p>
          <div className="flex items-center justify-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-text">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-text">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

No cookie-preferences link is added — the site sets no tracking cookies, per spec §5.15.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/Footer.tsx`
Expected: clean.

Manual check: every footer link scrolls to an existing section id on the page (cross-check against the ids assigned in Tasks 3–15: `#services`, `#pipeline-section`, `#how-we-work`, `#observability`, `#engagement`, `#case-studies`, `#insights`, `#contact`, `#faq`, `#top`) — none should 404 or no-op. `hello@avanlog.com` and the Oryntic Labs link still work as before.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: rebuild footer on new design system, keep verified contact links"
```

---

### Task 17: SEO metadata update

**Files:**
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: nothing new (this edits the `metadata` export already touched in Task 1 for fonts — confirm Task 1's edits are still present before editing further).

- [ ] **Step 1: Update the `metadata` export**

```ts
export const metadata: Metadata = {
  title: "Avanlog | Cloud Infrastructure, DevOps & Production Engineering",
  description:
    "Avanlog helps businesses automate deployments, engineer cloud infrastructure, and improve production reliability through DevOps, platform engineering, and managed cloud operations.",
  icons: {
    icon: "/fevicon.png",
    shortcut: "/fevicon.png",
    apple: "/fevicon.png",
  },
  openGraph: {
    title: "Avanlog | Cloud Infrastructure, DevOps & Production Engineering",
    description:
      "Avanlog helps businesses automate deployments, engineer cloud infrastructure, and improve production reliability through DevOps, platform engineering, and managed cloud operations.",
    type: "website",
  },
};
```

No `canonical`, no `og:image`, no structured data — no confirmed production domain or share image exists yet (spec §9).

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: clean.

Manual check: view page source (`curl -s http://localhost:3000 | grep -i "og:\|<title>"`) and confirm the new title and Open Graph tags render.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: update SEO metadata and Open Graph tags"
```

---

### Task 18: Page composition and dead-component audit

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/StackRow.tsx`, `src/components/MessageBotsCard.tsx` (only if confirmed unused)

**Interfaces:**
- Consumes: every section component's default export from Tasks 3–16.

- [ ] **Step 1: Rewrite `page.tsx`**

```tsx
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ReliabilityMetrics from "@/components/ReliabilityMetrics";
import TechnologyStack from "@/components/TechnologyStack";
import ServicesSection from "@/components/ServicesSection";
import DeploymentPipeline from "@/components/DeploymentPipeline";
import ObservabilityShowcase from "@/components/ObservabilityShowcase";
import HowWeWork from "@/components/HowWeWork";
import CaseStudies from "@/components/CaseStudies";
import EngagementModels from "@/components/EngagementModels";
import SecuritySection from "@/components/SecuritySection";
import InsightsSection from "@/components/InsightsSection";
import FAQSection from "@/components/FAQSection";
import ConversionSection from "@/components/ConversionSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-bg">
        <Hero />
        <ReliabilityMetrics />
        <TechnologyStack />
        <ServicesSection />
        <DeploymentPipeline />
        <ObservabilityShowcase />
        <HowWeWork />
        <CaseStudies />
        <EngagementModels />
        <SecuritySection />
        <InsightsSection />
        <FAQSection />
        <ConversionSection />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Audit `StackRow.tsx` and `MessageBotsCard.tsx`**

Run: `grep -rln "StackRow\|MessageBotsCard" src/ | grep -v "src/components/StackRow.tsx\|src/components/MessageBotsCard.tsx"`
Expected: no output (neither is imported anywhere after this rewrite — `MessageBotsCard` was already removed from `page.tsx` before this plan, and `StackRow` was never added). If either shows a real importer, keep that file and skip deleting it.

```bash
git rm src/components/StackRow.tsx src/components/MessageBotsCard.tsx
```

(Only run this if Step 2's grep confirmed both are unused.)

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint src/app/page.tsx`
Expected: clean.

Run: `npm run build`
Expected: builds successfully with no missing-module errors (this is the authoritative check that every deleted file in Tasks 5–16 truly had no remaining importer).

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: compose full rebuilt landing page, remove dead components"
```

---

### Task 19: Full-site verification pass

**Files:** none (verification only).

- [ ] **Step 1: Token migration grep**

Run: `cd /Users/tushargupta/Documents/avanlog && grep -rn "bg-graphite\|text-fog\|text-paper\|bg-steel\b\|text-wire\|text-signal\|text-amber\|border-steel-line\|bg-ink\|text-ink-fog" src/components src/app`
Expected: no output. If anything remains, fix it in the owning component and re-run this grep before moving on (do not commit this task until it's clean).

- [ ] **Step 2: Build and lint**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Responsive pass**

Start the dev server (`npm run dev`), open it in the browser tooling used earlier in this project, and check all three widths (~390px, ~820px, ~1470px) for: no horizontal scrollbar/overflow on any section, no clipped text, mobile nav drawer opens/closes correctly, deployment pipeline stacks vertically on mobile, FAQ accordion works at all widths, footer columns stack cleanly.

- [ ] **Step 4: Keyboard pass**

Starting from the top of the page, press Tab repeatedly and confirm: a visible focus ring appears on every interactive element in order (logo link → nav links → Book an Audit → mobile menu button at mobile width → hero CTAs → pipeline stage buttons, operable with arrow keys per Task 8 → service "Learn more" links → FAQ question buttons, operable with Enter/Space → form fields → footer links). No element is skipped and no element traps focus outside the mobile drawer.

- [ ] **Step 5: Reduced-motion pass**

Enable `prefers-reduced-motion: reduce` (Chrome DevTools Rendering tab), reload the page, and confirm: all hero/section content is immediately visible (no stuck-at-opacity-0 elements), the hero's looping cyan pulse does not run, and every interactive feature (pipeline, accordion, nav, form) still works.

- [ ] **Step 6: Final commit (if any fixes were made in this task)**

```bash
git add -A
git commit -m "fix: resolve issues found in full-site verification pass"
```

If no fixes were needed, skip this commit — Task 19 is a pure verification gate.

---

## Self-Review

**1. Spec coverage** — every spec section has an owning task: §3/§4 tokens+font → Task 1; §5.1 → Task 3; §5.2 → Task 4; §5.3 → Task 5; §5.4 → Task 6; §5.5 → Task 7; §5.6 → Task 8; §5.7 → Task 9; §5.8 → Task 10; §5.9 → Task 11; §5.10 → Task 12; §5.11 → Task 13; §5.12/§5.13 → Task 14; §5.14 → Task 15; §5.15 → Task 16; §6 composition → Task 18; §9 SEO → Task 17; §8 animation/accessibility and §10 testing → woven into every task's verify step plus the dedicated Task 19 sweep; §7 file deletions → Tasks 5, 6, 7, 9, 10, 15, 18.

**2. Placeholder scan** — no "TBD"/"TODO"/"add validation" instructions; every step either gives full code or a concrete grep/manual check with an expected result stated.

**3. Type consistency** — `useReducedMotion()` (Task 2) is called the same way in Tasks 4/9 (only Hero/InfrastructureVisual actually consume it in this plan's code — Task 9's Observability doesn't need it since nothing there loops continuously, and Task 8/10's existing mechanics don't require a new call site beyond what's already in `HowWeWork.tsx`); `ServiceCard` props in Task 7 match the object shape used in `SERVICES`; every `href`/`id` pair referenced across Nav (Task 3), ServicesSection (Task 7), DeploymentPipeline (Task 8), ObservabilityShowcase (Task 9), HowWeWork (Task 10), CaseStudies (Task 11), EngagementModels (Task 12), InsightsSection/FAQSection (Task 14), ConversionSection (Task 15), and Footer (Task 16) was cross-checked: `#top`, `#services`, `#pipeline-section`, `#observability`, `#how-we-work`, `#case-studies`, `#engagement`, `#insights`, `#faq`, `#contact` — all nine ids are both assigned by exactly one section and referenced correctly elsewhere.

**4. Review Focus** — all five items from the Review Focus section above have an owning task and explicit check: dead-import deletions → Step "audit for imports" in Tasks 5/6/7/9/10/15/18 plus the authoritative `npm run build` in Task 18; footer contact info correction → Task 16 Step 1 note; fake form success state → Task 15's honest-state implementation + manual check; pipeline/FAQ keyboard access → Task 8/14 manual checks + Task 19 Step 4 keyboard pass; mobile nav focus trap → Task 3 Step 1 code + manual check.

No gaps found. Plan is ready for execution.

---

Plan complete and saved to `docs/superpowers/plans/2026-10-14-avanlog-rebuild.md`. Please review the plan. Which execution approach would you prefer?

- **Subagent-driven** — A fresh subagent implements each task and a fresh reviewer checks it before the next one starts, then a whole-branch review at the end. Most thorough; costs a fresh context per task and per review.
- **Native** — I implement every task myself in this session, the way this harness runs work, then one fresh reviewer on the most capable model checks the whole branch. Cheapest and fastest; no independent review until the end.

For this plan I recommend **subagent-driven**, because the 19 tasks are mostly independent (one component each) but share nine cross-referenced anchor ids and a single token system across the whole file tree — a per-task review catches an id mismatch or a leftover old-token class immediately, in the task that introduced it, rather than only surfacing as a pile of fixes at the very end of a 19-task, ~20-file rebuild.

Does the plan capture what you want, and which approach should we use?
