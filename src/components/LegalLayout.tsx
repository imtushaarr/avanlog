import type { ReactNode } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export type LegalSection = {
  id: string;
  heading: string;
  body: ReactNode;
};

export default function LegalLayout({
  title,
  lastUpdated,
  intro,
  sections,
}: {
  title: string;
  lastUpdated: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <>
      <BreadcrumbJsonLd page={title} />
      <Nav />
      <main className="flex-1 bg-graphite pb-24 pt-32 md:pt-40">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Link
            href="/#top"
            className="text-xs font-medium uppercase tracking-[0.15em] text-fog transition-colors hover:text-paper"
          >
            ← Back to avanlog.orynticlabs.com
          </Link>

          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-fog">Last updated {lastUpdated}</p>

          <div className="mt-6 max-w-2xl text-sm leading-relaxed text-fog">{intro}</div>

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
            <nav aria-label="Table of contents" className="hidden lg:block">
              <div className="sticky top-32 flex flex-col gap-1 border-l border-steel-line pl-5">
                {sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="py-1.5 text-sm text-fog transition-colors hover:text-paper"
                  >
                    {String(index + 1).padStart(2, "0")}. {section.heading}
                  </a>
                ))}
              </div>
            </nav>

            <div className="flex max-w-2xl flex-col gap-10">
              {sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-32">
                  <h2 className="mb-3 font-display text-lg font-semibold text-paper">
                    <span className="mr-2 font-mono text-sm text-fog">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.heading}
                  </h2>
                  <div className="flex flex-col gap-3 text-sm leading-relaxed text-fog">
                    {section.body}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
