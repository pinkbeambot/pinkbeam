import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { ProjectsClient } from "./ProjectsClient";

export const metadata: Metadata = createMetadata({
  title: "Project-Based — End-to-End Delivery | Pink Beam Solutions",
  description:
    "End-to-end project delivery for strategic initiatives. Fixed fee, time & materials, or hybrid pricing. Full project lifecycle from discovery to delivery.",
  path: "/solutions/engagement/projects",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Project-Based Engagements",
  description:
    "Complete project delivery for strategic initiatives. Flexible pricing models: fixed fee, time & materials, or hybrid. Full lifecycle from discovery to delivery.",
  path: "/solutions/engagement/projects",
});

const webPageJsonLd = structuredData.webPage({
  title: "Project-Based Engagements — Pink Beam Solutions",
  description:
    "End-to-end project delivery for digital transformation, AI implementation, and technology initiatives. Fixed fee and T&M pricing options.",
  path: "/solutions/engagement/projects",
  datePublished: "2026-02-10",
  dateModified: "2026-02-10",
});

export default function ProjectsPage() {
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
      <ProjectsClient />
    </>
  );
}
