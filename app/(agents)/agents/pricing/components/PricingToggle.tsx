"use client";

import { cn } from "@/lib/utils";

interface PricingToggleProps {
  isAnnual: boolean;
  onToggle: (isAnnual: boolean) => void;
  savingsText?: string;
}

export function PricingToggle({
  isAnnual,
  onToggle,
  savingsText = "Save 2 months",
}: PricingToggleProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3 p-1 bg-muted rounded-full">
        <button
          onClick={() => onToggle(false)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-display font-medium transition-all duration-200",
            !isAnnual
              ? "bg-surface-elevated text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => onToggle(true)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-display font-medium transition-all duration-200",
            isAnnual
              ? "bg-surface-elevated text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Annual
        </button>
      </div>
      {isAnnual && (
        <span className="text-xs font-medium text-pink-500 animate-fade-in">
          {savingsText}
        </span>
      )}
    </div>
  );
}
