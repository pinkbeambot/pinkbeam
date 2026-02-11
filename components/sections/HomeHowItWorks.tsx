"use client";

import { Rocket, Zap, TrendingUp } from "lucide-react";
import { FadeIn } from "@/components/animations";

const steps = [
  {
    number: "01",
    icon: Rocket,
    title: "Choose Your Service",
    description: "Hire AI employees, build a website, create custom software, or get strategic guidance. You pick what fits your needs.",
  },
  {
    number: "02",
    icon: Zap,
    title: "Quick Onboarding",
    description: "Get started in minutes, not months. Brief setup, connect your tools, and define your goals. Most services launch in a week.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Scale Effortlessly",
    description: "See results immediately. Add more services as you grow. One platform, infinite possibilities. No vendor switching.",
  },
];

export function HomeHowItWorks() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Simple{" "}
            <span className="text-gradient-beam">Getting Started</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            From signup to impact in three easy steps.
          </p>
        </FadeIn>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500/0 via-pink-500/50 to-pink-500/0" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <FadeIn key={step.number} delay={index * 0.1} className="relative">
                    <div className="text-center">
                      {/* Step Number and Icon */}
                      <div className="relative inline-flex items-center justify-center mb-6">
                        {/* Background Circle */}
                        <div className="w-20 h-20 rounded-full bg-surface-elevated border border-border flex items-center justify-center relative z-10">
                          <Icon className="w-8 h-8 text-pink-500" />
                        </div>
                        {/* Step Number Badge */}
                        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-beam flex items-center justify-center">
                          <span className="text-white font-display font-bold text-sm">
                            {step.number}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-h4 font-display font-semibold mb-4">
                        {step.title}
                      </h3>
                      <p className="text-body text-muted-foreground max-w-sm mx-auto">
                        {step.description}
                      </p>
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
