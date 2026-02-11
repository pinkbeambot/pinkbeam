"use client";

import { DollarSign, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StaggerContainer, FadeIn } from "@/components/animations";

const pricingPlans = [
  {
    name: "Starter",
    price: "$500",
    employees: "1 AI Employee",
    description: "Perfect for trying out AI employees",
    features: [
      "Choose any 1 employee",
      "Standard support (24h response)",
      "Email delivery",
      "Basic analytics dashboard",
      "7-day data retention",
    ],
    popular: false,
    badge: "Best for trying out",
  },
  {
    name: "Growth",
    price: "$1,200",
    employees: "3 AI Employees",
    description: "Most popular for growing teams",
    features: [
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
    name: "Scale",
    price: "Custom",
    employees: "Unlimited",
    description: "For teams with 10+ employees",
    features: [
      "Unlimited AI employees",
      "Dedicated account manager",
      "Custom integrations",
      "99.9% uptime SLA",
      "On-premise deployment",
      "Custom AI training",
    ],
    popular: false,
    badge: "For teams 10+",
  },
];

export function PricingSection() {
  return (
    <section className="py-20 md:py-32 bg-surface-sunken">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-500/10 mb-6">
            <DollarSign className="w-7 h-7 text-pink-500" />
          </div>
          <h2 className="text-h2 font-display font-bold mb-4">
            Simple, Transparent{" "}
            <span className="text-gradient-beam">Pricing</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Hire AI employees for less than a single human salary. Start small, scale as you grow. No hidden fees, no surprises.
          </p>
        </FadeIn>

        {/* Pricing Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan, index) => (
            <FadeIn key={plan.name} delay={index * 0.1}>
              <Card
                variant={plan.popular ? "elevated" : "outlined"}
                className={`relative h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  plan.popular ? "ring-2 ring-pink-500/50" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0">
                    {plan.badge}
                  </Badge>
                )}
                <CardContent className="p-6 lg:p-8 flex flex-col h-full">
                  {/* Plan Header */}
                  <div className="mb-6">
                    <h3 className="text-h4 font-display font-bold mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-body text-muted-foreground mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-display font-bold">
                        {plan.price}
                      </span>
                      {plan.price !== "Custom" && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {plan.employees}
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                        <span className="text-body text-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    asChild
                    variant={plan.popular ? "beam" : "outline"}
                    className="w-full"
                  >
                    <Link href="/agents/pricing">
                      View All Plans
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </StaggerContainer>

        {/* CTA Section */}
        <FadeIn className="text-center">
          <p className="text-lead text-muted-foreground mb-6 max-w-2xl mx-auto">
            All plans include a 7-day free trial with full access to all features. No credit card required.
          </p>
          <Button asChild size="lg" variant="beam">
            <Link href="/agents/pricing">
              See Full Pricing & Compare Features
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
