"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Palette, Monitor, Smartphone, Zap, Shield } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { WebHero } from "../components/WebHero";

const designFeatures = [
  {
    icon: Palette,
    title: "Custom Design",
    description: "Unique designs tailored to your brand. No templates, no cookie-cutter solutions.",
  },
  {
    icon: Monitor,
    title: "Responsive Design",
    description: "Flawless experiences on desktop, tablet, and mobile devices.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "Designed for mobile users first, then scaled up for larger screens.",
  },
  {
    icon: Zap,
    title: "Fast Performance",
    description: "Optimized for speed. Sub-2-second load times as standard.",
  },
  {
    icon: Shield,
    title: "SEO Built-In",
    description: "Clean code, semantic HTML, and technical SEO from day one.",
  },
  {
    icon: Check,
    title: "Accessibility",
    description: "WCAG 2.1 AA compliance. Your site works for everyone.",
  },
];

const designProcess = [
  {
    step: "01",
    title: "Discovery",
    description: "We dive deep into your brand, competitors, and goals to understand what makes you unique.",
  },
  {
    step: "02",
    title: "Strategy",
    description: "Information architecture, user flows, and content strategy that converts visitors.",
  },
  {
    step: "03",
    title: "Design",
    description: "High-fidelity mockups with your branding, colors, and typography.",
  },
  {
    step: "04",
    title: "Development",
    description: "Clean, modern code using Next.js, React, and Tailwind CSS.",
  },
  {
    step: "05",
    title: "Launch",
    description: "Rigorous testing, performance optimization, and smooth deployment.",
  },
];

const faqs = [
  {
    question: "How long does a typical website take?",
    answer: "Most websites take 4-8 weeks from kickoff to launch. Simple sites can be faster, complex projects may take longer. We'll give you a specific timeline during our discovery call.",
  },
  {
    question: "Do you use templates or themes?",
    answer: "No. Every site we build is custom-designed for your brand. We don't use off-the-shelf templates because your business deserves better than cookie-cutter solutions.",
  },
  {
    question: "What platforms do you build on?",
    answer: "We specialize in Next.js and React for most projects. For content-heavy sites, we can integrate with headless CMS options like Sanity or Contentful.",
  },
  {
    question: "Will my site work on mobile?",
    answer: "Absolutely. Every site we build is fully responsive and tested on multiple devices. We design mobile-first, ensuring the experience is excellent on any screen size.",
  },
];

export function DesignPageClient() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <WebHero />

      {/* Overview */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">Web Design</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Custom Websites That Convert
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Beautiful, fast, and effective websites built specifically for your business. 
              No templates. No compromises. Just results.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-violet-500 to-violet-600" asChild>
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-32 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What you get</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every website includes these essentials
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {designFeatures.map((feature, index) => (
              <FadeIn key={feature.title} delay={index * 0.1} direction="up">
                <div className="group p-6 rounded-2xl border bg-card h-full hover:shadow-lg hover:border-violet-500/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-violet-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-32 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A proven approach to building successful websites
            </p>
          </FadeIn>

          <div className="max-w-4xl mx-auto">
            {designProcess.map((item, index) => (
              <FadeIn key={item.step} delay={index * 0.1} direction="up">
                <div className="flex gap-6 mb-10 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-violet-500">{item.step}</span>
                    </div>
                    {index < designProcess.length - 1 && (
                      <div className="w-px h-full bg-border mt-4" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-32 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Common questions</h2>
          </FadeIn>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="p-6 rounded-xl border bg-card">
                  <h3 className="font-bold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center" direction="up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to build something great?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Let's discuss your project and create a website that drives results.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-violet-500 to-violet-600" asChild>
              <Link href="/contact">
                Get a Quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
