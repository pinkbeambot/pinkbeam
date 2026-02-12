"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

interface PricingFAQProps {
  items: FAQItem[];
  accentColor?: "pink" | "violet" | "cyan" | "amber";
}

const colorClasses = {
  pink: {
    border: "data-[state=open]:border-pink-500/30",
    hover: "hover:text-pink-500",
  },
  violet: {
    border: "data-[state=open]:border-violet-500/30",
    hover: "hover:text-violet-500",
  },
  cyan: {
    border: "data-[state=open]:border-cyan-500/30",
    hover: "hover:text-cyan-500",
  },
  amber: {
    border: "data-[state=open]:border-amber-500/30",
    hover: "hover:text-amber-500",
  },
};

export function PricingFAQ({ items, accentColor = "pink" }: PricingFAQProps) {
  const colors = colorClasses[accentColor];

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className={cn(
            "bg-surface-elevated rounded-xl border border-border px-6 transition-colors",
            colors.border
          )}
        >
          <AccordionTrigger
            className={cn(
              "text-left font-display font-semibold text-foreground hover:no-underline py-5 transition-colors",
              colors.hover
            )}
          >
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-body text-muted-foreground pb-5">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
