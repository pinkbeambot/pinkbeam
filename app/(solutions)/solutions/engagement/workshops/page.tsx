import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { WorkshopsClient } from "./WorkshopsClient";

export const metadata: Metadata = createMetadata({
  title: "Workshops — Strategic Consulting | Pink Beam Solutions",
  description:
    "Intensive workshops for immediate business impact. AI strategy, digital transformation, process automation, and technology stack reviews. Half-day to multi-day formats.",
  path: "/solutions/engagement/workshops",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Strategic Workshops",
  description:
    "Intensive workshops designed to accelerate decision-making and create immediate business impact. Available in half-day, full-day, and multi-day formats.",
  path: "/solutions/engagement/workshops",
});

const webPageJsonLd = structuredData.webPage({
  title: "Strategic Workshops — Pink Beam Solutions",
  description:
    "Intensive workshops for AI strategy, digital transformation, process automation, and technology stack review. Book your workshop today.",
  path: "/solutions/engagement/workshops",
  datePublished: "2026-02-10",
  dateModified: "2026-02-10",
});

export default function WorkshopsPage() {
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
      <WorkshopsClient />
    </>
  );
}
