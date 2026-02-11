"use client";

import Link from "next/link";
import { FadeIn } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui";
import { ArrowRight, DollarSign } from "lucide-react";

const pricingTiers = [
  {
    title: "Phase-Based",
    description: "Clear milestones, predictable costs",
    price: "$25k - $150k+",
    examples: ["MVPs", "Full Systems", "Scalable Projects"],
    color: "bg-cyan-500",
  },
  {
    title: "Time & Materials",
    description: "Flexible scope, hourly transparency",
    price: "$150-200/hr",
    examples: ["Complex Projects", "Evolving Requirements", "Hourly Teams"],
    color: "bg-cyan-400",
  },
  {
    title: "Retainer",
    description: "Dedicated capacity, long-term growth",
    price: "$8k - $50k/mo",
    examples: ["Ongoing Support", "Feature Development", "Scaling Ops"],
    color: "bg-cyan-300",
  },
];

export function LabsPricingPreview() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <DollarSign className="w-4 h-4 text-cyan-500" />
            <span className="text-sm font-medium text-cyan-500">Transparent Pricing</span>
          </div>
          <h2 className="text-h2 font-display font-bold mb-4">
            Three Ways to{" "}
            <span className="text-gradient-cyan">Work With Us</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Choose the pricing model that fits your project scope and budget.
            All include transparent communication and weekly updates.
          </p>
        </FadeIn>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {pricingTiers.map((tier, idx) => (
            <FadeIn key={tier.title} delay={0.05 + idx * 0.05}>
              <Card variant="elevated" className="h-full border-cyan-500/30">
                <CardContent className="p-8 flex flex-col h-full">
                  <h3 className="text-h4 font-display font-bold text-foreground mb-2">
                    {tier.title}
                  </h3>
                  <p className="text-body text-cyan-500 font-medium mb-4">
                    {tier.description}
                  </p>
                  <p className="text-2xl font-bold text-foreground mb-6">
                    {tier.price}
                  </p>
                  <ul className="space-y-2 flex-1">
                    {tier.examples.map((example) => (
                      <li
                        key={example}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${tier.color}`} />
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
            Want to see detailed pricing ranges, project examples, and our ROI calculator?
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90"
            asChild
          >
            <Link href="/labs/pricing">
              View Complete Pricing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
