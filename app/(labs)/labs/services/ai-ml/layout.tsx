import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import AIMLPage from "./page";

export const metadata: Metadata = createMetadata({
  title: "AI/ML Integration",
  description: "LLM integration, embeddings, intelligent automation, and custom machine learning solutions. Bring AI to your products and workflows.",
  path: "/labs/services/ai-ml",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "AI/ML Integration",
  description: "AI and machine learning integration services for intelligent applications",
  path: "/labs/services/ai-ml",
});

const webPageJsonLd = structuredData.webPage({
  title: "AI/ML Integration Services",
  description: "LLM integration, embeddings, intelligent automation, and custom machine learning solutions. Bring AI to your products and workflows.",
  path: "/labs/services/ai-ml",
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
      <AIMLPage />
    </>
  );
}
