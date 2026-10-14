# Avanlog landing page rebuild — design spec

Date: 2026-10-14
Status: approved, superseded in part by the revision below

## Revision (same day, after initial approval)

The user redirected scope before implementation started:

- **`Nav.tsx`, `Hero.tsx`, `Footer.tsx` are NOT touched.** They keep their
  current dark graphite theme, copy, and behavior exactly as already live.
  Sections 5.1 ("Nav"), 5.2 ("Hero"), and 5.15 ("Footer") below, and every
  reference to rebuilding them, no longer apply.
- **No token or font migration.** `globals.css` keeps its current token set
  (dark `--graphite/--steel/--fog/--paper/--signal/--amber/--wire` tokens
  *and* the already-present light `--surface: #f4f6fb` / `--surface-line:
  #e2e6f0` / `--ink: #10141d` / `--ink-fog: #5b6372` tokens — the light set
  was already defined but unused by any component). `layout.tsx` keeps
  Josefin Sans + IBM Plex Mono — no switch to Inter. Section 3 ("Design
  tokens") and section 4 ("Typography") below describing a navy/blue/Inter
  system no longer apply.
- **Every section between Hero and Footer ships in a white theme**, reusing
  the existing light tokens (`bg-white` / `bg-surface` / `text-ink` /
  `text-ink-fog` / `border-surface-line`) rather than the dark
  `bg-bg`/`text-text` tokens described below.
- **Keep the full existing gradient accent palette** (wire blue `#4a6cf7`,
  purple `#8b5cf6`, pink `#ec4899`, amber `#f2a33d`, red `#ef4444`, signal
  green `#35d07f`, teal `#2dd4bf`) on white card surfaces — not the
  blue/cyan-only restriction described in section 3 below.
- `HowWeWork.tsx` and `CaseStudies.tsx` were already rebuilt in a prior
  session with white cards and the gradient-palette icons/accents this
  revision wants, but their *section* backgrounds are still dark
  (`bg-graphite` / `bg-black`) with glow blobs meant for a dark backdrop —
  those need to flip to a white/light section background (`bg-white` or
  `bg-surface`) to match "all components in white theme," in addition to
  the copy/content updates in §5.8/§5.9 below. The card styling and
  gradient icons inside them do not need to change.
  Everything else in §5 (ReliabilityMetrics,
  TechnologyStack, Services, DeploymentPipeline, ObservabilityShowcase,
  EngagementModels, Security, Insights, FAQ, Conversion) still needs to be
  built, but on this white theme instead of the navy one.
- All credibility/content rules (§2), copy/data per section (§5.3–§5.14
  content, minus their color/token instructions), file deletions (§7), and
  animation/accessibility/testing rules (§8/§10) still apply unchanged —
  only the color system and the Nav/Hero/Footer scope changed.

The implementation plan (`docs/superpowers/plans/2026-10-14-avanlog-rebuild.md`)
has been rewritten to match this revision; it is the authoritative task
list going forward.

## 1. Intent

Rebuild `avanlog.dev`'s single landing page (`src/app/page.tsx`) into a complete,
production-quality site for Avanlog — a cloud infrastructure / DevOps /
platform engineering / SRE consultancy. Audience: founders, CTOs, engineering
managers at companies with production applications. Goal: communicate
technical credibility and convert visitors into infrastructure-audit /
consultation leads.

This is a full visual and structural rebuild, not an incremental addition:
the color system changes site-wide, every section component is rewritten
fresh, and duplicate/unused legacy components are deleted.

Decisions already made with the user (do not re-litigate):
- **Palette**: adopt the brief's navy/blue/cyan system site-wide, replacing
  the current graphite/steel/wire/signal/amber tokens.
- **Typography**: switch display/body font from Josefin Sans to **Inter**;
  keep **IBM Plex Mono** for metrics, numeric labels, stage counters.
- **Components**: rebuild every section fresh; delete superseded duplicates
  rather than keep both.
- **Scope**: full build, all sections, in one plan.

## 2. Non-goals / explicit constraints

- No fabricated client names, testimonials, metrics, certifications, or
  "industry leader" claims. Reliability metrics ship as clearly-labeled
  illustrative/example values (see §5).
- No fake monitoring platform claims — the observability section is an
  illustrative demo with a `DEMONSTRATION DATA` label.
- No fabricated case studies presented as paid client work — ship as
  "Engineering in practice" demonstration projects, explicitly labeled.
- No pricing tables — engagement models route to contact, not checkout.
- No fabricated contact details (address/phone/email) — contact block uses
  the existing `/contact` anchor + form only; no invented email/phone.
- No backend/CMS/booking integration exists yet. The contact form is
  front-end only: client-side validation + a clearly-visible
  "not yet connected to a backend" dev note in a code comment, and a
  disabled-until-wired submit path that shows a honest inline message
  rather than a fake success toast. Document required wiring in the PR
  description, not in user-facing copy.
- Do not introduce new npm dependencies. Stack stays: Next.js App Router,
  Tailwind v4, `motion/react`, `lucide-react`, native React state.
- Keep `/pipeline`, `/privacy`, `/terms` routes untouched except where the
  footer needs to link to them.

## 3. Design tokens

Replace the existing token block in `src/app/globals.css`:

```css
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
```

Drop `--graphite/--steel/--steel-line/--fog/--paper/--signal/--amber/--wire/
--wire-dark/--surface(old light surface)/--ink/--ink-fog`. Grep every
component for these class names (`bg-graphite`, `text-fog`, `text-paper`,
`bg-steel`, `border-steel-line`, `text-wire`, `text-signal`, `text-amber`,
etc.) and migrate to the new token names as each component is rebuilt — no
component should reference an old token after this rebuild.

Rules carried from the brief:
- Blue/cyan used sparingly, for emphasis only (active states, key numbers,
  connecting lines) — not as a decorative gradient on every card.
- No purple, no multi-hue gradients, no heavy glassmorphism/blur-everywhere.
- Borders are 1px `--surface-line`, not glowing.

## 4. Typography

Replace `Josefin_Sans` with `Inter` in `src/app/layout.tsx`:

```ts
import { Inter, IBM_Plex_Mono } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
```

Keep the existing `IBM_Plex_Mono` import/config as-is (rename the CSS
variable it's assigned to only if needed for consistency; `--font-plex-mono`
already matches `@theme inline` above).

Heading scale: use `clamp()` for the hero H1 and major H2s, e.g.
`text-[clamp(2.5rem,5vw,4rem)]` for H1, `text-[clamp(1.75rem,3vw,2.5rem)]`
for section H2s. Body copy stays at a readable `text-base md:text-lg` with
`--text-muted` for supporting copy, `--text` for headings/primary copy.

## 5. Section-by-section spec

Each section below names the component file(s), replaces/removes any
existing legacy file, and gives the copy/data to ship with (so the
implementation plan does not need to invent content).

### 5.1 `Nav.tsx` (rebuild in place) + `MobileNav.tsx` (new)

- Left: `AvanlogLogomark` (existing asset, keep as-is, recolor stroke to
  `--text`/`--accent` on hover) + "avanlog" wordmark in Inter semibold.
- Links: Services, Solutions, How We Work, Case Studies, Insights — each
  an anchor to the matching section id (`#services`, `#solutions` — map to
  Technology Stack section since "Solutions" has no dedicated section in
  this brief, point it at `#services`, revisit if a dedicated Solutions
  section is added later), `#how-we-work`, `#case-studies`, `#insights`.
- Right: primary CTA button "Book an Audit" → `#contact`.
- Sticky, `fixed top-0`. Transparent/blended at scroll Y = 0, transitions to
  `bg-bg/90 backdrop-blur border-b border-surface-line` past ~24px scroll
  (reuse the scroll-listener pattern already in the current `Nav.tsx`).
- Mobile: hamburger opens `MobileNav` as a full-height drawer (`motion`
  slide-in from right or top), traps focus, closes on link click, closes on
  `Escape`, closes on backdrop click, restores focus to the trigger button
  on close.

### 5.2 `Hero.tsx` (rebuild) + `InfrastructureVisual.tsx` (new)

Copy:
- Eyebrow: "CLOUD INFRASTRUCTURE / DEVOPS / SRE"
- H1: "Production infrastructure. Engineered for reliability."
- Supporting: "We help ambitious teams automate deployments, engineer
  resilient cloud infrastructure, and keep production systems running with
  confidence."
- Primary CTA: "Book an Infrastructure Audit" → `#contact`
- Secondary CTA: "Explore Our Services" with arrow icon → `#services`
- Optional trust line under CTAs: "Built for teams that cannot afford
  unreliable releases." — include only if it fits without crowding the
  composition; implementer's visual call.

Layout: asymmetric split, text column ~55%, `InfrastructureVisual` ~45% on
desktop; visual moves below text and shrinks on mobile/tablet.

`InfrastructureVisual`: bespoke inline SVG — a small set of connected nodes
(4-6 circles representing services) linked by thin paths to one central
"production" node, rendered in `--surface`/`--surface-line`/`--accent`/
`--accent-cyan`. On mount: nodes fade/scale in staggered (~60ms stagger),
paths draw in via `strokeDashoffset` animation, then one path shows a
looping low-amplitude "pulse" (a small circle animated along the path,
`motion` `offsetPath` or a simple keyframed translate) — pulse motion must
pause under `prefers-reduced-motion`.

Entrance sequence: eyebrow → H1 (upward reveal, `y: 16→0, opacity 0→1`,
~450ms) → supporting text (staggered ~100ms after) → CTAs (fade+slide,
~100ms after that) → visual draws in roughly concurrently with text. Total
sequence under ~900ms so the page doesn't feel gated.

### 5.3 `ReliabilityMetrics.tsx` (new; deletes `MetricsStrip.tsx` and
`ReliabilityMetricsStrip.tsx`)

