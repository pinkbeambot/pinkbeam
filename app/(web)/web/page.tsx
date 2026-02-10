import type { Metadata } from "next";
import { createMetadata, serviceMetadata, structuredData } from "@/lib/metadata";
import { WebPageClient } from "./WebPageClient";

export const metadata: Metadata = createMetadata(serviceMetadata.web);

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Web Services",
  description: "Professional website design, development, and SEO services",
  path: "/web",
});

const webPageJsonLd = structuredData.webPage({
  title: "Web Services — Website & SEO",
  description: "Professional website design, development, and SEO services. Fast, beautiful websites that convert.",
  path: "/web",
});

export default function WebPage() {
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
      <WebPageClient />
    </>
  );
}
