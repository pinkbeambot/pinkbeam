import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { SolutionsPricingPageClient } from "./SolutionsPricingPageClient";

export const metadata: Metadata = createMetadata({
  title: "Solutions Pricing — Strategic Consulting & Advisory",
  description:
    "Transparent pricing for strategic consulting. Workshops from $2,500, assessments from $10,000, fractional CTO retainers from $5,000/month.",
  path: "/solutions/pricing",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Solutions Pricing",
  description:
    "Strategic consulting pricing — workshops, assessments, retainers, and projects",
  path: "/solutions/pricing",
});

export default function SolutionsPricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <SolutionsPricingPageClient />
    </>
  );
}
