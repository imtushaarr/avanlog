"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";

type Model = {
  variant: "audit" | "deploy" | "migrate" | "operate";
  from: string;
  to: string;
  glow: string;
  title: string;
  summary: string;
  description: string;
  includes: string[];
  cta: string;
};

const MODELS: Model[] = [
  {
    variant: "audit",
    from: "#4a6cf7",
    to: "#8b5cf6",
    glow: "rgba(74,108,247,0.25)",
    title: "Infrastructure Audit",
    summary: "Understand what you're running today.",
    description:
      "We start by mapping exactly what you have: cloud accounts, network topology, deployment process, and where the operational risk actually sits. You get a clear, prioritized picture of your infrastructure — not a generic checklist — before you commit to any further work.",
    includes: [
      "Cloud architecture and IAM review",
      "Deployment and release process walkthrough",
      "Security posture and risk findings",
      "A prioritized report, not just a list",
    ],
    cta: "Request an Audit",
  },
  {
    variant: "deploy",
    from: "#8b5cf6",
    to: "#ec4899",
    glow: "rgba(139,92,246,0.25)",
    title: "Deployment Engineering",
    summary: "Build the pipeline that ships your code.",
    description:
      "We replace manual, error-prone releases with a pipeline that runs the same way every time: automated tests, security checks, and a deployment strategy suited to your traffic and risk tolerance — so shipping stops being the scary part of the week.",
    includes: [
      "CI/CD pipeline design and build automation",
      "Environment and secrets configuration",
      "Blue-green, canary, or rolling strategy",
      "Rollback automation built in from day one",
    ],
    cta: "Discuss a Deployment",
  },
  {
    variant: "migrate",
    from: "#f2a33d",
    to: "#ef4444",
    glow: "rgba(242,163,61,0.25)",
    title: "Cloud Migration and Modernization",
    summary: "Move or rebuild without the downtime.",
    description:
      "Whether you're moving off a legacy host, consolidating multi-cloud sprawl, or re-architecting a monolith, we plan the migration path first — so the move itself is boring, predictable, and doesn't interrupt the business while it happens.",
    includes: [
      "Migration plan with explicit rollback points",
      "Infrastructure as Code for the target state",
      "Environment parity across dev, staging, and production",
      "Cutover support, not a handoff document",
    ],
    cta: "Plan Your Migration",
  },
  {
    variant: "operate",
    from: "#35d07f",
    to: "#2dd4bf",
    glow: "rgba(53,208,127,0.25)",
    title: "Managed DevOps and Production Operations",
    summary: "Ongoing ownership once you're live.",
    description:
      "Once you're live, we stay on as the team watching it: patching, monitoring, cost tuning, and being the first call when something breaks — so your own engineers can keep building the product instead of carrying the pager.",
    includes: [
      "24/7 monitoring and incident escalation",
      "Patching, backups, and cost optimization",
      "Monthly operational reporting",
      "Clear ownership — you always know who's on call",
    ],
    cta: "Discuss Ongoing Support",
  },
];

