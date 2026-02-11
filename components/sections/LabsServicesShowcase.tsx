"use client";

import Link from "next/link";
import {
  Globe,
  Smartphone,
  Plug,
  Brain,
  RefreshCw,
  ArrowRight,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { Button, Badge } from "@/components/ui";
import { FadeIn } from "@/components/animations";

const services = [
  {
    id: "web-applications",
    name: "Web Applications",
    icon: Globe,
    description: "Full-stack web apps built for scale",
    features: [
      "React, Next.js, TypeScript",
      "Real-time data & dashboards",
      "Payment processing & auth",
      "SEO optimization",
      "Custom integrations",
    ],
    color: "bg-cyan-500",
    textColor: "text-cyan-500",
    borderColor: "border-cyan-500/50",
    href: "/labs/services/web-applications",
    featured: true,
  },
  {
    id: "ai-ml",
    name: "AI & ML Solutions",
    icon: Brain,
    description: "AI-powered features & workflows",
    features: [
      "LLM integrations",
      "ML model deployment",
      "Predictive analytics",
      "Automation workflows",
      "Custom AI agents",
    ],
    color: "bg-cyan-400",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-400/50",
    href: "/labs/services/ai-ml",
    featured: true,
  },
  {
    id: "mobile-applications",
    name: "Mobile Applications",
    icon: Smartphone,
    description: "Native and cross-platform apps",
    features: [
      "React Native & Flutter",
      "iOS & Android native",
      "Offline-first apps",
      "Push notifications",
      "App store deployment",
    ],
    color: "bg-cyan-300",
    textColor: "text-cyan-300",
    borderColor: "border-cyan-300/50",
    href: "/labs/services/mobile-applications",
    featured: false,
  },
  {
    id: "api-integrations",
    name: "API & Integrations",
    icon: Plug,
    description: "Connect your systems seamlessly",
    features: [
      "REST & GraphQL APIs",
      "3rd-party integrations",
      "Webhook management",
      "API documentation",
      "OAuth & security",
    ],
    color: "bg-blue-500",
    textColor: "text-blue-500",
    borderColor: "border-blue-500/50",
    href: "/labs/services/api-integrations",
    featured: false,
  },
  {
    id: "legacy-modernization",
    name: "Legacy Modernization",
    icon: RefreshCw,
    description: "Breathe new life into old systems",
    features: [
      "Code audits & analysis",
      "Incremental rewrites",
      "Architecture improvements",
      "Performance optimization",
      "Tech stack upgrades",
    ],
    color: "bg-indigo-500",
    textColor: "text-indigo-500",
    borderColor: "border-indigo-500/50",
    href: "/labs/services/legacy-modernization",
    featured: false,
  },
];

export function LabsServicesShowcase() {
  const featuredServices = services.filter((s) => s.featured);
  const otherServices = services.filter((s) => !s.featured);

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            What We{" "}
            <span className="text-gradient-cyan">Build</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            From web and mobile apps to AI integrations and system modernization.
            Any technical challenge, any vision.
          </p>
        </FadeIn>

        {/* Featured Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {featuredServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <FadeIn key={service.id} delay={0.05 + idx * 0.05}>
                <Link href={service.href}>
                  <div
                    className={`group relative p-8 md:p-10 rounded-2xl border-2 ${service.borderColor} bg-gradient-to-br from-cyan-500/5 to-cyan-600/5 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full`}
                  >
                    <div className="flex items-start gap-6 mb-6">
                      <div
                        className={`${service.color} w-14 h-14 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      {service.featured && (
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                          Most Popular
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-h3 font-display font-bold text-foreground mb-2">
                      {service.name}
                    </h3>
                    <p className={`text-body ${service.textColor} font-medium mb-6`}>
                      {service.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                          <span className="text-body text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90 group"
                      asChild
                    >
                      <span>
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        {/* Other Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      <p className={`text-sm font-medium ${service.textColor} mb-6`}>
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
                          Explore
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
