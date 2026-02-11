import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { EngagementClient } from "./EngagementClient";

export const metadata: Metadata = createMetadata({
  title: "How We Work — Engagement Models | Pink Beam Solutions",
  description:
    "Choose how you work with Pink Beam: Workshops, Assessments, Retainers, or Project-Based. Compare engagement models and find the right fit for your needs.",
  path: "/solutions/engagement",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Engagement Models",
  description:
    "Flexible engagement options: Workshops for immediate impact, Assessments for clarity, Retainers for ongoing partnership, and Project-Based for end-to-end delivery.",
  path: "/solutions/engagement",
});

const webPageJsonLd = structuredData.webPage({
  title: "How We Work — Pink Beam Solutions",
  description:
    "Explore Pink Beam's engagement models: workshops, assessments, retainers, and project-based work. Find the right way to work with us.",
  path: "/solutions/engagement",
  datePublished: "2026-02-10",
  dateModified: "2026-02-10",
});

export default function EngagementPage() {
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
      <EngagementClient />
    </>
  );
}