function ModelIllustration({ variant, from, to, gradientId }: { variant: Model["variant"]; from: string; to: string; gradientId: string }) {
  const stroke = `url(#${gradientId})`;

  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>

      {variant === "audit" && (
        <g fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <rect x="22" y="14" width="56" height="72" rx="8" stroke={stroke} />
          <line x1="34" y1="34" x2="66" y2="34" stroke={stroke} opacity="0.6" />
          <line x1="34" y1="48" x2="66" y2="48" stroke={stroke} opacity="0.6" />
          <line x1="34" y1="62" x2="54" y2="62" stroke={stroke} opacity="0.6" />
          <circle cx="76" cy="78" r="16" stroke={stroke} />
          <line x1="87" y1="89" x2="100" y2="102" stroke={stroke} />
        </g>
      )}

      {variant === "deploy" && (
        <g fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="60" x2="98" y2="60" stroke={stroke} strokeDasharray="1 9" />
          <circle cx="24" cy="60" r="9" stroke={stroke} />
          <circle cx="60" cy="60" r="9" stroke={stroke} />
          <path d="M90 48 L104 60 L90 72 Z" stroke={stroke} strokeLinejoin="round" />
        </g>
      )}

      {variant === "migrate" && (
        <g fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M30 46a12 12 0 0 1 22-7 15 15 0 0 1 28 10 10 10 0 0 1-2 20H32a12 12 0 0 1-2-23z"
            stroke={stroke}
          />
          <path
            d="M62 82a12 12 0 0 1 22-7 15 15 0 0 1 28 10 10 10 0 0 1-2 20H64a12 12 0 0 1-2-23z"
            stroke={stroke}
            opacity="0.45"
            transform="translate(-38,-10) scale(0.72)"
          />
          <path d="M40 68 Q60 86 82 92" stroke={stroke} strokeDasharray="1 7" />
          <path d="M76 86 L82 92 L74 96" stroke={stroke} />
        </g>
      )}

      {variant === "operate" && (
        <g fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="60" cy="60" r="38" stroke={stroke} opacity="0.3" />
          <circle cx="60" cy="60" r="24" stroke={stroke} opacity="0.55" />
          <path d="M28 60h16l8-18 10 36 8-18h14" stroke={stroke} />
          <circle cx="60" cy="60" r="3.5" fill={stroke} />
        </g>
      )}
    </svg>
  );
}

export default function EngagementModels() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = MODELS[activeIndex];
  const gradientBase = useId();

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      setActiveIndex((index + 1) % MODELS.length);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveIndex((index - 1 + MODELS.length) % MODELS.length);
    }
  };

  return (
    <section id="engagement" className="relative bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Bring us in where you need us.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-fog">
            Four ways to work together — pick the one that matches where you
            are right now.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-3 lg:mt-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-0 lg:rounded-3xl lg:border lg:border-surface-line lg:bg-surface lg:p-3 lg:shadow-sm">
          <div role="tablist" aria-orientation="vertical" className="flex flex-col gap-1">
            {MODELS.map((model, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={model.title}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={`flex items-start gap-4 rounded-2xl px-5 py-4 text-left transition-colors duration-200 ${
                    isActive ? "bg-white shadow-sm" : "hover:bg-white/60"
                  }`}
                >
                  <span
                    className="mt-0.5 font-mono text-xs"
                    style={{ color: isActive ? model.from : undefined }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className={`text-sm font-semibold ${isActive ? "text-ink" : "text-ink-fog"}`}>
                      {model.title}
                    </span>
                    <span className="text-xs text-ink-fog">{model.summary}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-surface-line bg-white p-8 shadow-sm lg:border-0 lg:shadow-none lg:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{ background: `radial-gradient(120% 90% at 100% 0%, ${active.glow}, transparent 70%)` }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={active.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative grid grid-cols-1 gap-8 sm:grid-cols-[1.3fr_0.7fr] sm:items-center"
              >
                <div className="flex flex-col gap-4">
                  <h3 className="font-display text-xl font-semibold text-ink">{active.title}</h3>
                  <p className="max-w-md text-sm leading-relaxed text-ink-fog">{active.description}</p>

                  <ul className="flex flex-col gap-2 pt-1">
                    {active.includes.map((line) => (
                      <li key={line} className="flex items-start gap-2 text-sm text-ink-fog">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: `linear-gradient(135deg, ${active.from}, ${active.to})` }}
                        />
                        {line}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-wire px-5 py-2.5 text-xs font-semibold text-wire transition-all hover:bg-wire hover:text-white"
                  >
                    {active.cta}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                  </a>
                </div>

                <div className="mx-auto hidden w-full max-w-[160px] sm:block">
                  <ModelIllustration
                    variant={active.variant}
                    from={active.from}
                    to={active.to}
                    gradientId={`${gradientBase}-${active.variant}`}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-ink-fog">
          Scope, availability, response times, and pricing are defined per
          engagement.
        </p>
      </div>
    </section>
  );
}