Full-width strip directly below Hero, `bg-bg-secondary`, top+bottom
1px `border-surface-line`. Four metrics in
`grid grid-cols-2 md:grid-cols-4` (even distribution, first metric flush
left, last flush right at the container's max-width, no left-clustering):

1. Uptime SLA — `99.95%`
2. On-call coverage — `24/7`
3. Time to acknowledge — `<15m`
4. Operational visibility — `24/7 monitoring`

Each cell: large mono value (`--font-mono`, `--text`), small muted label
below (`--text-muted`, uppercase, tracked). Add a one-line caption under the
strip, small and muted: "Representative targets — confirmed per engagement."
— this satisfies the brief's requirement that these not be presented as
unverified guarantees, without cluttering the strip itself.
Reveal: simple staggered fade/slide on scroll into view, no count-up
animation (per brief, these aren't counters, they're fixed operational
figures).

### 5.4 `TechnologyStack.tsx` (new; deletes `TechnologyEcosystem.tsx` and
`TechnologyGrid.tsx`)

Heading: "Built around your existing stack."
Supporting: "Practical infrastructure engineering that works with the
tools your team already trusts."

Logo/name grid (responsive grid, 3-6 columns depending on breakpoint):
AWS, Microsoft Azure, Google Cloud, Cloudflare, Docker, Kubernetes,
Terraform, GitHub Actions, GitLab CI/CD, Prometheus, Grafana,
OpenTelemetry.

