# Avanlog Landing Page Rebuild Implementation Plan (Revision 2 — white theme)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build every landing-page section between `Hero` and `Footer` in a white theme, leaving `Nav.tsx`, `Hero.tsx`, and `Footer.tsx` completely untouched, and delete the superseded duplicate section components.

**Architecture:** Next.js App Router site, `src/app/page.tsx` composed of section components under `src/components/`. No backend, no CMS, no test runner — verification is `tsc --noEmit`, `eslint`, `next build`, and manual browser checks. New/rebuilt components are client components using `motion/react` and `lucide-react`, matching existing conventions. No new design tokens and no font change — every section reuses tokens already defined in `globals.css`.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, `motion/react`, `lucide-react`, TypeScript, ESLint. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-14-avanlog-rebuild-design.md` — read the "Revision" section at the top first; it overrides the dark-navy/Inter instructions further down the same document. This plan implements the Revision's white-theme direction using the spec's §5 content (copy, data, behavior) but not its §3/§4/§5.1/§5.2/§5.15 color/typography/Nav/Hero/Footer instructions.

## Global Constraints

- No new npm dependencies.
- **Do not modify** `src/components/Nav.tsx`, `src/components/Hero.tsx`, or `src/components/Footer.tsx` in any task below.
- **No changes to `globals.css` or `layout.tsx`.** Every token used below already exists: `bg-white`, `bg-surface` (`#f4f6fb`), `border-surface-line` (`#e2e6f0`), `text-ink` (`#10141d`), `text-ink-fog` (`#5b6372`), plus the dark tokens `bg-graphite`/`bg-black` for section backgrounds that intentionally stay dark behind white cards (none in this plan do — every section background here is `bg-white` or `bg-surface`). Font stays `font-display`/`font-sans` (Josefin Sans) and `font-mono` (IBM Plex Mono) — no Inter.
- Gradient accent palette (reuse exactly, do not invent new hex values): wire blue `#4a6cf7`, purple `#8b5cf6`, pink `#ec4899`, amber `#f2a33d`, red `#ef4444`, signal green `#35d07f`, teal `#2dd4bf`.
- No fabricated client names, testimonials, results, percentages, certifications, partnership badges, publication dates, or contact details. Demo/illustrative data is clearly labeled; the contact form shows an honest not-yet-connected state on submit, never a fake "message sent" claim.
- The Deployment Pipeline section is explanatory only — no real command execution.
- Every continuous/looping animation is wrapped to disable under `prefers-reduced-motion: reduce` (via the shared hook in Task 1), while all interactivity keeps working in that mode.
- Every interactive element (pipeline stages, accordion, form) is keyboard-operable with a visible focus state.
- `src/app/pipeline/page.tsx` and its `src/components/pipeline/` + `src/components/ui/build-pipeline.tsx` dependencies are out of scope — do not modify or break them.
- After each task: `cd /Users/tushargupta/Documents/avanlog && npx tsc --noEmit && npx eslint <changed files>`, both clean, before committing.

## Review Focus

- **Deleting a file still imported elsewhere breaks the build silently until `next build` runs.** Before deleting any component below, grep the whole repo (including `src/app/pipeline/page.tsx`) for its import.
- **`HowWeWork.tsx`/`CaseStudies.tsx` currently sit on dark `bg-graphite`/`bg-black` section backgrounds with glow blobs sized for a dark backdrop.** Flipping just the background color class without checking the glow-blob opacity/blend can leave a washed-out or invisible decorative blob on white — verify it still reads correctly (or remove it) after the flip.
- **The existing `ConversionSection.tsx` sets a fake `submitted` success state on form submit with no backend call** — reads as "message sent" when nothing happened. Must be replaced with an honest not-yet-connected state.
- **Keyboard users on the Deployment Pipeline and FAQ accordion** need real button semantics and visible focus, not hover-only handlers.
- **White-on-white contrast.** Every new card/chip needs a visible `border-surface-line` or `shadow-sm` against the `bg-white`/`bg-surface` section backgrounds — a white card directly on a white section with no border/shadow would be invisible; check this visually in Task 14, not just by reading the class names.

---

## File Structure

New files:
- `src/lib/useReducedMotion.ts`
- `src/components/ReliabilityMetrics.tsx`
- `src/components/TechnologyStack.tsx`
- `src/components/ServicesSection.tsx`
- `src/components/ServiceCard.tsx`
- `src/components/SecuritySection.tsx`
- `src/components/InsightsSection.tsx`
- `src/components/FAQSection.tsx`

Rewritten in place:
- `src/components/HowWeWork.tsx` (background flip + copy update only)
- `src/components/CaseStudies.tsx` (background flip + reframe to demos only)
- `src/components/DeploymentPipeline.tsx` (full rewrite)
- `src/components/ObservabilityShowcase.tsx` (full rewrite)
- `src/components/EngagementModels.tsx` (full rewrite)
- `src/components/ConversionSection.tsx` (full rewrite)
- `src/app/page.tsx` (composition)

Untouched: `src/components/Nav.tsx`, `src/components/Hero.tsx`, `src/components/Footer.tsx`, `src/app/globals.css`, `src/app/layout.tsx`.

Deleted (superseded, after import audit):
- `src/components/MetricsStrip.tsx`, `ReliabilityMetricsStrip.tsx`
- `src/components/TechnologyEcosystem.tsx`, `TechnologyGrid.tsx`
- `src/components/Services.tsx`, `CoreServicesGrid.tsx`
- `src/components/ObservabilityBentoGrid.tsx`, `ArchitectureShowcase.tsx`, `IncidentWalkthrough.tsx`
- `src/components/Process.tsx`
- `src/components/CTASection.tsx`
- `src/components/StackRow.tsx`, `MessageBotsCard.tsx` (only if confirmed unused)

---

### Task 1: Shared reduced-motion hook

**Files:**
- Create: `src/lib/useReducedMotion.ts`

**Interfaces:**
- Produces: `useReducedMotion(): boolean`, named export, importable as `import { useReducedMotion } from "@/lib/useReducedMotion"`. `false` during SSR/first render, updates to the real value in a `useEffect` to avoid hydration mismatch.
- Consumed by: Tasks 7 (DeploymentPipeline) and 8 (ObservabilityShowcase) if either adds a continuous/looping animation; otherwise available for any task that needs it.

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

