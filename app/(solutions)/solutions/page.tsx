import type { Metadata } from "next";
import { createMetadata, serviceMetadata, structuredData } from "@/lib/metadata";
import { SolutionsPageClient } from "./SolutionsPageClient";

export const metadata: Metadata = createMetadata(serviceMetadata.solutions);

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Solutions",
  description: "Strategic consulting to transform your business with AI and technology",
  path: "/solutions",
});

const webPageJsonLd = structuredData.webPage({
  title: "Solutions — Strategic Consulting",
  description: "Strategic consulting for digital transformation and AI adoption. Workshops, assessments, and ongoing advisory.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <>
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
