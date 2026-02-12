"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Check, Calculator, HelpCircle, DollarSign, Mail } from "lucide-react";
import { FadeIn, FadeInOnMount } from "@/components/animations";
import { CompactHero } from "@/components/sections/CompactHero";
import { WebROICalculator } from "@/components/web/sections/WebROICalculator";
import { FeatureComparisonTable } from "@/components/pricing/FeatureComparisonTable";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import type { FeatureComparison } from "@/components/pricing/FeatureComparisonTable";
import type { FAQItem } from "@/components/pricing/PricingFAQ";

// Calculator types
type ProjectType = "landing" | "starter" | "business" | "ecommerce" | "custom";
type SEOPackage = "none" | "basic" | "advanced";

interface CalculatorState {
  projectType: ProjectType;
  pageCount: number;
  hasEcommerce: boolean;
  needsCMS: boolean;
  seoPackage: SEOPackage;
  isRush: boolean;
}

// Base prices
const basePrices: Record<ProjectType, { min: number; max: number }> = {
  landing: { min: 1997, max: 4500 },
  starter: { min: 3997, max: 6997 },
  business: { min: 7997, max: 14997 },
  ecommerce: { min: 12997, max: 24997 },
  custom: { min: 19997, max: 44997 },
};

// Multipliers
const seoMultipliers: Record<SEOPackage, number> = {
  none: 1,
  basic: 1.15,
  advanced: 1.3,
};

const projectTypeLabels: Record<ProjectType, string> = {
  landing: "Landing Page",
  starter: "Starter Website (5-10 pages)",
  business: "Business Website (10-25 pages)",
  ecommerce: "E-commerce Store",
  custom: "Custom Project",
};

const seoLabels: Record<SEOPackage, string> = {
  none: "No SEO",
  basic: "Basic SEO (+15%)",
  advanced: "Advanced SEO (+30%)",
};

// Calculate price range
function calculatePrice(state: CalculatorState): { min: number; max: number } {
  const base = basePrices[state.projectType];
  let min = base.min;
  let max = base.max;

  // Page count adjustment for non-landing pages
  if (state.projectType !== "landing") {
    const extraPages = Math.max(0, state.pageCount - 5);
    min += extraPages * 250;
    max += extraPages * 450;
  }

  // Feature multipliers
  if (state.hasEcommerce) {
    min *= 1.4;
    max *= 1.4;
  }

  if (state.needsCMS) {
    min *= 1.2;
    max *= 1.2;
  }

  // SEO multiplier
  min *= seoMultipliers[state.seoPackage];
  max *= seoMultipliers[state.seoPackage];

  // Rush fee
  if (state.isRush) {
    min *= 1.25;
    max *= 1.25;
  }

  return {
    min: Math.round(min / 100) * 100,
    max: Math.round(max / 100) * 100,
  };
}

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Feature comparison for website types
const featureComparisons: FeatureComparison[] = [
  {
    feature: "Number of Pages",
    essential: "1 page",
    growth: "5-10 pages",
    scale: "Unlimited",
    tooltip: "Total number of unique pages on your website",
  },
  {
    feature: "Custom Design",
    essential: "Template-based",
    growth: "Semi-custom",
    scale: "Fully custom",
    tooltip: "Level of design customization and uniqueness",
  },
  {
    feature: "Content Management",
    essential: false,
    growth: true,
    scale: true,
    tooltip: "Ability to edit content yourself without developer help",
  },
  {
    feature: "SEO Setup",
    essential: "Basic",
    growth: "Standard",
    scale: "Advanced",
    tooltip: "On-page SEO, meta tags, sitemap, and optimization",
  },
  {
    feature: "Mobile Responsive",
    essential: true,
    growth: true,
    scale: true,
    tooltip: "Website adapts to all screen sizes",
  },
  {
    feature: "Contact Forms",
    essential: "1 form",
    growth: "3 forms",
    scale: "Unlimited",
    tooltip: "Number of custom contact/lead forms",
  },
  {
    feature: "E-commerce",
    essential: false,
    growth: "Basic",
    scale: "Advanced",
    tooltip: "Online store with payment processing",
  },
  {
    feature: "Analytics Integration",
    essential: true,
    growth: true,
    scale: true,
    tooltip: "Google Analytics and conversion tracking",
  },
  {
    feature: "Performance Optimization",
    essential: "Standard",
    growth: "Advanced",
    scale: "Enterprise",
    tooltip: "Page speed and loading time optimization",
  },
  {
    feature: "Security Features",
    essential: "SSL only",
    growth: "SSL + Basic",
    scale: "Enterprise grade",
    tooltip: "Website security, SSL certificates, and protection",
  },
  {
    feature: "Custom Animations",
    essential: false,
    growth: "Basic",
    scale: "Advanced",
    tooltip: "Interactive animations and transitions",
  },
  {
    feature: "Third-party Integrations",
    essential: "2 included",
    growth: "5 included",
    scale: "Unlimited",
    tooltip: "CRM, email marketing, and other tool integrations",
  },
];

