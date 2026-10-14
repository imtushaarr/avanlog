import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page not found — Avanlog",
  description: "The page you're looking for doesn't exist or has moved.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-graphite px-6 pt-32 pb-24 text-center md:px-10">
        <span className="font-mono text-sm uppercase tracking-[0.2em] text-fog">404</span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
          This page doesn&rsquo;t exist.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-fog">
          The link you followed might be broken, or the page may have moved.
          Let&rsquo;s get you back to somewhere useful.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-wire px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-wire-dark"
          >
            Back to the homepage
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Link>
          <Link
            href="/#contact"
            className="text-sm font-semibold text-fog transition-colors hover:text-paper"
          >
            Talk to an engineer
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
