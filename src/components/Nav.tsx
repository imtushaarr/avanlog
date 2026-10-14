"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PillLink from "@/components/ui/PillLink";
import { trackEvent } from "@/lib/analytics";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#engagement", label: "How we work" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black" : ""
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl xl:max-w-[1400px] 2xl:max-w-[1800px] items-center justify-between border-b px-6 py-4 transition-colors duration-300 md:px-10 ${
          scrolled ? "border-transparent" : "border-paper/15"
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/avanlog__1_-removebg-preview.png"
            alt="Avanlog"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span className="flex flex-col items-center leading-none">
            <span className="font-display text-4xl font-bold tracking-tight text-paper">
              avanlog
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-fog transition-colors hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <PillLink
          href="#contact"
          className="px-5 py-2.5 text-xs"
          onClick={() => trackEvent("cta_click", { cta: "request_a_review", location: "nav" })}
        >
          Request a review
        </PillLink>
      </div>
    </header>
  );
}
