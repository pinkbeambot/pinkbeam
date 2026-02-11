import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { AugmentationPageClient } from "./AugmentationPageClient";

export const metadata: Metadata = createMetadata({
  title: "Team Augmentation — Scale Your Engineering Team",
  description: "Senior engineers that integrate with your team. Flexible engagement, code review, mentorship, and agile collaboration.",
  path: "/labs/augmentation",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Team Augmentation",
  description: "Senior engineers to augment your development team",
  path: "/labs/augmentation",
});

const webPageJsonLd = structuredData.webPage({
  title: "Team Augmentation — Scale Your Engineering Team",
  description: "Senior engineers that integrate with your team. Flexible engagement, code review, mentorship, and agile collaboration.",
  path: "/labs/augmentation",
});

export default function AugmentationPage() {
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
      <AugmentationPageClient />
    </>
  );
}
