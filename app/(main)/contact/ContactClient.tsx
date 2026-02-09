"use client";

import {
  Mail,
  MessageCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Users,
  CreditCard,
  Shield,
} from "lucide-react";
import { FadeIn, FadeInOnMount } from "@/components/animations";
import { ContactForm } from "../about/components";
import { Button } from "@/components/ui";
import Link from "next/link";

// Contact info
const contactMethods = [
  {
    icon: MessageCircle,
    title: "Support",
    email: "support@pinkbeam.ai",
    description: "Technical issues, account questions, or help getting started.",
  },
  {
    icon: Mail,
    title: "Sales",
    email: "sales@pinkbeam.ai",
    description: "Questions about pricing, enterprise plans, or custom solutions.",
  },
];

// FAQ data
const faqs = [
  {
    question: "How quickly will I get a response?",
    answer:
      "We typically respond to all inquiries within 24 hours during business days. Support requests are often answered much faster—usually within a few hours.",
  },
  {
    question: "Do you offer custom enterprise solutions?",
    answer:
      "Yes! For teams with unique needs, we offer custom AI employee configurations, dedicated support, and tailored pricing. Reach out to our sales team to discuss.",
  },
  {
    question: "How do I get started with Pink Beam?",
    answer:
      "Getting started is easy. Sign up for a free 14-day trial, no credit card required. Our AI employees are ready to start working with you immediately.",
  },
];

export default function ContactClient() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-void overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-beam-glow opacity-20 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <FadeInOnMount delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-8">
                <HelpCircle className="w-4 h-4 text-pink-500" />
                <span className="text-sm font-medium text-pink-500">
                  We&apos;re Here to Help
                </span>
              </div>
            </FadeInOnMount>

            <FadeInOnMount delay={0.1}>
              <h1 className="text-hero font-display font-bold mb-6 text-white">
                Get in <span className="text-gradient-beam">Touch</span>
              </h1>
            </FadeInOnMount>

            <FadeInOnMount delay={0.2}>
              <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
                Have a question about Pink Beam? Whether you&apos;re interested in
                learning more, need support, or just want to say hello, we&apos;d love
                to hear from you.
              </p>
            </FadeInOnMount>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <FadeIn direction="up" once>
                <div className="bg-card border border-border rounded-xl p-8">
                  <h2 className="text-h3 font-display font-semibold text-foreground mb-6">
                    Send Us a Message
                  </h2>
                  <ContactForm />
                </div>
              </FadeIn>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5 space-y-8">
              {/* Contact Info */}
              <FadeIn direction="up" delay={0.1} once>
                <div>
                  <h3 className="text-h4 font-display font-semibold text-foreground mb-6">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    {contactMethods.map((method) => (
                      <div
                        key={method.title}
                        className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl"
                      >
                        <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center shrink-0">
                          <method.icon className="w-5 h-5 text-pink-500" />
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-foreground">
                            {method.title}
                          </h4>
                          <a
                            href={`mailto:${method.email}`}
                            className="text-sm text-pink-500 hover:underline"
                          >
                            {method.email}
                          </a>
                          <p className="text-sm text-muted-foreground mt-1">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Response Time */}
              <FadeIn direction="up" delay={0.2} once>
                <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-pink-500" />
                    <h4 className="font-display font-semibold text-foreground">
                      Response Time
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 24 hours during business days.
                    Support inquiries are often answered within a few hours.
                  </p>
                </div>
              </FadeIn>

              {/* FAQ Sidebar */}
              <FadeIn direction="up" delay={0.3} once>
                <div>
                  <h3 className="text-h4 font-display font-semibold text-foreground mb-6">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="bg-card border border-border rounded-xl p-4"
                      >
                        <h4 className="font-display font-medium text-foreground mb-2 text-sm">
                          {faq.question}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 md:py-28 bg-surface-sunken">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <FadeIn direction="up" once>
              <h2 className="text-h2 font-display font-bold text-foreground mb-4">
                Other Ways to Connect
              </h2>
              <p className="text-lead text-muted-foreground">
                Explore more resources or get started today.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FadeIn direction="up" delay={0} once>
              <Link href="/agents/pricing" className="block group">
                <div className="bg-card border border-border rounded-xl p-6 hover:border-pink-500/30 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-colors">
                    <CreditCard className="w-6 h-6 text-pink-500" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    Pricing
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    View our plans and find the right fit for your team.
                  </p>
                  <span className="text-sm text-pink-500 font-medium flex items-center gap-1">
                    View pricing
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </FadeIn>

            <FadeIn direction="up" delay={0.1} once>
              <Link href="/about" className="block group">
                <div className="bg-card border border-border rounded-xl p-6 hover:border-pink-500/30 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-lg bg-accent-purple/10 flex items-center justify-center mb-4 group-hover:bg-accent-purple/20 transition-colors">
                    <Users className="w-6 h-6 text-accent-purple" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    About Us
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn more about our mission and the team behind Pink Beam.
                  </p>
                  <span className="text-sm text-accent-purple font-medium flex items-center gap-1">
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </FadeIn>

            <FadeIn direction="up" delay={0.2} once>
              <Link href="/security" className="block group">
                <div className="bg-card border border-border rounded-xl p-6 hover:border-pink-500/30 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-lg bg-accent-cyan/10 flex items-center justify-center mb-4 group-hover:bg-accent-cyan/20 transition-colors">
                    <Shield className="w-6 h-6 text-accent-cyan" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    Security
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn how we keep your data safe and secure.
                  </p>
                  <span className="text-sm text-accent-cyan font-medium flex items-center gap-1">
                    Security overview
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  );
}
