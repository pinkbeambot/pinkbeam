import type { Metadata } from "next";
import { createMetadata, serviceMetadata, structuredData } from "@/lib/metadata";
import { Hero } from "./components/Hero";
import { CTASection } from "./components/CTASection";
import { WhoIsPinkBeamFor } from "@/components/sections/WhoIsPinkBeamFor";
import { HomeProblemSection } from "@/components/sections/HomeProblemSection";
import { ServicesShowcase } from "@/components/sections/ServicesShowcase";
import { HomeHowItWorks } from "@/components/sections/HomeHowItWorks";
import { HomePricingOverview } from "@/components/sections/HomePricingOverview";
import { HomeFAQSection } from "@/components/sections/HomeFAQSection";

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
        {/* Hero - Updated value proposition */}
        <Hero />

        {/* Problem - Universal business challenges */}
        <HomeProblemSection />

        {/* Services - Featured Agents + others */}
        <ServicesShowcase />

        {/* How It Works - 3-step platform explainer */}
        <HomeHowItWorks />

        {/* Who Is Pink Beam For - Audience segmentation */}
        <WhoIsPinkBeamFor />

        {/* Pricing - Service comparison */}
        <HomePricingOverview />

        {/* FAQ - Common questions */}
        <HomeFAQSection />

        {/* Final CTA - Service-specific options */}
        <CTASection />
      </main>
    </>
  );
}
