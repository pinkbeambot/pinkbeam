"use client";

import Link from "next/link";
import { DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerContainer } from "@/components/animations";
import { PricingPreviewCard } from "./PricingPreviewCard";
import { cn } from "@/lib/utils";

interface PricingTier {
  title: string;
  description: string;
  price: string;
  items: string[];
  popular?: boolean;
  badge?: string;
}

interface PricingPreviewSectionProps {
  title: string;
  subtitle: string;
  tiers: PricingTier[];
  ctaText: string;
  ctaDescription: string;
  ctaHref: string;
  accentColor: "pink" | "violet" | "cyan" | "amber";
  additionalInfo?: string;
}

const colorConfig = {
  pink: {
    badge: "bg-pink-500/10 border-pink-500/20 text-pink-500",
    icon: "text-pink-500",
    gradient: "text-gradient-beam",
    button: "bg-gradient-to-r from-pink-500 to-pink-600 hover:opacity-90 shadow-lg shadow-pink-500/25",
  },
  violet: {
    badge: "bg-violet-500/10 border-violet-500/20 text-violet-500",
    icon: "text-violet-500",
    gradient: "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-300",
    button: "bg-gradient-to-r from-violet-500 to-violet-600 hover:opacity-90 shadow-lg shadow-violet-500/25",
  },
  cyan: {
    badge: "bg-cyan-500/10 border-cyan-500/20 text-cyan-500",
    icon: "text-cyan-500",
    gradient: "text-gradient-cyan",
    button: "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90 shadow-lg shadow-cyan-500/25",
  },
  amber: {
    badge: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    icon: "text-amber-500",
    gradient: "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300",
    button: "bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25",
  },
};

export function PricingPreviewSection({
  title,
  subtitle,
  tiers,
  ctaText,
  ctaDescription,
  ctaHref,
  accentColor,
  additionalInfo,
}: PricingPreviewSectionProps) {
  const colors = colorConfig[accentColor];

  return (
    <section id="pricing" className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6",
              colors.badge
            )}
          >
            <DollarSign className={cn("w-4 h-4", colors.icon)} />
            <span className="text-sm font-medium">Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {title.split(" ").map((word, i, arr) => {
              // Apply gradient to last 1-2 words
              const isLastWords = i >= arr.length - 2;
              return isLastWords ? (
                <span key={i} className={colors.gradient}>
                  {word}{" "}
                </span>
              ) : (
                <span key={i}>{word} </span>
              );
            })}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </FadeIn>

        {/* Pricing Cards */}
        <StaggerContainer
          className={cn(
            "grid gap-6 lg:gap-8 mb-12",
            tiers.length === 3 && "grid-cols-1 md:grid-cols-3",
            tiers.length === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {tiers.map((tier, index) => (
            <FadeIn key={tier.title} delay={index * 0.1}>
              <PricingPreviewCard
                title={tier.title}
                description={tier.description}
                price={tier.price}
                items={tier.items}
                accentColor={accentColor}
                popular={tier.popular}
                badge={tier.badge}
              />
            </FadeIn>
          ))}
        </StaggerContainer>

        {/* Additional Info (optional) */}
        {additionalInfo && (
          <FadeIn className="text-center mb-8">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              {additionalInfo}
            </p>
          </FadeIn>
        )}

        {/* CTA to full pricing page */}
        <FadeIn delay={0.2} className="text-center">
          <p className="text-base text-muted-foreground mb-6">
            {ctaDescription}
          </p>
          <Button size="lg" className={colors.button} asChild>
            <Link href={ctaHref}>
              {ctaText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
