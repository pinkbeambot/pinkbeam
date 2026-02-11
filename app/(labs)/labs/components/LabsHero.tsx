"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeInOnMount } from "@/components/animations";
import { ArrowRight, ChevronDown, Code2 } from "lucide-react";

export function LabsHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-void">
      {/* Cyan glow effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge with cyan */}
          <FadeInOnMount delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">
                Custom Development
              </span>
            </div>
          </FadeInOnMount>

          {/* Headline with cyan gradient */}
          <FadeInOnMount delay={0.1}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 text-white tracking-tight">
              Build software{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
                that scales
              </span>
            </h1>
          </FadeInOnMount>

          {/* Subheadline */}
          <FadeInOnMount delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Custom web applications, mobile apps, APIs, and AI solutions.
              From startup MVPs to enterprise systems.
            </p>
          </FadeInOnMount>

          {/* CTA Buttons */}
          <FadeInOnMount delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90 shadow-lg shadow-cyan-500/25" asChild>
                <Link href="/contact">
                  Start Your Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Link href="#services" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full">
                  View Services
                </Button>
              </Link>
            </div>
          </FadeInOnMount>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs uppercase tracking-wider">Scroll</span>
        <ChevronDown className="w-5 h-5 text-cyan-400 animate-bounce" />
      </div>
    </section>
  );
}
