"use client";

import { PricingPreviewSection } from "@/components/sections/PricingPreviewSection";

const pricingPlans = [
  {
    title: "Starter",
    description: "Perfect for trying out AI employees",
    price: "$500/month",
    items: [
      "Choose any 1 employee",
      "Standard support (24h response)",
      "Email delivery",
      "Basic analytics dashboard",
      "7-day data retention",
    ],
    badge: "Best for trying out",
  },
  {
    title: "Growth",
    description: "Most popular for growing teams",
    price: "$1,200/month",
    items: [
      "Mix and match any 3 employees",
      "Priority support (4h response)",
      "Slack + Email delivery",
      "Advanced analytics & reports",
      "API access",
      "30-day data retention",
    ],
    popular: true,
    badge: "Most Popular",
  },
  {
    title: "Scale",
    description: "For teams with 10+ employees",
    price: "Custom",
    items: [
      "Unlimited AI employees",
      "Dedicated account manager",
      "Custom integrations",
      "99.9% uptime SLA",
      "On-premise deployment",
      "Custom AI training",
    ],
    badge: "For teams 10+",
  },
];

export function PricingSection() {
  return (
    <PricingPreviewSection
      title="Simple, Transparent Pricing"
      subtitle="Hire AI employees for less than a single human salary. Start small, scale as you grow. No hidden fees, no surprises."
      tiers={pricingPlans}
      ctaText="View All Plans"
      ctaDescription="All plans include a 7-day free trial with full access to all features. No credit card required."
      ctaHref="/agents/pricing"
      accentColor="pink"
    />
  );
}
