"use client";

import Link from "next/link";
import { FadeIn } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui";
import {
  ArrowRight,
  Check,
  Lightbulb,
  Search,
  Users,
  Rocket,
} from "lucide-react";

const models = [
  {
    name: "Workshops",
    icon: Lightbulb,
    tagline: "Quick clarity, fast alignment",
    price: "$2,500 - $10,000",
    duration: "Half-day to multi-day",
    description:
      "Intensive strategy sessions that get your team aligned and give you a clear action plan. Perfect for kicking off new initiatives or unblocking stalled ones.",
    features: [
      "Pre-session preparation & research",
      "Expert-facilitated working sessions",
      "Custom materials & frameworks",
      "Documented action plan",
      "30-day follow-up support",
    ],
    idealFor: [
      "AI opportunity mapping",
      "Digital transformation kickoff",
      "Process mapping & optimization",
      "Technology stack review",
    ],
    popular: false,
  },
  {
    name: "Assessments",
    icon: Search,
    tagline: "Deep-dive analysis with a roadmap",
    price: "$10,000 - $25,000",
    duration: "2-3 weeks",
    description:
      "Comprehensive evaluation of your technology, processes, and opportunities. You get a detailed report with specific, prioritized recommendations.",
    features: [
      "Stakeholder interviews",
      "Technology & process audit",
      "Competitive landscape analysis",
      "Prioritized recommendation report",
      "Implementation roadmap",
      "Executive presentation",
    ],
    idealFor: [
      "AI readiness evaluation",
      "Digital maturity assessment",
      "Technology architecture review",
      "Process automation audit",
    ],
    popular: true,
  },
  {
    name: "Retainers",
    icon: Users,
    tagline: "Fractional CTO on your team",
    price: "$5,000 - $20,000/mo",
    duration: "Monthly (no long-term contract)",
    description:
      "Ongoing strategic partnership with senior technology leadership. Like having a CTO on speed dial without the $300K+ salary.",
    features: [
      "Monthly strategy sessions",
      "Priority Slack/email access",
      "Quarterly business reviews",
      "Team mentorship & guidance",
      "Vendor evaluation & negotiation",
      "Board/investor prep support",
    ],
    idealFor: [
      "Companies without a CTO",
      "Scaling startups needing guidance",
      "Pre-acquisition tech due diligence",
      "Ongoing technology leadership",
    ],
    popular: false,
  },
  {
    name: "Projects",
    icon: Rocket,
    tagline: "End-to-end strategy & execution",
    price: "$30,000 - $500,000+",
    duration: "2-12 months",
    description:
      "Complete strategic initiatives from discovery through implementation. Dedicated team, milestone-based delivery, measurable outcomes.",
    features: [
      "Dedicated project lead",
      "Full discovery & strategy phase",
      "Implementation oversight",
      "Change management support",
      "Knowledge transfer",
      "Post-launch optimization",
    ],
    idealFor: [
      "AI implementation programs",
      "Digital transformation initiatives",
      "Technology modernization",
      "Organizational restructuring",
    ],
    popular: false,
  },
];

export function SolutionsPricingModels() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Engagement{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Models
            </span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Each model is designed for a different stage of your journey. Most
            clients start with a workshop or assessment and evolve into a
            retainer.
          </p>
        </FadeIn>

        {/* Model Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {models.map((model, idx) => {
            const Icon = model.icon;
            return (
              <FadeIn key={model.name} delay={0.05 + idx * 0.05}>
                <Card
                  variant="elevated"
                  className={`h-full ${
                    model.popular
                      ? "border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/5 to-amber-600/5"
                      : "border border-border"
                  }`}
                >
                  <CardContent className="p-8 md:p-10">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-amber-500/10 w-12 h-12 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="text-h3 font-display font-bold text-foreground">
                            {model.name}
                          </h3>
                          <p className="text-sm text-amber-500 font-medium">
                            {model.tagline}
                          </p>
                        </div>
                      </div>
                      {model.popular && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 whitespace-nowrap">
                          Most Popular
                        </Badge>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-2xl font-bold text-foreground">
                        {model.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {model.duration}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-body text-muted-foreground mb-6">
                      {model.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-foreground mb-3">
                        What&apos;s included:
                      </p>
                      <ul className="space-y-2">
                        {model.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Ideal For */}
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-3">
                        Ideal for:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {model.idealFor.map((item) => (
                          <span
                            key={item}
                            className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>

        {/* CTA */}
        <FadeIn delay={0.3} className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90"
            asChild
          >
            <Link href="/contact">
              Discuss Your Needs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
