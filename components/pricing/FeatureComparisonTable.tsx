"use client";

import { Check, X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface FeatureComparison {
  feature: string;
  tooltip?: string;
  [key: string]: string | boolean | undefined;
}

interface FeatureComparisonTableProps {
  features: FeatureComparison[];
  tiers: string[];
  popularTier?: string;
  accentColor?: "pink" | "violet" | "cyan" | "amber";
}

const colorClasses = {
  pink: {
    header: "text-pink-500 bg-pink-500/5",
    border: "border-pink-500/30",
    bg: "bg-pink-500/5",
    icon: "text-pink-500",
    iconBg: "bg-pink-500",
    iconBgLight: "bg-pink-500/10",
    hover: "hover:text-pink-500",
  },
  violet: {
    header: "text-violet-500 bg-violet-500/5",
    border: "border-violet-500/30",
    bg: "bg-violet-500/5",
    icon: "text-violet-500",
    iconBg: "bg-violet-500",
    iconBgLight: "bg-violet-500/10",
    hover: "hover:text-violet-500",
  },
  cyan: {
    header: "text-cyan-500 bg-cyan-500/5",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    icon: "text-cyan-500",
    iconBg: "bg-cyan-500",
    iconBgLight: "bg-cyan-500/10",
    hover: "hover:text-cyan-500",
  },
  amber: {
    header: "text-amber-500 bg-amber-500/5",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    icon: "text-amber-500",
    iconBg: "bg-amber-500",
    iconBgLight: "bg-amber-500/10",
    hover: "hover:text-amber-500",
  },
};

export function FeatureComparisonTable({
  features,
  tiers,
  popularTier,
  accentColor = "pink",
}: FeatureComparisonTableProps) {
  const colors = colorClasses[accentColor];

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
              {tiers.map((tier, index) => {
                const isPopular = tier === popularTier;
                return (
                  <th
                    key={tier}
                    className={cn(
                      "text-center p-4 font-display font-semibold w-[180px]",
                      isPopular
                        ? `${colors.header} rounded-t-xl`
                        : "text-foreground",
                      index === tiers.length - 1 && !isPopular && "rounded-tr-xl"
                    )}
                  >
                    {tier}
                    {isPopular && (
                      <span className="block text-xs font-normal text-muted-foreground mt-1">
                        Most Popular
                      </span>
                    )}
                  </th>
                );
              })}
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
                          <button
                            className={cn(
                              "text-muted-foreground transition-colors",
                              colors.hover
                            )}
                          >
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
                {tiers.map((tier) => {
                  const isPopular = tier === popularTier;
                  const value = feature[tier.toLowerCase()];
                  return (
                    <td
                      key={tier}
                      className={cn("p-4 text-center", isPopular && colors.bg)}
                    >
                      <FeatureValue
                        value={value}
                        highlight={isPopular}
                        colors={colors}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-6">
        {tiers.map((tier) => {
          const isPopular = tier === popularTier;
          return (
            <Card
              key={tier}
              className={cn(
                "p-4",
                isPopular && `${colors.border} ${colors.bg}`
              )}
            >
              <div className="mb-4 pb-3 border-b border-border">
                <h3
                  className={cn(
                    "font-display font-semibold text-lg",
                    isPopular && colors.header.split(" ")[0]
                  )}
                >
                  {tier}
                </h3>
                {isPopular && (
                  <span className="text-xs text-muted-foreground">
                    Most Popular
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {features.map((feature, featureIndex) => {
                  const value = feature[tier.toLowerCase()];

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
                              <button
                                className={cn(
                                  "text-muted-foreground transition-colors",
                                  colors.hover
                                )}
                              >
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
                        <FeatureValue
                          value={value}
                          highlight={isPopular}
                          colors={colors}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

function FeatureValue({
  value,
  highlight = false,
  colors,
}: {
  value: string | boolean | undefined;
  highlight?: boolean;
  colors: (typeof colorClasses)[keyof typeof colorClasses];
}) {
  if (typeof value === "boolean") {
    return value ? (
      <div className="flex justify-center">
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center",
            highlight ? colors.iconBg : colors.iconBgLight
          )}
        >
          <Check
            className={cn("w-4 h-4", highlight ? "text-white" : colors.icon)}
          />
        </div>
      </div>
    ) : (
      <div className="flex justify-center">
        <X className="w-5 h-5 text-muted-foreground/40" />
      </div>
    );
  }

  if (value === undefined || value === "") {
    return (
      <div className="flex justify-center">
        <X className="w-5 h-5 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <span
      className={cn(
        "text-sm",
        highlight
          ? `${colors.icon} font-medium`
          : "text-muted-foreground"
      )}
    >
      {value}
    </span>
  );
}
