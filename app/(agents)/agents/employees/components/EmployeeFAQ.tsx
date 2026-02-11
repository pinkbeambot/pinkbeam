"use client";

import { FadeIn } from "@/components/animations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface EmployeeFAQProps {
  title?: string;
  description?: string;
  faqs: FAQItem[];
}

export function EmployeeFAQ({
  title = "Frequently Asked Questions",
  description = "Everything you need to know about hiring this AI employee",
  faqs,
}: EmployeeFAQProps) {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            {title}
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </FadeIn>

        {/* FAQ Accordion */}
        <FadeIn delay={0.1}>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-surface-elevated"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-display font-semibold text-foreground">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
