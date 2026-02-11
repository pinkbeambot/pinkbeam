"use client";

import { motion } from "framer-motion";
import { FadeIn, StaggerContainer } from "@/components/animations";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  Lightbulb,
  Check,
  Search,
  Rocket,
  Briefcase,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

const engagementModels = [
  {
    id: "workshops",
    name: "Workshops",
    icon: Lightbulb,
    tagline: "Intensive sessions for immediate impact",
    description: "Focused, facilitated sessions to accelerate decisions and align your team",
    duration: "Half-day to multi-day",
    investment: "$2,500 - $10,000",
    ideal: [
      "Need quick strategic alignment",
      "Want to kick off an initiative",
      "Have a specific challenge to solve",
    ],
    href: "/solutions/engagement/workshops",
    color: "amber",
  },
  {
    id: "assessments",
    name: "Assessments",
    icon: Search,
    tagline: "Know where you stand",
    description: "Comprehensive evaluation of your current state with actionable recommendations",
    duration: "2-3 weeks",
    investment: "$10,000 - $25,000",
    ideal: [
      "Need clarity on current state",
      "Evaluating opportunities",
      "Planning a major initiative",
    ],
    href: "/solutions/engagement/assessments",
    color: "amber",
  },
  {
    id: "retainers",
    name: "Retainers",
    icon: Users,
    tagline: "Fractional CTO/CIO expertise",
    description: "Ongoing strategic partnership with executive-level technology leadership",
    duration: "Monthly engagement",
    investment: "$5,000 - $20,000/mo",
    ideal: [
      "Need ongoing strategic guidance",
      "Scaling without a full-time CTO",
      "Want consistent advisory support",
    ],
    href: "/solutions/engagement/retainers",
    color: "amber",
  },
  {
    id: "projects",
    name: "Project-Based",
    icon: Rocket,
    tagline: "End-to-end delivery",
    description: "Complete project execution from concept to completion",
    duration: "2-12 months",
    investment: "$30,000 - $500,000+",
    ideal: [
      "Have a defined initiative",
      "Need execution support",
      "Want outcomes, not just advice",
    ],
    href: "/solutions/engagement/projects",
    color: "amber",
  },
];

const comparisonData = {
  attributes: [
    { label: "Time to Value", key: "timeToValue" },
    { label: "Engagement Length", key: "length" },
    { label: "Deliverables", key: "deliverables" },
    { label: "Involvement Level", key: "involvement" },
    { label: "Best For", key: "bestFor" },
    { label: "Starting Investment", key: "investment" },
  ],
  models: [
    {
      name: "Workshops",
      timeToValue: "Immediate (same day)",
      length: "Hours to days",
      deliverables: "Action plans, alignment",
      involvement: "Intensive, short-term",
      bestFor: "Decisions & alignment",
      investment: "$2,500 - $10,000",
    },
    {
      name: "Assessments",
      timeToValue: "2-3 weeks",
      length: "2-3 weeks",
      deliverables: "Reports & roadmaps",
      involvement: "Focused, analysis-heavy",
      bestFor: "Understanding current state",
      investment: "$10,000 - $25,000",
    },
    {
      name: "Retainers",
      timeToValue: "Ongoing",
      length: "Monthly (ongoing)",
      deliverables: "Advisory & guidance",
      involvement: "Consistent partnership",
      bestFor: "Long-term strategic support",
      investment: "$5,000 - $20,000/mo",
    },
    {
      name: "Projects",
      timeToValue: "3-6 months",
      length: "Months",
      deliverables: "Working solutions",
      involvement: "Deep, end-to-end",
      bestFor: "Implementation & delivery",
      investment: "$30,000 - $500,000+",
    },
  ],
};

const decisionGuide = [
  {
    question: "Do you need to make a decision or get aligned quickly?",
    answer: "Choose Workshops",
    description: "Workshops are designed for rapid decision-making and stakeholder alignment.",
    href: "/solutions/engagement/workshops",
  },
  {
    question: "Are you unsure where to start or what opportunities exist?",
    answer: "Choose Assessments",
    description: "Assessments give you clarity on your current state and a roadmap for improvement.",
    href: "/solutions/engagement/assessments",
  },
  {
    question: "Do you need ongoing strategic guidance and support?",
    answer: "Choose Retainers",
    description: "Retainers provide consistent access to executive-level technology leadership.",
    href: "/solutions/engagement/retainers",
  },
  {
    question: "Do you have a specific initiative that needs to be delivered?",
    answer: "Choose Project-Based",
    description: "Project-based engagements handle the full lifecycle from concept to completion.",
    href: "/solutions/engagement/projects",
  },
];

const faqs = [
  {
    question: "Can I combine different engagement models?",
    answer: "Absolutely. Many clients start with an Assessment to understand their situation, move to a Workshop to align stakeholders, and then engage on a Project or Retainer basis to execute. We'll help you design the right sequence.",
  },
  {
    question: "How do I know which engagement is right for me?",
    answer: "Schedule a free consultation. We'll discuss your situation, goals, and constraints to recommend the best approach. There's no obligation—our goal is to help you succeed, whether that's with us or not.",
  },
  {
    question: "Can we adjust the engagement as we go?",
    answer: "Yes. We design engagements to be flexible. Many clients start with one model and evolve to another as their needs change. Retainers can scale up or down, and projects can be structured with phase gates.",
  },
  {
    question: "What's the minimum engagement?",
    answer: "Our smallest engagement is a half-day workshop at $2,500. For ongoing work, retainers start at $5,000/month with a 3-month minimum commitment. Project minimums vary based on scope.",
  },
  {
    question: "Do you work with startups or only enterprise?",
    answer: "We work with organizations of all sizes, from pre-revenue startups to Fortune 500 companies. Our engagement models are designed to scale with your needs and budget.",
  },
];

