"use client";

import { PricingPreviewSection } from "./PricingPreviewSection";

const pricingTiers = [
  {
    title: "Starter",
    description: "Perfect for small businesses",
    price: "$2,000",
    items: ["5-page website", "Mobile responsive", "Basic SEO", "1 month support"],
  },
  {
    title: "Professional",
    description: "For growing companies",
    price: "$5,000",
    items: ["10-page website", "Advanced SEO", "Analytics dashboard", "3 months support", "Blog setup"],
    popular: true,
    badge: "Most Popular",
  },
  {
    title: "Enterprise",
    description: "Custom solutions",
    price: "$10,000+",
    items: ["Unlimited pages", "Custom functionality", "Priority support", "12 months support", "Dedicated manager"],
  },
];

export function WebPricingPreview() {
  return (
    <PricingPreviewSection
      title="Simple Pricing"
      subtitle="Get a ballpark estimate below, or use our calculator for more details"
      tiers={pricingTiers}
      ctaText="Use Pricing Calculator"
      ctaDescription="Need exact pricing? Use our pricing calculator to get a detailed estimate"
      ctaHref="/web/pricing"
      accentColor="violet"
    />
  );
}
