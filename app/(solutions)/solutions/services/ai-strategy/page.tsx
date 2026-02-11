import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { AIStrategyClient } from "./AIStrategyClient";

export const metadata: Metadata = createMetadata({
  title: "AI Strategy Consulting — Pink Beam Solutions",
  description:
    "AI that actually works for your business. Develop a comprehensive AI roadmap tailored to your goals, with responsible implementation and measurable ROI.",
  path: "/solutions/services/ai-strategy",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "AI Strategy Consulting",
  description:
    "Strategic AI consulting to help businesses develop comprehensive AI roadmaps, identify high-impact use cases, and implement responsible AI solutions with measurable ROI.",
  path: "/solutions/services/ai-strategy",
});

const webPageJsonLd = structuredData.webPage({
  title: "AI Strategy Consulting — Pink Beam Solutions",
  description:
    "Develop a comprehensive AI strategy that delivers real business results. From readiness assessment to implementation roadmap.",
  path: "/solutions/services/ai-strategy",
  datePublished: "2026-02-10",
  dateModified: "2026-02-10",
});

export default function AIStrategyPage() {
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
      <AIStrategyClient />
    </>
  );
}
