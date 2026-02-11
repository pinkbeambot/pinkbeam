import type { Metadata } from "next";
import { createMetadata, serviceMetadata, structuredData } from "@/lib/metadata";
import { SolutionsPageClient } from "./SolutionsPageClient";

export const metadata: Metadata = createMetadata(serviceMetadata.solutions);

// JSON-LD structured data
const organizationJsonLd = structuredData.organization();

const serviceJsonLd = {
  ...structuredData.service({
    name: "Strategic Consulting Solutions",
    description: "Strategic consulting to transform your business with AI and technology. We help you discover opportunities, design solutions, and deliver results.",
    path: "/solutions",
  }),
  areaServed: {
    "@type": "Place",
    name: "Global",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Consulting Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI Strategy",
          description: "Develop a comprehensive AI roadmap tailored to your business goals",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Process Automation",
          description: "Identify and automate repetitive workflows",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Digital Transformation",
          description: "Guide your organization through comprehensive digital transformation",
        },
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "50",
    bestRating: "5",
  },
};

const webPageJsonLd = structuredData.webPage({
  title: "Solutions — Strategic Consulting",
  description: "Strategic consulting for digital transformation and AI adoption. Workshops, assessments, and ongoing advisory to transform your business with technology.",
  path: "/solutions",
  datePublished: "2026-02-10",
  dateModified: "2026-02-10",
});

export default function SolutionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <SolutionsPageClient />
    </>
  );
}
