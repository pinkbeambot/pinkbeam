"use client";

import Link from "next/link";
import { FadeIn } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui";
import { ArrowRight, DollarSign } from "lucide-react";

const engagementModels = [
  {
    title: "Workshops",
    description: "Intensive strategy sessions for quick alignment",
    price: "$1,997 - $7,997",
    examples: ["AI Strategy", "Digital Transformation", "Process Mapping"],
    color: "bg-amber-500",
  },
  {
    title: "Assessments",
    description: "Deep-dive analysis with actionable recommendations",
    price: "$7,997 - $19,997",
    examples: ["AI Readiness", "Tech Audits", "Digital Maturity"],
    color: "bg-amber-400",
  },
  {
    title: "Retainers",
    description: "Fractional CTO — ongoing strategic partnership",
    price: "$3,997 - $14,997/mo",
    examples: ["Advisory", "Active Leadership", "Embedded CTO"],
    color: "bg-amber-300",
  },
  {
    title: "Projects",
    description: "End-to-end strategy and implementation",
    price: "$24,997 - $497,000+",
    examples: ["AI Implementation", "Transformation", "Modernization"],
    color: "bg-orange-500",
  },
];

export function SolutionsPricingPreview() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">
              Transparent Pricing
            </span>
          </div>
          <h2 className="text-h2 font-display font-bold mb-4">
            Four Ways to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Engage
            </span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            From a focused workshop to an embedded CTO — choose the engagement
            model that fits your stage and budget.
          </p>
        </FadeIn>

        {/* Engagement Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {engagementModels.map((model, idx) => (
            <FadeIn key={model.title} delay={0.05 + idx * 0.05}>
              <Card variant="elevated" className="h-full border-amber-500/30">
                <CardContent className="p-8 flex flex-col h-full">
                  <h3 className="text-h4 font-display font-bold text-foreground mb-2">
                    {model.title}
                  </h3>
                  <p className="text-body text-amber-500 font-medium mb-4">
                    {model.description}
                  </p>
                  <p className="text-2xl font-bold text-foreground mb-6">
                    {model.price}
                  </p>
                  <ul className="space-y-2 flex-1">
                    {model.examples.map((example) => (
                      <li
                        key={example}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${model.color}`}
                        />
                        {example}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* CTA to full pricing page */}
        <FadeIn delay={0.2} className="text-center">
          <p className="text-body text-muted-foreground mb-6">
            Want detailed breakdowns, comparison tables, and our consulting ROI
            calculator?
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90"
            asChild
          >
            <Link href="/solutions/pricing">
              View Complete Pricing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
