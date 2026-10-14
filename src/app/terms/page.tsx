import type { Metadata } from "next";
import LegalLayout, { type LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Use — Avanlog",
  description: "The terms that apply to using the Avanlog website.",
  alternates: { canonical: "/terms" },
};

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    heading: "Acceptance of these terms",
    body: (
      <p>
        By browsing avanlog.orynticlabs.com or submitting the contact form, you agree
        to these terms. If you don&rsquo;t agree with them, the only
        request we&rsquo;d make is that you not use the site — there&rsquo;s
        no account to create or agreement to sign just to look around.
      </p>
    ),
  },
  {
    id: "who-we-are",
    heading: "Who we are",
    body: (
      <p>
        Avanlog is a specialized subsidiary of Oryntic Labs Private
        Limited. These terms cover your use of this website. They do not
        cover any separate statement of work or service agreement we sign
        with you to design, build, or operate your infrastructure —
        that&rsquo;s its own contract with its own terms, agreed
        individually per engagement.
      </p>
    ),
  },
  {
    id: "using-this-site",
    heading: "Using this site",
    body: (
      <>
        <p>
          You&rsquo;re welcome to browse this site freely and use the
          contact form to reach us about a project. In return, please
          don&rsquo;t:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Use the contact form to send spam or unsolicited advertising</li>
          <li>Attempt to probe, scan, or test the security of this site or our infrastructure without permission</li>
          <li>Misrepresent your identity or who you represent when contacting us</li>
          <li>Scrape or republish the site&rsquo;s content at scale without asking first</li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    heading: "Intellectual property",
    body: (
      <p>
        The content on this site — the copy, the design, the Avanlog name
        and logo — belongs to Avanlog and Oryntic Labs Private Limited,
        unless stated otherwise. You&rsquo;re welcome to link to this site;
        you don&rsquo;t have permission to copy the design or copy large
        portions of the text for your own commercial use.
      </p>
    ),
  },
  {
    id: "third-party-links",
    heading: "Third-party links",
    body: (
      <p>
        This site links to pages we don&rsquo;t control — Oryntic
        Labs&rsquo; social media profiles and website, and the technology
        vendors mentioned in the services and technology sections. We
        aren&rsquo;t responsible for the content, availability, or
        practices of those external sites.
      </p>
    ),
  },
  {
    id: "no-warranty",
    heading: "No warranty",
    body: (
      <p>
        This website, and the information on it, is provided as-is. While
        we try to keep it accurate and up to date, we don&rsquo;t guarantee
        it&rsquo;s free of errors or that the site will always be available
        without interruption. Nothing on this site is a substitute for a
        scoped conversation about your specific infrastructure — treat it
        as a starting point, not a commitment, until we&rsquo;ve actually
        talked.
      </p>
    ),
  },
  {
    id: "limitation-of-liability",
    heading: "Limitation of liability",
    body: (
      <p>
        To the extent permitted by law, Avanlog and Oryntic Labs Private
        Limited aren&rsquo;t liable for any indirect, incidental, or
        consequential loss arising from your use of this website. This
        section doesn&rsquo;t limit liability that can&rsquo;t be limited
        under applicable law, and it has no bearing on the separate
        liability terms in an actual client services agreement.
      </p>
    ),
  },
  {
    id: "governing-law",
    heading: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of India, without regard to
        its conflict of law principles. Any dispute arising from your use
        of this website will be handled in the courts with jurisdiction
        over Oryntic Labs Private Limited.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to these terms",
    body: (
      <p>
        We may update these terms as the site changes. The date at the top
        of this page reflects the most recent revision — if you keep using
        the site after an update, that means you&rsquo;re accepting the
        current version.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <p>
        Questions about these terms can be sent to{" "}
        <a href="mailto:avanlog@orynticlabs.com" className="text-wire hover:underline">
          avanlog@orynticlabs.com
        </a>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Use"
      lastUpdated="October 2026"
      intro={
        <p>
          These terms cover your use of this website only. They&rsquo;re
          written to be read, not just stored — if anything here is
          unclear, the contact section at the end goes straight to a real
          inbox.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
