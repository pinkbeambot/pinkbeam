"use client";

import * as React from "react";
import { FadeIn, StaggerContainer } from "@/components/animations";
import { Check, LucideIcon } from "lucide-react";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
  title?: string;
  description?: string;
}

export function ProcessTimeline({
  steps,
  title = "Our Process",
  description,
}: ProcessTimelineProps) {
  return (
    <section className="py-24 lg:py-32 bg-muted/30 border-y">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            How We Work
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </FadeIn>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/50 via-amber-500/30 to-transparent hidden md:block" />

            <StaggerContainer className="space-y-8 md:space-y-12">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative flex flex-col md:flex-row gap-6 md:gap-8"
                >
                  {/* Step number/icon */}
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/25">
                      {step.icon ? (
                        <step.icon className="w-6 h-6" />
                      ) : (
                        step.number
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
