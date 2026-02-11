"use client";

import Link from "next/link";
import {
  Lightbulb,
  Rocket,
  Shield,
  TrendingUp,
  ArrowRight,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { Button, Badge } from "@/components/ui";
import { FadeIn } from "@/components/animations";

const services = [
  {
    id: "ai-strategy",
    name: "AI Strategy",
    icon: Lightbulb,
    description: "Turn AI hype into real business value",
    features: [
      "AI readiness assessment",
      "Use case prioritization",
      "Technology selection",
      "Implementation roadmap",
      "ROI modeling",
    ],
    color: "bg-amber-500",
    textColor: "text-amber-500",
    borderColor: "border-amber-500/50",
    href: "/solutions/services/ai-strategy",
    featured: true,
  },
  {
    id: "digital-transformation",
    name: "Digital Transformation",
    icon: Rocket,
    description: "Modernize operations for growth",
    features: [
      "Current state assessment",
      "Process optimization",
      "Technology integration",
      "Change management",
      "Transformation roadmap",
    ],
    color: "bg-amber-400",
    textColor: "text-amber-400",
    borderColor: "border-amber-400/50",
    href: "/solutions/services/digital-transformation",
    featured: true,
  },
  {
    id: "technology-advisory",
    name: "Technology Advisory",
    icon: Shield,
    description: "Architecture, security & infrastructure",
    features: [
      "Architecture review",
      "Tech stack evaluation",
      "Security assessment",
    ],
    color: "bg-amber-300",
    textColor: "text-amber-300",
    borderColor: "border-amber-300/50",
    href: "/solutions/services/technology-architecture",
    featured: false,
  },
  {
    id: "growth-strategy",
    name: "Growth Strategy",
    icon: TrendingUp,
    description: "Scale with data-driven decisions",
    features: [
      "Market opportunity analysis",
      "Technology-enabled growth",
      "Organizational design",
    ],
    color: "bg-orange-500",
    textColor: "text-orange-500",
    borderColor: "border-orange-500/50",
    href: "/solutions/services/growth-strategy",
    featured: false,
  },
];

export function SolutionsServicesShowcase() {
  const featuredServices = services.filter((s) => s.featured);
  const otherServices = services.filter((s) => !s.featured);

  return (
    <section id="services" className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            How We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Help
            </span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Strategic consulting services that bridge the gap between where you
            are and where you want to be.
          </p>
        </FadeIn>

        {/* Featured Services - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {featuredServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <FadeIn key={service.id} delay={0.05 + idx * 0.05}>
                <Link href={service.href}>
                  <Card
                    variant="elevated"
                    className={`group h-full border-2 ${service.borderColor} bg-gradient-to-br from-amber-500/5 to-amber-600/5 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                  >
                    <CardContent className="p-8 md:p-10 flex flex-col h-full">
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div
                          className={`${service.color} w-14 h-14 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 whitespace-nowrap">
                          Most Popular
                        </Badge>
                      </div>

                      <h3 className="text-h3 font-display font-bold text-foreground mb-2">
                        {service.name}
                      </h3>
                      <p
                        className={`text-body font-medium ${service.textColor} mb-6`}
                      >
                        {service.description}
                      </p>

                      <ul className="space-y-3 mb-8 flex-1">
                        {service.features.slice(0, 5).map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-body text-foreground">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90"
                        asChild
                      >
                        <span>
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </span>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        {/* Secondary Services - Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <FadeIn key={service.id} delay={0.1 + idx * 0.05}>
                <Link href={service.href}>
                  <Card
                    variant="elevated"
                    className={`group h-full border-2 ${service.borderColor} hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                  >
                    <CardContent className="p-6 md:p-8 flex flex-col h-full">
                      <div
                        className={`${service.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <h3 className="text-h4 font-display font-bold text-foreground mb-2">
                        {service.name}
                      </h3>
                      <p
                        className={`text-sm font-medium ${service.textColor} mb-6`}
                      >
                        {service.description}
                      </p>

                      <ul className="space-y-2 mb-8 flex-1">
                        {service.features.slice(0, 3).map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-muted-foreground"
                          >
                            <Check
                              className={`w-3 h-3 ${service.textColor} shrink-0 mt-0.5`}
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        variant="outline"
                        className={`w-full border-current ${service.textColor} hover:bg-current/10`}
                        asChild
                      >
                        <span>
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </span>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
