// Thin wrapper around GA4's gtag. No-ops when Analytics isn't configured
// (see src/components/Analytics.tsx — it only loads when NEXT_PUBLIC_GA_ID
// is set), so every call site below is always safe to call.
//
// Never pass personal information here (name, email, form content, etc.)
// — only the fact that an action happened and non-identifying context
// about it (e.g. which CTA, which section).

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