- [ ] **Step 3: Commit**

```bash
git add src/lib/useReducedMotion.ts
git commit -m "feat: add shared prefers-reduced-motion hook"
```

---

### Task 2: Flip HowWeWork to white theme + update copy

**Files:**
- Modify: `src/components/HowWeWork.tsx`

**Interfaces:**
- Produces: `HowWeWork` default export, renders `<section id="how-we-work">` (rename from the current `id="process"` — Task 6's "Learn more" links and Task 13's footer/page composition expect `#how-we-work`).

- [ ] **Step 1: Background flip**

Change the `<section>` wrapper from:
```tsx
<section id="process" className="relative overflow-hidden bg-graphite py-20 md:py-28">
```
to:
```tsx
<section id="how-we-work" className="relative overflow-hidden bg-white py-20 md:py-28">
```

Check the decorative glow blob (the `absolute -top-40 ... radial-gradient(closest-side, #4a6cf7, transparent 70%)` div): at `opacity-20` on white this will read as a faint blue smudge rather than the glow effect it was tuned for on dark. Reduce it to `opacity-10` so it reads as a subtle tint rather than a visible blob edge; keep the gradient color and size as-is.

Update the eyebrow badge classes from `border-steel-line bg-steel ... text-wire` to `border-surface-line bg-surface ... text-wire` (the badge already uses a white-compatible border/bg pattern elsewhere in the codebase — this matches `CaseStudies.tsx`'s existing badge treatment). Update the heading from `text-paper` to `text-ink` and the supporting paragraph from `text-fog` to `text-ink-fog`.

The `StepCard` component's card styling (`bg-white border-surface-line shadow-sm`) and gradient icon treatment are already correct for a white theme — no change needed there.

- [ ] **Step 2: Update copy to match the approved content**

Replace the `STEPS` array's `title`/`description` fields (keep each entry's `icon`/`from`/`to`/`glow` exactly as-is) with:

```ts
const STEPS: Step[] = [
  { ...existing icon/from/to/glow for item 0, title: "Assess", description: "Understand the existing infrastructure, deployment workflow, operational pain points, security requirements, and reliability expectations." },
  { ...existing icon/from/to/glow for item 1, title: "Architect", description: "Define an appropriate architecture, infrastructure plan, automation strategy, and measurable delivery goals." },
  { ...existing icon/from/to/glow for item 2, title: "Automate", description: "Implement repeatable infrastructure provisioning, CI/CD pipelines, environment configuration, and operational workflows." },
  { ...existing icon/from/to/glow for item 3, title: "Deploy", description: "Validate the release process, test deployment and rollback procedures, and establish production readiness." },
  { ...existing icon/from/to/glow for item 4, title: "Operate and Improve", description: "Monitor the environment, review operational performance, address incidents, and continuously improve reliability and efficiency." },
];
```

