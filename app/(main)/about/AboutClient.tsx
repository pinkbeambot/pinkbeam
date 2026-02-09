"use client";

import {
  Sparkles,
  Users,
  Shield,
  BookOpen,
  Target,
  Zap,
  Heart,
  Globe,
  Clock,
} from "lucide-react";
import { FadeIn, FadeInOnMount } from "@/components/animations";
import { TeamCard, ValueCard } from "./components";

// Team data
const teamMembers = [
  {
    name: "Sarah",
    role: "Researcher",
    description:
      "Your AI research analyst who monitors competitors and delivers weekly market intelligence briefs.",
    color: "bg-pink-500",
  },
  {
    name: "Mike",
    role: "SDR",
    description:
      "Your AI sales development rep who identifies prospects, crafts outreach, and books qualified meetings.",
    color: "bg-accent-purple",
  },
  {
    name: "Alex",
    role: "Support",
    description:
      "Your AI support specialist who handles tier-1 tickets and responds to customers 24/7 in under 2 minutes.",
    color: "bg-accent-cyan",
  },
  {
    name: "Casey",
    role: "Content",
    description:
      "Your AI content writer who creates blogs, social posts, and email sequences in your brand voice.",
    color: "bg-accent-amber",
  },
  {
    name: "LUMEN",
    role: "Designer",
    description:
      "Your AI visual designer who creates graphics, presentations, and brand assets on demand.",
    color: "bg-accent-indigo",
  },
  {
    name: "FLUX",
    role: "Video",
    description:
      "Your AI motion designer who produces short-form videos, explainers, and social clips.",
    color: "bg-pink-400",
  },
];

// Values data
const values = [
  {
    icon: Sparkles,
    title: "AI-First",
    description:
      "We believe AI should be the default, not an afterthought. Every process, every decision, every product starts with how AI can make it better.",
  },
  {
    icon: Heart,
    title: "Customer Obsessed",
    description:
      "Our customers' success is our success. We listen, we iterate, and we build what actually solves problems—not what sounds impressive.",
  },
  {
    icon: Shield,
    title: "Transparent",
    description:
      "No black boxes. No hidden fees. We're open about how our AI works, what it can do, and where it needs human oversight.",
  },
  {
    icon: BookOpen,
    title: "Always Learning",
    description:
      "AI evolves daily, and so do we. We're perpetual students of technology, business, and the art of building great products.",
  },
];

// Stats data
const stats = [
  { value: "2026", label: "Founded" },
  { value: "100%", label: "AI-First" },
  { value: "24/7", label: "Always On" },
  { value: "Global", label: "Remote Team" },
];

