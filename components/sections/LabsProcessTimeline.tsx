"use client";

import { Search, Lightbulb, Code2, Rocket } from "lucide-react";
import { FadeIn } from "@/components/animations";

const steps = [
  {
    number: "01",
    title: "Discovery & Planning",
    description:
      "We dive deep into your business, users, competitors, and technical environment. We ask hard questions and document requirements in detail.",
    icon: Search,
    duration: "1-2 weeks",
  },
  {
    number: "02",
    title: "Architecture & Design",
    description:
      "System design, data models, API specs, UI/UX wireframes. We plan before we code. You review and approve before development starts.",
    icon: Lightbulb,
    duration: "2-4 weeks",
  },
  {
    number: "03",
    title: "Development & Testing",
    description:
      "Agile sprints with weekly demos. You see working software every week. Automated tests, code reviews, continuous integration. Real progress, real visibility.",
    icon: Code2,
    duration: "6-12 weeks",
  },
  {
    number: "04",
    title: "Launch & Scale",
    description:
      "Deployment, monitoring, performance optimization. We stay involved post-launch. If you want ongoing support, we offer retainer-based partnerships.",
    icon: Rocket,
    duration: "Ongoing",
  },
];

export function LabsProcessTimeline() {
  return (
    <section className="py-20 md:py-32 bg-surface-sunken">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            How We{" "}
            <span className="text-gradient-cyan">Build</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            A transparent, collaborative process designed for success. From day one
            to launch and beyond.
          </p>
        </FadeIn>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

            {/* Timeline items */}
            <div className="space-y-12">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <FadeIn key={step.number} delay={0.05 + idx * 0.05}>
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      {/* Content */}
                      <div className={idx % 2 === 0 ? "md:text-right md:pr-12" : "md:order-2 md:text-left md:pl-12"}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-medium mb-3">
                          Step {step.number}
                          <span className="text-muted-foreground">•</span>
                          <span>{step.duration}</span>
                        </div>
                        <h3 className="text-h4 font-display font-bold text-foreground mb-3">
                          {step.title}
                        </h3>
                        <p className="text-body text-muted-foreground">
                          {step.description}
                        </p>
                      </div>

                      {/* Icon */}
                      <div
                        className={
                          idx % 2 === 0 ? "md:text-left md:pl-12" : "md:order-1 md:text-right md:pr-12"
                        }
                      >
                        <div className="bg-card border border-border rounded-xl p-6 inline-flex items-center justify-center w-full md:w-auto">
                          <Icon className="w-8 h-8 text-cyan-500" />
                        </div>
                      </div>

                      {/* Timeline dot */}
                      <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-cyan-500 border-4 border-background md:-translate-x-1/2 top-6" />
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
