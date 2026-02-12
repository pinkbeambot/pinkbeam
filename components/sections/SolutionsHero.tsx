"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeInOnMount } from "@/components/animations";
import { ArrowRight, ChevronDown, Compass } from "lucide-react";

export function SolutionsHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-void">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-beam-glow opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <FadeInOnMount delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <Compass className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-500">
                Strategic Consulting
              </span>
            </div>
          </FadeInOnMount>

          {/* Main Headline */}
          <FadeInOnMount delay={0.1}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 text-white tracking-tight">
              Strategy That{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Drives Results.
              </span>
            </h1>
          </FadeInOnMount>

          {/* Subheadline */}
          <FadeInOnMount delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Technology leadership without the full-time cost. AI strategy,
              digital transformation, and growth consulting for companies ready
              to scale.
            </p>
          </FadeInOnMount>

          {/* VALIS Quote */}
          <FadeInOnMount delay={0.25}>
            <div className="mx-auto max-w-2xl mb-10 p-6 rounded-xl border border-amber-500/30 bg-amber-500/5">
              <p className="text-lg text-amber-400 italic mb-3">
                &quot;The best technology decisions aren&apos;t about technology
                at all. They&apos;re about understanding your business deeply
                enough to know what to build next.&quot;
              </p>
              <p className="text-sm text-muted-foreground">— VALIS</p>
            </div>
          </FadeInOnMount>

          {/* CTA Buttons */}
          <FadeInOnMount delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                variant="beam"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                asChild
              >
                <Link href="#services">
                  Explore Services
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="#pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </FadeInOnMount>

          {/* Service Highlights */}
          <FadeInOnMount delay={0.4}>
            <div className="space-y-4">
              <p className="text-small text-muted-foreground uppercase tracking-wider">
                Fractional CTO & Strategic Advisory
              </p>
              <p className="text-sm text-muted-foreground">
                AI Strategy &bull; Digital Transformation &bull; Technology
                Advisory &bull; Growth Strategy
              </p>
            </div>
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
