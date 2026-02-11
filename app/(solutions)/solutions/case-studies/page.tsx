import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { CaseStudiesClient } from "./CaseStudiesClient";
import {
  getCaseStudies,
  getFilterOptions,
  INDUSTRIES,
  SERVICES,
  ENGAGEMENT_TYPES,
} from "@/lib/case-studies";

export const metadata: Metadata = createMetadata({
  title: "Case Studies — Proven Results for Real Businesses",
  description:
    "Explore how Pink Beam Solutions has helped organizations transform their operations, accelerate growth, and achieve measurable outcomes through strategic consulting and AI implementation.",
  path: "/solutions/case-studies",
});

// JSON-LD structured data
const webPageJsonLd = structuredData.webPage({
  title: "Case Studies — Proven Results for Real Businesses",
  description:
    "Explore how Pink Beam Solutions has helped organizations transform their operations and achieve measurable outcomes.",
  path: "/solutions/case-studies",
});

export default async function CaseStudiesPage() {
  // Fetch case studies and filter options
  const [caseStudies, filterOptions] = await Promise.all([
    getCaseStudies(),
    getFilterOptions(),
  ]);

  // Use defaults if no data yet
  const effectiveFilterOptions = {
    industries:
      filterOptions.industries.length > 0
        ? filterOptions.industries
        : INDUSTRIES,
    services:
      filterOptions.services.length > 0 ? filterOptions.services : SERVICES,
    engagementTypes:
      filterOptions.engagementTypes.length > 0
        ? filterOptions.engagementTypes
        : ENGAGEMENT_TYPES,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <CaseStudiesClient
        caseStudies={caseStudies}
        filterOptions={effectiveFilterOptions}
      />
    </>
  );
}