Use `lucide-react` is not a logo set — for this section, render each as a
muted-gray text/wordmark chip (`--text-muted`, 1px `--surface-line` border)
rather than fabricating brand marks, since no verified logo asset set exists
in the repo. On hover: border brightens to `--accent`, text brightens to
`--text`. This avoids using unlicensed third-party logo art while still
satisfying the "built around your stack" message. (If the user later
supplies official logo SVGs, swapping them in is a drop-in change — note
this in the PR description.)

No partner badges (AWS/Cloudflare) — brief requires verification before
display, and none exists; omit entirely rather than imply partnership.

### 5.5 `ServicesSection.tsx` + `ServiceCard.tsx` (new; deletes
`Services.tsx` and `CoreServicesGrid.tsx`)

Heading: "Everything your production environment needs."
Supporting: "From the first deployment pipeline to dependable day-to-day
operations, we engineer the systems behind reliable software delivery."

Six cards, 3-column desktop / 2-column tablet / 1-column mobile grid, each
with: a small `lucide-react` line icon (distinct per card — e.g. `Cloud`,
`GitBranch`, `Container`/`Boxes`, `LayoutGrid`, `Activity`, `Server`), title,
2-sentence description, a short capability list (`ul`, muted check-style
marks), and a "Learn more" link. Since no dedicated detail pages exist,
"Learn more" anchors to the most relevant deeper section on the same page
(e.g. Cloud Infrastructure → `#solutions`/tech stack, DevOps/CI/CD →
`#pipeline`, Kubernetes → `#pipeline`, Platform Engineering → `#how-we-work`,
SRE → `#observability`, Managed Operations → `#engagement`) rather than a
dead link — document this mapping in the component so it's easy to retarget
once real detail pages exist.

