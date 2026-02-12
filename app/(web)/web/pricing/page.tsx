import type { Metadata } from "next";
import { Suspense } from "react";
import { createMetadata, structuredData } from "@/lib/metadata";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { PricingPageClient } from "./PricingPageClient";

export const metadata: Metadata = createMetadata({
  title: "Pricing",
  description: "Transparent pricing for web design, development, and maintenance. Use our project calculator for an instant estimate.",
  path: "/web/pricing",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Web Services Pricing",
  description: "Transparent pricing for web design, development, and maintenance",
  path: "/web/pricing",
});

const webPageJsonLd = structuredData.webPage({
  title: "Web Services Pricing",
  description: "Transparent pricing for web design, development, and maintenance. Use our project calculator for an instant estimate.",
  path: "/web/pricing",
});

export default function PricingPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pinkbeam.io/" },
          { name: "Web Services", item: "https://pinkbeam.io/web" },
          { name: "Pricing", item: "https://pinkbeam.io/web/pricing" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <PricingPageClient />
      </Suspense>
    </>
  );
}
