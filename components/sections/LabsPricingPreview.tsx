"use client";

import { PricingPreviewSection } from "./PricingPreviewSection";

const pricingTiers = [
  {
    title: "Phase-Based",
    description: "Clear milestones, predictable costs",
    price: "$20k - $125k+",
    items: ["MVPs", "Full Systems", "Scalable Projects"],
  },
  {
    title: "Time & Materials",
    description: "Flexible scope, hourly transparency",
    price: "$125-175/hr",
    items: ["Complex Projects", "Evolving Requirements", "Hourly Teams"],
  },
  {
    title: "Retainer",
    description: "Dedicated capacity, long-term growth",
    price: "$7k - $45k/mo",
    items: ["Ongoing Support", "Feature Development", "Scaling Ops"],
  },
];

export function LabsPricingPreview() {
  return (
    <PricingPreviewSection
      title="Three Ways to Work With Us"
      subtitle="Choose the pricing model that fits your project scope and budget. All include transparent communication and weekly updates."
      tiers={pricingTiers}
      ctaText="View Complete Pricing"
      ctaDescription="Want to see detailed pricing ranges, project examples, and our ROI calculator?"
      ctaHref="/labs/pricing"
      accentColor="cyan"
    />
  );
}
