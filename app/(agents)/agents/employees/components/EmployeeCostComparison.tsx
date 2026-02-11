"use client";

import { FadeIn } from "@/components/animations";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeCostComparisonProps {
  roleName: string; // e.g., "SDR", "Researcher"
  humanTitle: string; // e.g., "Full-Time SDR"
  humanCost: number; // Monthly cost
  aiCost: number; // Monthly cost
  colorClass: string; // e.g., "text-pink-500", "bg-pink-500"
  savings: number; // Annual savings
  humanDrawbacks?: string[]; // Optional list of human hire drawbacks
  aiAdvantages?: string[]; // Optional list of AI advantages
}

export function EmployeeCostComparison({
  roleName,
  humanTitle,
  humanCost,
  aiCost,
  colorClass,
  savings,
  humanDrawbacks = [
    "Benefits & payroll taxes",
    "Vacation & sick days",
    "Training & onboarding",
    "Management overhead"
  ],
  aiAdvantages = [
    "24/7 availability",
    "Instant onboarding",
    "Zero overhead",
    "Scales infinitely"
  ]
}: EmployeeCostComparisonProps) {
  const bgColorClass = colorClass.replace("text-", "bg-").replace("-500", "-500/10");
  const borderColorClass = colorClass.replace("text-", "border-").replace("-500", "-500/30");

  return (
    <section className="py-20 bg-surface-sunken">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Cost <span className="text-gradient-beam">Comparison</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            See why AI employees make financial sense
          </p>
        </FadeIn>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Human Hire Card */}
          <FadeIn delay={0.1}>
            <div className="h-full p-8 rounded-2xl border border-border bg-background">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <X className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-h3 font-display font-bold mb-2">{humanTitle}</h3>
                <div className="text-4xl font-display font-bold text-foreground mb-1">
                  ${humanCost.toLocaleString()}<span className="text-xl text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ${(humanCost * 12).toLocaleString()}/year
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Additional Costs
                </p>
                {humanDrawbacks.map((drawback, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{drawback}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* AI Employee Card */}
          <FadeIn delay={0.2}>
            <div className={cn(
              "h-full p-8 rounded-2xl border",
              borderColorClass,
              bgColorClass
            )}>
              <div className="text-center mb-6">
                <div className={cn(
                  "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4",
                  colorClass.replace("text-", "bg-")
                )}>
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-h3 font-display font-bold mb-2">{roleName}</h3>
                <div className={cn("text-4xl font-display font-bold mb-1", colorClass)}>
                  ${aiCost}<span className="text-xl text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ${(aiCost * 12).toLocaleString()}/year
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Included Benefits
                </p>
                {aiAdvantages.map((advantage, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className={cn("w-5 h-5 flex-shrink-0 mt-0.5", colorClass)} />
                    <span className="text-sm text-foreground">{advantage}</span>
                  </div>
                ))}
              </div>

              {/* Savings Badge */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Annual Savings</p>
                  <p className={cn("text-3xl font-display font-bold", colorClass)}>
                    ${savings.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
