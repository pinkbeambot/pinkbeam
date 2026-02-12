"use client";

import { PricingPreviewSection } from "./PricingPreviewSection";

const engagementModels = [
  {
    title: "Workshops",
    description: "Intensive strategy sessions for quick alignment",
    price: "$1,997 - $7,997",
    items: ["AI Strategy", "Digital Transformation", "Process Mapping"],
  },
  {
    title: "Assessments",
    description: "Deep-dive analysis with actionable recommendations",
    price: "$7,997 - $19,997",
    items: ["AI Readiness", "Tech Audits", "Digital Maturity"],
  },
  {
    title: "Retainers",
    description: "Fractional CTO — ongoing strategic partnership",
    price: "$3,997 - $14,997/mo",
    items: ["Advisory", "Active Leadership", "Embedded CTO"],
  },
  {
    title: "Projects",
    description: "End-to-end strategy and implementation",
    price: "$24,997 - $497,000+",
    items: ["AI Implementation", "Transformation", "Modernization"],
  },
];

export function SolutionsPricingPreview() {
  return (
    <PricingPreviewSection
      title="Four Ways to Engage"
      subtitle="From a focused workshop to an embedded CTO — choose the engagement model that fits your stage and budget."
      tiers={engagementModels}
      ctaText="View Complete Pricing"
      ctaDescription="Want detailed breakdowns, comparison tables, and our consulting ROI calculator?"
      ctaHref="/solutions/pricing"
      accentColor="amber"
    />
  );
}
