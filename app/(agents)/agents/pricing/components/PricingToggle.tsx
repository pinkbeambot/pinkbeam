"use client";

import { cn } from "@/lib/utils";

interface PricingToggleProps {
  isAnnual: boolean;
  onToggle: (isAnnual: boolean) => void;
  savingsText?: string;
  themeColor?: string;
}

export function PricingToggle({
  isAnnual,
  onToggle,
  savingsText = "Save 2 months",
  themeColor = "bg-pink-500",
}: PricingToggleProps) {
  const textColor = themeColor.replace("bg-", "text-");

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center gap-3 p-1 bg-muted rounded-full">
        {/* Sliding background indicator */}
        <div
          className={cn(
            "absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-out shadow-sm",
            themeColor,
            isAnnual ? "left-[calc(50%+0.375rem)] right-1" : "left-1 right-[calc(50%+0.375rem)]"
          )}
        />

        {/* Buttons */}
        <button
          onClick={() => onToggle(false)}
          className={cn(
            "relative z-10 px-4 py-2 rounded-full text-sm font-display font-medium transition-colors duration-300",
            !isAnnual
              ? "text-white"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => onToggle(true)}
          className={cn(
            "relative z-10 px-4 py-2 rounded-full text-sm font-display font-medium transition-colors duration-300",
            isAnnual
              ? "text-white"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Annual
        </button>
      </div>
      {isAnnual && (
        <span className={cn("text-xs font-medium animate-fade-in", textColor)}>
          {savingsText}
        </span>
      )}
    </div>
  );
}
