"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, FlaskConical, Rocket, Activity } from "lucide-react";
import {
  BuildPipeline,
  type PipelineLog,
  type PipelineRun,
  type PipelineStage,
} from "@/components/ui/build-pipeline";

const logs = (messages: string[], error = false): PipelineLog[] =>
  messages.map((message, index) => ({
    time: `09:${String(12 + index).padStart(2, "0")}:00`,
    message,
    level: error && index === messages.length - 1 ? "error" : "info",
  }));

const stage = (
  id: string,
  name: string,
  kind: PipelineStage["kind"],
  durationMs: number,
  messages: string[]
): PipelineStage => ({ id, name, kind, durationMs, status: "passed", logs: logs(messages) });

const baseStages: PipelineStage[] = [
  stage("code", "Code commit", "checkout", 1800, [
    "Fetching main branch",
    "Resolved commit 7c2a19f",
    "Workspace ready",
  ]),
  stage("build", "Build", "build", 38200, [
    "Installing cached dependencies",
    "docker build -t avanlog/api:482 .",
    'ENTRYPOINT ["node","server.js"]',
    "Build completed in 38.2s",
  ]),
  stage("test", "Automated tests", "test", 14600, [
    "Running unit suite",
    "Running integration suite",
    "Running contract tests",
    "212 passed, 0 failed",
  ]),
  stage("security", "Security checks", "security", 9300, [
    "Scanning dependencies",
    "Scanning container image",
    "Scanning for leaked secrets",
    "0 critical, 0 high findings",
  ]),
  stage("deploy", "Deployment", "deploy", 8100, [
    "Pushing image to registry: 482d91c",
    "Rolling update 10% → 100%",
    "Deployment ready",
  ]),
  stage("monitor", "Production monitoring", "monitor", 6400, [
    "/healthz 200 OK x4",
    "Error rate 0.03%",
    "p99 latency 284ms",
    "Deployment stable",
  ]),
];

const demoRuns: PipelineRun[] = [
  {
    id: "482",
    branch: "main",
    commit: "7c2a19fd20",
    startedAt: "2026-10-08T09:12:00Z",
    stages: baseStages,
  },
  {
    id: "481",
    branch: "feat/search-reindex",
    commit: "f931c02e11",
    startedAt: "2026-10-08T08:48:00Z",
    stages: baseStages.map((item) =>
      item.id === "security"
        ? {
            ...item,
            status: "failed",
            durationMs: 4200,
            logs: logs(
              [
                "Scanning dependencies",
                "Scanning container image",
                "1 high severity finding: outdated base image",
              ],
              true
            ),
          }
        : item.id === "deploy" || item.id === "monitor"
          ? { ...item, status: "skipped", durationMs: 0, logs: [] }
          : item
    ),
  },
];

const EXPLAINERS = [
  {
    icon: FlaskConical,
    title: "Nothing ships untested",
    body: "Unit, integration, and contract tests run on every commit before a build is eligible to deploy.",
  },
  {
    icon: ShieldCheck,
    title: "Security checks are built in",
    body: "Dependency, container, and secret scans run automatically — not as a manual step someone has to remember.",
  },
  {
    icon: Rocket,
    title: "Controlled, reversible releases",
    body: "Rolling, blue-green, or canary strategies roll back automatically if health checks fail after deploy.",
  },
  {
    icon: Activity,
    title: "Visibility after the deploy",
    body: "Error rate and latency are watched immediately after release, not discovered from a support ticket.",
  },
];

export default function PipelineDashboard() {
  const [runs, setRuns] = useState(demoRuns);
  const [activeId, setActiveId] = useState("482");
  const [replaying, setReplaying] = useState<string | null>(null);

  useEffect(() => {
    if (!replaying) return;
    const run = runs.find((item) => item.id === replaying);
    const snapshot = demoRuns.find((item) => item.id === replaying);
    if (!run || !snapshot) {
      const timer = setTimeout(() => setReplaying(null), 0);
      return () => clearTimeout(timer);
    }
    const index = run.stages.findIndex((item) => item.status === "running");
    if (index < 0) {
      const timer = setTimeout(() => setReplaying(null), 0);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      const terminal = snapshot.stages[index].status !== "passed";
      setRuns((previous) =>
        previous.map((item) =>
          item.id !== replaying
            ? item
            : {
                ...item,
                stages: item.stages.map((current, i) => {
                  if (i === index) return { ...snapshot.stages[i] };
                  if (terminal && i > index) return { ...snapshot.stages[i] };
                  if (i === index + 1)
                    return {
                      ...current,
                      status: "running",
                      logs: [{ time: "09:12:00", message: "Starting stage…", level: "info" }],
                    };
                  return current;
                }),
              }
        )
      );
      if (terminal || index === run.stages.length - 1) setReplaying(null);
    }, 900);
    return () => clearTimeout(timer);
  }, [runs, replaying]);

  const replay = (run: PipelineRun) => {
    setRuns((previous) =>
      previous.map((item) =>
        item.id !== run.id
          ? item
          : {
              ...item,
              stages: item.stages.map((current, index) => ({
                ...current,
                status: index === 0 ? "running" : "queued",
                durationMs: 0,
                logs: index === 0 ? [{ time: "09:12:00", message: "Starting stage…", level: "info" }] : [],
              })),
            }
      )
    );
    setReplaying(run.id);
  };

  const cancel = (run: PipelineRun) => {
    if (replaying === run.id) setReplaying(null);
    setRuns((previous) =>
      previous.map((item) =>
        item.id !== run.id
          ? item
          : {
              ...item,
              stages: item.stages.map((current) =>
                current.status === "running"
                  ? {
                      ...current,
                      status: "canceled",
                      logs: [...current.logs, { time: "09:12:00", message: "Canceled by user", level: "warning" }],
                    }
                  : current.status === "queued"
                    ? { ...current, status: "skipped" }
                    : current
              ),
            }
      )
    );
  };

  return (
    <section id="pipeline" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Every deploy moves through the same automated gates.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-fog">
              This is the kind of CI/CD pipeline our team sets up for clients
              — code, build, test, and security checks before anything
              ships, then a controlled deploy and monitoring once it&rsquo;s
              live. The run on the right is sample data; click a stage to
              see what it reports, or replay it to watch a deploy move
              through the pipeline.
            </p>

            <div className="mt-10 flex flex-col gap-6">
              {EXPLAINERS.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-wire" strokeWidth={1.75} aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-fog">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <BuildPipeline
            runs={runs}
            title="avanlog-api pipeline"
            theme="light"
            selectedRunId={activeId}
            onRunChange={(run) => setActiveId(run.id)}
            onRerun={replay}
            onCancel={cancel}
            busyRunId={replaying}
            rerunLabel="Replay"
          />
        </div>
      </div>
    </section>
  );
}
