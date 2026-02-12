"use client";

import { FadeIn } from "@/components/animations";
import { FeatureComparisonTable } from "@/components/pricing/FeatureComparisonTable";
import type { FeatureComparison } from "@/components/pricing/FeatureComparisonTable";

const featureComparisons: FeatureComparison[] = [
  {
    feature: "Project Scope",
    "phase-based": "Fixed milestones",
    "t&m": "Flexible & evolving",
    retainer: "Ongoing capacity",
    tooltip: "How project scope is defined and managed",
  },
  {
    feature: "Pricing Structure",
    "phase-based": "Fixed per phase",
    "t&m": "Hourly rate",
    retainer: "Monthly flat fee",
    tooltip: "How you're billed for work",
  },
  {
    feature: "Best For",
    "phase-based": "Clear scope projects",
    "t&m": "Evolving requirements",
    retainer: "Long-term partnerships",
    tooltip: "Ideal use case for each pricing model",
  },
  {
    feature: "Timeline",
    "phase-based": "8-16 weeks",
    "t&m": "Flexible",
    retainer: "3+ months",
    tooltip: "Typical project duration",
  },
  {
    feature: "Minimum Commitment",
    "phase-based": "One phase",
    "t&m": "$4,997/month",
    retainer: "3 months",
    tooltip: "Minimum engagement period",
  },
  {
    feature: "Dedicated Team",
    "phase-based": false,
    "t&m": "Shared capacity",
    retainer: "Fully dedicated",
    tooltip: "Whether you get a dedicated development team",
  },
  {
    feature: "Scope Changes",
    "phase-based": "Requires new phase",
    "t&m": "Fully flexible",
    retainer: "Built into capacity",
    tooltip: "How scope changes are handled",
  },
  {
    feature: "Weekly Updates",
    "phase-based": true,
    "t&m": true,
    retainer: true,
    tooltip: "Regular progress reporting",
  },
  {
    feature: "Direct Communication",
    "phase-based": "Project manager",
    "t&m": "Direct with team",
    retainer: "Direct + manager",
    tooltip: "How you communicate with the development team",
  },
  {
    feature: "Post-Launch Support",
    "phase-based": "30 days included",
    "t&m": "Billed hourly",
    retainer: "Included",
    tooltip: "Support after project launches",
  },
  {
    feature: "Priority Access",
    "phase-based": false,
    "t&m": false,
    retainer: true,
    tooltip: "Priority response times and support",
  },
  {
    feature: "Quarterly Planning",
    "phase-based": false,
    "t&m": false,
    retainer: true,
    tooltip: "Strategic planning sessions included",
  },
];

export function LabsFeatureComparison() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Compare Pricing{" "}
            <span className="text-gradient-cyan">Models</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Understand what's included with each engagement model
          </p>
        </FadeIn>

        {/* Comparison Table */}
        <FadeIn delay={0.1}>
          <div className="max-w-5xl mx-auto">
            <FeatureComparisonTable
              features={featureComparisons}
              tiers={["Phase-Based", "T&M", "Retainer"]}
              popularTier="T&M"
              accentColor="cyan"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