1. **Cloud Infrastructure Engineering** — "Design, provision, and manage
   secure cloud environments built around your application's performance,
   availability, and growth requirements." Capabilities: Cloud architecture,
   Infrastructure provisioning, AWS/Azure/Google Cloud, Infrastructure as
   Code, Networking and IAM, Cloud migration.
2. **DevOps and CI/CD Automation** — "Replace fragile manual releases with
   repeatable delivery pipelines that help teams ship changes with
   confidence." Capabilities: CI/CD pipeline design, Automated testing
   integration, Build and release automation, Environment management,
   Deployment strategies, Rollback automation.
3. **Kubernetes and Container Platforms** — "Build and operate container
   platforms that make application deployment, scaling, and lifecycle
   management more predictable." Capabilities: Docker, Kubernetes, Container
   orchestration, Cluster configuration, Helm, Workload scaling.
4. **Platform Engineering** — "Create reusable infrastructure patterns and
   deployment workflows that reduce developer friction and operational
   overhead." Capabilities: Internal developer platforms, Deployment
   templates, Self-service infrastructure workflows, Standardized
   environments, Developer experience, Platform automation.
5. **Site Reliability Engineering** — "Improve service reliability through
   observability, sensible reliability targets, incident response, and
   continuous operational improvement." Capabilities: Service-level
   objectives, Monitoring and alerting, Incident management, Performance
   engineering, Reliability reviews, Disaster recovery planning.
6. **Managed Cloud Operations** — "Get consistent operational support for
   the cloud environments your business depends on, with clear ownership
   and transparent processes." Capabilities: Infrastructure monitoring,
   Maintenance and patching, Backup management, Incident escalation, Cost
   optimization, Operational reporting.

Hover: border brightens to `--accent` + 2-4px translateY lift. No large
blur/glow.

### 5.6 `DeploymentPipeline.tsx` (rebuild in place; interactive)

Heading: "From commit to production. Without the chaos."
Supporting: "Create a repeatable path from code changes to production
releases with automated checks, controlled deployment, and clear
operational visibility."

Six stages, horizontal on desktop (connected nodes + thin animated
connecting lines), vertical stack on mobile (do not shrink to unreadable
compact scroller — brief explicitly requires vertical flow, not
horizontal-scroll-with-tiny-labels):

1. **Code Commit** — "A code change enters version control and triggers the
   delivery workflow."
2. **Build** — "The application is compiled or packaged into a consistent
   deployable artifact."
3. **Automated Tests** — "Automated checks validate expected behavior
   before release."
4. **Security Checks** — "Relevant dependency, configuration, and
   vulnerability checks run before deployment."
5. **Deployment** — "Changes are released using a deployment strategy
   appropriate to the application's requirements."
6. **Production Monitoring** — "Observability and health checks help teams
   understand the impact of the release."

Each stage carries a short "tools/practices" line (e.g. Build → "Docker,
build caching"; Security Checks → "Dependency scanning, IaC policy checks";
Deployment → "Blue-green, canary, rolling") shown when that stage is
active.

Interaction: hover, click, and keyboard (stage buttons in a roving-tabindex
or simple `button` list, arrow-key navigable, `aria-pressed`/`aria-current`
on the active stage) all set the "active" stage; active stage highlights
in `--accent`, connecting line to the next stage animates, description
panel updates. Default active stage on load: stage 1. Entire pipeline stays
visible at all stage states (no stage collapses/hides).

This is explanatory only — no real command execution, no fake terminal
output claiming to run anything live.

### 5.7 `ObservabilityShowcase.tsx` (rebuild; deletes
`ObservabilityBentoGrid.tsx`, `ArchitectureShowcase.tsx`,
`IncidentWalkthrough.tsx` unless a follow-up review finds reusable visual
pieces worth porting in — default is delete all three and rebuild clean)

Heading: "Know what is happening in production."
Supporting: "Make infrastructure health, application behavior, and
operational events easier to understand."

