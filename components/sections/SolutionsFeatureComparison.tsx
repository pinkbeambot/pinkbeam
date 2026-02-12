"use client";

import { FadeIn } from "@/components/animations";
import { FeatureComparisonTable } from "@/components/pricing/FeatureComparisonTable";
import type { FeatureComparison } from "@/components/pricing/FeatureComparisonTable";

const featureComparisons: FeatureComparison[] = [
  {
    feature: "Engagement Type",
    workshops: "One-time session",
    assessments: "Deep-dive analysis",
    retainers: "Ongoing advisory",
    projects: "Defined initiative",
    tooltip: "Nature of the engagement",
  },
  {
    feature: "Duration",
    workshops: "1 day",
    assessments: "2-4 weeks",
    retainers: "3+ months",
    projects: "Varies by scope",
    tooltip: "Typical engagement length",
  },
  {
    feature: "Investment Level",
    workshops: "$2,497-4,997",
    assessments: "$9,997-24,997",
    retainers: "$4,997-19,997/mo",
    projects: "$14,997-99,997+",
    tooltip: "Typical price range",
  },
  {
    feature: "Deliverables",
    workshops: "Action plan",
    assessments: "Full report + roadmap",
    retainers: "Ongoing guidance",
    projects: "Implementation",
    tooltip: "What you receive",
  },
  {
    feature: "Best For",
    workshops: "Quick alignment",
    assessments: "Strategic planning",
    retainers: "Continuous support",
    projects: "Major initiatives",
    tooltip: "Ideal use case",
  },
  {
    feature: "Team Involvement",
    workshops: "Leadership team",
    assessments: "Stakeholders + team",
    retainers: "Leadership + teams",
    projects: "Full organization",
    tooltip: "Who participates from your side",
  },
  {
    feature: "Strategic Guidance",
    workshops: "Framework",
    assessments: "Detailed strategy",
    retainers: "Continuous refinement",
    projects: "Implementation plan",
    tooltip: "Level of strategic direction provided",
  },
  {
    feature: "Implementation Support",
    workshops: false,
    assessments: "Recommendations",
    retainers: "Direct support",
    projects: "Full execution",
    tooltip: "Help with executing the strategy",
  },
  {
    feature: "Follow-up Sessions",
    workshops: "Optional",
    assessments: "2 included",
    retainers: "Weekly/bi-weekly",
    projects: "As needed",
    tooltip: "Ongoing check-ins after initial engagement",
  },
  {
    feature: "Priority Access",
    workshops: false,
    assessments: false,
    retainers: true,
    projects: "During project",
    tooltip: "Priority response and support",
  },
  {
    feature: "Custom Research",
    workshops: false,
    assessments: "Included",
    retainers: "Included",
    projects: "As needed",
    tooltip: "Market research and competitive analysis",
  },
  {
    feature: "Quarterly Reviews",
    workshops: false,
    assessments: false,
    retainers: true,
    projects: false,
    tooltip: "Strategic planning and progress reviews",
  },
];

export function SolutionsFeatureComparison() {
  return (
    <section className="py-20 md:py-32 bg-surface-sunken">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Compare{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Engagement Models
            </span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Understand what's included with each type of engagement
          </p>
        </FadeIn>

        {/* Comparison Table */}
        <FadeIn delay={0.1}>
          <div className="max-w-6xl mx-auto">
            <FeatureComparisonTable
              features={featureComparisons}
              tiers={["Workshops", "Assessments", "Retainers", "Projects"]}
              popularTier="Assessments"
              accentColor="amber"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
