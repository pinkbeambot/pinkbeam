"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface PricingCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
  iconColor?: string;
}

export function PricingCard({
  name,
  price,
  description,
  features,
  ctaText,
  popular = false,
  iconColor = "bg-pink-500",
}: PricingCardProps) {
  return (
    <div className={cn(
      "relative p-8 rounded-2xl border",
      popular 
        ? "bg-gradient-beam border-transparent text-white" 
        : "bg-surface-elevated border-border"
    )}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 bg-white text-pink-600 text-xs font-semibold rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className={cn("text-h3 font-display font-bold mb-2", popular ? "text-white" : "text-foreground")}>
          {name}
        </h3>
        <p className={cn("text-small mb-4", popular ? "text-white/80" : "text-muted-foreground")}>
          {description}
        </p>
        <div className="flex items-baseline justify-center gap-1">
          <span className={cn("text-5xl font-display font-bold", popular ? "text-white" : "text-foreground")}>
            ${price}
          </span>
          <span className={cn("text-body", popular ? "text-white/80" : "text-muted-foreground")}>
            /month
          </span>
        </div>
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
              popular ? "bg-white/20" : "bg-pink-500/10"
            )}>
              <Check className={cn("w-3 h-3", popular ? "text-white" : "text-pink-500")} />
            </div>
            <span className={cn("text-body", popular ? "text-white/90" : "text-muted-foreground")}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
      
      <Button 
        className="w-full" 
        variant={popular ? "secondary" : "beam"} 
        size="lg"
      >
        {ctaText}
      </Button>
    </div>
  );
}
