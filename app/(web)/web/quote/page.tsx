import type { Metadata } from "next";
import { Suspense } from "react";
import { createMetadata, structuredData } from "@/lib/metadata";
import { QuotePageClient } from "./QuotePageClient";

export const metadata: Metadata = createMetadata({
  title: "Request a Quote",
  description: "Get a custom quote for your web design, development, or SEO project. Fill out our simple form and we'll get back to you within 24 hours.",
  path: "/web/quote",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Quote Request",
  description: "Get a custom quote for your web project",
  path: "/web/quote",
});

const webPageJsonLd = structuredData.webPage({
  title: "Request a Quote",
  description: "Get a custom quote for your web design, development, or SEO project.",
  path: "/web/quote",
});

export default function QuotePage() {
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
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <QuotePageClient />
      </Suspense>
    </>
  );
}
