import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = createMetadata({
  title: "Insights — AI Strategy & Digital Transformation",
  description: "Strategic perspectives on AI adoption, digital transformation, and building technology that drives business growth.",
  path: "/solutions/blog",
});

// JSON-LD structured data
const webPageJsonLd = structuredData.webPage({
  title: "Insights — AI Strategy & Digital Transformation",
  description: "Strategic perspectives on AI adoption, digital transformation, and building technology that drives business growth.",
  path: "/solutions/blog",
});

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <BlogPageClient />
    </>
  );
}
