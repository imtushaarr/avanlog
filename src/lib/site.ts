// Central source of truth for site-wide identity used by metadata,
// sitemap.ts, robots.ts, and structured data (JSON-LD).
//
// TODO: confirm the production domain before launch. The rest of the
// site's copy (legal pages, footer, this constant) currently assumes
// avanlog.orynticlabs.com — update SITE_URL here if the real domain differs.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://avanlog.orynticlabs.com";

export const SITE_NAME = "Avanlog";

export const SITE_TITLE = "Avanlog | Cloud Infrastructure, DevOps & Production Engineering";

export const SITE_DESCRIPTION =
  "Avanlog helps growing teams automate deployments, engineer reliable cloud infrastructure, and run production with confidence — cloud architecture, CI/CD, Kubernetes, and 24/7 operations.";

export const SITE_LOGO = `${SITE_URL}/avanlog__1_-removebg-preview.png`;

// Verified directly against orynticlabs.com's own footer — see the git
// history for how these were confirmed before being linked anywhere.
export const SOCIAL_LINKS = [
  "https://www.linkedin.com/company/orynticlabs",
  "https://www.instagram.com/orynticlabs",
  "https://twitter.com/orynticlabs",
  "https://www.youtube.com/@orynticlabs",
  "https://orynticlabs.medium.com",
];

export const CONTACT_EMAIL = "avanlog@orynticlabs.com";
