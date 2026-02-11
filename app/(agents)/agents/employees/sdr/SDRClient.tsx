"use client";

import { Users, Search, Mail, Calendar, Database, Check, Calculator, Clock, TrendingDown, DollarSign, Target } from "lucide-react";
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
    icon: Search,
    title: "Researches Every Lead Before Outreach",
    description: "Mike analyzes prospects' LinkedIn, company news, recent posts, and trigger events to craft hyper-personalized outreach.",
  },
  {
    icon: Mail,
    title: "Writes Personalized Email Sequences",
    description: "No templates. Every email is uniquely crafted based on prospect research and your value proposition.",
  },
  {
    icon: Calendar,
    title: "3-Touch Cadence Over 7 Days",
    description: "Automated multi-channel follow-up including email, LinkedIn, and voicemail drops to maximize response rates.",
  },
  {
    icon: Database,
    title: "Books Meetings Directly",
    description: "Mike handles objections, answers questions, and schedules qualified meetings directly on your calendar.",
  },
  {
    icon: Users,
    title: "CRM Integration",
    description: "Seamlessly syncs with HubSpot and Salesforce to log activities, update stages, and maintain clean data.",
  },
];

const emailSequence = [
  {
    day: "Day 1",
    subject: "Quick question about {{company}}'s expansion",
    preview: "Hi {{first_name}}, noticed {{company}} just opened the Austin office. Congrats! I help similar scaling teams automate their outbound...",
  },
  {
    day: "Day 3",
    subject: "Re: Quick question about {{company}}'s expansion",
    preview: "Following up on my note about {{company}}'s growth. Saw your recent LinkedIn post about hiring challenges—thought this might help...",
  },
  {
    day: "Day 7",
    subject: "Should I close the loop?",
    preview: "Hi {{first_name}}, I know you're busy scaling {{company}}. If outbound automation isn't a priority right now, totally understand...",
  },
];

const integrations = [
  { name: "HubSpot", icon: "HS" },
  { name: "Salesforce", icon: "SF" },
  { name: "LinkedIn", icon: "LI" },
  { name: "Apollo", icon: "Ap" },
  { name: "ZoomInfo", icon: "ZI" },
  { name: "Outreach", icon: "Ou" },
];

const problems = [
  {
    icon: Clock,
    title: "Manual Outbound Takes Forever",
    description: "Your sales team spends 20+ hours/week researching prospects and writing emails instead of closing deals.",
  },
  {
    icon: TrendingDown,
    title: "Low Response Rates",
    description: "Generic templates and mass emails get ignored. Personalization at scale is impossible manually.",
  },
  {
    icon: DollarSign,
    title: "Expensive SDR Hiring",
    description: "$6,000+/month for a full-time SDR, plus benefits, training, and management overhead.",
  },
  {
    icon: Target,
    title: "Inconsistent Pipeline",
    description: "Outbound volume fluctuates based on team bandwidth. Your pipeline suffers when reps are busy closing.",
  },
];

const faqs = [
  {
    question: "How long does it take to set up Mike?",
    answer: "Initial setup takes about 30 minutes. You'll define your ideal customer profile, value proposition, and outreach strategy. Mike starts researching and reaching out within 24 hours.",
  },
  {
    question: "Can Mike integrate with my CRM?",
    answer: "Yes! Mike integrates seamlessly with HubSpot and Salesforce. All activities, emails, and meeting bookings sync automatically to keep your data clean and up-to-date.",
  },
  {
    question: "How personalized are Mike's emails?",
    answer: "Every email is uniquely crafted based on deep prospect research—LinkedIn activity, company news, recent posts, and trigger events. No templates. Prospects often reply thinking they're talking to a human.",
  },
  {
    question: "What if prospects have questions Mike can't answer?",
    answer: "Mike handles common objections and qualification questions automatically. For complex technical questions, Mike loops in your sales team with full context.",
  },
  {
    question: "How many meetings can Mike book per month?",
    answer: "Typical customers see 20-50 qualified meetings per month, depending on target market, outreach volume, and offer quality. Mike scales with your goals.",
  },
  {
    question: "Can I customize Mike's outreach strategy?",
    answer: "Absolutely. You control the messaging, cadence, follow-up sequence, and qualification criteria. Mike learns from your feedback and continuously improves.",
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 30-day money-back guarantee. If Mike doesn't meet your expectations in the first month, we'll refund your payment—no questions asked.",
  },
  {
    question: "How is this different from traditional email automation?",
    answer: "Mike doesn't send templates. He researches each prospect individually, crafts personalized messages, handles replies, answers questions, and books meetings. Traditional tools just blast templates.",
  },
];

