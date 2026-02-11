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
    question: "How long does it take to build a website?",
    answer: "For a standard website, we typically deliver in 4-6 weeks. This includes discovery, design, development, and testing. Custom solutions or very large projects may take longer. We'll give you a timeline when we discuss your project.",
  },
  {
    question: "Can you help if I already have a website?",
    answer: "Absolutely. We redesign, improve, and migrate existing websites all the time. Whether you need a complete overhaul or just some updates, we can work with what you have.",
  },
  {
    question: "Do you include SEO?",
    answer: "Yes. Basic SEO is included in all our website packages—things like technical setup, core web vitals, and page optimization. We also offer enhanced SEO services if you want ongoing optimization and content strategy.",
  },
  {
    question: "What about ongoing maintenance?",
    answer: "We offer monthly maintenance plans starting at $99/month, which includes security updates, performance monitoring, regular backups, and priority support. This keeps your site secure and running smoothly.",
  },
  {
    question: "Do I own the website?",
    answer: "Yes, you own everything. We use open source technologies and host on reliable platforms. You're never locked in—you can take your site anywhere if you want.",
  },
  {
    question: "Can you integrate with my existing tools?",
    answer: "Most likely yes. We can integrate with email platforms, CRMs, payment processors, analytics tools, and more. Let us know what tools you use and we'll find a solution.",
  },
  {
    question: "What if I need changes after launch?",
    answer: "We offer a one-month warranty period where minor changes are included. After that, we're available for updates and changes. Maintenance plans include a set amount of updates each month.",
  },
  {
    question: "Can you help with content?",
    answer: "Yes. We can write copy for your site, incorporate your existing content, or do a mix. We also offer ongoing content updates to keep your site fresh and relevant.",
  },
  {
    question: "How much does it cost?",
    answer: "Website prices range from $2,000 to $10,000+ depending on complexity. Our calculator at /web/pricing can give you a ballpark estimate. Contact us for an exact quote based on your needs.",
  },
  {
    question: "What if I'm not happy with the result?",
    answer: "We focus on collaboration and communication throughout the process. We'll do as many revisions as needed during the design and development phase to get it right. If we can't agree on an approach, we can discuss options.",
  },
];

export function WebFAQSection() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/10 mb-6">
            <HelpCircle className="w-7 h-7 text-violet-500" />
          </div>
          <h2 className="text-h2 font-display font-bold mb-4">
            Questions About{" "}
            <span className="text-gradient-beam">Website Projects</span>
          </h2>
          <p className="text-lead text-muted-foreground">
            Get answers to the most common questions about our web services.
          </p>
        </FadeIn>

        {/* FAQ Accordion */}
        <FadeIn delay={0.1}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-surface-elevated rounded-xl border border-border px-6 data-[state=open]:border-violet-500/30 transition-colors"
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
            <a href="/web/quote" className="text-violet-500 hover:text-violet-600 font-medium">
              Start a quote request
            </a>{" "}
            and we'll answer everything.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
