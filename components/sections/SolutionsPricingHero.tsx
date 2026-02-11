"use client";

import { FadeInOnMount } from "@/components/animations";
import { Compass, ChevronDown } from "lucide-react";

export function SolutionsPricingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-void">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-beam-glow opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <FadeInOnMount delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <Compass className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-500">
                Consulting Pricing
              </span>
            </div>
          </FadeInOnMount>

          {/* Headline */}
          <FadeInOnMount delay={0.1}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 text-white tracking-tight">
              Transparent{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Pricing
              </span>
            </h1>
          </FadeInOnMount>

          <FadeInOnMount delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Four engagement models, clear pricing, no surprises. Find the
              right fit for your stage, budget, and goals.
            </p>
          </FadeInOnMount>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs uppercase tracking-wider">Scroll</span>
        <ChevronDown className="w-5 h-5 text-amber-500 animate-bounce" />
      </div>
    </section>
  );
}
