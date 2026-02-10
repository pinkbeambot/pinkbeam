"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, Clock, RefreshCw, AlertTriangle, Headphones } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { WebHero } from "../components/WebHero";

const maintenanceFeatures = [
  {
    icon: Shield,
    title: "Security Updates",
    description: "Regular security patches and vulnerability monitoring to keep your site safe.",
  },
  {
    icon: Zap,
    title: "Performance Monitoring",
    description: "24/7 uptime monitoring and performance optimization.",
  },
  {
    icon: RefreshCw,
    title: "Regular Backups",
    description: "Daily automated backups with one-click restore capability.",
  },
  {
    icon: Clock,
    title: "Core Updates",
    description: "CMS, plugin, and framework updates tested before deployment.",
  },
  {
    icon: Headphones,
    title: "Priority Support",
    description: "Fast response times and expert help when you need it.",
  },
  {
    icon: AlertTriangle,
    title: "Issue Resolution",
    description: "Proactive monitoring and quick fixes for any problems.",
  },
];

const carePlans = [
  {
    name: "Essential",
    price: "$99/mo",
    description: "For simple websites",
    features: [
      "Monthly backups",
      "Security monitoring",
      "Core updates",
      "Uptime monitoring",
      "Email support",
      "48hr response time",
    ],
  },
  {
    name: "Professional",
    price: "$249/mo",
    description: "For business websites",
    features: [
      "Daily backups",
      "Advanced security",
      "All updates included",
      "Performance optimization",
      "Priority support",
      "24hr response time",
      "Monthly reports",
      "Content updates (2hrs)",
    ],
  },
  {
    name: "Enterprise",
    price: "$499/mo",
    description: "For mission-critical sites",
    features: [
      "Real-time backups",
      "Enterprise security",
      "Immediate updates",
      "Dedicated resources",
      "Phone + email support",
      "4hr response time",
      "Weekly reports",
      "Content updates (5hrs)",
      "Strategy consulting",
    ],
  },
];

const faqs = [
  {
    question: "What's included in website maintenance?",
    answer: "Our maintenance plans include security monitoring, regular backups, CMS and plugin updates, uptime monitoring, performance optimization, and technical support. Higher-tier plans include content updates and strategic consulting.",
  },
  {
    question: "What happens if my site goes down?",
    answer: "We monitor all sites 24/7. If your site goes down, we investigate immediately and work to restore service. For Professional and Enterprise plans, we proactively address issues before they impact your visitors.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, all our maintenance plans are month-to-month with no long-term contracts. We just ask for 30 days notice so we can ensure a smooth handoff.",
  },
  {
    question: "Do you work with sites you didn't build?",
    answer: "Absolutely. We can take over maintenance of most WordPress, Shopify, or custom-built websites. We'll start with a comprehensive audit to understand your site's current state.",
  },
];

export function MaintenancePageClient() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <WebHero />

      {/* Overview */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">Maintenance</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Keep Your Site Running Smoothly
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Professional website maintenance, security, and support. 
              Focus on your business while we handle the technical details.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-violet-500 to-violet-600" asChild>
              <Link href="/contact">
                View Care Plans
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What's included</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive care for your website
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {maintenanceFeatures.map((feature, index) => (
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

      {/* Pricing */}
      <section className="py-20 lg:py-32 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Care plans</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the level of care your website needs
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-start">
            {carePlans.map((plan, index) => (
              <FadeIn key={plan.name} delay={index * 0.15} direction="up">
                <div className={`
                  relative p-6 lg:p-8 rounded-2xl border bg-card h-full flex flex-col
                  hover:shadow-lg hover:scale-[1.02] transition-all duration-300
                  ${plan.name === "Professional" ? "border-violet-500/50 shadow-lg shadow-violet-500/10" : ""}
                `}>
                  {plan.name === "Professional" && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-violet-600 text-white border-0">
                      Most Popular
                    </Badge>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="text-3xl font-bold mb-6">{plan.price}</div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-violet-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.name === "Professional" ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/contact">
                      Get Started
                    </Link>
                  </Button>
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
              Ready for peace of mind?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Let us handle the technical stuff while you focus on growing your business.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-violet-500 to-violet-600" asChild>
              <Link href="/contact">
                Schedule a Call
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
