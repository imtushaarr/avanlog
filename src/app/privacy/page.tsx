import type { Metadata } from "next";
import LegalLayout, { type LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — Avanlog",
  description: "How Avanlog collects, uses, and protects information submitted through this website.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS: LegalSection[] = [
  {
    id: "overview",
    heading: "Overview",
    body: (
      <p>
        Avanlog (&ldquo;Avanlog,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;),
        a specialized subsidiary of Oryntic Labs Private Limited, operates
        this website. This policy explains what information we collect when
        you use the site, how we use it, and the choices you have. It
        applies to avanlog.orynticlabs.com only — it does not cover the separate work
        we do once a client engagement begins, which is governed by that
        engagement&rsquo;s own agreement.
      </p>
    ),
  },
  {
    id: "information-we-collect",
    heading: "Information we collect",
    body: (
      <>
        <p>
          We only collect information you choose to give us directly. The
          one place that happens on this site is the contact form at the
          bottom of the homepage, where we ask for:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Your name</li>
          <li>Your work email address</li>
          <li>Your company name</li>
          <li>Your current cloud provider (if any)</li>
          <li>The area of work you&rsquo;re interested in</li>
          <li>A short description of your project or infrastructure</li>
        </ul>
        <p>
          We do not use cookies, analytics scripts, or any other tracking
          technology on this site, so we do not collect browsing behavior,
          device fingerprints, or location data. If that changes in the
          future, we will update this policy and this section before any
          tracking goes live.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    heading: "How we use it",
    body: (
      <p>
        We use what you submit through the contact form for one purpose:
        responding to you and discussing the engagement you&rsquo;re asking
        about. We do not use it for marketing emails you haven&rsquo;t asked
        for, and we do not sell, rent, or otherwise share it with third
        parties for their own marketing purposes.
      </p>
    ),
  },
  {
    id: "spam-protection",
    heading: "Spam protection",
    body: (
      <p>
        The contact form includes a standard, invisible field that helps us
        tell real inquiries apart from automated spam submissions. It
        doesn&rsquo;t collect anything about you personally — it only
        checks that a form was filled out by a person rather than a bot.
      </p>
    ),
  },
  {
    id: "third-party-services",
    heading: "Third-party services",
    body: (
      <p>
        This site links out to Oryntic Labs&rsquo; official social media
        profiles (LinkedIn, Instagram, X, YouTube, and Medium) and to{" "}
        <a href="https://orynticlabs.com" target="_blank" rel="noreferrer" className="text-wire hover:underline">
          orynticlabs.com
        </a>
        . Those are operated independently and have their own privacy
        practices — this policy only covers avanlog.orynticlabs.com itself. We do not
        currently use a third-party analytics, advertising, or email
        marketing provider on this site.
      </p>
    ),
  },
  {
    id: "data-retention",
    heading: "Data retention",
    body: (
      <p>
        We keep information submitted through the contact form only as long
        as needed to respond to your inquiry and, if we start working
        together, for the duration of that relationship. You can ask us to
        delete information we hold about you at any time using the contact
        details below.
      </p>
    ),
  },
  {
    id: "your-rights",
    heading: "Your rights",
    body: (
      <p>
        You can ask us what information we hold about you, ask us to
        correct it, or ask us to delete it. Email us at the address below
        and we&rsquo;ll respond directly — there&rsquo;s no automated
        self-service process for this yet.
      </p>
    ),
  },
  {
    id: "childrens-privacy",
    heading: "Children's privacy",
    body: (
      <p>
        This site and the services it describes are intended for
        businesses and working professionals. We do not knowingly collect
        information from children, and the contact form is not directed at
        anyone under the age of 18.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    body: (
      <p>
        If we change what we collect or how we use it, we&rsquo;ll update
        this page and the date at the top. We won&rsquo;t make a material
        change — like starting to sell data we previously said we wouldn&rsquo;t
        share — without being upfront about it here first.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <p>
        Questions about this policy or a request about your data can be
        sent to{" "}
        <a href="mailto:avanlog@orynticlabs.com" className="text-wire hover:underline">
          avanlog@orynticlabs.com
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="October 2026"
      intro={
        <p>
          This is a short, plain-language policy because this is a small
          site that collects very little. Every section below is also
          linked in the table of contents alongside it.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