Illustrative dashboard panel (bento-style grid within one bordered
`--surface` container) with: overall service health indicator, request
latency mini-chart, error rate mini-chart, CPU/memory utilization bars,
a short deployment history list, a simple service-dependency node map,
an alert timeline strip, and a short "recent operational events" list.
Small, legible labels/units on every chart. A visible small-caps label
"DEMONSTRATION DATA" in a corner of the panel makes clear this is
illustrative, not a live feed. End with a text link: "Explore our
observability approach" → `#services` (SRE card) since there's no separate
observability detail page yet.

Charts: simple inline SVG (sparkline paths, bar fills) — no charting
library dependency. Reveal via a brief scale/opacity-in when scrolled into
view; bars animate to their target height/width once.

### 5.8 `ProcessTimeline.tsx` (rebuild `HowWeWork.tsx` in place onto the new
palette and copy; delete `Process.tsx` duplicate)

Heading: "A clear path to reliable production."
Supporting: "Every engagement starts with understanding your environment,
identifying risk, and building a practical plan."

Five steps (note: copy changes from the current "Assess/Design/Automate/
Launch/Monitor" to the brief's step names/descriptions below — update data
even though the timeline mechanics from the current build are reusable):

1. **Assess** — "Understand the existing infrastructure, deployment
   workflow, operational pain points, security requirements, and
   reliability expectations."
2. **Architect** — "Define an appropriate architecture, infrastructure
   plan, automation strategy, and measurable delivery goals."
3. **Automate** — "Implement repeatable infrastructure provisioning,
   CI/CD pipelines, environment configuration, and operational workflows."
4. **Deploy** — "Validate the release process, test deployment and
   rollback procedures, and establish production readiness."
5. **Operate and Improve** — "Monitor the environment, review operational
   performance, address incidents, and continuously improve reliability
   and efficiency."

Keep the existing alternating-timeline mechanic (scroll-synced progress
line, numbered nodes) from the current `HowWeWork.tsx`, but: recolor the
per-step gradients to variations within `--accent`/`--accent-cyan` only (no
purple/amber/teal), restyle cards onto `--surface`/`--surface-line`/`--text`
tokens, and add one small caption line under the heading: "The approach
below adapts to each client's existing infrastructure and requirements" —
satisfies the brief's "don't imply identical process" requirement.
Horizontal orientation is fine on desktop (current alternating-left-right
timeline satisfies "horizontal on larger screens" in spirit); confirm it
degrades to a single-column vertical stack on mobile (it already does).

### 5.9 `CaseStudiesSection.tsx` (rebuild `CaseStudies.tsx` in place onto
new palette; reframe as "Engineering in practice")

Per the brief's credibility rule: no invented client names or results.
Reframe the section as technical demonstrations, not client work.

Heading: "Engineering in practice."
Supporting: "No invented client logos or numbers — here's how we'd approach
problems like these. Real engagement case studies will appear here as they
are published."

Three demonstration cards (bento layout — one featured + two compact, as
already built), each labeled with a small "DEMONSTRATION" chip instead of
an industry badge, framed as approach write-ups rather than completed
client results:

