import type { ReactNode } from "react";

type Variant = "primary" | "outline-dark" | "outline-light";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-[#2776a2] text-white hover:bg-[#3a90c2] hover:shadow-[0_0_18px_rgba(39,118,162,0.5)]",
  "outline-dark": "border border-paper/25 text-paper hover:border-[#2776a2]",
  "outline-light": "border border-ink/20 text-ink hover:border-ink/50",
};

export default function PillLink({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
        <path
          d="M9 1L13 5M13 5L9 9M13 5H1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
