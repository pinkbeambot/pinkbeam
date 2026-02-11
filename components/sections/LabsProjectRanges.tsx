"use client";

import { FadeIn } from "@/components/animations";
import { Card, CardContent } from "@/components/ui";
import { Check } from "lucide-react";

const projects = [
  {
    name: "MVP / Proof of Concept",
    priceRange: "$25,000 - $50,000",
    timeline: "8-12 weeks",
    scope: "Lean, validated product to test market fit",
    features: [
      "Core features only",
      "Single-platform (web or mobile)",
      "Basic integrations",
      "Deployed but not optimized",
      "Post-launch support included",
    ],
    examples: [
      "Landing page with lead capture",
      "Simple SaaS tool (task management, note-taking)",
      "Mobile app MVP",
      "API integration prototype",
    ],
  },
  {
    name: "Standard Project",
    priceRange: "$50,000 - $100,000",
    timeline: "12-20 weeks",
    scope: "Production-ready system with core features and integrations",
    features: [
      "Full feature set for MVP",
      "Multi-platform (web + mobile OR multiple web apps)",
      "3rd-party integrations (Stripe, Slack, etc)",
      "Performance & security optimized",
      "Analytics & monitoring setup",
      "3 months post-launch support",
    ],
    examples: [
      "E-commerce platform",
      "SaaS product with multiple services",
      "Real-time collaboration app",
      "Inventory management system",
    ],
  },
  {
    name: "Enterprise System",
    priceRange: "$100,000+",
    timeline: "20+ weeks",
    scope: "Complex, scalable system with advanced features",
    features: [
      "All Standard features",
      "Advanced architecture (microservices, etc)",
      "Custom integrations & APIs",
      "Real-time features & AI/ML",
      "Comprehensive security review",
      "6+ months ongoing support",
      "Team training & documentation",
    ],
    examples: [
      "Full-featured marketplace",
      "AI-powered analytics platform",
      "Multi-tenant B2B system",
      "Legacy system modernization",
    ],
  },
];

export function LabsProjectRanges() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Project Examples &{" "}
            <span className="text-gradient-cyan">Pricing Ranges</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            These are typical ranges. Your actual cost depends on complexity,
            timeline, and team size.
          </p>
        </FadeIn>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <FadeIn key={project.name} delay={0.05 + idx * 0.1}>
              <Card variant="elevated" className="h-full border-cyan-500/30 flex flex-col">
                <CardContent className="p-8 flex flex-col h-full">
                  {/* Header */}
                  <h3 className="text-h3 font-display font-bold text-foreground mb-2">
                    {project.name}
                  </h3>

                  {/* Price & Timeline */}
                  <div className="mb-6 pb-6 border-b border-border">
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground">Typical Cost</p>
                      <p className="text-2xl font-bold text-cyan-500">
                        {project.priceRange}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Timeline</p>
                      <p className="font-medium text-foreground">
                        {project.timeline}
                      </p>
                    </div>
                  </div>

                  {/* Scope */}
                  <p className="text-body text-muted-foreground mb-6 font-medium">
                    {project.scope}
                  </p>

                  {/* Features */}
                  <div className="mb-8">
                    <p className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                      Includes
                    </p>
                    <ul className="space-y-2">
                      {project.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Examples */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                      Examples
                    </p>
                    <ul className="space-y-1">
                      {project.examples.map((example, i) => (
                        <li
                          key={i}
                          className="text-xs text-muted-foreground pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-cyan-500"
                        >
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
