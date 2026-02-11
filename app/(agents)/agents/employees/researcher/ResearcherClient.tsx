"use client";

import { Search, Bell, FileText, TrendingUp, Target, Clock, Check, AlertTriangle, Zap, DollarSign, Calculator } from "lucide-react";
import { useState } from "react";
import { EmployeeHero } from "../components/EmployeeHero";
import { CapabilityCard } from "../components/CapabilityCard";
import { PricingCard } from "../components/PricingCard";
import { IntegrationShowcase } from "../components/IntegrationShowcase";
import { EmployeeProblemSection } from "../components/EmployeeProblemSection";
import { EmployeeVALISQuote } from "../components/EmployeeVALISQuote";
import { EmployeeCostComparison } from "../components/EmployeeCostComparison";
import { EmployeeFAQ } from "../components/EmployeeFAQ";
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

const problems = [
  {
    icon: Clock,
    title: "Research Takes 20+ Hours/Week",
    description: "Your team spends entire days scanning news, tracking competitors, and reading industry reports instead of executing strategy.",
  },
  {
    icon: AlertTriangle,
    title: "You're Always One Step Behind",
    description: "Competitors move faster because you miss critical market signals buried in thousands of sources.",
  },
  {
    icon: TrendingUp,
    title: "No Consistent Intelligence Process",
    description: "Market research happens ad-hoc. Your team lacks a systematic way to stay informed and spot trends early.",
  },
  {
    icon: DollarSign,
    title: "Full-Time Analysts Cost $80K+",
    description: "Hiring a market intelligence analyst costs $80,000+/year, plus benefits, training, and management overhead.",
  },
];

const faqs = [
  {
    question: "How long does it take to set up Sarah?",
    answer: "Initial setup takes about 20 minutes. You'll define your competitors, focus areas, and preferred sources. Sarah starts monitoring within 1 hour and delivers your first brief on Monday.",
  },
  {
    question: "Can Sarah monitor specific companies or topics?",
    answer: "Absolutely. You can configure Sarah to track specific competitors, technologies, funding rounds, regulatory changes, or any custom topics relevant to your business.",
  },
  {
    question: "How does Sarah find relevant information?",
    answer: "Sarah monitors 50+ sources including news APIs, RSS feeds, Twitter/X, SEC filings, and industry publications. She uses AI to filter signal from noise and surface only what matters.",
  },
  {
    question: "What if I need research beyond Monday briefs?",
    answer: "Sarah can handle ad-hoc research requests anytime. Just ask her to investigate a specific topic, competitor, or trend, and she'll deliver a detailed brief within hours.",
  },
  {
    question: "Can Sarah integrate with our existing tools?",
    answer: "Yes! Sarah delivers briefs via email, Slack, or your preferred channel. She can also sync with Notion, Google Docs, or any tool that accepts webhooks.",
  },
  {
    question: "How is this different from news aggregators?",
    answer: "News aggregators dump raw headlines. Sarah analyzes, filters, synthesizes, and provides strategic recommendations. She understands your business context and surfaces only relevant intelligence.",
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 30-day money-back guarantee. If Sarah doesn't deliver actionable intelligence in the first month, we'll refund your payment—no questions asked.",
  },
  {
    question: "How many sources can Sarah monitor?",
    answer: "Sarah monitors 50+ sources by default and can scale to 100+ based on your needs. She prioritizes quality over quantity—only surfacing truly relevant updates.",
  },
];

export default function ResearcherClient() {
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  const costPerMonth = 397;
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

      {/* Problem Section */}
      <EmployeeProblemSection
        title="Stop Missing Market Signals"
        description="Get ahead of competitors with 24/7 market intelligence"
        problems={problems}
        colorClass="text-pink-500"
      />

      {/* VALIS Quote */}
      <EmployeeVALISQuote
        quote="The best strategic advantage is information others don't have. Sarah turns data chaos into competitive intelligence—24/7, without the $80K analyst salary."
        colorClass="border-pink-500/30 bg-pink-500/5 text-pink-400"
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

          {/* Featured Capabilities - Top 2 */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {capabilities.slice(0, 2).map((capability, index) => (
              <FadeIn key={index} delay={index * 0.05}>
                <CapabilityCard {...capability} iconColor="bg-pink-500" />
              </FadeIn>
            ))}
          </div>

          {/* Other Capabilities - Bottom 3 */}
          <div className="grid md:grid-cols-3 gap-6">
            {capabilities.slice(2).map((capability, index) => (
              <FadeIn key={index + 2} delay={(index + 2) * 0.05}>
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

      {/* ROI Calculator */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              Time <span className="text-gradient-beam">Savings Calculator</span>
            </h2>
            <p className="text-lead text-muted-foreground">
              See how much time Sarah saves your team
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-surface-elevated rounded-2xl p-8 border border-border">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">
                    Hours spent on research per week: <span className="text-pink-500 font-bold">{hoursPerWeek}</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>5 hours</span>
                    <span>40 hours</span>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Manual Research Cost</span>
                      <span className="text-lg font-bold text-foreground">
                        ${(hoursPerWeek * 4 * 50).toLocaleString()}/mo
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-pink-500/10 rounded-lg border border-pink-500/30">
                      <span className="text-pink-500">Sarah Cost</span>
                      <span className="text-lg font-bold text-pink-500">$397/mo</span>
                    </div>
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 text-sm font-medium mb-4">
                    <Calculator className="w-4 h-4" />
                    Annual Time Savings
                  </div>
                  <div className="text-6xl font-display font-bold text-foreground mb-2">
                    {hoursPerWeek * 52}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    hours saved per year
                  </p>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <p className="text-green-600 font-semibold">
                      Save ${((hoursPerWeek * 4 * 50 - 397) * 12).toLocaleString()} annually
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Cost Comparison */}
      <EmployeeCostComparison
        roleName="Sarah (AI Researcher)"
        humanTitle="Full-Time Market Analyst"
        humanCost={7000}
        aiCost={397}
        colorClass="text-pink-500"
        savings={79236}
      />

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
                price={397}
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

      {/* FAQ Section */}
      <EmployeeFAQ faqs={faqs} />
    </main>
  );
}
