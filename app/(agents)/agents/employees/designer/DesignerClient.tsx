"use client";

import { Palette, Image, FileImage, Layout, Sparkles, Check, Clock, TrendingDown, DollarSign, AlertCircle, Quote } from "lucide-react";
import { EmployeeHero } from "../components/EmployeeHero";
import { CapabilityCard } from "../components/CapabilityCard";
import { PricingCard } from "../components/PricingCard";
import { IntegrationShowcase } from "../components/IntegrationShowcase";
import { EmployeeProblemSection } from "../components/EmployeeProblemSection";
import { EmployeeVALISQuote } from "../components/EmployeeVALISQuote";
import { EmployeeCostComparison } from "../components/EmployeeCostComparison";
import { EmployeeFAQ } from "../components/EmployeeFAQ";
import { FadeIn } from "@/components/animations";

const capabilities = [
  {
    icon: Image,
    title: "Creates Marketing Assets",
    description: "Generate social media graphics, ad creatives, banners, and promotional materials that match your brand guidelines.",
  },
  {
    icon: FileImage,
    title: "Builds Brand Collateral",
    description: "Design presentations, one-pagers, whitepapers, and sales decks that maintain visual consistency across all touchpoints.",
  },
  {
    icon: Layout,
    title: "Generates Social Graphics",
    description: "Produce platform-optimized images for Instagram, LinkedIn, Twitter, and more with the perfect dimensions.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Design",
    description: "Leverages cutting-edge AI to create stunning visuals from simple text descriptions and brand references.",
  },
  {
    icon: Clock,
    title: "2-3 Day Turnaround",
    description: "Submit unlimited design requests with fast turnaround times. No more waiting weeks for agency revisions.",
  },
];

const portfolioItems = [
  { title: "Social Media Kit", category: "Marketing", color: "bg-pink-500" },
  { title: "Sales Deck", category: "Collateral", color: "bg-accent-purple" },
  { title: "Product Banner", category: "Advertising", color: "bg-accent-cyan" },
  { title: "LinkedIn Graphics", category: "Social", color: "bg-accent-amber" },
  { title: "Email Headers", category: "Marketing", color: "bg-pink-400" },
  { title: "Brand Guidelines", category: "Identity", color: "bg-accent-indigo" },
];

const assetTypes = [
  "Social media graphics",
  "Ad creatives & banners",
  "Presentation decks",
  "Email marketing assets",
  "Sales collateral",
  "Infographics",
  "Product mockups",
  "Brand templates",
];

const problems = [
  {
    icon: Clock,
    title: "Design Bottlenecks Kill Momentum",
    description: "You need graphics yesterday but designers are booked for weeks. Every campaign launch gets delayed waiting for assets.",
  },
  {
    icon: TrendingDown,
    title: "Inconsistent Visual Quality",
    description: "Freelancers deliver mixed results. Agency work is great but slow. Your brand looks different across every touchpoint.",
  },
  {
    icon: DollarSign,
    title: "Design Agencies Cost $10K+/Month",
    description: "Agencies charge $10,000-$30,000/month for retainers. Freelancers are cheaper but unreliable and hard to manage.",
  },
  {
    icon: AlertCircle,
    title: "Revision Cycles Take Forever",
    description: "Three rounds of feedback. Two-week turnaround. By the time you get the final file, the campaign window is closed.",
  },
];

const integrations = [
  { name: "Figma", icon: "Fi" },
  { name: "Adobe CC", icon: "Ai" },
  { name: "Canva", icon: "Ca" },
  { name: "Slack", icon: "Sl" },
  { name: "Notion", icon: "No" },
  { name: "Brand Kit", icon: "BK" },
];

const faqs = [
  {
    question: "How long does it take to set up LUMEN?",
    answer: "Initial setup takes about 30 minutes. You'll upload your brand kit (logos, colors, fonts) and provide style references. LUMEN starts creating designs within 24 hours.",
  },
  {
    question: "What file formats does LUMEN deliver?",
    answer: "LUMEN delivers PNG, JPG, SVG, and PDF formats. Source files (Figma, PSD) are included with every design for easy editing.",
  },
  {
    question: "How does the unlimited request system work?",
    answer: "Submit as many design requests as you want via your dashboard. LUMEN works through them in 2-3 day cycles. Most clients submit 5-10 requests per month.",
  },
  {
    question: "Can LUMEN match our existing brand guidelines?",
    answer: "Yes! LUMEN learns from your brand kit, style guide, and reference materials. After 2-3 designs, output will be consistently on-brand.",
  },
  {
    question: "What if we need revisions?",
    answer: "Unlimited revisions are included. Submit feedback and LUMEN will iterate until you're satisfied—typically 1-2 revision rounds.",
  },
  {
    question: "Can LUMEN design logos or full brand identities?",
    answer: "LUMEN focuses on marketing assets and collateral. For logo design or comprehensive brand identity work, we recommend a specialized brand agency.",
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 30-day money-back guarantee. If LUMEN doesn't deliver quality designs in the first month, we'll refund your payment—no questions asked.",
  },
  {
    question: "How is this different from Canva or design templates?",
    answer: "LUMEN creates custom, on-brand designs from scratch—not template modifications. Every asset is unique and tailored to your specific needs and brand.",
  },
];

