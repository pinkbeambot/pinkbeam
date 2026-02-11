"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeInOnMount } from "@/components/animations";
import { ArrowRight, ChevronDown, Code2 } from "lucide-react";

export function LabsHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-void">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-beam-glow opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />


      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <FadeInOnMount delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
              <Code2 className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-medium text-cyan-500">
                Custom Software Development
              </span>
            </div>
          </FadeInOnMount>

          {/* Main Headline */}
          <FadeInOnMount delay={0.1}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 text-white tracking-tight">
              Software Built{" "}
              <span className="text-gradient-cyan">For Your Business.</span>
            </h1>
          </FadeInOnMount>

          {/* Subheadline */}
          <FadeInOnMount delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              We don't build generic software. We build systems tailored to your
              business, your users, and your growth—from MVP to enterprise scale.
            </p>
          </FadeInOnMount>

          {/* Founder Quote */}
          <FadeInOnMount delay={0.25}>
            <div className="mx-auto max-w-2xl mb-10 p-6 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
              <p className="text-lg text-cyan-400 italic mb-3">
                "Building custom software is an investment in your competitive
                advantage. When we're done, you own something that no one else has."
              </p>
              <p className="text-sm text-muted-foreground">
                — Pink Beam Founder
              </p>
            </div>
          </FadeInOnMount>

          {/* CTA Buttons */}
          <FadeInOnMount delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                variant="beam"
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90 shadow-lg shadow-cyan-500/25"
                asChild
              >
                <Link href="/contact">
                  Start Your Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Link href="#services" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full">
                  Explore Our Services
                </Button>
              </Link>
            </div>
          </FadeInOnMount>

          {/* Social Proof */}
          <FadeInOnMount delay={0.4}>
            <div className="space-y-4">
              <p className="text-small text-muted-foreground uppercase tracking-wider">
                Trusted for complex projects
              </p>
              <p className="text-sm text-muted-foreground">
                MVPs • Enterprise Systems • AI Integration • Legacy Modernization
              </p>
            </div>
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
