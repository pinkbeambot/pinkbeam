import type { Metadata } from "next";
import { createMetadata, serviceMetadata, structuredData } from "@/lib/metadata";
import { Hero } from "./components/Hero";
import { ServicesSection } from "./components/ServicesSection";
import { CTASection } from "./components/CTASection";

export const metadata: Metadata = createMetadata(serviceMetadata.home);

// JSON-LD structured data
const organizationJsonLd = structuredData.organization();
const webPageJsonLd = structuredData.webPage({
  title: "Pink Beam — AI-Powered Business Solutions",
  description: "Pink Beam offers AI employees, website services, custom software development, and strategic consulting.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <main className="min-h-screen">
        <Hero />
        <ServicesSection />
        <CTASection />
      </main>
    </>
  );
}
