import type { Metadata } from "next";
import { createMetadata, serviceMetadata, structuredData } from "@/lib/metadata";
import { LabsPageClient } from "./LabsPageClient";

export const metadata: Metadata = createMetadata(serviceMetadata.labs);

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Labs",
  description: "Custom software development for complex business challenges",
  path: "/labs",
});

const webPageJsonLd = structuredData.webPage({
  title: "Labs — Custom Software Development",
  description: "Custom software development for startups and enterprises. Web apps, mobile apps, APIs, and AI solutions.",
  path: "/labs",
});

export default function LabsPage() {
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
      <LabsPageClient />
    </>
  );
}