1. **Featured — Designing a production-ready deployment pipeline**:
   "A deployment pipeline architecture for a team moving off manual
   releases: build artifact strategy, automated test gating, security
   scanning, and a blue-green release path with fast rollback." Replace the
   fabricated uptime/deploy-time metric pills with labeled capability tags
   (e.g. "Blue-green releases", "Automated rollback", "Policy-gated
   deploys") — no invented percentages.
2. **Building a repeatable cloud infrastructure setup**: "An Infrastructure-
   as-Code baseline for standing up consistent, reviewable cloud
   environments across dev, staging, and production." Tags: "Terraform
   modules", "Environment parity", "IAM least-privilege".
3. **Implementing a monitoring and alerting strategy**: "A practical
   approach to service-level objectives, alert routing, and incident
   response for a team with no existing observability practice." Tags:
   "SLOs", "Alert routing", "On-call runbooks".

Each card keeps a "Read the approach" link → scroll to `#contact` (no real
case-study detail pages exist yet). Keep the existing count-up `MetricPill`
component in the codebase only if a future real case study needs it; it is
not used by the demonstration cards above (remove the count-up metric
usage from this section, since the tags above replace invented numbers).

### 5.10 `EngagementModels.tsx` (rebuild in place onto new palette)

Heading: "Bring us in where you need us."

Four models, 2x2 grid desktop / stacked mobile, each: title, one-paragraph
description, CTA button (not a pricing table):

1. **Infrastructure Audit** — "For businesses that want to understand
   their current cloud setup, deployment process, security posture, or
   reliability risks." CTA: "Request an Audit" → `#contact`.
2. **Deployment Engineering** — "For teams that need CI/CD pipelines,
   automated releases, environment configuration, or a repeatable
   deployment process." CTA: "Discuss a Deployment" → `#contact`.
3. **Cloud Migration and Modernization** — "For businesses moving
   applications, improving infrastructure architecture, or standardizing
   environments." CTA: "Plan Your Migration" → `#contact`.
4. **Managed DevOps and Production Operations** — "For businesses that
   need ongoing infrastructure maintenance, monitoring, operational
   support, and reliability improvements." CTA: "Discuss Ongoing Support"
   → `#contact`.

Footnote under the grid: "Scope, availability, response times, and pricing
are defined per engagement." No pricing table.

### 5.11 `SecuritySection.tsx` (new)

Heading: "Built with operational responsibility in mind."

Grid of 8 items, each a small `lucide-react` line icon + short label +
one-line description, framed as practices/capabilities (not certifications):

- Least-privilege access (`KeyRound`)
- Secrets management (`Lock`)
- Secure infrastructure configuration (`ShieldCheck`)
- Dependency and vulnerability scanning (`ScanSearch`)
- Backup and recovery planning (`DatabaseBackup`)
- Monitoring and audit trails (`FileClock`)
- Environment separation (`Layers`)
- Incident escalation procedures (`Siren`)

No certification badges (SOC2/ISO/etc.) unless the user confirms Avanlog
holds them — omit entirely per the brief.

### 5.12 `InsightsSection.tsx` (new)

Heading: "Better infrastructure starts with better decisions."

Editorial grid, 8 cards, each: title, 1-2 sentence summary, category chip,
estimated reading time. **No publication date** on any card (the brief
prohibits inventing dates) — omit the date field entirely rather than
fabricate one; add a small code comment noting dates should be added once
real articles are published. Cards are visually clickable but not wired
to real article routes yet — mark with a subtle "Coming soon" tag rather
than a dead link that looks live, consistent with "no placeholder buttons
appear functional when they are not."

Topics (title / category / read time):
1. Building reliable CI/CD pipelines — CI/CD — 6 min
2. Docker and Kubernetes deployment patterns — Containers — 8 min
3. Infrastructure as Code with Terraform — IaC — 7 min
4. Cloud cost optimization — Cost — 5 min
5. Observability fundamentals — Monitoring — 6 min
6. Production incident preparedness — Reliability — 7 min
7. Blue-green and canary deployment strategies — Deployment — 6 min
8. Cloud backup and disaster recovery — Resilience — 5 min

### 5.13 `FAQSection.tsx` (new)

Heading: "Frequently asked questions."

Accessible accordion (`<button aria-expanded>` per item controlling a
`role="region"` panel, unique ids, no nested interactive elements inside
the trigger), one item open at a time or multiple-open — implementer's
call, default to single-open for scannability. Smooth height transition
(`motion` `AnimatePresence`/`height: auto` workaround or CSS grid-rows
trick — avoid animating `height: auto` directly), respects reduced motion
(snap instead of animate).

Questions (answers concise, honest, no invented SLAs/response times beyond
what's already stated in §5.3's metrics strip):

1. **What does Avanlog do?** — We help teams design, build, and operate
   the infrastructure behind their production applications: cloud
   architecture, CI/CD automation, Kubernetes, and ongoing operations.
2. **Which cloud platforms do you support?** — AWS, Microsoft Azure, and
   Google Cloud, along with Cloudflare for edge and network needs.
3. **Can you work with our existing development team?** — Yes. Most
   engagements work alongside an existing team rather than replacing it,
   handling the infrastructure and operations layer.
4. **Can you improve our current deployment pipeline?** — Yes. We
   regularly audit and rebuild existing CI/CD pipelines rather than
   starting over unnecessarily.
5. **Do you offer ongoing DevOps and cloud support?** — Yes, through our
   Managed DevOps and Production Operations engagement model.
6. **Can you help migrate our infrastructure?** — Yes. Migration scope and
   approach depend on your current architecture and constraints.
7. **How do you approach security and access management?** — Through
   least-privilege access, secrets management, environment separation, and
   regular configuration review — see our security practices above.
8. **How is an infrastructure engagement scoped?** — Through an initial
   audit or discovery conversation that defines scope, priorities, and
   timeline before work begins.
9. **Can you support applications already running in production?** — Yes.
   Many engagements start with an existing production system rather than
   a greenfield build.
10. **How do we get started?** — Book an infrastructure audit or reach out
    through the contact form below, and we'll follow up to discuss your
    environment.

### 5.14 `ConversionSection.tsx` (rebuild in place as the final CTA + form;
deletes `CTASection.tsx` duplicate)

