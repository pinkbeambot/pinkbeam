import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { DigitalTransformationClient } from "./DigitalTransformationClient";

export const metadata: Metadata = createMetadata({
  title: "Digital Transformation Consulting — Pink Beam Solutions",
  description:
    "Transform your business for the digital age. Strategic consulting to modernize operations, integrate technology, and drive sustainable growth.",
  path: "/solutions/services/digital-transformation",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Digital Transformation Consulting",
  description:
    "Comprehensive digital transformation services to modernize your business operations, integrate cutting-edge technology, and build a foundation for sustainable growth.",
  path: "/solutions/services/digital-transformation",
});

const webPageJsonLd = structuredData.webPage({
  title: "Digital Transformation Consulting — Pink Beam Solutions",
  description:
    "Transform your business for the digital age with strategic consulting that delivers measurable results.",
  path: "/solutions/services/digital-transformation",
  datePublished: "2026-02-10",
  dateModified: "2026-02-10",
});

export default function DigitalTransformationPage() {
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
      <DigitalTransformationClient />
    </>
  );
}
