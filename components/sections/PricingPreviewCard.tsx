"use client";

import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PricingPreviewCardProps {
  title: string;
  description: string;
  price: string;
  items: string[];
  accentColor: "pink" | "violet" | "cyan" | "amber";
  popular?: boolean;
  badge?: string;
}

const colorConfig = {
  pink: {
    ring: "ring-pink-500/50",
    badge: "from-pink-500 to-pink-600",
    check: "text-pink-500",
  },
  violet: {
    ring: "ring-violet-500/50",
    badge: "from-violet-500 to-violet-600",
    check: "text-violet-500",
  },
  cyan: {
    ring: "ring-cyan-500/50",
    badge: "from-cyan-500 to-cyan-600",
    check: "text-cyan-500",
  },
  amber: {
    ring: "ring-amber-500/50",
    badge: "from-amber-500 to-amber-600",
    check: "text-amber-500",
  },
};

export function PricingPreviewCard({
  title,
  description,
  price,
  items,
  accentColor,
  popular = false,
  badge,
}: PricingPreviewCardProps) {
  const colors = colorConfig[accentColor];

  return (
    <Card
      className={cn(
        "relative h-full flex flex-col overflow-visible transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        popular && `ring-2 ${colors.ring}`
      )}
    >
      {popular && badge && (
        <Badge
          className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r text-white border-0 z-10",
            colors.badge
          )}
        >
          {badge}
        </Badge>
      )}
      <CardContent className={cn("p-6 lg:p-8 flex flex-col h-full", popular && badge && "pt-8")}>
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{price}</span>
          </div>
        </div>

        {/* Items List */}
        <ul className="space-y-3 flex-1">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className={cn("w-5 h-5 shrink-0 mt-0.5", colors.check)} />
              <span className="text-sm text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
