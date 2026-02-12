"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";
import { ArrowRight, ChevronDown, LucideIcon } from "lucide-react";

interface ServiceHeroProps {
  badge: {
    icon: LucideIcon;
    text: string;
  };
  title: React.ReactNode;
  description: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
}

export function ServiceHero({
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
}: ServiceHeroProps) {
  return (
    <section className="relative h-[40vh] min-h-[450px] max-h-[550px] flex items-center justify-center overflow-hidden bg-gradient-void">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <badge.icon className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-500">
                {badge.text}
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-5 text-white tracking-tight">
              {title}
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              {description}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                asChild
              >
                <Link href={primaryCta.href}>
                  {primaryCta.text}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              {secondaryCta && (
                <Button size="lg" variant="outline" asChild>
                  <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
                </Button>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