export default function AboutClient() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-void overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-beam-glow opacity-20 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <FadeInOnMount delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-8">
                <span className="text-sm font-medium text-pink-500">
                  About Pink Beam
                </span>
              </div>
            </FadeInOnMount>

            <FadeInOnMount delay={0.1}>
              <h1 className="text-hero font-display font-bold mb-6 text-white">
                We&apos;re Building the{" "}
                <span className="text-gradient-beam">Future of Work</span>
              </h1>
            </FadeInOnMount>

            <FadeInOnMount delay={0.2}>
              <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
                Pink Beam exists to democratize access to AI employees. We believe
                every business—regardless of size—deserves a world-class team that
                works 24/7, scales infinitely, and never calls in sick.
              </p>
            </FadeInOnMount>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn direction="left" once>
              <div className="space-y-6">
                <h2 className="text-h2 font-display font-bold text-foreground">
                  Our Mission
                </h2>
                <p className="text-body text-muted-foreground leading-relaxed">
                  To make AI employees accessible to every business on Earth. We
                  envision a world where founders can compete with enterprises not
                  by working harder, but by leveraging AI that works smarter.
                </p>
                <p className="text-body text-muted-foreground leading-relaxed">
                  The future of work isn&apos;t humans vs. AI—it&apos;s humans with AI,
                  accomplishing more than either could alone. We&apos;re here to build
                  that future, one AI employee at a time.
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="right" once>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-card border border-border rounded-xl p-6 text-center hover:border-pink-500/30 transition-colors"
                  >
                    <div className="text-3xl md:text-4xl font-display font-bold text-gradient-beam mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-20 md:py-28 bg-surface-sunken">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <FadeIn direction="up" once>
              <h2 className="text-h2 font-display font-bold text-foreground mb-4">
                Our Story
              </h2>
              <p className="text-lead text-muted-foreground">
                How we went from an idea to building the AI workforce platform of
                the future.
              </p>
            </FadeIn>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {/* Item 1 */}
              <FadeIn direction="up" once>
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right md:pr-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 text-xs font-medium mb-3">
                      <Clock className="w-3 h-3" />
                      The Problem
                    </div>
                    <h3 className="text-h4 font-display font-semibold text-foreground mb-2">
                      Why Pink Beam Exists
                    </h3>
                    <p className="text-body text-muted-foreground">
                      We watched talented founders struggle to scale because hiring
                      was too slow, too expensive, and too risky. Meanwhile, AI
                      capabilities were exploding—but integrating them was a
                      full-time job.
                    </p>
                  </div>
                  <div className="md:pl-12">
                    <div className="bg-card border border-border rounded-xl p-6">
                      <Zap className="w-8 h-8 text-pink-500 mb-3" />
                      <p className="text-sm text-muted-foreground italic">
                        &ldquo;What if AI wasn&apos;t just a tool, but a team member?&rdquo;
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-pink-500 border-4 border-background md:-translate-x-1/2 top-6" />
                </div>
              </FadeIn>

              {/* Item 2 */}
              <FadeIn direction="up" once>
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="md:order-2 md:text-left md:pl-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple text-xs font-medium mb-3">
                      <Target className="w-3 h-3" />
                      The Solution
                    </div>
                    <h3 className="text-h4 font-display font-semibold text-foreground mb-2">
                      AI Employees, Not Just Tools
                    </h3>
                    <p className="text-body text-muted-foreground">
                      We built AI employees that slot into your team like human
                      hires—except they work 24/7, cost a fraction of the price,
                      and integrate with your existing tools out of the box.
                    </p>
                  </div>
                  <div className="md:order-1 md:text-right md:pr-12">
                    <div className="bg-card border border-border rounded-xl p-6">
                      <Users className="w-8 h-8 text-accent-purple mb-3" />
                      <p className="text-sm text-muted-foreground italic">
                        &ldquo;Autonomous, integrated, affordable.&rdquo;
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-accent-purple border-4 border-background md:-translate-x-1/2 top-6" />
                </div>
              </FadeIn>

              {/* Item 3 */}
              <FadeIn direction="up" once>
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right md:pr-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan text-xs font-medium mb-3">
                      <Globe className="w-3 h-3" />
                      The Future
                    </div>
                    <h3 className="text-h4 font-display font-semibold text-foreground mb-2">
                      Where We&apos;re Going
                    </h3>
                    <p className="text-body text-muted-foreground">
                      We&apos;re building the infrastructure for the AI-native company.
                      Our vision is a world where any founder can compete with
                      enterprise teams by hiring AI employees that work
                      alongside them.
                    </p>
                  </div>
                  <div className="md:pl-12">
                    <div className="bg-card border border-border rounded-xl p-6">
                      <Sparkles className="w-8 h-8 text-accent-cyan mb-3" />
                      <p className="text-sm text-muted-foreground italic">
                        &ldquo;The future is AI + Human, working together.&rdquo;
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-accent-cyan border-4 border-background md:-translate-x-1/2 top-6" />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <FadeIn direction="up" once>
              <h2 className="text-h2 font-display font-bold text-foreground mb-4">
                Meet Your AI Team
              </h2>
              <p className="text-lead text-muted-foreground">
                These aren&apos;t just tools—they&apos;re autonomous AI employees ready to
                join your workforce.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <TeamCard
                key={member.name}
                {...member}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28 bg-surface-sunken">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <FadeIn direction="up" once>
              <h2 className="text-h2 font-display font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-lead text-muted-foreground">
                The principles that guide everything we build.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ValueCard key={value.title} {...value} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