export default function DesignerClient() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <EmployeeHero
        name="LUMEN"
        role="Visual Designer"
        tagline="Your On-Demand Visual Designer"
        description="LUMEN creates stunning visual assets that elevate your brand. From social graphics to sales decks, get professional design work without the agency fees."
        icon={Palette}
        iconColor="bg-accent-indigo"
        ctaText="Configure LUMEN"
      />

      {/* Problem Section */}
      <EmployeeProblemSection
        title="Design On Demand"
        description="Get unlimited professional design without agency fees or freelancer hassles"
        problems={problems}
        colorClass="text-indigo-500"
      />

      {/* VALIS Quote */}
      <EmployeeVALISQuote
        quote="Great design isn't about hiring expensive agencies—it's about having unlimited access to quality visuals when you need them. LUMEN delivers this for $400/month instead of $10K+ agency retainers."
        colorClass="border-indigo-500/30 bg-indigo-500/5 text-indigo-400"
      />

      {/* Capabilities Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-h2 font-display font-bold mb-4">
              What LUMEN <span className="text-gradient-beam">Can Do</span>
            </h2>
            <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
              Professional visual design that brings your brand to life across every channel.
            </p>
          </FadeIn>

          {/* Featured Capabilities - Top 2 */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {capabilities.slice(0, 2).map((capability, index) => (
              <FadeIn key={index} delay={index * 0.05}>
                <CapabilityCard {...capability} iconColor="bg-accent-indigo" />
              </FadeIn>
            ))}
          </div>

          {/* Other Capabilities - Bottom 3 */}
          <div className="grid md:grid-cols-3 gap-6">
            {capabilities.slice(2).map((capability, index) => (
              <FadeIn key={index + 2} delay={(index + 2) * 0.05}>
                <CapabilityCard {...capability} iconColor="bg-accent-indigo" />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid Section */}
      <section className="py-20 bg-surface-sunken">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              Sample <span className="text-gradient-beam">Portfolio</span>
            </h2>
            <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
              A glimpse of what LUMEN can create for your brand
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="group relative aspect-[4/3] bg-surface-elevated rounded-xl border border-border overflow-hidden hover:border-accent-indigo/50 transition-all">
                  {/* Placeholder Image */}
                  <div className={`absolute inset-0 ${item.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity`}>
                      <Palette className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{item.category}</p>
                    <p className="font-display font-semibold text-white">{item.title}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Asset Types Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              Asset <span className="text-gradient-beam">Types</span>
            </h2>
            <p className="text-lead text-muted-foreground">
              LUMEN creates a wide range of visual assets
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid md:grid-cols-2 gap-4">
              {assetTypes.map((asset, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-surface-elevated rounded-lg border border-border hover:border-accent-indigo/30 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-accent-indigo" />
                  </div>
                  <span className="text-foreground font-medium">{asset}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Design Tool Integrations */}
      <IntegrationShowcase
        title="Design Tool Integrations"
        description="LUMEN works with your favorite design tools"
        integrations={integrations}
      />

      {/* Cost Comparison */}
      <EmployeeCostComparison
        roleName="LUMEN (AI Designer)"
        humanTitle="Design Agency Retainer"
        humanCost={10000}
        aiCost={400}
        colorClass="text-indigo-500"
        savings={115200}
      />

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-surface-sunken">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              Simple <span className="text-gradient-beam">Pricing</span>
            </h2>
            <p className="text-lead text-muted-foreground">
              One flat monthly fee. Unlimited design requests. No hourly rates.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="max-w-md mx-auto">
              <PricingCard
                name="LUMEN — Designer"
                price={400}
                description="On-demand visual designer"
                features={[
                  "Unlimited design requests",
                  "Social media graphics",
                  "Marketing assets",
                  "Presentation decks",
                  "Brand collateral",
                  "2-3 day turnaround",
                  "Source files included",
                ]}
                ctaText="Configure LUMEN"
                popular={true}
                iconColor="bg-accent-indigo"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Section */}
      <EmployeeFAQ faqs={faqs} />
    </main>
  );
}
