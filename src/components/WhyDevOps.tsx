"use client";

import { motion, type Variants } from "motion/react";
import { GitBranch, ShieldCheck, Boxes, Activity, Gauge, type LucideIcon } from "lucide-react";

type Pillar = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const PILLARS: Pillar[] = [
  {
    icon: GitBranch,
    title: "DevOps is our core discipline, not a side service",
    body:
      "A lot of agencies offer DevOps as one line item next to web development, design, and app builds. We don't. Every engineer on our team works in CI/CD pipelines, cloud infrastructure, and production operations every day — it's the only thing we do, so it's the thing we do well. That focus shows up in the details: how we structure a pipeline, how we name environments, how we handle a rollback at 2 a.m.",
  },
  {
    icon: Boxes,
    title: "Infrastructure as Code, every time, no exceptions",
    body:
      "We don't click around a cloud console and hope someone remembers what was changed. Every environment we build is defined in code — Terraform, version-controlled, reviewable, and reproducible. If a server dies, we don't panic; we redeploy from the same definition that created it the first time. That's the difference between infrastructure you can trust and infrastructure you're afraid to touch.",
  },
  {
    icon: ShieldCheck,
    title: "Security checks run in the pipeline, not after the fact",
    body:
      "Dependency scans, container image scans, and secret detection aren't a separate audit we schedule once a year — they're steps in the same pipeline that ships your code. A vulnerable dependency or a leaked key gets caught before it reaches production, not after an incident report. Security is a gate in the process, not a document on a shelf.",
  },
  {
    icon: Activity,
    title: "We build for what happens after launch",
    body:
      "Shipping is the easy part. We design deployments assuming something will eventually go wrong — rollback paths, health checks, and monitoring are part of the architecture from day one, not bolted on after an outage. When an alert fires, our engineers already know what the deploy history, error rate, and latency are supposed to look like, because we built the system that reports them.",
  },
  {
    icon: Gauge,
    title: "We work in your stack, not around it",
    body:
      "We're not trying to migrate you to a proprietary platform or lock you into tooling only we understand. We build on AWS, Azure, Google Cloud, Kubernetes, Terraform, and the CI/CD tools your team already uses, and we document everything we touch. When the engagement ends, your team owns a system it can actually operate — not a black box that only we can maintain.",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function WhyDevOps() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Why teams choose Avanlog for DevOps.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-fog">
            Plenty of companies can stand up a server. Fewer can build the
            automated, secure, and observable delivery process that keeps
            that server reliable six months later. That second part is what
            we specialize in — here&rsquo;s what that actually means in
            practice.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 flex flex-col divide-y divide-surface-line border-y border-surface-line"
        >
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                variants={item}
                className="grid grid-cols-1 gap-4 py-8 md:grid-cols-[auto_auto_1fr] md:items-start md:gap-8"
              >
                <span className="font-mono text-sm text-ink-fog/60 md:pt-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-surface-line bg-surface text-wire">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-lg font-semibold text-ink">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-fog">{pillar.body}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
