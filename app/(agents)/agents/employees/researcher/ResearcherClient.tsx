"use client";

import { Search, Bell, FileText, TrendingUp, Target, Clock, Check } from "lucide-react";
import { EmployeeHero } from "../components/EmployeeHero";
import { CapabilityCard } from "../components/CapabilityCard";
import { PricingCard } from "../components/PricingCard";
import { IntegrationShowcase } from "../components/IntegrationShowcase";
import { FadeIn } from "@/components/animations";
import { Quote } from "lucide-react";

const capabilities = [
  {
    icon: Clock,
    title: "Monitors 50+ Sources 24/7",
    description: "Sarah continuously scans news sites, RSS feeds, Twitter, SEC filings, and industry publications so you never miss critical updates.",
  },
  {
    icon: Target,
    title: "Tracks Competitors & Funding",
    description: "Get alerted when competitors launch products, change pricing, announce partnerships, or raise funding rounds.",
  },
  {
    icon: FileText,
    title: "Delivers Monday Morning Briefs",
    description: "Start your week with a curated executive summary of everything that matters to your business.",
  },
  {
    icon: Bell,
    title: "Real-Time Breaking News Alerts",
    description: "Critical developments are flagged instantly via Slack, email, or your preferred channel.",
  },
  {
    icon: TrendingUp,
    title: "Custom Focus Areas",
    description: "Configure Sarah to prioritize specific topics, companies, or trends based on your strategic priorities.",
  },
];

const sampleBrief = `MONDAY MARKET INTELLIGENCE BRIEF
Week of February 3, 2025

=== COMPETITOR ACTIVITY ===
• Competitor X launched new API pricing (20% decrease)
• Competitor Y raised $15M Series B (TechCrunch)
• Competitor Z announced partnership with Salesforce

=== INDUSTRY TRENDS ===
• AI adoption in enterprise up 340% YoY
• New GDPR compliance requirements announced
• Supply chain disruptions affecting chip availability

=== FUNDING LANDSCAPE ===
• 47 deals totaling $2.3B in our sector
• Average Series A increased to $12M
• Notable: Company ABC's $50M round

=== RECOMMENDED ACTIONS ===
1. Review pricing strategy vs. Competitor X
2. Schedule competitive analysis meeting
3. Monitor Salesforce partnership impact`;

const integrations = [
  { name: "RSS Feeds", icon: "R" },
  { name: "Twitter/X", icon: "X" },
  { name: "News APIs", icon: "N" },
  { name: "SEC Filings", icon: "S" },
  { name: "Slack", icon: "Sl" },
  { name: "Email", icon: "Em" },
];

export default function ResearcherClient() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <EmployeeHero
        name="Sarah"
        role="Market Intelligence Analyst"
        tagline="Your Personal Market Intelligence Analyst"
        description="Sarah monitors the market 24/7, tracking competitors, funding rounds, and industry trends. She delivers actionable intelligence so you can make informed strategic decisions without spending hours reading news."
        icon={Search}
        iconColor="bg-pink-500"
        ctaText="Configure Sarah"
      />

      {/* Capabilities Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-h2 font-display font-bold mb-4">
              What Sarah <span className="text-gradient-beam">Can Do</span>
            </h2>
            <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
              Fully autonomous research capabilities that scale with your intelligence needs.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <CapabilityCard {...capability} iconColor="bg-pink-500" />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Brief Section */}
      <section className="py-20 bg-surface-sunken">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <h2 className="text-h2 font-display font-bold mb-4">
                Sample <span className="text-gradient-beam">Brief Output</span>
              </h2>
              <p className="text-lead text-muted-foreground mb-6">
                Every Monday, Sarah delivers a comprehensive market intelligence brief directly to your inbox. 
                Structured, actionable, and tailored to your priorities.
              </p>
              <ul className="space-y-3">
                {[
                  "Executive summary of key events",
                  "Competitor activity tracking",
                  "Industry trend analysis",
                  "Funding landscape overview",
                  "Recommended strategic actions",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-pink-500/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-pink-500" />
                    </div>
                    <span className="text-body text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={0.2} direction="left">
              <div className="bg-void-900 rounded-xl p-6 font-mono text-sm text-void-200 overflow-x-auto border border-void-700">
                <pre className="whitespace-pre-wrap">{sampleBrief}</pre>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <IntegrationShowcase
        title="Source Integrations"
        description="Sarah connects to your favorite sources and tools"
        integrations={integrations}
      />

      {/* Testimonial Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="relative bg-surface-elevated rounded-2xl p-8 md:p-12 border border-border">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center">
                <Quote className="w-6 h-6 text-pink-500" />
              </div>
              <blockquote className="text-h4 font-display font-medium text-foreground text-center mb-8 pt-4">
                "Sarah's weekly briefs have become essential to our strategic planning. 
                We've identified three competitive threats early and adjusted our roadmap accordingly. 
                It's like having a full-time analyst for a fraction of the cost."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center">
                  <span className="text-white font-display font-bold">JL</span>
                </div>
                <div className="text-left">
                  <p className="font-display font-semibold text-foreground">Jennifer Lee</p>
                  <p className="text-small text-muted-foreground">VP Strategy, TechVentures Inc.</p>
                </div>
              </div>
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
              One flat monthly fee. No usage limits. No surprises.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="max-w-md mx-auto">
              <PricingCard
                name="Sarah — Researcher"
                price={500}
                description="Full-time market intelligence analyst"
                features={[
                  "Unlimited research requests",
                  "Weekly executive briefs",
                  "Real-time alerts",
                  "50+ source monitoring",
                  "Custom focus areas",
                  "Slack & email integration",
                  "Source citations included",
                ]}
                ctaText="Configure Sarah"
                popular={true}
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
