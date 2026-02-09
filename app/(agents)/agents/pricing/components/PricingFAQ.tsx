"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";

interface FAQItem {
  question: string;
  answer: string;
}

interface PricingFAQProps {
  items: FAQItem[];
}

export function PricingFAQ({ items }: PricingFAQProps) {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="bg-surface-elevated rounded-xl border border-border px-6 data-[state=open]:border-pink-500/30 transition-colors"
        >
          <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:no-underline py-5">
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
