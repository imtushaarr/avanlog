"use client";

import { motion, type Variants } from "motion/react";
import { Cloud, GitBranch, Boxes, Activity, type LucideIcon } from "lucide-react";

type ServiceGroup = {
  icon: LucideIcon;
  accent: string;
  title: string;
  description: string;
  items: string[];
};

const GROUPS: ServiceGroup[] = [
  {
    icon: Cloud,
    accent: "#4a6cf7",
    title: "Cloud Infrastructure & Architecture",
    description:
      "Design, provision, and manage secure cloud environments built around your application's performance, availability, and growth.",
    items: ["Cloud Architecture", "Infrastructure as Code", "Networking & IAM", "Cloud Migration"],
  },
  {
    icon: GitBranch,
    accent: "#8b5cf6",
    title: "DevOps & Deployment Engineering",
    description:
      "Replace fragile manual releases with repeatable delivery pipelines that help teams ship changes with confidence.",
    items: ["CI/CD Pipelines", "Build Automation", "Deployment Strategies", "Rollback Automation"],
  },
  {
    icon: Boxes,
    accent: "#f2a33d",
    title: "Platform & Container Engineering",
    description:
      "Build and operate container platforms that make deployment, scaling, and lifecycle management predictable.",
    items: ["Kubernetes", "Docker", "Internal Developer Platforms", "Workload Scaling"],
  },
  {
    icon: Activity,
    accent: "#35d07f",
    title: "Reliability & Managed Operations",
    description:
      "Ongoing observability, incident response, and operational support for the environments your business depends on.",
    items: ["Monitoring & Alerting", "Incident Response", "Backup & Recovery", "Cost Optimization"],
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
};

const column: Variants = {
  hidden: { opacity: 0, y: 56 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ServicesSection() {
  return (
    <section id="services" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Everything your production environment needs.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-fog">
            From the first deployment pipeline to dependable day-to-day
            operations, we engineer the systems behind reliable software
            delivery.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-14 grid grid-cols-1 border-t border-surface-line sm:grid-cols-2 sm:divide-x sm:divide-surface-line lg:mt-16 lg:grid-cols-4"
        >
          {GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <motion.div
                key={group.title}
                variants={column}
                className="flex flex-col gap-6 border-b border-surface-line px-6 py-10 first:pl-0 last:pr-0 sm:px-8 sm:[&:nth-child(2n)]:pl-8 lg:border-b-0"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm"
                  style={{ color: group.accent }}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-display text-xl font-semibold leading-snug text-ink">
                    {group.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-fog">{group.description}</p>
                </div>

                <ul className="mt-2 flex flex-col">
                  {group.items.map((entry) => (
                    <li
                      key={entry}
                      className="border-t border-dashed border-surface-line py-3 text-sm text-ink-fog first:border-t-0"
                    >
                      {entry}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