const faqs: FAQItem[] = [
  {
    question: "How accurate is the calculator?",
    answer: "The calculator provides a realistic range based on typical projects. Final pricing depends on specific requirements, design complexity, and timeline. Contact us for an exact quote.",
  },
  {
    question: "What's included in the price?",
    answer: "All projects include design, development, testing, and launch. E-commerce includes payment processing setup. CMS includes content management training.",
  },
  {
    question: "Do you offer payment plans?",
    answer: "Yes! We typically structure payments as 50% deposit, 25% at design approval, and 25% at launch. For larger projects, we can create custom payment schedules.",
  },
  {
    question: "What if my project doesn't fit these categories?",
    answer: "Every project is unique. Use the 'Custom Project' option for a rough estimate, or contact us directly. We'll provide a detailed proposal after understanding your specific needs.",
  },
  {
    question: "How long does a typical project take?",
    answer: "Landing pages take 1-2 weeks, starter websites take 3-4 weeks, business websites take 6-8 weeks, and e-commerce sites take 8-12 weeks. Rush timelines available for +25%.",
  },
  {
    question: "Do you provide hosting?",
    answer: "We can set up hosting for you on your preferred provider (Vercel, Netlify, AWS, etc.). Hosting costs are separate and typically range from $10-100/month depending on your needs.",
  },
];

