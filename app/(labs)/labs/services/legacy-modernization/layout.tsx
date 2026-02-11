import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import LegacyModernizationPage from "./page";

export const metadata: Metadata = createMetadata({
  title: "Legacy Modernization",
  description: "Strategic migration and refactoring of legacy systems. Modernize without disruption using proven patterns and incremental approaches.",
  path: "/labs/services/legacy-modernization",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Legacy Modernization",
  description: "Legacy system modernization and migration services",
  path: "/labs/services/legacy-modernization",
});

const webPageJsonLd = structuredData.webPage({
  title: "Legacy Modernization Services",
  description: "Strategic migration and refactoring of legacy systems. Modernize without disruption using proven patterns and incremental approaches.",
  path: "/labs/services/legacy-modernization",
});

export default function Page() {
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
      <LegacyModernizationPage />
    </>
  );
}
