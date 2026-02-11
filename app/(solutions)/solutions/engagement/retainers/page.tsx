import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { RetainersClient } from "./RetainersClient";

export const metadata: Metadata = createMetadata({
  title: "Retainers — Fractional CTO/CIO | Pink Beam Solutions",
  description:
    "Fractional CTO and CIO expertise on retainer. Advisory, active, and embedded engagement tiers to match your needs. Ongoing strategic partnership.",
  path: "/solutions/engagement/retainers",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Fractional CTO/CIO Retainers",
  description:
    "Ongoing strategic partnership with fractional CTO and CIO expertise. Three tiers: Advisory (10 hrs/mo), Active (20 hrs/mo), and Embedded (40 hrs/mo).",
  path: "/solutions/engagement/retainers",
});

const webPageJsonLd = structuredData.webPage({
  title: "Fractional CTO/CIO Retainers — Pink Beam Solutions",
  description:
    "Get executive-level technology leadership without the full-time hire. Flexible retainer tiers for ongoing strategic guidance.",
  path: "/solutions/engagement/retainers",
  datePublished: "2026-02-10",
  dateModified: "2026-02-10",
});

export default function RetainersPage() {
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
      <RetainersClient />
    </>
  );
}
