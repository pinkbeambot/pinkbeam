"use client";

import { FadeIn } from "@/components/animations";
import { Search, Map, Wrench, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discovery",
    icon: Search,
    description:
      "We learn your business inside and out — goals, challenges, tech landscape, team dynamics. No generic frameworks, just deep understanding.",
    details: [
      "Stakeholder interviews",
      "Technology audit",
      "Process mapping",
      "Opportunity assessment",
    ],
  },
  {
    number: "02",
    title: "Strategy",
    icon: Map,
    description:
      "We turn insights into a clear, prioritized roadmap. You'll know exactly what to do, in what order, and why it matters.",
    details: [
      "Prioritized recommendations",
      "Technology selection",
      "Investment modeling",
      "Risk assessment",
    ],
  },
  {
    number: "03",
    title: "Implementation",
    icon: Wrench,
    description:
      "We don't just hand you a report. We guide execution — whether that's building in-house or through our Labs and Agents teams.",
    details: [
      "Vendor evaluation",
      "Team alignment",
      "Pilot programs",
      "Progress tracking",
    ],
  },
  {
    number: "04",
    title: "Scale",
    icon: Rocket,
    description:
      "Once it's working, we help you scale it. Ongoing advisory ensures your strategy evolves as your business grows.",
    details: [
      "Performance reviews",
      "Continuous optimization",
      "New opportunity identification",
      "Leadership coaching",
    ],
  },
];

export function SolutionsProcessTimeline() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Process
            </span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            A proven methodology for turning uncertainty into clarity and
            strategy into results.
          </p>
        </FadeIn>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <FadeIn key={step.number} delay={0.05 + idx * 0.05}>
                <div className="group relative p-6 md:p-8 rounded-2xl border border-border bg-card hover:border-amber-500/30 hover:shadow-lg transition-all duration-300">
                  {/* Step Number */}
                  <div className="text-5xl font-display font-bold text-amber-500/10 absolute top-4 right-4">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="bg-amber-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-amber-500" />
                  </div>

                  {/* Content */}
                  <h3 className="text-h4 font-display font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {step.description}
                  </p>

                  {/* Details */}
                  <ul className="space-y-1.5">
                    {step.details.map((detail) => (
                      <li
                        key={detail}
                        className="text-xs text-muted-foreground flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-amber-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Retainer Note */}
        <FadeIn delay={0.3} className="text-center mt-12">
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Most clients start with a workshop or assessment and continue with a
            retainer for ongoing strategic partnership.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
