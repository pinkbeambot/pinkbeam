"use client";

import { Palette, Image, FileImage, Layout, Sparkles, Check } from "lucide-react";
import { EmployeeHero } from "../components/EmployeeHero";
import { CapabilityCard } from "../components/CapabilityCard";
import { PricingCard } from "../components/PricingCard";
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

          <div className="grid md:grid-cols-2 gap-6">
            {capabilities.map((capability, index) => (
              <FadeIn key={index} delay={index * 0.1}>
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
    </main>
  );
}
