import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { TechnologyArchitectureClient } from "./TechnologyArchitectureClient";

export const metadata: Metadata = createMetadata({
  title: "Technology Architecture Consulting — Pink Beam Solutions",
  description:
    "Build systems that scale with your ambition. Modernize your technology architecture for performance, reliability, and future growth.",
  path: "/solutions/services/technology-architecture",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Technology Architecture Consulting",
  description:
    "Strategic technology architecture services to modernize legacy systems, design scalable infrastructure, implement secure integration patterns, and plan seamless migrations.",
  path: "/solutions/services/technology-architecture",
});

const webPageJsonLd = structuredData.webPage({
  title: "Technology Architecture Consulting — Pink Beam Solutions",
  description:
    "Build scalable, secure, and modern technology architectures that support your business growth and digital transformation initiatives.",
  path: "/solutions/services/technology-architecture",
  datePublished: "2026-02-10",
  dateModified: "2026-02-10",
});

export default function TechnologyArchitecturePage() {
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
      <TechnologyArchitectureClient />
    </>
  );
}
