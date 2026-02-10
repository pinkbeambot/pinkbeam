import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { SEOPageClient } from "./SEOPageClient";

export const metadata: Metadata = createMetadata({
  title: "SEO Services",
  description: "Technical SEO, content strategy, and ongoing optimization. Improve your rankings and drive organic traffic.",
  path: "/web/seo",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "SEO Services",
  description: "Technical SEO, content strategy, and ongoing optimization",
  path: "/web/seo",
});

const webPageJsonLd = structuredData.webPage({
  title: "SEO Services",
  description: "Technical SEO, content strategy, and ongoing optimization. Improve your rankings and drive organic traffic.",
  path: "/web/seo",
});

export default function SEOPage() {
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
      <SEOPageClient />
    </>
  );
}
