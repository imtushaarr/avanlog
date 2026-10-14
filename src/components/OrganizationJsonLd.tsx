import type { Organization, Service, WithContext } from "schema-dts";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_LOGO, SOCIAL_LINKS, CONTACT_EMAIL } from "@/lib/site";

const organization: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: SITE_LOGO,
  description: SITE_DESCRIPTION,
  email: CONTACT_EMAIL,
  sameAs: SOCIAL_LINKS,
  parentOrganization: {
    "@type": "Organization",
    name: "Oryntic Labs Private Limited",
    url: "https://orynticlabs.com",
  },
};

const service: WithContext<Service> = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Cloud infrastructure and DevOps engineering",
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  areaServed: "Worldwide",
  description:
    "Cloud infrastructure engineering, DevOps and CI/CD automation, Kubernetes and container platforms, and managed production operations.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Avanlog services",
    itemListElement: [
      "Cloud Infrastructure & Architecture",
      "DevOps & Deployment Engineering",
      "Platform & Container Engineering",
      "Reliability & Managed Operations",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name,
      },
    })),
  },
};

export default function OrganizationJsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
    </>
  );
}
