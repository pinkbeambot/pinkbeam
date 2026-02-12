"use client";

import { Check, X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/animations";
import { Card } from "@/components/ui/card";
import type { FeatureComparison } from "../data/pricing";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FeatureComparisonProps {
  features: FeatureComparison[];
}

export function FeatureComparisonTable({ features }: FeatureComparisonProps) {
  const tiers = ['Starter', 'Growth', 'Scale'] as const;

  return (
    <TooltipProvider delayDuration={100}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-surface-sunken">
              <th className="text-left p-4 font-display font-semibold text-foreground rounded-tl-xl">
                Feature
              </th>
              <th className="text-center p-4 font-display font-semibold text-foreground w-[180px]">
                Starter
              </th>
              <th className="text-center p-4 font-display font-semibold text-pink-500 w-[180px] bg-pink-500/5 rounded-t-xl">
                Growth
                <span className="block text-xs font-normal text-muted-foreground mt-1">
                  Most Popular
                </span>
              </th>
              <th className="text-center p-4 font-display font-semibold text-foreground w-[180px] rounded-tr-xl">
                Scale
              </th>
            </tr>
          </thead>
          <tbody className="bg-surface-elevated">
            {features.map((feature, index) => (
              <tr
                key={index}
                className={cn(
                  "border-b border-border last:border-b-0",
                  index % 2 === 1 && "bg-muted/30"
                )}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {feature.feature}
                    </span>
                    {feature.tooltip && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-muted-foreground hover:text-pink-500 transition-colors">
                            <HelpCircle className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="max-w-xs bg-surface-elevated border-border text-foreground"
                        >
                          <p className="text-sm">{feature.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <FeatureValue value={feature.starter} />
                </td>
                <td className="p-4 text-center bg-pink-500/5">
                  <FeatureValue value={feature.growth} highlight />
                </td>
                <td className="p-4 text-center">
                  <FeatureValue value={feature.scale} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-6">
        {tiers.map((tier, tierIndex) => (
          <Card key={tier} className={cn(
            "p-4",
            tier === 'Growth' && "border-pink-500/30 bg-pink-500/5"
          )}>
            <div className="mb-4 pb-3 border-b border-border">
              <h3 className={cn(
                "font-display font-semibold text-lg",
                tier === 'Growth' && "text-pink-500"
              )}>
                {tier}
              </h3>
              {tier === 'Growth' && (
                <span className="text-xs text-muted-foreground">Most Popular</span>
              )}
            </div>

            <div className="space-y-3">
              {features.map((feature, featureIndex) => {
                const value = tier === 'Starter' ? feature.starter
                  : tier === 'Growth' ? feature.growth
                  : feature.scale;

                return (
                  <div
                    key={featureIndex}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm font-medium text-foreground">
                        {feature.feature}
                      </span>
                      {feature.tooltip && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="text-muted-foreground hover:text-pink-500 transition-colors">
                              <HelpCircle className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="max-w-xs bg-surface-elevated border-border text-foreground"
                          >
                            <p className="text-sm">{feature.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <div className="ml-2">
                      <FeatureValue value={value} highlight={tier === 'Growth'} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}

function FeatureValue({
  value,
  highlight = false,
}: {
  value: string | boolean;
  highlight?: boolean;
}) {
  if (typeof value === "boolean") {
    return value ? (
      <div className="flex justify-center">
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center",
            highlight ? "bg-pink-500 text-white" : "bg-pink-500/10"
          )}
        >
          <Check
            className={cn("w-4 h-4", highlight ? "text-white" : "text-pink-500")}
          />
        </div>
      </div>
    ) : (
      <div className="flex justify-center">
        <X className="w-5 h-5 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <span
      className={cn(
        "text-sm",
        highlight ? "text-pink-600 font-medium" : "text-muted-foreground"
      )}
    >
      {value}
    </span>
  );
}
