import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { GrowthStrategyClient } from "./GrowthStrategyClient";

export const metadata: Metadata = createMetadata({
  title: "Growth Strategy Consulting — Pink Beam Solutions",
  description:
    "Sustainable growth through strategic innovation. Develop data-driven growth strategies that leverage technology for scalable expansion.",
  path: "/solutions/services/growth-strategy",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Growth Strategy Consulting",
  description:
    "Strategic growth consulting to identify expansion opportunities, optimize digital channels, and build scalable growth engines powered by technology and data.",
  path: "/solutions/services/growth-strategy",
});

const webPageJsonLd = structuredData.webPage({
  title: "Growth Strategy Consulting — Pink Beam Solutions",
  description:
    "Develop sustainable growth strategies that combine market insight with technology-enabled execution for scalable business expansion.",
  path: "/solutions/services/growth-strategy",
  datePublished: "2026-02-10",
  dateModified: "2026-02-10",
});

export default function GrowthStrategyPage() {
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
      <GrowthStrategyClient />
    </>
  );
}
