"use client";

import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";
import { FadeIn } from "@/components/animations";

const faqItems = [
  {
    question: "How do I choose the right service?",
    answer: "Each service solves different problems. Need to scale your team? Start with AI Employees. Building an online presence? Go with Websites. Need custom functionality? Choose Custom Software. Unsure about strategy? Book a consultation.",
  },
  {
    question: "Can I use multiple services together?",
    answer: "Absolutely! Many customers combine services. For example: hire AI Employees for lead generation, build a website with Custom Software integrations, and use Consulting to optimize processes. One platform handles it all.",
  },
  {
    question: "What if I'm not happy with the service?",
    answer: "We stand behind our work. AI Employees have a 30-day trial. Websites have revision rounds during development. Custom Software includes ongoing support. If we can't deliver, we'll make it right.",
  },
  {
    question: "How long does onboarding take?",
    answer: "Most services launch in 1-2 weeks. AI Employees: 5 minutes setup. Websites: 4-6 weeks total. Custom Software: varies by scope. Consulting: book your first call immediately.",
  },
  {
    question: "Do you offer payment plans?",
    answer: "Yes! AI Employees are monthly subscriptions. Websites typically use 50% upfront / 50% at launch. Custom Software uses milestone-based payments. Consulting is hourly or project-based.",
  },
  {
    question: "Is there a long-term contract?",
    answer: "No contracts for AI Employees—cancel anytime. Websites have a project timeline, but maintenance plans are month-to-month. Custom Software includes support but no lock-in.",
  },
];

export function HomeFAQSection() {
  return (
    <section className="py-20 md:py-32 bg-surface-sunken">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-500/10 mb-6">
            <HelpCircle className="w-7 h-7 text-pink-500" />
          </div>
          <h2 className="text-h2 font-display font-bold mb-4">
            Questions?
          </h2>
          <p className="text-lead text-muted-foreground">
            We've answered the common ones. For specifics, reach out.
          </p>
        </FadeIn>

        {/* FAQ Accordion */}
        <FadeIn delay={0.1}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
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
        </FadeIn>

        {/* Contact CTA */}
        <FadeIn delay={0.2} className="mt-12 text-center">
          <p className="text-body text-muted-foreground">
            Still have questions?{" "}
            <a href="/contact" className="text-pink-500 hover:text-pink-600 font-medium">
              Get in touch
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
