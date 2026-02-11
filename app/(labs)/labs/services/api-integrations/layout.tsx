import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import APIIntegrationsPage from "./page";

export const metadata: Metadata = createMetadata({
  title: "API & Integration Development",
  description: "Custom APIs, third-party integrations, and system connectivity. REST, GraphQL, webhooks, and enterprise integrations.",
  path: "/labs/services/api-integrations",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "API & Integration Development",
  description: "Custom API development and third-party system integration services",
  path: "/labs/services/api-integrations",
});

const webPageJsonLd = structuredData.webPage({
  title: "API & Integration Development Services",
  description: "Custom APIs, third-party integrations, and system connectivity. REST, GraphQL, webhooks, and enterprise integrations.",
  path: "/labs/services/api-integrations",
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
      <APIIntegrationsPage />
    </>
  );
}
