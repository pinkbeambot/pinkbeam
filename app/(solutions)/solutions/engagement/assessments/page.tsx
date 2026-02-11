import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { AssessmentsClient } from "./AssessmentsClient";

export const metadata: Metadata = createMetadata({
  title: "Assessments — Strategic Consulting | Pink Beam Solutions",
  description:
    "Comprehensive assessments to understand your current state and identify opportunities. AI readiness, digital maturity, process audits, and architecture reviews.",
  path: "/solutions/engagement/assessments",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Strategic Assessments",
  description:
    "In-depth assessments to evaluate AI readiness, digital maturity, processes, and technology architecture. Get actionable insights and clear recommendations.",
  path: "/solutions/engagement/assessments",
});

const webPageJsonLd = structuredData.webPage({
  title: "Strategic Assessments — Pink Beam Solutions",
  description:
    "Comprehensive business assessments including AI readiness, digital maturity, process automation audits, and technology architecture reviews.",
  path: "/solutions/engagement/assessments",
  datePublished: "2026-02-10",
  dateModified: "2026-02-10",
});

export default function AssessmentsPage() {
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
      <AssessmentsClient />
    </>
  );
}