(Written as a diff description rather than a full literal array here because the existing file's `icon`/`from`/`to`/`glow` values per item must be preserved exactly — open the file, keep every field except `title` and `description` on each of the five objects, and replace only those two fields per the mapping above, in array order.)

Update the section heading/supporting copy to:
```tsx
<h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
  A clear path to reliable production.
</h2>
<p className="mt-4 text-base leading-relaxed text-ink-fog">
  Every engagement starts with understanding your environment, identifying
  risk, and building a practical plan.
</p>
<p className="mt-2 text-sm text-ink-fog">
  The approach below adapts to each client&rsquo;s existing infrastructure
  and requirements.
</p>
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/HowWeWork.tsx`
Expected: clean.

Manual check: section background is white, all text is legible dark-on-white (no leftover `text-paper`/`text-fog` classes — run `grep -n "text-paper\|text-fog\|bg-graphite" src/components/HowWeWork.tsx`, expect no output), the glow blob is a faint tint not a visible hard edge, and the five steps show the new copy in order: Assess, Architect, Automate, Deploy, Operate and Improve.

- [ ] **Step 4: Commit**

```bash
git add src/components/HowWeWork.tsx
git commit -m "feat: flip how-we-work to white theme and update step copy"
```

---

### Task 3: Flip CaseStudies to white theme + reframe as demonstrations

**Files:**
- Modify: `src/components/CaseStudies.tsx`

**Interfaces:**
- Produces: `CaseStudies` default export, renders `<section id="case-studies">` (add this id — the current file has none).

- [ ] **Step 1: Background flip**

Change `<section className="relative overflow-hidden bg-black py-20 md:py-28">` to `<section id="case-studies" className="relative overflow-hidden bg-surface py-20 md:py-28">` (use `bg-surface`, not `bg-white`, so this section reads as a distinct band from the white `HowWeWork`/`ServicesSection` bands around it — this is the one deliberate alternation in the white theme's rhythm). Reduce the glow blob's opacity from `opacity-20` to `opacity-10` for the same reason as Task 2.

Update text classes: `text-paper` → `text-ink`, `text-fog` → `text-ink-fog`, the featured/compact card backgrounds from `bg-steel` → `bg-white`, `border-steel-line` → `border-surface-line`.

- [ ] **Step 2: Reframe content (remove invented metrics, replace with demo tags)**

Replace the `CASE_STUDIES` data and the `Metric`/`MetricPill`/`useCountUp` usage with a `tags: string[]` field per study, removing the count-up metric pills entirely (delete the now-unused `Metric` type, `useCountUp` function, and `MetricPill` component from the file if nothing else in it references them — confirm with `npx eslint`, which flags unused code):

```ts
type CaseStudy = {
  category: string;
  title: string;
  summary: string;
  from: string;
  to: string;
  glow: string;
  featured?: boolean;
  tags: string[];
};

const CASE_STUDIES: CaseStudy[] = [
  {
    category: "Demonstration",
    title: "Designing a production-ready deployment pipeline",
    summary:
      "A deployment pipeline architecture for a team moving off manual releases: build artifact strategy, automated test gating, security scanning, and a blue-green release path with fast rollback.",
    from: "#4a6cf7",
    to: "#8b5cf6",
    glow: "rgba(74,108,247,0.25)",
    featured: true,
    tags: ["Blue-green releases", "Automated rollback", "Policy-gated deploys"],
  },
  {
    category: "Demonstration",
    title: "Building a repeatable cloud infrastructure setup",
    summary:
      "An Infrastructure-as-Code baseline for standing up consistent, reviewable cloud environments across dev, staging, and production.",
    from: "#f2a33d",
    to: "#ef4444",
    glow: "rgba(242,163,61,0.25)",
    tags: ["Terraform modules", "Environment parity", "IAM least-privilege"],
  },
  {
    category: "Demonstration",
    title: "Implementing a monitoring and alerting strategy",
    summary:
      "A practical approach to service-level objectives, alert routing, and incident response for a team with no existing observability practice.",
    from: "#35d07f",
    to: "#2dd4bf",
    glow: "rgba(53,208,127,0.25)",
    tags: ["SLOs", "Alert routing", "On-call runbooks"],
  },
];
```

Replace each card's metric-pill grid (`study.metrics.map(...)`) with a tag-chip row:

```tsx
<div className="mt-auto flex flex-wrap gap-2 pt-2">
  {study.tags.map((tag) => (
    <span
      key={tag}
      className="rounded-full border border-surface-line bg-white px-3 py-1 text-xs text-ink-fog"
    >
      {tag}
    </span>
  ))}
</div>
```

Replace the `Zap`-icon industry `Badge` with a plain "Demonstration" chip using `study.category` instead of `study.industry` (rename the field throughout the file — `industry` → `category`), and change the link text from "Read the engagement" to "Read the approach" (destination stays `#contact`).

Update the heading/supporting copy:
```tsx
<span className="... text-signal">Engineering in practice</span>
<h2 className="... text-ink ...">Engineering in practice.</h2>
<p className="... text-ink-fog">
  No invented client logos or numbers — here&rsquo;s how we&rsquo;d approach
  problems like these. Real engagement case studies will appear here as
  they are published.
</p>
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/CaseStudies.tsx`
Expected: clean, no unused-variable warnings from the removed count-up code.

Manual check: section background reads as a light gray band distinct from the pure-white sections around it; all three cards show "Demonstration" badges and tag chips with no percentage/number claims; `grep -n "text-paper\|text-fog\|bg-black\|bg-steel\|border-steel-line" src/components/CaseStudies.tsx` returns nothing.

- [ ] **Step 4: Commit**

```bash
git add src/components/CaseStudies.tsx
git commit -m "feat: flip case studies to white theme and reframe as demonstrations"
```

---

### Task 4: Reliability metrics strip

**Files:**
- Create: `src/components/ReliabilityMetrics.tsx`
- Delete: `src/components/MetricsStrip.tsx`, `src/components/ReliabilityMetricsStrip.tsx` (after import audit)

**Interfaces:**
- Produces: `ReliabilityMetrics` default export, no props.

- [ ] **Step 1: Audit for imports**

Run: `grep -rn "MetricsStrip\|ReliabilityMetricsStrip" src/`
Expected: only the two files' own definitions. Resolve any other importer before deleting.

- [ ] **Step 2: Write the file**

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
    <section className="border-y border-surface-line bg-white py-10">
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
              className={`flex flex-col gap-1 ${index === METRICS.length - 1 ? "md:items-end md:text-right" : "items-start text-left"}`}
            >
              <span className="font-mono text-3xl font-semibold text-ink">
                {metric.value}
              </span>
              <span className="text-xs uppercase tracking-[0.1em] text-ink-fog">
                {metric.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
        <p className="mt-6 text-xs text-ink-fog">
          Representative targets — confirmed per engagement.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Delete superseded files**

```bash
git rm src/components/MetricsStrip.tsx src/components/ReliabilityMetricsStrip.tsx
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/ReliabilityMetrics.tsx`
Expected: clean.

Manual check at 1470px: first metric flush left, fourth flush right; at 390px: 2x2 grid, no overlap.

- [ ] **Step 5: Commit**

```bash
git add src/components/ReliabilityMetrics.tsx
git commit -m "feat: add white-theme reliability metrics strip, remove duplicates"
```

---

### Task 5: Technology stack section

**Files:**
- Create: `src/components/TechnologyStack.tsx`
- Delete: `src/components/TechnologyEcosystem.tsx`, `src/components/TechnologyGrid.tsx` (after import audit)

**Interfaces:**
- Produces: `TechnologyStack` default export, no props.

- [ ] **Step 1: Audit for imports**

Run: `grep -rn "TechnologyEcosystem\|TechnologyGrid" src/`
Expected: only the two files' own definitions.

- [ ] **Step 2: Write the file**

```tsx
const TECHNOLOGIES = [
  "AWS", "Microsoft Azure", "Google Cloud", "Cloudflare",
  "Docker", "Kubernetes", "Terraform", "GitHub Actions",
  "GitLab CI/CD", "Prometheus", "Grafana", "OpenTelemetry",
];

export default function TechnologyStack() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Built around your existing stack.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-fog">
            Practical infrastructure engineering that works with the tools
            your team already trusts.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {TECHNOLOGIES.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center rounded-xl border border-surface-line bg-surface px-4 py-5 text-center text-sm text-ink-fog shadow-sm transition-colors hover:border-wire hover:text-ink"
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

Manual check: 2 columns at 390px, 6 at 1470px; chips are visibly bordered against the white section.

- [ ] **Step 5: Commit**

```bash
git add src/components/TechnologyStack.tsx
git commit -m "feat: add white-theme technology stack grid, remove duplicates"
```

---

### Task 6: Services section

**Files:**
- Create: `src/components/ServicesSection.tsx`
- Create: `src/components/ServiceCard.tsx`
- Delete: `src/components/Services.tsx`, `src/components/CoreServicesGrid.tsx` (after import audit)

**Interfaces:**
- Produces: `ServicesSection` default export, renders `<section id="services">`. `ServiceCard` default export, props `{ icon: LucideIcon; title: string; description: string; capabilities: string[]; href: string; from: string; to: string }`.

- [ ] **Step 1: Audit for imports**

Run: `grep -rn "from \"@/components/Services\"\|from \"@/components/CoreServicesGrid\"" src/`
Expected: no output.

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
  from,
  to,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  capabilities: string[];
  href: string;
  from: string;
  to: string;
}) {
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-surface-line bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-110"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-fog">{description}</p>
      <ul className="flex flex-col gap-1.5">
        {capabilities.map((capability) => (
          <li key={capability} className="flex items-center gap-2 text-sm text-ink-fog">
            <Check className="h-3.5 w-3.5 shrink-0 text-wire" strokeWidth={2} aria-hidden="true" />
            {capability}
          </li>
        ))}
      </ul>
      <a
        href={href}
        className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-wire"
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
    icon: Cloud, from: "#4a6cf7", to: "#8b5cf6",
    title: "Cloud Infrastructure Engineering",
    description: "Design, provision, and manage secure cloud environments built around your application's performance, availability, and growth requirements.",
    capabilities: ["Cloud architecture", "Infrastructure provisioning", "AWS, Azure, and Google Cloud", "Infrastructure as Code", "Networking and IAM", "Cloud migration"],
    href: "#services",
  },
  {
    icon: GitBranch, from: "#8b5cf6", to: "#ec4899",
    title: "DevOps and CI/CD Automation",
    description: "Replace fragile manual releases with repeatable delivery pipelines that help teams ship changes with confidence.",
    capabilities: ["CI/CD pipeline design", "Automated testing integration", "Build and release automation", "Environment management", "Deployment strategies", "Rollback automation"],
    href: "#pipeline-section",
  },
  {
    icon: Boxes, from: "#f2a33d", to: "#ef4444",
    title: "Kubernetes and Container Platforms",
    description: "Build and operate container platforms that make application deployment, scaling, and lifecycle management more predictable.",
    capabilities: ["Docker", "Kubernetes", "Container orchestration", "Cluster configuration", "Helm", "Workload scaling"],
    href: "#pipeline-section",
  },
  {
    icon: LayoutGrid, from: "#35d07f", to: "#2dd4bf",
    title: "Platform Engineering",
    description: "Create reusable infrastructure patterns and deployment workflows that reduce developer friction and operational overhead.",
    capabilities: ["Internal developer platforms", "Deployment templates", "Self-service infrastructure workflows", "Standardized environments", "Developer experience", "Platform automation"],
    href: "#how-we-work",
  },
  {
    icon: Activity, from: "#2dd4bf", to: "#4a6cf7",
    title: "Site Reliability Engineering",
    description: "Improve service reliability through observability, sensible reliability targets, incident response, and continuous operational improvement.",
    capabilities: ["Service-level objectives", "Monitoring and alerting", "Incident management", "Performance engineering", "Reliability reviews", "Disaster recovery planning"],
    href: "#observability",
  },
  {
    icon: Server, from: "#4a6cf7", to: "#f2a33d",
    title: "Managed Cloud Operations",
    description: "Get consistent operational support for the cloud environments your business depends on, with clear ownership and transparent processes.",
    capabilities: ["Infrastructure monitoring", "Maintenance and patching", "Backup management", "Incident escalation", "Cost optimization", "Operational reporting"],
    href: "#engagement",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Everything your production environment needs.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-fog">
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

- [ ] **Step 4: Delete superseded files**

```bash
git rm src/components/Services.tsx src/components/CoreServicesGrid.tsx
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/ServicesSection.tsx src/components/ServiceCard.tsx`
Expected: clean.

Manual check: 3-column grid at 1470px, 1-column at 390px; each card's white background has a visible border/shadow against the `bg-surface` section; gradient icon chips render in the intended colors.

- [ ] **Step 6: Commit**

```bash
git add src/components/ServicesSection.tsx src/components/ServiceCard.tsx
git commit -m "feat: add white-theme services grid, remove duplicates"
```

---

### Task 7: Deployment pipeline (interactive, rebuilt)

**Files:**
- Modify: `src/components/DeploymentPipeline.tsx` (full rewrite)

**Interfaces:**
- Produces: `DeploymentPipeline` default export, renders `<section id="pipeline-section">`.

- [ ] **Step 1: Replace the file**

```tsx
"use client";

import { useState, type KeyboardEvent } from "react";
import {
  GitCommit, Hammer, FlaskConical, ShieldCheck, Rocket, Activity,
  type LucideIcon,
} from "lucide-react";

type Stage = { id: string; title: string; icon: LucideIcon; description: string; tools: string };

const STAGES: Stage[] = [
  { id: "commit", title: "Code Commit", icon: GitCommit, description: "A code change enters version control and triggers the delivery workflow.", tools: "Git, pull request checks" },
  { id: "build", title: "Build", icon: Hammer, description: "The application is compiled or packaged into a consistent deployable artifact.", tools: "Docker, build caching" },
  { id: "test", title: "Automated Tests", icon: FlaskConical, description: "Automated checks validate expected behavior before release.", tools: "Unit, integration, contract tests" },
  { id: "security", title: "Security Checks", icon: ShieldCheck, description: "Relevant dependency, configuration, and vulnerability checks run before deployment.", tools: "Dependency scanning, IaC policy checks" },
  { id: "deploy", title: "Deployment", icon: Rocket, description: "Changes are released using a deployment strategy appropriate to the application's requirements.", tools: "Blue-green, canary, rolling" },
  { id: "monitor", title: "Production Monitoring", icon: Activity, description: "Observability and health checks help teams understand the impact of the release.", tools: "Health checks, error rate, latency" },
];

export default function DeploymentPipeline() {
  const [activeId, setActiveId] = useState(STAGES[0].id);
  const activeIndex = STAGES.findIndex((stage) => stage.id === activeId);
  const active = STAGES[activeIndex];

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActiveId(STAGES[(index + 1) % STAGES.length].id);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveId(STAGES[(index - 1 + STAGES.length) % STAGES.length].id);
    }
  };

  return (
    <section id="pipeline-section" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            From commit to production. Without the chaos.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-fog">
            Create a repeatable path from code changes to production
            releases with automated checks, controlled deployment, and
            clear operational visibility.
          </p>
        </div>

        <div role="group" aria-label="Deployment pipeline stages" className="mt-14 flex flex-col gap-2 md:mt-20 md:flex-row md:items-start md:gap-0">
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
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left shadow-sm transition-colors md:flex-col md:items-center md:gap-2 md:text-center ${
                      isActive ? "border-wire bg-surface text-ink" : "border-surface-line bg-white text-ink-fog hover:border-wire/50"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                    <span className="text-sm font-medium">{stage.title}</span>
                  </button>
                  {index < STAGES.length - 1 && (
                    <div aria-hidden="true" className={`hidden h-px flex-1 md:block ${index < activeIndex ? "bg-wire" : "bg-surface-line"}`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-surface-line bg-surface p-6 shadow-sm md:p-8">
          <h3 className="font-display text-lg font-semibold text-ink">{active.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-fog">{active.description}</p>
          <p className="mt-3 font-mono text-xs text-wire">{active.tools}</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/DeploymentPipeline.tsx`
Expected: clean.

Manual check: click each stage, confirm the description panel updates and the connecting line up to the active stage turns blue on desktop width. Tab to the stage buttons, use ArrowRight/ArrowLeft to move between them, confirm the panel updates on arrow-key navigation too. Confirm `aria-pressed="true"` on the active stage via DevTools. At 390px, stages stack vertically with no clipped labels.

- [ ] **Step 3: Commit**

```bash
git add src/components/DeploymentPipeline.tsx
git commit -m "feat: rebuild deployment pipeline as white-theme accessible stage selector"
```

---

### Task 8: Observability showcase

**Files:**
- Modify: `src/components/ObservabilityShowcase.tsx` (full rewrite)
- Delete: `src/components/ObservabilityBentoGrid.tsx`, `src/components/ArchitectureShowcase.tsx`, `src/components/IncidentWalkthrough.tsx` (after import audit)

**Interfaces:**
- Produces: `ObservabilityShowcase` default export, renders `<section id="observability">`.

- [ ] **Step 1: Audit for imports**

Run: `grep -rn "ObservabilityBentoGrid\|ArchitectureShowcase\|IncidentWalkthrough" src/`
Expected: only each file's own definition. Confirm `src/app/pipeline/page.tsx` does not import any of them.

- [ ] **Step 2: Rewrite the file**

```tsx
"use client";

import { motion } from "motion/react";

const LATENCY_POINTS = [40, 44, 38, 52, 48, 60, 55, 50, 46, 42];
const ERROR_POINTS = [2, 3, 2, 4, 2, 5, 3, 2, 2, 1];

function sparklinePath(points: number[], width: number, height: number) {
  const max = Math.max(...points);
  const step = width / (points.length - 1);
  return points
    .map((value, index) => `${index === 0 ? "M" : "L"}${(index * step).toFixed(1)},${(height - (value / max) * height).toFixed(1)}`)
    .join(" ");
}

const DEPLOYS = [
  { label: "avanlog-api #482", time: "2m ago" },
  { label: "avanlog-worker #118", time: "41m ago" },
  { label: "avanlog-api #481", time: "3h ago" },
];

const EVENTS = [
  "p99 latency returned to baseline after #482",
  "Alert: error rate exceeded 1% for 4 minutes, auto-resolved",
  "Scheduled scale-up ahead of traffic peak",
];

export default function ObservabilityShowcase() {
  return (
    <section id="observability" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Know what is happening in production.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-fog">
            Make infrastructure health, application behavior, and
            operational events easier to understand.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="relative mt-12 overflow-hidden rounded-2xl border border-surface-line bg-white p-6 shadow-sm md:p-8"
        >
          <span className="absolute right-4 top-4 rounded-full border border-surface-line bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-fog">
            Demonstration data
          </span>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-surface-line p-4">
              <p className="text-xs uppercase tracking-wide text-ink-fog">Service health</p>
              <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-ink">
                <span className="h-2.5 w-2.5 rounded-full bg-signal" aria-hidden="true" />
                Operational
              </p>
            </div>

            <div className="rounded-xl border border-surface-line p-4">
              <p className="text-xs uppercase tracking-wide text-ink-fog">Request latency (p99, ms)</p>
              <svg viewBox="0 0 100 32" className="mt-2 h-8 w-full">
                <path d={sparklinePath(LATENCY_POINTS, 100, 32)} fill="none" stroke="#4a6cf7" strokeWidth={1.5} />
              </svg>
              <p className="mt-1 font-mono text-sm text-ink">284ms</p>
            </div>

            <div className="rounded-xl border border-surface-line p-4">
              <p className="text-xs uppercase tracking-wide text-ink-fog">Error rate (%)</p>
              <svg viewBox="0 0 100 32" className="mt-2 h-8 w-full">
                <path d={sparklinePath(ERROR_POINTS, 100, 32)} fill="none" stroke="#2dd4bf" strokeWidth={1.5} />
              </svg>
              <p className="mt-1 font-mono text-sm text-ink">0.03%</p>
            </div>

            <div className="rounded-xl border border-surface-line p-4">
              <p className="text-xs uppercase tracking-wide text-ink-fog">CPU utilization</p>
              <div className="mt-3 h-2 rounded-full bg-surface">
                <div className="h-2 rounded-full bg-wire" style={{ width: "42%" }} />
              </div>
              <p className="mt-1 font-mono text-xs text-ink-fog">42%</p>
            </div>

            <div className="rounded-xl border border-surface-line p-4">
              <p className="text-xs uppercase tracking-wide text-ink-fog">Memory utilization</p>
              <div className="mt-3 h-2 rounded-full bg-surface">
                <div className="h-2 rounded-full bg-[#2dd4bf]" style={{ width: "61%" }} />
              </div>
              <p className="mt-1 font-mono text-xs text-ink-fog">61%</p>
            </div>

            <div className="rounded-xl border border-surface-line p-4">
              <p className="text-xs uppercase tracking-wide text-ink-fog">Deployment history</p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {DEPLOYS.map((deploy) => (
                  <li key={deploy.label} className="flex items-center justify-between text-xs text-ink-fog">
                    <span className="truncate text-ink">{deploy.label}</span>
                    <span>{deploy.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-surface-line p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-ink-fog">Service dependency map</p>
              <svg viewBox="0 0 200 60" className="mt-3 h-14 w-full">
                <line x1="20" y1="30" x2="100" y2="30" stroke="#e2e6f0" strokeWidth={1.5} />
                <line x1="100" y1="30" x2="180" y2="15" stroke="#e2e6f0" strokeWidth={1.5} />
                <line x1="100" y1="30" x2="180" y2="45" stroke="#e2e6f0" strokeWidth={1.5} />
                <circle cx="20" cy="30" r="8" fill="white" stroke="#2dd4bf" strokeWidth={1.5} />
                <circle cx="100" cy="30" r="10" fill="white" stroke="#4a6cf7" strokeWidth={1.5} />
                <circle cx="180" cy="15" r="8" fill="white" stroke="#e2e6f0" strokeWidth={1.5} />
                <circle cx="180" cy="45" r="8" fill="white" stroke="#e2e6f0" strokeWidth={1.5} />
              </svg>
            </div>

            <div className="rounded-xl border border-surface-line p-4">
              <p className="text-xs uppercase tracking-wide text-ink-fog">Recent events</p>
              <ul className="mt-2 flex flex-col gap-2 text-xs text-ink-fog">
                {EVENTS.map((event) => (<li key={event}>{event}</li>))}
              </ul>
            </div>
          </div>
        </motion.div>

        <a href="#services" className="mt-6 inline-block text-sm font-semibold text-ink transition-colors hover:text-wire">
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

Manual check: "Demonstration data" label visible in the panel corner; sparklines render without console warnings; bento grid reflows to 1 column at 390px.

- [ ] **Step 5: Commit**

```bash
git add src/components/ObservabilityShowcase.tsx
git commit -m "feat: rebuild observability showcase as white-theme labeled dashboard"
```

---

### Task 9: Engagement models

**Files:**
- Modify: `src/components/EngagementModels.tsx` (full rewrite)

**Interfaces:**
- Produces: `EngagementModels` default export, renders `<section id="engagement">`.

- [ ] **Step 1: Replace the file**

```tsx
const MODELS = [
  { title: "Infrastructure Audit", description: "For businesses that want to understand their current cloud setup, deployment process, security posture, or reliability risks.", cta: "Request an Audit" },
  { title: "Deployment Engineering", description: "For teams that need CI/CD pipelines, automated releases, environment configuration, or a repeatable deployment process.", cta: "Discuss a Deployment" },
  { title: "Cloud Migration and Modernization", description: "For businesses moving applications, improving infrastructure architecture, or standardizing environments.", cta: "Plan Your Migration" },
  { title: "Managed DevOps and Production Operations", description: "For businesses that need ongoing infrastructure maintenance, monitoring, operational support, and reliability improvements.", cta: "Discuss Ongoing Support" },
];

export default function EngagementModels() {
  return (
    <section id="engagement" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Bring us in where you need us.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {MODELS.map((model) => (
            <div key={model.title} className="flex flex-col gap-4 rounded-2xl border border-surface-line bg-surface p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-ink">{model.title}</h3>
              <p className="text-sm leading-relaxed text-ink-fog">{model.description}</p>
              <a
                href="#contact"
                className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-wire px-4 py-2 text-xs font-semibold text-wire transition-colors hover:bg-wire hover:text-white"
              >
                {model.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-ink-fog">
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

Manual check: 2x2 grid at 1470px, single column at 390px; each CTA scrolls to `#contact`.

- [ ] **Step 3: Commit**

```bash
git add src/components/EngagementModels.tsx
git commit -m "feat: rebuild engagement models in white theme"
```

---

### Task 10: Security and operational trust section

**Files:**
- Create: `src/components/SecuritySection.tsx`

**Interfaces:**
- Produces: `SecuritySection` default export, no props.

- [ ] **Step 1: Write the file**

```tsx
import {
  KeyRound, Lock, ShieldCheck, ScanSearch, DatabaseBackup, FileClock, Layers, Siren,
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
    <section className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Built with operational responsibility in mind.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRACTICES.map((practice) => (
            <div key={practice.label} className="flex flex-col gap-3 rounded-xl border border-surface-line bg-white p-5 shadow-sm">
              <practice.icon className="h-5 w-5 text-wire" strokeWidth={1.75} aria-hidden="true" />
              <h3 className="text-sm font-semibold text-ink">{practice.label}</h3>
              <p className="text-sm leading-relaxed text-ink-fog">{practice.description}</p>
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

Manual check: 4-column grid at 1470px, 1-column at 390px.

- [ ] **Step 3: Commit**

```bash
git add src/components/SecuritySection.tsx
git commit -m "feat: add white-theme security and operational trust section"
```

---

### Task 11: Insights and FAQ sections

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
    <section id="insights" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Better infrastructure starts with better decisions.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ARTICLES.map((article) => (
            <div key={article.title} className="flex flex-col gap-3 rounded-xl border border-surface-line bg-surface p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-wire">{article.category}</span>
                <span className="rounded-full border border-surface-line bg-white px-2 py-0.5 text-[10px] text-ink-fog">
                  Coming soon
                </span>
              </div>
              <h3 className="text-sm font-semibold leading-snug text-ink">{article.title}</h3>
              <span className="mt-auto text-xs text-ink-fog">{article.readTime} read</span>
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
  { question: "What does Avanlog do?", answer: "We help teams design, build, and operate the infrastructure behind their production applications: cloud architecture, CI/CD automation, Kubernetes, and ongoing operations." },
  { question: "Which cloud platforms do you support?", answer: "AWS, Microsoft Azure, and Google Cloud, along with Cloudflare for edge and network needs." },
  { question: "Can you work with our existing development team?", answer: "Yes. Most engagements work alongside an existing team rather than replacing it, handling the infrastructure and operations layer." },
  { question: "Can you improve our current deployment pipeline?", answer: "Yes. We regularly audit and rebuild existing CI/CD pipelines rather than starting over unnecessarily." },
  { question: "Do you offer ongoing DevOps and cloud support?", answer: "Yes, through our Managed DevOps and Production Operations engagement model." },
  { question: "Can you help migrate our infrastructure?", answer: "Yes. Migration scope and approach depend on your current architecture and constraints." },
  { question: "How do you approach security and access management?", answer: "Through least-privilege access, secrets management, environment separation, and regular configuration review — see our security practices above." },
  { question: "How is an infrastructure engagement scoped?", answer: "Through an initial audit or discovery conversation that defines scope, priorities, and timeline before work begins." },
  { question: "Can you support applications already running in production?", answer: "Yes. Many engagements start with an existing production system rather than a greenfield build." },
  { question: "How do we get started?", answer: "Book an infrastructure audit or reach out through the contact form below, and we'll follow up to discuss your environment." },
];

function FAQItem({ question, answer, open, onToggle }: { question: string; answer: string; open: boolean; onToggle: () => void }) {
  const panelId = useId();
  return (
    <div className="border-b border-surface-line py-4">
      <button type="button" aria-expanded={open} aria-controls={panelId} onClick={onToggle} className="flex w-full items-center justify-between gap-4 text-left">
        <span className="text-sm font-medium text-ink">{question}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-ink-fog transition-transform duration-200 ${open ? "rotate-180" : ""}`} strokeWidth={2} aria-hidden="true" />
      </button>
      <div id={panelId} role="region" className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <p className="pt-3 text-sm leading-relaxed text-ink-fog">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Frequently asked questions.
        </h2>
        <div className="mt-10 rounded-2xl border border-surface-line bg-white px-6 shadow-sm">
          {FAQS.map((faq, index) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} open={openIndex === index} onToggle={() => setOpenIndex(openIndex === index ? null : index)} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/InsightsSection.tsx src/components/FAQSection.tsx`
Expected: clean.

Manual check: click a FAQ question, confirm it expands and the chevron rotates; click another, confirm single-open behavior; Tab to a question and press Enter/Space, confirm it toggles; confirm `aria-expanded` flips in DevTools. On Insights, confirm no card shows a date and every card shows "Coming soon."

- [ ] **Step 4: Commit**

```bash
git add src/components/InsightsSection.tsx src/components/FAQSection.tsx
git commit -m "feat: add white-theme insights grid and accessible FAQ accordion"
```

---

### Task 12: Final conversion section (honest form state)

**Files:**
- Modify: `src/components/ConversionSection.tsx` (full rewrite)
- Delete: `src/components/CTASection.tsx` (after import audit)

**Interfaces:**
- Produces: `ConversionSection` default export, renders `<section id="contact">` (keep this id — every other section's CTAs depend on it).

- [ ] **Step 1: Audit for imports**

Run: `grep -rn "from \"@/components/CTASection\"" src/`
Expected: no output.

- [ ] **Step 2: Replace `ConversionSection.tsx`**

```tsx
"use client";

import { useId, useState, type FormEvent } from "react";

const CLOUD_PROVIDERS = ["AWS", "Azure", "Google Cloud", "Multiple", "Other / none"];
const INTEREST_AREAS = ["Infrastructure Audit", "Deployment Engineering", "Cloud Migration and Modernization", "Managed DevOps and Production Operations", "Not sure yet"];

type FieldErrors = Partial<Record<"name" | "email" | "company" | "description", string>>;

const inputClass = "rounded-xl border border-surface-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-fog/60 focus:border-wire";
const labelClass = "text-sm text-ink-fog";

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
    if (String(new FormData(form).get("company-website") ?? "")) return;
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setStatus("submitting");
    window.setTimeout(() => setStatus("done"), 600);
  };

  return (
    <section id="contact" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="rounded-3xl border border-surface-line bg-surface px-6 py-12 shadow-sm md:px-14 md:py-16">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
            <div className="flex max-w-md flex-col gap-6">
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
                Let&rsquo;s make your infrastructure ready for what comes next.
              </h2>
              <p className="text-lg leading-relaxed text-ink-fog">
                Tell us about your application, deployment challenges, or
                cloud environment. We&rsquo;ll discuss the engineering work
                needed to move forward with confidence.
              </p>
            </div>

            {status === "done" ? (
              <p className="self-start rounded-xl border border-surface-line bg-white p-6 text-sm leading-relaxed text-ink-fog shadow-sm">
                Thanks for the details — this form isn&rsquo;t connected to a
                live inbox yet, so please reach out to{" "}
                <a href="mailto:hello@avanlog.com" className="text-wire hover:underline">hello@avanlog.com</a>{" "}
                directly in the meantime.
              </p>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
                <input type="text" name="company-website" id={honeypotId} tabIndex={-1} autoComplete="off" className="absolute h-0 w-0 opacity-0" aria-hidden="true" />

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className={labelClass}>Name</label>
                  <input id="name" name="name" type="text" required className={inputClass} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
                  {errors.name && <p id="name-error" className="text-xs text-red-600">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className={labelClass}>Work email</label>
                  <input id="email" name="email" type="email" required className={inputClass} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
                  {errors.email && <p id="email-error" className="text-xs text-red-600">{errors.email}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="company" className={labelClass}>Company name</label>
                  <input id="company" name="company" type="text" required className={inputClass} aria-invalid={!!errors.company} aria-describedby={errors.company ? "company-error" : undefined} />
                  {errors.company && <p id="company-error" className="text-xs text-red-600">{errors.company}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cloud-provider" className={labelClass}>Current cloud provider</label>
                  <select id="cloud-provider" name="cloudProvider" className={inputClass} defaultValue={CLOUD_PROVIDERS[0]}>
                    {CLOUD_PROVIDERS.map((provider) => (<option key={provider} value={provider}>{provider}</option>))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="interest" className={labelClass}>Area of interest</label>
                  <select id="interest" name="interest" className={inputClass} defaultValue={INTEREST_AREAS[0]}>
                    {INTEREST_AREAS.map((area) => (<option key={area} value={area}>{area}</option>))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="description" className={labelClass}>Short project description</label>
                  <textarea id="description" name="description" required rows={4} className={inputClass} aria-invalid={!!errors.description} aria-describedby={errors.description ? "description-error" : undefined} />
                  {errors.description && <p id="description-error" className="text-xs text-red-600">{errors.description}</p>}
                </div>

                <button type="submit" disabled={status === "submitting"} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-wire px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-wire-dark disabled:opacity-60">
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

Manual check: submit empty, confirm inline errors appear under each required field with `aria-invalid`/`aria-describedby` wired (check DevTools); fill validly and submit, confirm "Sending…" then the honest not-connected message with the working `hello@avanlog.com` mailto — never a "message sent" claim; set the honeypot field via DevTools console and submit, confirm it silently no-ops.

- [ ] **Step 5: Commit**

```bash
git add src/components/ConversionSection.tsx
git commit -m "feat: rebuild contact form in white theme with honest no-backend state"
```

---

### Task 13: Page composition and dead-component audit

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/Process.tsx`, `src/components/StackRow.tsx`, `src/components/MessageBotsCard.tsx` (only if confirmed unused)

**Interfaces:**
- Consumes: every section component's default export from Tasks 2–12, plus the untouched `Nav`/`Hero`/`Footer`.

- [ ] **Step 1: Audit `Process.tsx`, `StackRow.tsx`, `MessageBotsCard.tsx`**

Run: `grep -rln "\bProcess\b\|StackRow\|MessageBotsCard" src/ | grep -v "process\.env" | grep -v "src/components/Process.tsx\|src/components/StackRow.tsx\|src/components/MessageBotsCard.tsx"`
Expected: no output (none imported anywhere after Task 2 superseded `Process.tsx`'s role and neither `StackRow` nor `MessageBotsCard` is in the current `page.tsx`). Delete only the ones confirmed unused:

```bash
git rm src/components/Process.tsx src/components/StackRow.tsx src/components/MessageBotsCard.tsx
```

- [ ] **Step 2: Rewrite `page.tsx`**

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
      <main className="flex-1 bg-white">
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

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint src/app/page.tsx`
Expected: clean.

Run: `npm run build`
Expected: builds successfully with no missing-module errors — this is the authoritative check that every file deleted across Tasks 4–13 truly had no remaining importer.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: compose full white-theme landing page, remove dead components"
```

---

### Task 14: Full-site verification pass

**Files:** none (verification only).

- [ ] **Step 1: Stray old-token grep (on the files this plan touched)**

Run: `cd /Users/tushargupta/Documents/avanlog && grep -rln "text-paper\|text-fog\|bg-graphite\|bg-black\b\|bg-steel\b\|border-steel-line" src/components/HowWeWork.tsx src/components/CaseStudies.tsx src/components/ReliabilityMetrics.tsx src/components/TechnologyStack.tsx src/components/ServicesSection.tsx src/components/ServiceCard.tsx src/components/DeploymentPipeline.tsx src/components/ObservabilityShowcase.tsx src/components/EngagementModels.tsx src/components/SecuritySection.tsx src/components/InsightsSection.tsx src/components/FAQSection.tsx src/components/ConversionSection.tsx`
Expected: no output. (Nav/Hero/Footer are intentionally excluded — they're untouched and legitimately keep the dark tokens.) Fix anything found before continuing.

- [ ] **Step 2: Build and lint**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Responsive pass**

Start the dev server, check ~390px, ~820px, ~1470px widths for: no horizontal overflow on any section, no clipped text, deployment pipeline stacks vertically on mobile, FAQ accordion works at all widths, every white/light card is visibly bordered against its section background (no invisible white-on-white elements).

- [ ] **Step 4: Keyboard pass**

Tab through the full page starting at the existing Nav: confirm a visible focus ring on every interactive element in order, including the deployment pipeline stage buttons (operable with arrow keys per Task 7), FAQ question buttons (operable with Enter/Space per Task 11), and the contact form fields. No element is skipped.

- [ ] **Step 5: Reduced-motion pass**

Enable `prefers-reduced-motion: reduce`, reload, confirm all section content is immediately visible (no stuck-at-opacity-0 elements) and every interactive feature (pipeline, accordion, form) still works.

- [ ] **Step 6: Final commit (if fixes were made)**

```bash
git add -A
git commit -m "fix: resolve issues found in full-site verification pass"
```

Skip this commit if no fixes were needed — Task 14 is a verification gate.

---

## Self-Review

**1. Spec coverage** — every white-theme section has an owning task: ReliabilityMetrics → Task 4; TechnologyStack → Task 5; Services → Task 6; DeploymentPipeline → Task 7; ObservabilityShowcase → Task 8; HowWeWork copy/background → Task 2; CaseStudies reframe/background → Task 3; EngagementModels → Task 9; Security → Task 10; Insights/FAQ → Task 11; Conversion → Task 12; composition/cleanup → Task 13; full verification → Task 14. Nav/Hero/Footer are explicitly out of scope per the Revision and are not assigned a task.

**2. Placeholder scan** — no "TBD"/"TODO"/"add validation" instructions; Task 2's step 2 uses a documented diff description (preserve icon/from/to/glow, replace only title/description) instead of a placeholder because the existing file's exact per-item values must be read from the file rather than re-typed — this is a precise instruction, not a vague one.

**3. Type consistency** — `ServiceCard` props (`icon`, `title`, `description`, `capabilities`, `href`, `from`, `to`) match the `SERVICES` array shape in Task 6 exactly. Every `href`/`id` pair was cross-checked: `#services` (Task 6), `#pipeline-section` (Task 7), `#observability` (Task 8), `#how-we-work` (Task 2), `#case-studies` (Task 3), `#engagement` (Task 9), `#insights`/`#faq` (Task 11), `#contact` (Task 12, already existed) — each id is assigned by exactly one section and referenced correctly from Services/Footer/CTAs.

**4. Review Focus** — dead-import deletions → audit steps in Tasks 4/5/6/8/12/13 plus the authoritative `npm run build` in Task 13; glow-blob-on-white contrast → called out explicitly in Tasks 2 and 3; fake form success state → Task 12's honest-state implementation; pipeline/FAQ keyboard access → Task 7/11 manual checks plus Task 14 Step 4; white-on-white contrast → Task 14 Step 3's explicit check and the Review Focus item above.

No gaps found. Plan is ready for execution.

---

Plan complete and saved to `docs/superpowers/plans/2026-10-14-avanlog-rebuild.md`. Please review the plan. Which execution approach would you prefer?

- **Subagent-driven** — a fresh subagent implements each task and a fresh reviewer checks it before the next starts, then a whole-branch review at the end. Most thorough; costs a fresh context per task and per review.
- **Native** — I implement every task myself in this session, then one fresh reviewer checks the whole branch at the end. Cheapest and fastest; no independent review until the end.

For this plan I recommend **native**, because this revision is smaller and lower-risk than the original (14 tasks, no Nav/Hero/Footer/token changes, no cross-file design-system migration) — most tasks are a single self-contained white-themed component, and the main risk (the two background-flip edits in Tasks 2–3 and the shared anchor ids) is small enough for one end-of-branch review to catch reliably.

Does the plan capture what you want, and which approach should we use?
