"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { WebHero } from "./components/WebHero";

const features = [
  "Custom website design",
  "SEO optimization",
  "Performance tuning",
  "Analytics setup",
  "Ongoing maintenance",
  "Content updates",
];

const tiers = [
  {
    name: "Starter",
    price: "$2,000",
    description: "Perfect for small businesses",
    features: ["5-page website", "Mobile responsive", "Basic SEO", "1 month support"],
  },
  {
    name: "Professional",
    price: "$5,000",
    description: "For growing companies",
    features: ["10-page website", "Advanced SEO", "Analytics dashboard", "3 months support", "Blog setup"],
  },
  {
    name: "Enterprise",
    price: "$10,000+",
    description: "Custom solutions",
    features: ["Unlimited pages", "Custom functionality", "Priority support", "12 months support", "Dedicated manager"],
  },
];

export function WebPageClient() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <WebHero />

      {/* Features */}
      <section id="features" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From design to deployment to ongoing optimization
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <FadeIn key={feature} delay={index * 0.1} direction="up">
                <div className="flex items-center gap-3 p-4 rounded-xl border bg-card h-full">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-violet-500" />
                  </div>
                  <span className="font-medium">{feature}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 lg:py-32 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {tiers.map((tier, index) => (
              <FadeIn key={tier.name} delay={index * 0.15} direction="up">
                <div className="p-6 lg:p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow h-full flex flex-col">
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{tier.description}</p>
                  <div className="text-3xl font-bold mb-6">{tier.price}</div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-violet-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={tier.name === "Professional" ? "default" : "outline"}>
                    Get Started
                  </Button>
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
              Ready for a new website?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Let's discuss your project and create something amazing together.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-violet-500 to-violet-600 hover:opacity-90">
              Schedule a Call
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
