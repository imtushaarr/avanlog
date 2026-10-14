"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowUp } from "lucide-react";
import { siInstagram, siX, siYoutube, siMedium } from "simple-icons";

const COLUMNS = [
  {
    heading: "Services",
    links: [
      { label: "Cloud infrastructure", href: "/#services" },
      { label: "DevOps & CI/CD", href: "/#services" },
      { label: "Kubernetes & containers", href: "/#services" },
      { label: "Site reliability engineering", href: "/#services" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Engagement models", href: "/#engagement" },
      { label: "Deployment pipeline", href: "/#pipeline" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Book an audit", href: "/#contact" },
      { label: "Technology we support", href: "/#services" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "avanlog@orynticlabs.com", href: "mailto:avanlog@orynticlabs.com" },
      { label: "Oryntic Labs Private Limited", href: "https://orynticlabs.com" },
    ],
  },
];

const SOCIALS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/orynticlabs", kind: "text" as const, mark: "in" },
  { name: "Instagram", href: "https://www.instagram.com/orynticlabs", kind: "icon" as const, icon: siInstagram },
  { name: "X", href: "https://twitter.com/orynticlabs", kind: "icon" as const, icon: siX },
  { name: "YouTube", href: "https://www.youtube.com/@orynticlabs", kind: "icon" as const, icon: siYoutube },
  { name: "Medium", href: "https://orynticlabs.medium.com", kind: "icon" as const, icon: siMedium },
];

const pillClass =
  "flex h-10 w-10 items-center justify-center rounded-xl border border-dotted border-steel-line text-fog transition-all hover:-translate-y-1 hover:border-wire/50 hover:text-paper";

function handleScrollTop() {
  window.scroll({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  return (
    <footer className="border-t border-steel-line bg-graphite">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 pt-16 xl:max-w-[1400px] 2xl:max-w-[1800px] sm:flex-row sm:items-start md:px-10">
        <Link href="/#top" className="shrink-0">
          <Image
            src="/avanlog__1_-removebg-preview.png"
            alt="Avanlog"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
        </Link>
        <p className="w-full flex-1 text-center text-sm leading-relaxed text-fog sm:text-left">
          Avanlog is an Oryntic Labs company that builds the cloud
          infrastructure and deployment pipelines modern products run on. We
          design the architecture, automate the release process, and then
          stay on to operate what we build — day shifts, on-call nights, and
          everything in between. Our engineers work across AWS, Azure, and
          Google Cloud, so your team never has to start over to get the
          reliability it needs.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <div className="border-t border-dotted border-steel-line" />
        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading} className="text-left">
              <p className="text-sm font-medium text-paper">{col.heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-fog transition-colors hover:text-paper"
                      {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-dotted border-steel-line" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 px-6 pb-10 sm:gap-4">
        <a href="mailto:avanlog@orynticlabs.com" aria-label="Email Avanlog" className={pillClass}>
          <Mail className="h-4 w-4" strokeWidth={1.5} />
        </a>
        {SOCIALS.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Oryntic Labs on ${social.name}`}
            className={pillClass}
          >
            {social.kind === "icon" ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d={social.icon.path} />
              </svg>
            ) : (
              <span className="text-xs font-bold tracking-tight">{social.mark}</span>
            )}
          </a>
        ))}
        <button
          type="button"
          onClick={handleScrollTop}
          aria-label="Back to top"
          className={pillClass}
        >
          <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="border-t border-steel-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-center text-xs text-fog xl:max-w-[1400px] 2xl:max-w-[1800px] sm:flex-row sm:items-center sm:justify-between md:px-10">
          <p>
            &copy; 2026 Avanlog, A specialized subsidiary of{" "}
            <a
              href="https://orynticlabs.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
              style={{ color: "#FD580C" }}
            >
              Oryntic Labs Private Limited.
            </a>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5">
            <Link href="/privacy" className="transition-colors hover:text-paper">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-paper">
              Terms & Conditions
            </Link>
            <Link href="/sitemap.xml" className="transition-colors hover:text-paper">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
