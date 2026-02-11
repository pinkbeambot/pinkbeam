import type { Metadata } from "next";
import { createMetadata, serviceMetadata, structuredData } from "@/lib/metadata";
import {
  Hero,
  ProblemSection,
  HowItWorks,
  EmployeeTabs,
  Testimonials,
  PricingSection,
  FAQ,
  FinalCTA,
} from "@/components/agents/sections";

export const metadata: Metadata = createMetadata({
  ...serviceMetadata.agents,
  title: "AI Employees — Hire AI Workers for $500/Month",
  description: "Build your AI workforce with Pink Beam. Hire AI employees for research, sales, support, content, and design starting at $500/month.",
});

// JSON-LD structured data
const webPageJsonLd = structuredData.webPage({
  title: "AI Employees — Hire AI Workers for $500/Month",
  description: "Build your AI workforce with Pink Beam. Hire AI employees for research, sales, support, content, and design starting at $500/month.",
  path: "/agents",
});

const serviceJsonLd = structuredData.service({
  name: "AI Employees",
  description: "AI-powered employees that work 24/7 for your business",
  path: "/agents",
});

const softwareJsonLd = structuredData.softwareApplication();

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <main className="min-h-screen">
        <Hero />
        <ProblemSection />
        <EmployeeTabs />
        <HowItWorks />
        <PricingSection />
        <Testimonials title="Why We Built Pink Beam Agents" />
        <FAQ />
        <FinalCTA />
      </main>
    </>
  );
}
