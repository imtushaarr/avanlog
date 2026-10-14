import type { Metadata } from "next";
import { Josefin_Sans, IBM_Plex_Mono } from "next/font/google";
import PageLoader from "@/components/PageLoader";
import OrganizationJsonLd from "@/components/OrganizationJsonLd";
import Analytics from "@/components/Analytics";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import "./globals.css";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "cloud infrastructure",
    "DevOps consulting",
    "CI/CD automation",
    "Kubernetes engineering",
    "site reliability engineering",
    "platform engineering",
    "managed cloud operations",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/fevicon.png",
    shortcut: "/fevicon.png",
    apple: "/fevicon.png",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    url: SITE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  // Set GOOGLE_SITE_VERIFICATION in .env.local once you have it from
  // Google Search Console (HTML tag method) — see .env.example.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${josefinSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-graphite text-paper">
        <OrganizationJsonLd />
        <Analytics />
        <PageLoader>{children}</PageLoader>
      </body>
    </html>
  );
}
