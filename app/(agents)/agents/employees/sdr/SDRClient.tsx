"use client";

import { Users, Search, Mail, Calendar, Database, Check, Calculator } from "lucide-react";
import { useState } from "react";
import { EmployeeHero } from "../components/EmployeeHero";
import { CapabilityCard } from "../components/CapabilityCard";
import { PricingCard } from "../components/PricingCard";
import { IntegrationShowcase } from "../components/IntegrationShowcase";
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <FadeIn key={index} delay={index * 0.1}>
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

      {/* Testimonial Section */}
      <section className="py-20 bg-surface-sunken">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="relative bg-surface-elevated rounded-2xl p-8 md:p-12 border border-border">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-accent-purple/10 flex items-center justify-center">
                <Quote className="w-6 h-6 text-accent-purple" />
              </div>
              <blockquote className="text-h4 font-display font-medium text-foreground text-center mb-8 pt-4">
                "Mike booked 47 qualified demos in his first month. Our cost per meeting dropped from $285 to $12. 
                The personalization in his emails is incredible—propects actually reply thinking he's a real person."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent-purple flex items-center justify-center">
                  <span className="text-white font-display font-bold">RK</span>
                </div>
                <div className="text-left">
                  <p className="font-display font-semibold text-foreground">Robert Kim</p>
                  <p className="text-small text-muted-foreground">Head of Sales, DataFlow Inc.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

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
    </main>
  );
}
