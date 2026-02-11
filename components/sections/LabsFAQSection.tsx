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
    question: "How long does a typical project take?",
    answer:
      "It depends on scope. A minimum viable product (MVP) typically takes 8-12 weeks. Larger systems might take 4-6 months. We break work into sprints so you see progress weekly and can make decisions along the way.",
  },
  {
    question: "What if we need ongoing development after launch?",
    answer:
      "We offer retainer-based partnerships starting at $5,000/month. You get a dedicated development capacity for new features, bug fixes, maintenance, and scaling. Perfect if you want us as an extended engineering team.",
  },
  {
    question: "Do you handle deployment and infrastructure?",
    answer:
      "Yes. We handle everything from design to deployment. We set up CI/CD pipelines, configure cloud infrastructure (AWS, Vercel, etc.), manage databases, and stay available post-launch for monitoring and optimization.",
  },
  {
    question: "What if our requirements change mid-project?",
    answer:
      "We work in agile sprints, so changes are expected and normal. We track scope carefully and communicate the impact on timeline and budget. If scope changes significantly, we adjust the project plan transparently.",
  },
  {
    question: "Can you integrate with our existing systems?",
    answer:
      "Absolutely. We build custom APIs and integrations to connect with your existing tools, databases, and workflows. Whether it's payment processors, CRMs, or internal systems, we can connect them.",
  },
  {
    question: "How much does a custom software project cost?",
    answer:
      "Pricing depends on complexity, team size, and timeline. A basic MVP might be $25k-$50k. A full production system could be $100k+. We provide detailed estimates after discovery. If you want to explore options, book a consultation.",
  },
  {
    question: "Do you offer fixed-price projects or only time-and-materials?",
    answer:
      "We prefer time-and-materials with transparent hourly rates after a clear scope and design phase. For projects with well-defined requirements, we can do fixed-price. Retainer models are great for long-term partnerships.",
  },
  {
    question: "What happens if we want to take over development later?",
    answer:
      "You own everything we build. We provide clean code, complete documentation, and architectural guidance. We also offer knowledge transfer and mentorship to help your team take over if you decide to build internally.",
  },
];

export function LabsFAQSection() {
  return (
    <section className="py-20 md:py-32 bg-surface-sunken">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Common Questions{" "}
            <span className="text-gradient-cyan">About Custom Software</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Have a specific question? Feel free to reach out and we'll give you a
            straight answer.
          </p>
        </FadeIn>

        {/* FAQ Accordion */}
        <FadeIn delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
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
