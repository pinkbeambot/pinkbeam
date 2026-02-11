"use client";

import { FadeInOnMount } from "@/components/animations";
import { DollarSign, ChevronDown } from "lucide-react";

export function LabsPricingHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-void">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-beam-glow opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <FadeInOnMount delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
              <DollarSign className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-medium text-cyan-500">
                Transparent Pricing
              </span>
            </div>
          </FadeInOnMount>

          {/* Main Headline */}
          <FadeInOnMount delay={0.1}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 text-white tracking-tight">
              Software Pricing That{" "}
              <span className="text-gradient-cyan">Makes Sense</span>
            </h1>
          </FadeInOnMount>

          {/* Subheadline */}
          <FadeInOnMount delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              From quick MVPs to enterprise systems, we offer flexible pricing
              models designed for your project scope and timeline.
            </p>
          </FadeInOnMount>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs uppercase tracking-wider">Scroll</span>
        <ChevronDown className="w-5 h-5 text-cyan-500 animate-bounce" />
      </div>
    </section>
  );
}
