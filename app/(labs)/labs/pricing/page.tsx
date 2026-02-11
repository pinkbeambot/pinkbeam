import type { Metadata } from "next";
import { createMetadata, serviceMetadata, structuredData } from "@/lib/metadata";
import { LabsPricingPageClient } from "./LabsPricingPageClient";

export const metadata: Metadata = createMetadata({
  title: "Labs Pricing — Custom Software Development Costs",
  description: "Transparent pricing for custom software development. See our pricing models, project ranges, and ROI calculator for custom software projects.",
  path: "/labs/pricing",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Labs Pricing",
  description: "Custom software development pricing and models",
  path: "/labs/pricing",
});

export default function LabsPricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <LabsPricingPageClient />
    </>
  );
}