export default function SDRClient() {
  const [meetingsPerMonth, setMeetingsPerMonth] = useState(20);
  const costPerMonth = 600;
  const costPerMeeting = (costPerMonth / meetingsPerMonth).toFixed(2);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <EmployeeHero
        name="Mike"
        role="Sales Development Representative"
        tagline="Your AI Sales Development Representative"
        description="Mike identifies, researches, and engages your ideal prospects. He books qualified meetings while you focus on closing deals."
        icon={Users}
        iconColor="bg-accent-purple"
        ctaText="Configure Mike"
      />

      {/* Problem Section */}
      <EmployeeProblemSection
        title="Outbound That Actually Works"
        description="Stop wasting time on manual prospecting and low-response campaigns"
        problems={problems}
        colorClass="text-purple-500"
      />

      {/* VALIS Quote */}
      <EmployeeVALISQuote
        quote="The best SDRs don't just send emails—they research, personalize, and build relationships at scale. Mike does all three, 24/7, without the $72K salary."
        colorClass="border-purple-500/30 bg-purple-500/5 text-purple-400"
      />

      {/* Capabilities Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-h2 font-display font-bold mb-4">
              What Mike <span className="text-gradient-beam">Can Do</span>
            </h2>
            <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
              Full-cycle outbound sales development that scales with your pipeline goals.
            </p>
          </FadeIn>

          {/* Featured Capabilities - Top 2 */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {capabilities.slice(0, 2).map((capability, index) => (
              <FadeIn key={index} delay={index * 0.05}>
                <CapabilityCard {...capability} iconColor="bg-accent-purple" />
              </FadeIn>
            ))}
          </div>

          {/* Other Capabilities - Bottom 3 */}
          <div className="grid md:grid-cols-3 gap-6">
            {capabilities.slice(2).map((capability, index) => (
              <FadeIn key={index + 2} delay={(index + 2) * 0.05}>
                <CapabilityCard {...capability} iconColor="bg-accent-purple" />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Outreach Section */}
      <section className="py-20 bg-surface-sunken">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              Sample <span className="text-gradient-beam">Outreach Sequence</span>
            </h2>
            <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
              Mike crafts personalized 3-touch sequences that convert
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {emailSequence.map((email, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="bg-surface-elevated rounded-xl p-6 border border-border h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent-purple bg-accent-purple/10 px-3 py-1 rounded-full">
                      {email.day}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-2 truncate">
                    {email.subject}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {email.preview}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CRM Integration Showcase */}
      <IntegrationShowcase
        title="CRM & Tool Integrations"
        description="Mike works seamlessly with your existing sales stack"
        integrations={integrations}
      />

      {/* ROI Calculator */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              ROI <span className="text-gradient-beam">Calculator</span>
            </h2>
            <p className="text-lead text-muted-foreground">
              See how much you'll save with Mike vs. a human SDR
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-surface-elevated rounded-2xl p-8 border border-border">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">
                    Meetings booked per month: <span className="text-accent-purple font-bold">{meetingsPerMonth}</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={meetingsPerMonth}
                    onChange={(e) => setMeetingsPerMonth(parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent-purple"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>5 meetings</span>
                    <span>50 meetings</span>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Human SDR Cost</span>
                      <span className="text-lg font-bold text-foreground">$6,000/mo</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-accent-purple/10 rounded-lg border border-accent-purple/30">
                      <span className="text-accent-purple">Mike Cost</span>
                      <span className="text-lg font-bold text-accent-purple">$600/mo</span>
                    </div>
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-purple/10 text-accent-purple text-sm font-medium mb-4">
                    <Calculator className="w-4 h-4" />
                    Cost Per Meeting
                  </div>
                  <div className="text-6xl font-display font-bold text-foreground mb-2">
                    ${costPerMeeting}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    vs. $300+ per meeting with a human SDR
                  </p>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <p className="text-green-600 font-semibold">
                      Save ${((300 - parseFloat(costPerMeeting)) * meetingsPerMonth).toFixed(0)} per month
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
        roleName="Mike (AI SDR)"
        humanTitle="Full-Time SDR"
        humanCost={6000}
        aiCost={600}
        colorClass="text-purple-500"
        savings={64800}
      />

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              Simple <span className="text-gradient-beam">Pricing</span>
            </h2>
            <p className="text-lead text-muted-foreground">
              One flat monthly fee. Unlimited outreach. No commission.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="max-w-md mx-auto">
              <PricingCard
                name="Mike — SDR"
                price={600}
                description="Full-cycle sales development representative"
                features={[
                  "Unlimited prospect research",
                  "Personalized email sequences",
                  "Multi-channel outreach",
                  "Meeting booking automation",
                  "HubSpot & Salesforce sync",
                  "Response handling",
                  "Performance analytics",
                ]}
                ctaText="Configure Mike"
                popular={true}
                iconColor="bg-accent-purple"
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
