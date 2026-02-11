import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = createMetadata({
  title: "Blog — Web Design, Development & SEO Insights",
  description: "Tips, guides, and insights on web design, development, SEO, and digital strategy from the Pink Beam team.",
  path: "/web/blog",
});

// JSON-LD structured data
const webPageJsonLd = structuredData.webPage({
  title: "Blog — Web Design, Development & SEO Insights",
  description: "Tips, guides, and insights on web design, development, SEO, and digital strategy.",
  path: "/web/blog",
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
