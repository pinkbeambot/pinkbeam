"use client";

import { PenTool, Repeat, Sparkles, Clock, BarChart3, Shield, Check, Twitter, Linkedin } from "lucide-react";
import { EmployeeHero } from "../components/EmployeeHero";
import { CapabilityCard } from "../components/CapabilityCard";
import { PricingCard } from "../components/PricingCard";
import { IntegrationShowcase } from "../components/IntegrationShowcase";
import { FadeIn } from "@/components/animations";
import { Quote } from "lucide-react";

const capabilities = [
  {
    icon: Repeat,
    title: "Turns One Piece into 5+ Formats",
    description: "Transform a single blog post into Twitter threads, LinkedIn posts, email newsletters, and more—automatically.",
  },
  {
    icon: Sparkles,
    title: "Adapts Tone for Each Platform",
    description: "Casey understands platform nuances—professional for LinkedIn, punchy for Twitter, detailed for blogs.",
  },
  {
    icon: Clock,
    title: "Schedules Optimal Posting Times",
    description: "Content is automatically scheduled for when your audience is most engaged—no guesswork needed.",
  },
  {
    icon: BarChart3,
    title: "Tracks Performance Metrics",
    description: "Casey monitors engagement, clicks, and conversions to continuously improve content strategy.",
  },
  {
    icon: Shield,
    title: "Maintains Brand Voice Consistency",
    description: "Trained on your brand guidelines, Casey ensures every piece of content sounds uniquely like you.",
  },
];

const repurposingExample = {
  original: {
    title: "Original Blog Post",
    content: "10 Ways AI is Transforming Customer Support in 2025",
    platform: "Blog",
  },
  outputs: [
    {
      platform: "Twitter Thread",
      icon: Twitter,
      content: "🧵 AI is revolutionizing customer support. Here are 10 trends shaping 2025:\n\n1/ Instant response times (2 min vs 4 hours)...",
      color: "bg-blue-500",
    },
    {
      platform: "LinkedIn Post",
      icon: Linkedin,
      content: "The customer support landscape is changing rapidly. In my latest article, I explore how AI is reducing response times by 99% while improving satisfaction scores...",
      color: "bg-blue-700",
    },
    {
      platform: "Email Newsletter",
      icon: PenTool,
      content: "This week: How leading companies are leveraging AI to transform their support operations. Plus: 3 strategies you can implement today.",
      color: "bg-accent-amber",
    },
  ],
};

const integrations = [
  { name: "Twitter/X", icon: "Tw" },
  { name: "LinkedIn", icon: "LI" },
  { name: "WordPress", icon: "WP" },
  { name: "HubSpot", icon: "HS" },
  { name: "Mailchimp", icon: "MC" },
  { name: "Buffer", icon: "Bu" },
];

export default function ContentClient() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <EmployeeHero
        name="Casey"
        role="Content Marketing Specialist"
        tagline="Your Content Marketing Multiplier"
        description="Casey transforms your ideas into platform-optimized content across every channel. One brief becomes a week's worth of posts, all in your unique voice."
        icon={PenTool}
        iconColor="bg-accent-amber"
        ctaText="Configure Casey"
      />

      {/* Capabilities Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-h2 font-display font-bold mb-4">
              What Casey <span className="text-gradient-beam">Can Do</span>
            </h2>
            <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
              End-to-end content creation and distribution that scales your marketing output.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <CapabilityCard {...capability} iconColor="bg-accent-amber" />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Content Repurposing Section */}
      <section className="py-20 bg-surface-sunken">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              Content <span className="text-gradient-beam">Repurposing</span>
            </h2>
            <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
              One piece of content becomes a multi-channel campaign
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Original Content */}
            <FadeIn>
              <div className="bg-surface-elevated rounded-xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-amber flex items-center justify-center">
                    <PenTool className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Original Content</p>
                    <p className="font-semibold text-foreground">{repurposingExample.original.platform}</p>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium text-foreground">{repurposingExample.original.content}</p>
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-accent-amber/20 flex items-center justify-center">
                    <Repeat className="w-4 h-4 text-accent-amber" />
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Repurposed Content */}
            <div className="space-y-4">
              {repurposingExample.outputs.map((output, index) => (
                <FadeIn key={index} delay={0.1 * (index + 1)} direction="left">
                  <div className="bg-surface-elevated rounded-xl p-4 border border-border">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg ${output.color} flex items-center justify-center shrink-0`}>
                        <output.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          {output.platform}
                        </p>
                        <p className="text-sm text-foreground line-clamp-2">{output.content}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Integrations */}
      <IntegrationShowcase
        title="Platform Integrations"
        description="Casey publishes directly to your marketing stack"
        integrations={integrations}
      />

      {/* Testimonial Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="relative bg-surface-elevated rounded-2xl p-8 md:p-12 border border-border">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-accent-amber/10 flex items-center justify-center">
                <Quote className="w-6 h-6 text-accent-amber" />
              </div>
              <blockquote className="text-h4 font-display font-medium text-foreground text-center mb-8 pt-4">
                "Casey produces more content in a week than our previous agency did in a month. 
                The quality is consistently on-brand, and she's learned our voice so well that readers can't tell it's AI. 
                We went from publishing twice a month to daily."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent-amber flex items-center justify-center">
                  <span className="text-white font-display font-bold">DW</span>
                </div>
                <div className="text-left">
                  <p className="font-display font-semibold text-foreground">David Wilson</p>
                  <p className="text-small text-muted-foreground">CMO, GrowthLabs</p>
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
              One flat monthly fee. Unlimited content. No word limits.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="max-w-md mx-auto">
              <PricingCard
                name="Casey — Content"
                price={500}
                description="Full-stack content marketing specialist"
                features={[
                  "Unlimited content creation",
                  "Multi-format repurposing",
                  "Platform-native optimization",
                  "Automated scheduling",
                  "Brand voice training",
                  "Performance tracking",
                  "Social media management",
                ]}
                ctaText="Configure Casey"
                popular={true}
                iconColor="bg-accent-amber"
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