const maintenancePlans = [
  {
    name: "Essential",
    price: "$79",
    period: "/month",
    description: "For simple websites",
    features: [
      "Monthly backups",
      "Security monitoring",
      "Core updates",
      "Uptime monitoring",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "$197",
    period: "/month",
    description: "For business websites",
    features: [
      "Daily backups",
      "Advanced security",
      "All updates included",
      "Performance optimization",
      "Priority support",
      "Monthly reports",
      "2 hours content updates",
    ],
    popular: true,
  },
  {
    name: "Scale",
    price: "$397",
    period: "/month",
    description: "For mission-critical sites",
    features: [
      "Real-time backups",
      "Enterprise security",
      "Immediate updates",
      "Dedicated resources",
      "Phone + email support",
      "Weekly reports",
      "5 hours content updates",
      "Strategy consulting",
    ],
  },
];

export function PricingPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);

  // Initialize state from URL or defaults
  const [state, setState] = useState<CalculatorState>({
    projectType: (searchParams.get("type") as ProjectType) || "starter",
    pageCount: parseInt(searchParams.get("pages") || "5", 10),
    hasEcommerce: searchParams.get("ecommerce") === "true",
    needsCMS: searchParams.get("cms") === "true",
    seoPackage: (searchParams.get("seo") as SEOPackage) || "none",
    isRush: searchParams.get("rush") === "true",
  });

  // Update URL when state changes (but not on initial mount)
  useEffect(() => {
    // Skip URL update on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();
    params.set("type", state.projectType);
    params.set("pages", state.pageCount.toString());
    if (state.hasEcommerce) params.set("ecommerce", "true");
    if (state.needsCMS) params.set("cms", "true");
    if (state.seoPackage !== "none") params.set("seo", state.seoPackage);
    if (state.isRush) params.set("rush", "true");

    router.replace(`/web/pricing?${params.toString()}`, { scroll: false });
  }, [state, router]);

  const price = calculatePrice(state);

  const updateState = (updates: Partial<CalculatorState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <main className="min-h-screen">
      {/* Compact Hero Section */}
      <CompactHero
        icon={Calculator}
        title="Simple Pricing"
        highlightText="Pricing"
        subtitle="Get an instant estimate with our project calculator. No hidden fees, no surprises—just transparent pricing for your web project."
        accentColor="violet-500"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-violet-500 to-violet-600 hover:opacity-90 shadow-lg shadow-violet-500/25" asChild>
            <Link href="#calculator">
              Calculate Your Project
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Link href="#maintenance" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full border-violet-500/30 hover:bg-violet-500/10">
              View Maintenance Plans
            </Button>
          </Link>
        </div>
      </CompactHero>

      {/* Calculator Section */}
      <section id="calculator" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Project Estimator</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Get an Instant Estimate
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Adjust the options below to see a price range for your project.
              For an exact quote, contact us.
            </p>
          </FadeIn>

          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calculator Form */}
                <div className="space-y-6">
                  {/* Project Type */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Project Type
                    </label>
                    <Select
                      value={state.projectType}
                      onValueChange={(value: ProjectType) =>
                        updateState({ projectType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(projectTypeLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Page Count */}
                  {state.projectType !== "landing" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Number of Pages: {state.pageCount}
                      </label>
                      <Slider
                        value={[state.pageCount]}
                        onValueChange={([value]) =>
                          updateState({ pageCount: value })
                        }
                        min={1}
                        max={50}
                        step={1}
                      />
                    </div>
                  )}

                  {/* Toggles */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        E-commerce Functionality
                      </label>
                      <Switch
                        checked={state.hasEcommerce}
                        onCheckedChange={(checked) =>
                          updateState({ hasEcommerce: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Content Management System
                      </label>
                      <Switch
                        checked={state.needsCMS}
                        onCheckedChange={(checked) =>
                          updateState({ needsCMS: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Rush Timeline (+25%)
                      </label>
                      <Switch
                        checked={state.isRush}
                        onCheckedChange={(checked) =>
                          updateState({ isRush: checked })
                        }
                      />
                    </div>
                  </div>

                  {/* SEO Package */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      SEO Package
                    </label>
                    <Select
                      value={state.seoPackage}
                      onValueChange={(value: SEOPackage) =>
                        updateState({ seoPackage: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(seoLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex flex-col justify-center">
                  <div className="p-8 rounded-2xl border bg-gradient-to-br from-violet-500/5 to-violet-600/5 text-center">
                    <Calculator className="w-12 h-12 text-violet-500 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Estimated Range
                    </p>
                    <div className="text-4xl sm:text-5xl font-bold mb-4">
                      {formatCurrency(price.min)} - {formatCurrency(price.max)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      Final price depends on specific requirements
                    </p>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-violet-500 to-violet-600"
                      asChild
                    >
                      <Link href="/contact">
                        Get Exact Quote
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <WebROICalculator />

      {/* Feature Comparison */}
      <section className="py-20 lg:py-32 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Compare Website Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understand what's included at each tier
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="max-w-5xl mx-auto">
              <FeatureComparisonTable
                features={featureComparisons}
                tiers={["Essential", "Growth", "Scale"]}
                popularTier="Growth"
                accentColor="violet"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Maintenance Plans */}
      <section id="maintenance" className="py-20 lg:py-32 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Monthly Maintenance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Keep your site secure, fast, and up-to-date
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-start">
            {maintenancePlans.map((plan, index) => (
              <FadeIn key={plan.name} delay={index * 0.15} direction="up">
                <div
                  className={`
                    relative p-6 lg:p-8 rounded-2xl border bg-card h-full flex flex-col
                    hover:shadow-lg hover:scale-[1.02] transition-all duration-300
                    ${plan.popular ? "border-violet-500/50 shadow-lg shadow-violet-500/10" : ""}
                  `}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-violet-600 text-white border-0">
                      Most Popular
                    </Badge>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-violet-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-32 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/10 mb-6">
              <HelpCircle className="w-7 h-7 text-violet-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Pricing FAQ
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Common questions about our pricing and services
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="max-w-3xl mx-auto">
              <PricingFAQ items={faqs} accentColor="violet" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-32 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/10 mb-6">
              <Mail className="w-7 h-7 text-violet-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Let's discuss your project and create a custom proposal that fits your needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-violet-600 hover:opacity-90 shadow-lg shadow-violet-500/25"
                asChild
              >
                <Link href="/contact">
                  Schedule a Call
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-violet-500/30 hover:bg-violet-500/10" asChild>
                <Link href="mailto:web@pinkbeam.io">
                  Email Us
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
