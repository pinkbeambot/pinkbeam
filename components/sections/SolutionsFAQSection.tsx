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
    question: "How is this different from hiring a traditional consultant?",
    answer:
      "We're practitioners, not slide-deck consultants. Our team has built and scaled real technology — we've been CTOs, VPs of Engineering, and technical founders. We don't just recommend strategy, we help you execute it, and we can connect you with our Labs and Agents teams when it's time to build.",
  },
  {
    question: "What's a fractional CTO and do I need one?",
    answer:
      "A fractional CTO gives you senior technology leadership on a part-time basis — typically 10-40 hours per month. It's ideal if you need strategic guidance but can't justify a full-time $300K+ executive hire. Most growing companies between $1M-$50M in revenue benefit from this model.",
  },
  {
    question: "How do I know which engagement model is right for me?",
    answer:
      "Start with what you need most urgently. If you need quick clarity, a workshop ($2,500-$10K) is the fastest path. If you need a thorough evaluation, an assessment ($10K-$25K) gives you a detailed roadmap. If you need ongoing guidance, a retainer ($5K-$20K/mo) provides consistent support. We'll help you choose the right fit during our initial consultation.",
  },
  {
    question: "Can you help implement the strategy, or just advise?",
    answer:
      "Both. We guide implementation directly through our retainer and project engagements. And when the strategy calls for custom software, AI agents, or web development, our Labs, Agents, and Web teams can handle the build. You get strategy and execution from one partner.",
  },
  {
    question: "What industries do you work with?",
    answer:
      "We work across industries — SaaS, e-commerce, healthcare, financial services, manufacturing, and professional services. Our expertise is in technology strategy and digital transformation, which applies universally. The specifics change by industry, but the methodology stays consistent.",
  },
  {
    question: "How long does a typical engagement last?",
    answer:
      "Workshops are half-day to multi-day. Assessments take 2-3 weeks. Projects run 2-12 months depending on scope. Retainer clients typically stay 6-12+ months as their strategic needs evolve. There are no long-term contracts required — we earn your continued engagement through results.",
  },
  {
    question: "What deliverables do I actually get?",
    answer:
      "Every engagement produces tangible deliverables you own. Workshops deliver action plans and prioritized roadmaps. Assessments produce detailed reports with specific recommendations. Projects deliver completed implementations. Retainers include monthly strategy documents, quarterly business reviews, and ongoing advisory access.",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a free consultation call. We'll spend 30 minutes understanding your situation and recommend the best engagement model. No pressure, no sales pitch — just an honest conversation about whether we're the right fit.",
  },
];

export function SolutionsFAQSection() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Questions
            </span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Common questions about our consulting services and engagement
            models.
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