Heading: "Let's make your infrastructure ready for what comes next."
Supporting: "Tell us about your application, deployment challenges, or
cloud environment. We'll discuss the engineering work needed to move
forward with confidence."
Primary CTA label (scrolls to the form / focuses first field): "Book an
Infrastructure Audit". Secondary: "Talk to an Engineer" (same destination;
both are entry points into the one form below, not separate flows, since
no booking backend exists).

Form fields: Name (required), Work email (required, email-format
validated), Company name (required), Current cloud provider (select: AWS,
Azure, Google Cloud, Multiple, Other/none), Area of interest (select,
options matching §5.10's four engagement models + "Not sure yet"), Short
project description (textarea, required, min length ~20 chars).

Behavior:
- Client-side validation on blur + submit; inline error messages tied to
  inputs via `aria-describedby`; invalid fields get `aria-invalid`.
- No backend exists. On submit, run validation; if valid, show a loading
  state (~600ms simulated) then an honest inline state: "Thanks — this
  form isn't connected to a live inbox yet. Please reach out via
  [existing contact method already on the site, if any — otherwise state
  that the team will add a direct contact path soon]." Do NOT claim the
  message was sent or will be followed up on, since nothing receives it.
  Implementer note in code comment: swap this block for a real POST once
  a form backend (e.g. an API route + email provider, or a form service)
  is configured.
- Basic spam mitigation appropriate to a no-backend form: a honeypot field
  (visually hidden, `tabindex="-1"`, `autocomplete="off"`) that silently
  no-ops the submit if filled.

### 5.15 `Footer.tsx` (rebuild in place)

Four columns + bottom row:
- **Brand**: `AvanlogLogomark` + wordmark, short description ("Avanlog
  helps teams automate deployments, engineer cloud infrastructure, and
  improve production reliability."), tagline "From Deployment to
  Reliability."
- **Services**: Cloud Infrastructure, DevOps & CI/CD, Kubernetes, Platform
  Engineering, Site Reliability Engineering, Managed Cloud Operations —
  each anchors to `#services`.
- **Company**: About (→ `#hero` or omit if no About section exists — point
  to top of page), How We Work (`#how-we-work`), Case Studies
  (`#case-studies`), Insights (`#insights`), Contact (`#contact`).
- **Resources**: Technical Guides (→ `#insights`, since no separate guides
  page exists), Infrastructure Checklist (→ `#contact`, mark as "ask us"
  rather than a dead download link), FAQ (`#faq`).
- **Contact**: no invented address/phone/email. Use only verified contact
  info already present in the codebase (checked: none currently exists
  outside the on-page form) — so this column states "Reach out through the
  form below" and links to `#contact`, rather than fabricating details.

Bottom row: `© {current year} Avanlog, an Oryntic Labs company.` (matches
existing footer copy already in the repo — verify before rebuild and keep
if accurate), Privacy Policy (`/privacy`, existing route), Terms of Service
(`/terms`, existing route). No cookie-preferences link — the site sets no
tracking cookies currently, so omit per "if tracking requires it."

## 6. `page.tsx` composition

```tsx
<Nav />
<main>
  <Hero />
  <ReliabilityMetrics />
  <TechnologyStack />
  <ServicesSection id="services" />
  <DeploymentPipeline />
  <ObservabilityShowcase />
  <ProcessTimeline id="how-we-work" />
  <CaseStudiesSection id="case-studies" />
  <EngagementModels id="engagement" />
  <SecuritySection />
  <InsightsSection id="insights" />
  <FAQSection id="faq" />
  <ConversionSection id="contact" />
</main>
<Footer />
```

Section order follows the brief's numbering (§5–§18) exactly.

## 7. Files to delete (superseded)

`src/components/MetricsStrip.tsx`, `ReliabilityMetricsStrip.tsx`,
`TechnologyEcosystem.tsx`, `TechnologyGrid.tsx`, `Services.tsx`,
`CoreServicesGrid.tsx`, `ObservabilityBentoGrid.tsx`,
`ArchitectureShowcase.tsx`, `IncidentWalkthrough.tsx`, `Process.tsx`,
`CTASection.tsx`. Before deleting, grep the repo (including `/pipeline`
route) for any remaining import of each — `src/app/pipeline/page.tsx` in
particular should be checked since it may reuse `pipeline/` subfolder
components independently of these files.

`StackRow.tsx` and `MessageBotsCard.tsx`: audit during implementation —
keep only if still referenced after the rebuild (currently unused in
`page.tsx`); otherwise delete as part of the same cleanup.

## 8. Animation & accessibility system (applies to every section)

- Easing/durations: hover transitions 180-250ms, content reveals
  350-650ms, large visual transitions 450-800ms. Use `transform`/`opacity`
  for animated properties, not layout dimensions, except where explicitly
  noted (pipeline connecting lines, timeline progress line).
- All scroll-reveal animations use `whileInView`/`IntersectionObserver`
  with `once: true` (no re-trigger on scroll-back).
- Wrap every continuous/decorative animation (hero pulse, background
  motion, any looping effect) in a `prefers-reduced-motion` check — when
  reduced motion is set: disable the loop, skip scroll-linked transforms,
  render all content in its final visible state immediately, keep all
  interactivity (pipeline stage switching, accordion, nav, form) working.
- All interactive elements (pipeline stages, accordion triggers, nav
  links, mobile drawer, form fields) must be reachable and operable by
  keyboard with visible focus rings, and usable by touch.

## 9. SEO metadata

Update `src/app/layout.tsx` metadata:
- Title: "Avanlog | Cloud Infrastructure, DevOps & Production Engineering"
- Description: "Avanlog helps businesses automate deployments, engineer
  cloud infrastructure, and improve production reliability through DevOps,
  platform engineering, and managed cloud operations."
- Add Open Graph fields (`og:title`, `og:description`, `og:type: website`)
  using the same copy; no `og:image` unless/until a real social-share
  asset exists — omit rather than reuse an unrelated image.
- No canonical URL / structured data — no confirmed production domain is
  known; omit rather than invent one (note in PR description that this
  should be added once the domain is finalized).

## 10. Testing / verification plan

- `npx tsc --noEmit` and the project's lint command (`npm run lint` if
  present) must pass after each major component batch, not just at the
  end.
- `npm run build` must succeed before calling the work done.
- Manual verification per section via the dev server + Chrome automation
  (as used in prior sessions on this project): desktop (~1470px), tablet
  (~820px), and mobile (~390px) widths; confirm no horizontal overflow at
  any width.
- Keyboard-only pass: tab through nav → mobile drawer (at mobile width) →
  pipeline stages → accordion → form, confirming visible focus and correct
  behavior at each stop.
- Toggle `prefers-reduced-motion` (via Chrome DevTools or OS setting) and
  re-check the hero, pipeline, and timeline sections for the reduced-motion
  behavior described in §8.
- Grep the final codebase for any remaining old token classnames
  (`bg-graphite`, `text-fog`, `text-paper`, `bg-steel`, `text-wire`,
  `text-signal`, `text-amber`, `border-steel-line`) to confirm the palette
  migration is complete.

## 11. Open items deferred, not blocking this spec

- Real case studies, articles, and certifications: structure is built to
  receive them later; no fabricated content ships in their place.
- Form backend / booking integration: front-end only, documented inline
  as noted in §5.14.
- Official technology/partner logo marks: using text chips until approved
  SVG assets are provided.
- Canonical domain / OG image / structured data: add once the production
  domain and a real share image exist.
