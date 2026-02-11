"use client";

import { Calendar, TrendingUp, Zap } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { Card, CardContent } from "@/components/ui";

const models = [
  {
    icon: Calendar,
    title: "Phase-Based Pricing",
    description: "Clear milestones, predictable costs.",
    details: [
      "Discovery & Design: $5,000-10,000",
      "MVP/Phase 1: $25,000-50,000",
      "Full Production System: $75,000-150,000+",
      "Best for: Well-defined scope, startup MVPs",
      "Timeline: 8-16 weeks typically",
    ],
    color: "bg-cyan-500",
  },
  {
    icon: TrendingUp,
    title: "Time & Materials (T&M)",
    description: "Flexible scope, hourly transparency.",
    details: [
      "Senior Engineers: $150-200/hour",
      "Full Team (3-5 people): $25,000-35,000/month",
      "Retainer Minimum: $5,000/month",
      "Best for: Evolving requirements, complex projects",
      "Pay only for actual hours worked",
    ],
    color: "bg-cyan-400",
  },
  {
    icon: Zap,
    title: "Retainer Partnerships",
    description: "Dedicated capacity, long-term growth.",
    details: [
      "Dedicated Developer: $8,000-12,000/month",
      "Core Team (2-3 people): $15,000-25,000/month",
      "Full Team (4-6 people): $30,000-50,000/month",
      "Best for: Scaling operations, ongoing support",
      "Flexible capacity adjustments quarterly",
    ],
    color: "bg-cyan-300",
  },
];

export function LabsPricingModels() {
  return (
    <section className="py-20 md:py-32 bg-surface-sunken">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Three Ways to Work{" "}
            <span className="text-gradient-cyan">With Us</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Pick the pricing model that fits your project and budget. All models
            include transparent communication and weekly updates.
          </p>
        </FadeIn>

        {/* Pricing Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {models.map((model, idx) => {
            const Icon = model.icon;
            return (
              <FadeIn key={model.title} delay={0.05 + idx * 0.05}>
                <Card variant="elevated" className="h-full border-cyan-500/30">
                  <CardContent className="p-8 flex flex-col h-full">
                    {/* Icon */}
                    <div
                      className={`${model.color} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-h4 font-display font-bold text-foreground mb-2">
                      {model.title}
                    </h3>
                    <p className="text-body text-cyan-500 font-medium mb-6">
                      {model.description}
                    </p>

                    {/* Details */}
                    <ul className="space-y-3 flex-1">
                      {model.details.map((detail, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {detail.split(":")[0]}:
                          </span>{" "}
                          {detail.split(":")[1]}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>

        {/* Bottom Note */}
        <FadeIn delay={0.25} className="mt-12 p-8 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
          <p className="text-center text-body text-muted-foreground">
            <span className="font-semibold text-foreground">Not sure which model?</span> We recommend
            starting with Phase-Based for MVPs or T&M for complex projects. Once you're ready to scale,
            transition to a Retainer partnership.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
