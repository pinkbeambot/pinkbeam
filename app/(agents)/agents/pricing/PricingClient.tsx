"use client";

import { useState } from "react";
import { DollarSign, HelpCircle, Plus, Mail } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { Button, Input } from "@/components/ui";
import { PricingToggle } from "./components/PricingToggle";
import { PricingCard } from "./components/PricingCard";
import { FeatureComparisonTable } from "./components/FeatureComparison";
import { PricingFAQ } from "./components/PricingFAQ";
import { cn } from "@/lib/utils";
import { getFieldErrors, pricingContactSchema } from "@/lib/validation";
import {
  pricingTiers,
  featureComparisons,
  addOns,
  pricingFAQ,
} from "./data/pricing";

export default function PricingClient() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = pricingContactSchema.safeParse(contactForm);
    if (!validation.success) {
      setContactErrors(getFieldErrors(validation.error));
      return;
    }
    setContactErrors({});
    console.log("Contact form submitted:", contactForm);
    alert("Thanks for your interest! We'll be in touch soon.");
    setContactForm({ name: "", email: "", company: "", message: "" });
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-500/10 mb-6">
              <DollarSign className="w-7 h-7 text-pink-500" />
            </div>
            <h1 className="text-hero font-display font-bold mb-6">
              Simple, Transparent{" "}
              <span className="text-gradient-beam">Pricing</span>
            </h1>
            <p className="text-lead text-muted-foreground mb-8">
              Hire AI employees for less than a single human salary. Start small,
              scale as you grow. No hidden fees, no surprises.
            </p>
            <PricingToggle
              isAnnual={isAnnual}
              onToggle={setIsAnnual}
              savingsText="Save 2 months free with annual billing"
            />
          </FadeIn>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 md:py-24 bg-surface-sunken">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricingTiers.map((tier, index) => (
              <FadeIn key={tier.name} delay={index * 0.1}>
                <PricingCard tier={tier} isAnnual={isAnnual} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              Compare All Features
            </h2>
            <p className="text-lead text-muted-foreground">
              Everything you need to know about each plan
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <FeatureComparisonTable features={featureComparisons} />
          </FadeIn>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-16 md:py-24 bg-surface-sunken">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-500/10 mb-6">
              <Plus className="w-7 h-7 text-pink-500" />
            </div>
            <h2 className="text-h2 font-display font-bold mb-4">
              Optional Add-ons
            </h2>
            <p className="text-lead text-muted-foreground">
              Customize your plan with these extras
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {addOns.map((addon, index) => (
                <div
                  key={index}
                  className="bg-surface-elevated rounded-xl border border-border p-6 hover:border-pink-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-semibold text-foreground">
                      {addon.name}
                    </h3>
                    <span className="text-lg font-display font-bold text-pink-500">
                      +${addon.price}/mo
                    </span>
                  </div>
                  <p className="text-body text-muted-foreground">
                    {addon.description}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-500/10 mb-6">
              <HelpCircle className="w-7 h-7 text-pink-500" />
            </div>
            <h2 className="text-h2 font-display font-bold mb-4">
              Pricing FAQ
            </h2>
            <p className="text-lead text-muted-foreground">
              Common questions about our pricing and plans
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <PricingFAQ items={pricingFAQ} />
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-surface-sunken">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-500/10 mb-6">
              <Mail className="w-7 h-7 text-pink-500" />
            </div>
            <h2 className="text-h2 font-display font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lead text-muted-foreground mb-8">
              Get in touch with our team for a personalized quote or demo
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <form
              onSubmit={handleContactSubmit}
              className="bg-surface-elevated rounded-2xl border border-border p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => {
                      setContactForm({ ...contactForm, name: e.target.value })
                      if (contactErrors.name) {
                        setContactErrors((prev) => {
                          const next = { ...prev }
                          delete next.name
                          return next
                        })
                      }
                    }}
                    aria-invalid={Boolean(contactErrors.name)}
                    aria-describedby={contactErrors.name ? "pricing-name-error" : undefined}
                    className={cn(
                      contactErrors.name && "border-destructive focus-visible:ring-destructive/30"
                    )}
                    required
                  />
                  {contactErrors.name && (
                    <p id="pricing-name-error" className="text-xs text-destructive mt-1">
                      {contactErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={contactForm.email}
                    onChange={(e) => {
                      setContactForm({ ...contactForm, email: e.target.value })
                      if (contactErrors.email) {
                        setContactErrors((prev) => {
                          const next = { ...prev }
                          delete next.email
                          return next
                        })
                      }
                    }}
                    aria-invalid={Boolean(contactErrors.email)}
                    aria-describedby={contactErrors.email ? "pricing-email-error" : undefined}
                    className={cn(
                      contactErrors.email && "border-destructive focus-visible:ring-destructive/30"
                    )}
                    required
                  />
                  {contactErrors.email && (
                    <p id="pricing-email-error" className="text-xs text-destructive mt-1">
                      {contactErrors.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Company
                </label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your company name"
                  value={contactForm.company}
                  onChange={(e) => {
                    setContactForm({ ...contactForm, company: e.target.value })
                    if (contactErrors.company) {
                      setContactErrors((prev) => {
                        const next = { ...prev }
                        delete next.company
                        return next
                      })
                    }
                  }}
                  aria-invalid={Boolean(contactErrors.company)}
                  aria-describedby={contactErrors.company ? "pricing-company-error" : undefined}
                  className={cn(
                    contactErrors.company && "border-destructive focus-visible:ring-destructive/30"
                  )}
                />
                {contactErrors.company && (
                  <p id="pricing-company-error" className="text-xs text-destructive mt-1">
                    {contactErrors.company}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us about your needs..."
                  className="w-full px-3 py-2 rounded-md border border-input bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background resize-none"
                  value={contactForm.message}
                  onChange={(e) => {
                    setContactForm({ ...contactForm, message: e.target.value })
                    if (contactErrors.message) {
                      setContactErrors((prev) => {
                        const next = { ...prev }
                        delete next.message
                        return next
                      })
                    }
                  }}
                  aria-invalid={Boolean(contactErrors.message)}
                  aria-describedby={contactErrors.message ? "pricing-message-error" : undefined}
                  required
                />
                {contactErrors.message && (
                  <p id="pricing-message-error" className="text-xs text-destructive mt-1">
                    {contactErrors.message}
                  </p>
                )}
              </div>
              <Button type="submit" variant="beam" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-8 text-center">
            <p className="text-body text-muted-foreground">
              Or start small —{" "}
              <button
                onClick={() => console.log("Navigate to Starter signup")}
                className="text-pink-500 hover:text-pink-600 font-medium"
              >
                begin with Starter and upgrade anytime
              </button>
            </p>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
