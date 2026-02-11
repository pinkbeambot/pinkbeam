"use client";

import { PenTool, Repeat, Sparkles, Clock, BarChart3, Shield, Check, Twitter, Linkedin, TrendingDown, DollarSign, AlertCircle, Calculator } from "lucide-react";
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

const problems = [
  {
    icon: Clock,
    title: "Content Bottleneck Slowing Growth",
    description: "You need to publish daily but can only produce 2-3 pieces per month. Your competitors are outpacing you on every platform.",
  },
  {
    icon: TrendingDown,
    title: "Inconsistent Platform Presence",
    description: "Your blog is active but social media is dead. Or vice versa. You can't maintain quality across all channels.",
  },
  {
    icon: DollarSign,
    title: "Agencies Cost $5K+/Month",
    description: "Content agencies charge $5,000-$15,000/month for basic packages. Freelancers are cheaper but inconsistent.",
  },
  {
    icon: AlertCircle,
    title: "Brand Voice Gets Lost",
    description: "Every writer sounds different. Your brand voice changes with each content creator, confusing your audience.",
  },
];

const faqs = [
  {
    question: "How long does it take to set up Casey?",
    answer: "Initial setup takes about 30 minutes. You'll provide brand guidelines, sample content, and preferred platforms. Casey starts creating content within 24 hours.",
  },
  {
    question: "Can Casey write in our brand voice?",
    answer: "Yes! Casey learns from your existing content, brand guidelines, and feedback. After 2-3 pieces, she'll consistently match your unique voice and tone.",
  },
  {
    question: "What platforms does Casey support?",
    answer: "Casey creates content for Twitter/X, LinkedIn, blogs, email newsletters, Facebook, Instagram captions, and more. She adapts format and tone for each platform automatically.",
  },
  {
    question: "How does content repurposing work?",
    answer: "Give Casey one piece of content (blog post, video transcript, etc.) and she'll create 5-10 platform-specific versions—Twitter threads, LinkedIn posts, email newsletters, and more.",
  },
  {
    question: "Can Casey schedule posts automatically?",
    answer: "Yes! Casey integrates with Buffer, Hootsuite, and native platform schedulers. She posts at optimal times based on your audience engagement data.",
  },
  {
    question: "What if we need specific content types?",
    answer: "Casey handles blogs, social posts, newsletters, landing pages, ad copy, video scripts, and more. Just specify the format and she'll deliver.",
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 30-day money-back guarantee. If Casey doesn't increase your content output in the first month, we'll refund your payment—no questions asked.",
  },
  {
    question: "How is this different from ChatGPT?",
    answer: "Casey is trained on your brand, integrates with your publishing tools, schedules automatically, and learns from performance data. ChatGPT requires manual prompting every time.",
  },
];

export default function ContentClient() {
  const [piecesPerMonth, setPiecesPerMonth] = useState(10);
  const costPerMonth = 500;
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

      {/* Problem Section */}
      <EmployeeProblemSection
        title="Break Through Content Bottlenecks"
        description="Scale your content output without sacrificing quality or brand voice"
        problems={problems}
        colorClass="text-amber-500"
      />

      {/* VALIS Quote */}
      <EmployeeVALISQuote
        quote="Great content marketing isn't about hiring more writers—it's about systematic repurposing and platform optimization. Casey multiplies your output 5x without the $60K content manager salary."
        colorClass="border-amber-500/30 bg-amber-500/5 text-amber-400"
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

          {/* Featured Capabilities - Top 2 */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {capabilities.slice(0, 2).map((capability, index) => (
              <FadeIn key={index} delay={index * 0.05}>
                <CapabilityCard {...capability} iconColor="bg-accent-amber" />
              </FadeIn>
            ))}
          </div>

          {/* Other Capabilities - Bottom 3 */}
          <div className="grid md:grid-cols-3 gap-6">
            {capabilities.slice(2).map((capability, index) => (
              <FadeIn key={index + 2} delay={(index + 2) * 0.05}>
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

      {/* ROI Calculator */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              Content <span className="text-gradient-beam">Output Calculator</span>
            </h2>
            <p className="text-lead text-muted-foreground">
              See how much content Casey produces
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-surface-elevated rounded-2xl p-8 border border-border">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">
                    Original pieces per month: <span className="text-amber-500 font-bold">{piecesPerMonth}</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={piecesPerMonth}
                    onChange={(e) => setPiecesPerMonth(parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>2 pieces</span>
                    <span>30 pieces</span>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Manual Production</span>
                      <span className="text-lg font-bold text-foreground">{piecesPerMonth} pieces</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                      <span className="text-amber-500">With Casey (5x repurposing)</span>
                      <span className="text-lg font-bold text-amber-500">{piecesPerMonth * 5} pieces</span>
                    </div>
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium mb-4">
                    <Calculator className="w-4 h-4" />
                    Total Monthly Output
                  </div>
                  <div className="text-6xl font-display font-bold text-foreground mb-2">
                    {piecesPerMonth * 5}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    pieces per month across all platforms
                  </p>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <p className="text-green-600 font-semibold">
                      {piecesPerMonth * 5 * 12} pieces per year
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
        roleName="Casey (AI Content)"
        humanTitle="Content Marketing Manager"
        humanCost={5000}
        aiCost={500}
        colorClass="text-amber-500"
        savings={54000}
      />

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

      {/* FAQ Section */}
      <EmployeeFAQ faqs={faqs} />
    </main>
  );
}
