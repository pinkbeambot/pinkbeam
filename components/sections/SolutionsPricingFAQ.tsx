"use client";

import { FadeIn } from "@/components/animations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Can I switch between engagement models?",
    answer:
      "Absolutely. Most clients evolve naturally — start with a workshop for quick alignment, move to an assessment for deeper analysis, then transition to a retainer for ongoing support. There's no lock-in at any stage.",
  },
  {
    question: "What's the minimum commitment for a retainer?",
    answer:
      "We recommend a minimum of 3 months to see meaningful results, but there's no long-term contract required. Retainers are month-to-month after the initial period. We earn continued engagement through results, not contracts.",
  },
  {
    question: "Do you offer discounts for startups?",
    answer:
      "We work with companies at every stage. For early-stage startups, a workshop or focused assessment is usually the best starting point — it gives you maximum value for a defined investment. We can also structure retainers to match startup budgets.",
  },
  {
    question: "What happens after an assessment?",
    answer:
      "You receive a comprehensive report with prioritized recommendations, a detailed implementation roadmap, and an executive presentation. You own all deliverables. From there, you can implement independently, continue with us on a retainer, or engage our Labs/Agents teams for the build.",
  },
  {
    question: "How are project engagements priced?",
    answer:
      "Projects can be fixed-fee, time-and-materials, or hybrid depending on scope clarity. Fixed-fee works best when requirements are well-defined. T&M is better for evolving scope. We'll recommend the right model during discovery.",
  },
  {
    question: "Can your consulting team also build the software?",
    answer:
      "Our Solutions team focuses on strategy and advisory. When the strategy calls for custom software, AI agents, or web development, we bring in our Labs, Agents, or Web teams. You get one partner for both strategy and execution.",
  },
  {
    question: "What if I'm not sure which model I need?",
    answer:
      "Book a free 30-minute consultation. We'll listen to your situation and recommend the best starting point. No sales pressure — if we're not the right fit, we'll tell you.",
  },
  {
    question: "Are travel expenses included?",
    answer:
      "Most engagements are conducted remotely. For on-site workshops or assessments, travel expenses are billed separately at cost. We'll always get approval before booking any travel.",
  },
];

export function SolutionsPricingFAQ() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Pricing{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              FAQ
            </span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Common questions about our engagement models and pricing.
          </p>
        </FadeIn>

        {/* FAQ Accordion */}
        <FadeIn delay={0.1}>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="border border-border rounded-xl px-6 data-[state=open]:border-amber-500/30"
                >
                  <AccordionTrigger className="text-left font-display font-semibold hover:text-amber-500 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
