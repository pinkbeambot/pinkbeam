"use client";

import Link from "next/link";
import { Zap, Code, Lightbulb, Briefcase, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { FadeIn } from "@/components/animations";

const pricingData = [
  {
    name: "AI Employees",
    icon: Zap,
    startingPrice: "$500",
    period: "/month",
    description: "Hire autonomous AI workers",
    color: "bg-pink-500",
    textColor: "text-pink-500",
    href: "/agents/pricing",
    features: [
      "Individual employee hiring",
      "24/7 autonomous work",
      "Full team bundles available",
    ],
  },
  {
    name: "Websites",
    icon: Code,
    startingPrice: "$2,000",
    period: "project",
    description: "High-performance websites",
    color: "bg-violet-500",
    textColor: "text-violet-500",
    href: "/web/pricing",
    features: [
      "Complete site design & development",
      "SEO & performance included",
      "Maintenance plans from $99/mo",
    ],
  },
  {
    name: "Custom Software",
    icon: Lightbulb,
    startingPrice: "Custom",
    period: "pricing",
    description: "Purpose-built applications",
    color: "bg-cyan-500",
    textColor: "text-cyan-500",
    href: "/labs",
    features: [
      "Full-stack web & mobile apps",
      "APIs & integrations",
      "Ongoing support included",
    ],
  },
  {
    name: "Consulting",
    icon: Briefcase,
    startingPrice: "Hourly",
    period: "rates",
    description: "Strategic expert guidance",
    color: "bg-amber-500",
    textColor: "text-amber-500",
    href: "/solutions",
    features: [
      "Operational strategy",
      "Tech planning & roadmaps",
      "Team building & training",
    ],
  },
];

export function HomePricingOverview() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Transparent{" "}
            <span className="text-gradient-beam">Pricing</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            No hidden fees. No surprise invoices. Just clear, honest pricing for each service.
          </p>
        </FadeIn>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingData.map((service, idx) => {
            const Icon = service.icon;
            return (
              <FadeIn key={service.name} delay={idx * 0.05}>
                <Card variant="elevated" className="h-full flex flex-col">
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Icon */}
                    <div className={`${service.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-h4 font-display font-bold text-foreground mb-1">
                      {service.name}
                    </h3>
                    <p className={`text-sm ${service.textColor} font-medium mb-6`}>
                      {service.description}
                    </p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="text-2xl font-display font-bold text-foreground">
                        {service.startingPrice}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {service.period}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 mb-6 flex-1 text-xs text-muted-foreground">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className={`${service.textColor} font-bold`}>•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button className={`w-full ${service.color}`} asChild>
                      <Link href={service.href}>
                        See Pricing
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
