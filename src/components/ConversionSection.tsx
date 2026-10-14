"use client";

import { useId, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { leadSchema } from "@/lib/leadSchema";

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
  "rounded-xl border border-surface-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-fog/60 transition-colors focus:border-wire";
const labelClass = "text-sm font-medium text-ink-fog";

export default function ConversionSection() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const honeypotId = useId();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      cloudProvider: String(data.get("cloudProvider") ?? ""),
      interest: String(data.get("interest") ?? ""),
      description: String(data.get("description") ?? ""),
      "company-website": String(data.get("company-website") ?? ""),
    };

    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        company: fieldErrors.company?.[0],
        description: fieldErrors.description?.[0],
      });
      return;
    }
    setErrors({});
    setSubmitError(null);

    setStatus("submitting");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setStatus("error");
        setSubmitError(
          typeof result.error === "string"
            ? result.error
            : "Something went wrong sending this — please try again."
        );
        return;
      }

      // No PII in this event — just the fact that a lead was delivered
      // and which service area they're interested in.
      trackEvent("generate_lead", { interest: parsed.data.interest });
      setStatus("done");
    } catch {
      setStatus("error");
      setSubmitError("Couldn't reach the server — check your connection and try again.");
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-surface-line bg-white px-6 py-12 shadow-sm md:px-14 md:py-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-1/2 right-0 h-full w-1/2 opacity-30"
            style={{ background: "radial-gradient(closest-side, rgba(74,108,247,0.25), transparent 70%)" }}
          />

          <div className="relative grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
            <div className="flex max-w-md flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-surface-line bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-wire">
                Get started
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
                Let&rsquo;s make your infrastructure ready for what comes next.
              </h2>
              <p className="text-lg leading-relaxed text-ink-fog">
                Tell us about your application, deployment challenges, or
                cloud environment. We&rsquo;ll discuss the engineering work
                needed to move forward with confidence.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="mailto:avanlog@orynticlabs.com"
                  onClick={() => trackEvent("cta_click", { cta: "talk_to_engineer", location: "final_cta" })}
                  className="inline-flex items-center gap-2 rounded-full bg-wire px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-wire-dark"
                >
                  Talk to an Engineer
                  <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </a>
              </div>
            </div>

            {status === "done" ? (
              <div className="self-start rounded-xl border border-surface-line bg-surface p-6 text-sm leading-relaxed text-ink-fog">
                Thanks — we&rsquo;ve received this and someone from the team
                will follow up at the email you provided.
              </div>
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
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className={inputClass}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && <p id="name-error" className="text-xs text-red-600">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className={labelClass}>Work email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={inputClass}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    suppressHydrationWarning
                  />
                  {errors.email && <p id="email-error" className="text-xs text-red-600">{errors.email}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="company" className={labelClass}>Company name</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    className={inputClass}
                    aria-invalid={!!errors.company}
                    aria-describedby={errors.company ? "company-error" : undefined}
                  />
                  {errors.company && <p id="company-error" className="text-xs text-red-600">{errors.company}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cloud-provider" className={labelClass}>Cloud provider</label>
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
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="description" className={labelClass}>Short project description</label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    className={inputClass}
                    aria-invalid={!!errors.description}
                    aria-describedby={errors.description ? "description-error" : undefined}
                  />
                  {errors.description && (
                    <p id="description-error" className="text-xs text-red-600">{errors.description}</p>
                  )}
                </div>

                {status === "error" && submitError && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                    {submitError} If this keeps happening, email{" "}
                    <a href="mailto:avanlog@orynticlabs.com" className="font-semibold underline">
                      avanlog@orynticlabs.com
                    </a>{" "}
                    directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-wire px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-wire-dark disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending…" : "Book an Infrastructure Audit"}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
