"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import type { PricingTier } from "../data/pricing";

interface PricingCardProps {
  tier: PricingTier;
  isAnnual: boolean;
}

export function PricingCard({ tier, isAnnual }: PricingCardProps) {
  const isCustom = tier.price.monthly === 0;
  const price = isAnnual ? tier.price.annual : tier.price.monthly;
  const period = isAnnual ? "/year" : "/month";

  return (
    <div
      className={cn(
        "relative p-8 rounded-2xl border transition-all duration-300",
        tier.popular
          ? "bg-gradient-beam border-transparent text-white scale-105 shadow-beam hover:shadow-glow-pink-lg"
          : "bg-surface-elevated border-border hover:border-pink-500/30 hover:shadow-lg"
      )}
    >
      {/* Badge */}
      <div
        className={cn(
          "absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap",
          tier.popular
            ? "bg-white text-pink-600"
            : "bg-pink-500 text-white"
        )}
      >
        {tier.badge}
      </div>

      {/* Header */}
      <div className="text-center mb-6 pt-2">
        <h3
          className={cn(
            "text-h3 font-display font-bold mb-2",
            tier.popular ? "text-white" : "text-foreground"
          )}
        >
          {tier.name}
        </h3>
        <p
          className={cn(
            "text-small mb-4",
            tier.popular ? "text-white/80" : "text-muted-foreground"
          )}
        >
          {tier.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline justify-center gap-1">
          {isCustom ? (
            <span
              className={cn(
                "text-4xl font-display font-bold",
                tier.popular ? "text-white" : "text-foreground"
              )}
            >
              Custom
            </span>
          ) : (
            <>
              <span
                className={cn(
                  "text-5xl font-display font-bold",
                  tier.popular ? "text-white" : "text-foreground"
                )}
              >
                ${price.toLocaleString()}
              </span>
              <span
                className={cn(
                  "text-body",
                  tier.popular ? "text-white/80" : "text-muted-foreground"
                )}
              >
                {period}
              </span>
            </>
          )}
        </div>

        {/* Employee count */}
        <p
          className={cn(
            "mt-2 text-sm",
            tier.popular ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {tier.employees === -1
            ? "Unlimited AI employees"
            : `${tier.employees} AI employee${tier.employees > 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                tier.popular ? "bg-white/20" : "bg-pink-500/10"
              )}
            >
              <Check
                className={cn(
                  "w-3 h-3",
                  tier.popular ? "text-white" : "text-pink-500"
                )}
              />
            </div>
            <span
              className={cn(
                "text-body",
                tier.popular ? "text-white/90" : "text-muted-foreground"
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        className="w-full"
        variant={tier.popular ? "secondary" : "beam"}
        size="lg"
        onClick={tier.ctaAction}
      >
        {tier.cta}
      </Button>
    </div>
  );
}
