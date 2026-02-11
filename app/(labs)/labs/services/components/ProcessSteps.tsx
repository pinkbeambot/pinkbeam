"use client";

import { FadeIn } from "@/components/animations";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

interface ProcessStepsProps {
  steps: ProcessStep[];
  title: string;
  description?: string;
}

export function ProcessSteps({ steps, title, description }: ProcessStepsProps) {
  return (
    <section className="py-24 lg:py-32 bg-background border-y">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
            Our Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </FadeIn>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <FadeIn key={step.number} delay={index * 0.1} direction="up">
              <div className="flex gap-6 mb-12 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    {step.icon ? (
                      <step.icon className="w-6 h-6 text-cyan-400" />
                    ) : (
                      <span className="text-lg font-bold text-cyan-400">{step.number}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-cyan-400/30 to-transparent mt-4 min-h-[60px]" />
                  )}
                </div>
                <div className="pb-6 flex-1">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
