"use client";

import { SolutionsHero } from "./components/SolutionsHero";
import { SocialProofSection } from "./components/SocialProofSection";
import { ServicesSection } from "./components/ServicesSection";
import { ProcessSection } from "./components/ProcessSection";
import { EngagementSection } from "./components/EngagementSection";
import { DifferentiationSection } from "./components/DifferentiationSection";
import { CaseStudyPreview } from "./components/CaseStudyPreview";
import { CTASection } from "./components/CTASection";

export function SolutionsPageClient() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <SolutionsHero />

      {/* Social Proof - Client logos, stats, trust indicators */}
      <SocialProofSection />

      {/* Services Overview */}
      <ServicesSection />

      {/* Differentiation - Why Pink Beam */}
      <DifferentiationSection />

      {/* Process Section - Discover → Design → Deliver */}
      <ProcessSection />

      {/* Engagement Options */}
      <EngagementSection />

      {/* Case Study Preview */}
      <CaseStudyPreview />

      {/* Final CTA */}
      <CTASection />
    </main>
  );
}
