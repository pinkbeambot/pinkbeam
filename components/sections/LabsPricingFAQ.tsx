"use client";

import { FadeIn } from "@/components/animations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const pricingFaqs = [
  {
    question: "How do you determine the final cost of a project?",
    answer:
      "We estimate costs based on: (1) Project scope & features, (2) Complexity & technical challenges, (3) Timeline & deadline, (4) Team size needed. After discovery, we provide a detailed estimate. If scope changes, we adjust the estimate transparently.",
  },
  {
    question: "What's included in the project cost?",
    answer:
      "Our pricing includes: Design & architecture, Full development, Testing & QA, Deployment & setup, Documentation, Post-launch support (varies by project type). It does NOT include hosting fees (AWS, etc), domain registration, or ongoing maintenance unless specified.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Yes. For phase-based projects, we typically invoice 50% upfront, 50% at completion. For larger projects (3+ months), we can do 33% upfront, 33% at midpoint, 34% at delivery. For retainers, we invoice monthly in advance.",
  },
  {
    question: "What happens if the project costs more than estimated?",
    answer:
      "We lock in estimates after discovery. If scope increases mid-project, we notify you of cost impact before proceeding. We work in agile sprints so you can see progress and make scope decisions weekly.",
  },
  {
    question: "Can I switch pricing models mid-project?",
    answer:
      "Yes. If you start with phase-based and want to continue long-term, we can transition to a retainer. If you start with T&M and scope becomes clear, we can move to fixed pricing. We're flexible based on your needs.",
  },
  {
    question: "Do you offer discounts for larger projects?",
    answer:
      "We do offer better rates for multi-phase projects or long-term retainers. Also, building in phases (MVP → full product) often costs less overall than building everything at once. Let's discuss what makes sense for your situation.",
  },
  {
    question: "What about maintenance and support after launch?",
    answer:
      "Post-launch support is typically 1-3 months included in project cost. After that, you can purchase an ongoing maintenance retainer (starts at $2,000/month) for bug fixes, updates, and scaling support.",
  },
  {
    question: "How accurate are your estimates?",
    answer:
      "After a thorough discovery phase, our estimates are usually within 10-15% of actual cost. We've learned from hundreds of projects. If scope is vague, we recommend starting with T&M or building in phases to derisk the project.",
  },
];

export function LabsPricingFAQ() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Pricing Questions &{" "}
            <span className="text-gradient-cyan">Clarity</span>
          </h2>
          <p className="text-lead text-muted-foreground">
            We believe in transparent pricing. Here are answers to common questions.
          </p>
        </FadeIn>

        {/* FAQ Accordion */}
        <FadeIn delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {pricingFaqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left hover:text-cyan-500 transition-colors">
                  <span className="text-body font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
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