export function EngagementClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - No framer-motion */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-void">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">
                How We Work
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-white tracking-tight">
              Choose Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Path
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Four ways to work with Pink Beam. Each designed to deliver value,
              whether you need quick insights, deep analysis, ongoing guidance, or full execution.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                asChild
              >
                <Link href="/solutions/contact">
                  Get Personalized Recommendation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#selector">Which Is Right for Me?</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm">Scroll</span>
          <ChevronDown className="w-5 h-5 text-amber-400 animate-bounce" />
        </div>
      </section>

      {/* Engagement Models Overview */}
      <section className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Engagement Models
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Four Ways to Work Together
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each model designed for different needs, timelines, and investment levels
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {engagementModels.map((model, index) => (
              <FadeIn key={model.id} delay={index * 0.1}>
                <motion.div
                  className="group p-6 lg:p-8 rounded-2xl h-full flex flex-col bg-card border border-border hover:border-amber-500/30 transition-all duration-300"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <model.icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{model.name}</h3>
                      <p className="text-sm text-amber-400">{model.tagline}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6">{model.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm">{model.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Investment</p>
                      <p className="text-sm">{model.investment}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs text-muted-foreground mb-2">Ideal for:</p>
                    <ul className="space-y-1">
                      {model.ideal.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <Check className="w-4 h-4 text-amber-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto">
                    <Button
                      className="w-full border-amber-500/30 hover:bg-amber-500/10"
                      variant="outline"
                      asChild
                    >
                      <Link href={model.href}>
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Side-by-Side Comparison
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quick reference guide to help you compare engagement models
            </p>
          </FadeIn>

          <FadeIn>
            <div className="max-w-5xl mx-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-medium text-muted-foreground sticky left-0 bg-background">
                      Feature
                    </th>
                    {comparisonData.models.map((model) => (
                      <th key={model.name} className="text-center py-4 px-4 font-semibold min-w-[140px]">
                        {model.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.attributes.map((attr) => (
                    <tr key={attr.key} className="border-b border-border">
                      <td className="py-4 px-4 font-medium sticky left-0 bg-background">
                        {attr.label}
                      </td>
                      {comparisonData.models.map((model) => (
                        <td key={model.name} className="text-center py-4 px-4 text-muted-foreground">
                          {model[attr.key as keyof typeof model]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-4 px-4 sticky left-0 bg-background"></td>
                    {comparisonData.models.map((model) => (
                      <td key={model.name} className="text-center py-4 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-500/30 hover:bg-amber-500/10"
                          asChild
                        >
                          <Link href={`/solutions/engagement/${model.name.toLowerCase().replace('-', '')}`}>
                            Details
                          </Link>
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Decision Guide */}
      <section id="selector" className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Decision Guide
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Which Engagement Is Right for You?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer these questions to find your best fit
            </p>
          </FadeIn>

          <StaggerContainer className="max-w-3xl mx-auto space-y-6">
            {decisionGuide.map((item) => (
              <div
                key={item.question}
                className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-2">{item.question}</p>
                    <p className="text-amber-400 font-semibold mb-1">{item.answer}</p>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-amber-500/30 hover:bg-amber-500/10"
                      asChild
                    >
                      <Link href={item.href}>
                        Learn More
                        <ArrowRight className="w-3 h-3 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Common Journey */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Typical Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How Clients Typically Engage
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Many clients evolve through multiple engagement types over time
            </p>
          </FadeIn>

          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/50 via-amber-500/30 to-transparent hidden md:block" />

                <div className="space-y-8">
                  {[
                    {
                      step: "1",
                      title: "Start with Clarity",
                      engagement: "Assessment",
                      description: "Begin with an Assessment to understand your current state, identify opportunities, and build a strategic roadmap.",
                    },
                    {
                      step: "2",
                      title: "Align Your Team",
                      engagement: "Workshop",
                      description: "Use a Workshop to align stakeholders on priorities, decisions, and next steps from the assessment findings.",
                    },
                    {
                      step: "3",
                      title: "Execute the Vision",
                      engagement: "Project or Retainer",
                      description: "Move into Project-based work for specific deliverables, or a Retainer for ongoing guidance and support.",
                    },
                  ].map((stage) => (
                    <div key={stage.step} className="relative flex gap-6 md:gap-8">
                      <div className="flex-shrink-0 relative z-10">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/25">
                          {stage.step}
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{stage.title}</h3>
                          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm">
                            {stage.engagement}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{stage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Common Questions
            </h2>
          </FadeIn>

          <StaggerContainer className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
              >
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Not Sure Where to Start?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Let&apos;s talk. We&apos;ll help you understand your options and recommend 
              the right engagement for your situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                asChild
              >
                <Link href="/solutions/contact">
                  Schedule Free Consultation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/solutions/services">View Our Services</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
