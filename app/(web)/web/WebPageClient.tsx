"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Globe, MessageSquare, Rocket } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { WebHero } from "./components/WebHero";
import { WebProblemSection } from "@/components/web/sections/WebProblemSection";
import { WebServicesSection } from "@/components/web/sections/WebServicesSection";
import { WebTestimonialsSection } from "@/components/web/sections/WebTestimonialsSection";
import { WebFAQSection } from "@/components/web/sections/WebFAQSection";

const processSteps = [
  {
    icon: MessageSquare,
    title: "Discovery",
    description: "We learn about your business, goals, and target audience to create a strategy.",
  },
  {
    icon: "palette", // Using string to avoid circular imports
    title: "Design",
    description: "Wireframes and visual designs that align with your brand and convert visitors.",
  },
  {
    icon: "code",
    title: "Development",
    description: "Clean, fast code with modern frameworks. Built for performance and scale.",
  },
  {
    icon: "search",
    title: "SEO & Launch",
    description: "Optimization for search engines, analytics setup, and smooth deployment.",
  },
  {
    icon: Rocket,
    title: "Growth",
    description: "Ongoing support, updates, and improvements based on real data.",
  },
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

      {/* Problem Section */}
      <WebProblemSection />

      {/* Services Section with Tabs */}
      <WebServicesSection />

      {/* Process */}
      <section className="py-20 lg:py-32 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How we work</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From first conversation to launch and beyond
            </p>
          </FadeIn>

          <div className="max-w-4xl mx-auto">
            {processSteps.map((step, index) => {
              const Icon = typeof step.icon === 'string' ? null : step.icon;
              return (
                <FadeIn key={step.title} delay={index * 0.1} direction="up">
                  <div className="flex gap-6 mb-8 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                        {Icon && <Icon className="w-5 h-5 text-violet-500" />}
                      </div>
                      {index < processSteps.length - 1 && (
                        <div className="w-px h-full bg-border mt-4" />
                      )}
                    </div>
                    <div className="pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-violet-500">0{index + 1}</span>
                        <h3 className="text-xl font-bold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Work Samples - Placeholder designs */}
      <section className="py-20 lg:py-32 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Sample work</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Design concepts and style examples
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Modern SaaS", style: "Clean, dashboard-focused", gradient: "from-violet-500/20 to-purple-500/20" },
              { title: "E-commerce", style: "Product-forward, high-converting", gradient: "from-pink-500/20 to-rose-500/20" },
              { title: "Professional", style: "Corporate, trustworthy", gradient: "from-cyan-500/20 to-blue-500/20" },
            ].map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.15} direction="up">
                <div className={`
                  group relative aspect-[4/3] rounded-2xl overflow-hidden
                  bg-gradient-to-br ${item.gradient} border
                  hover:shadow-lg hover:scale-[1.02] transition-all duration-300
                `}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Globe className="w-8 h-8 text-foreground/80" />
                      </div>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.style}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              Portfolio coming soon. Contact us to see current work.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-32 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a ballpark estimate below, or use our calculator for more details
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-start">
            {tiers.map((tier, index) => (
              <FadeIn key={tier.name} delay={index * 0.15} direction="up">
                <div className={`
                  relative p-6 lg:p-8 rounded-2xl border bg-card h-full flex flex-col
                  hover:shadow-lg hover:scale-[1.02] transition-all duration-300
                  ${tier.name === "Professional" ? "border-violet-500/50 shadow-lg shadow-violet-500/10" : ""}
                `}>
                  {tier.name === "Professional" && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-violet-600 text-white border-0">
                      Most Popular
                    </Badge>
                  )}
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
                  <Button
                    className="w-full"
                    variant={tier.name === "Professional" ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/web/quote">
                      Get a Quote
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center mt-12">
            <p className="text-body text-muted-foreground">
              Need exact pricing?{" "}
              <Link href="/web/pricing" className="text-violet-500 hover:text-violet-600 font-medium">
                Use our pricing calculator
              </Link>{" "}
              to get a detailed estimate
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <WebTestimonialsSection />

      {/* FAQ */}
      <WebFAQSection />

      {/* CTA */}
      <section className="py-20 lg:py-32 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center" direction="up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready for a new website?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Let's discuss your project and create something amazing together.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-violet-500 to-violet-600 hover:opacity-90" asChild>
              <Link href="/web/quote">
                Start Your Project
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
