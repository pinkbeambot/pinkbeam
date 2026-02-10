import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { DesignPageClient } from "./DesignPageClient";

export const metadata: Metadata = createMetadata({
  title: "Web Design & Development",
  description: "Custom websites built for your business. Beautiful design, fast performance, and SEO-optimized. No templates, just results.",
  path: "/web/design",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Web Design & Development",
  description: "Custom websites built specifically for your business needs",
  path: "/web/design",
});

const webPageJsonLd = structuredData.webPage({
  title: "Web Design & Development Services",
  description: "Custom websites built for your business. Beautiful design, fast performance, and SEO-optimized.",
  path: "/web/design",
});

export default function DesignPage() {
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
      <DesignPageClient />
    </>
  );
}
