import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { ArchitecturePageClient } from "./ArchitecturePageClient";

export const metadata: Metadata = createMetadata({
  title: "Technical Architecture — Design Systems That Scale",
  description: "Expert system design and technical architecture. We architect robust solutions for complex challenges.",
  path: "/labs/architecture",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Technical Architecture",
  description: "Expert system design and technical architecture services",
  path: "/labs/architecture",
});

const webPageJsonLd = structuredData.webPage({
  title: "Technical Architecture — Design Systems That Scale",
  description: "Expert system design and technical architecture. We architect robust solutions for complex challenges.",
  path: "/labs/architecture",
});

export default function ArchitecturePage() {
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
      <ArchitecturePageClient />
    </>
  );
}
