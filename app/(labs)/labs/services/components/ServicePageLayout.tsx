"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerContainer } from "@/components/animations";
import { ArrowRight, ChevronDown, LucideIcon } from "lucide-react";

interface ServicePageLayoutProps {
  children: React.ReactNode;
  hero: {
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
  };
}

export function ServiceHero({ hero }: { hero: ServicePageLayoutProps["hero"] }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-void">
      {/* Cyan glow effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="text-center max-w-3xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
              <hero.badge.icon className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">
                {hero.badge.text}
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-white tracking-tight">
              {hero.title}
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {hero.description}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90 shadow-lg shadow-cyan-500/25"
                asChild
              >
                <Link href={hero.primaryCta.href}>
                  {hero.primaryCta.text}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              {hero.secondaryCta && (
                <Button size="lg" variant="outline" asChild>
                  <Link href={hero.secondaryCta.href}>
                    {hero.secondaryCta.text}
                  </Link>
                </Button>
              )}
            </div>
          </FadeIn>
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

interface ProblemStatementProps {
  title: string;
  description: string;
  painPoints: string[];
}

export function ProblemStatement({ title, description, painPoints }: ProblemStatementProps) {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
              The Challenge
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 gap-6">
            {painPoints.map((point, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border bg-card/50 hover:border-cyan-500/30 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 mb-4" />
                <p className="text-foreground">{point}</p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

interface ApproachProps {
  title: string;
  description: string;
  approaches: {
    title: string;
    description: string;
  }[];
}

export function ApproachSection({ title, description, approaches }: ApproachProps) {
  return (
    <section className="py-24 lg:py-32 bg-background border-y">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
            Our Approach
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {approaches.map((item, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-cyan-400">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CaseStudyTeaserProps {
  title: string;
  description: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export function CaseStudyTeaser({ title, description, stats }: CaseStudyTeaserProps) {
  return (
    <section className="py-24 lg:py-32 bg-background border-y">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
              Case Study
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid grid-cols-3 gap-8 p-8 rounded-2xl border bg-card">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.3} className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/labs/case-studies">
                View All Case Studies
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export function CTASection({ title, description, buttonText, buttonHref }: CTASectionProps) {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {description}
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90 shadow-lg shadow-cyan-500/25"
            asChild
          >
            <Link href={buttonHref}>
              {buttonText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}

export function ServicePageLayout({ children, hero }: ServicePageLayoutProps) {
  return (
    <main className="min-h-screen">
      <ServiceHero hero={hero} />
      {children}
    </main>
  );
}
