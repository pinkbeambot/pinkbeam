"use client";

import { motion } from "framer-motion";
import { FadeIn, StaggerContainer } from "@/components/animations";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Users,
  Lightbulb,
  Zap,
  Check,
  Target,
  Rocket,
  FileText,
  Presentation,
  MessageSquare,
  Sparkles,
  ChevronDown,
} from "lucide-react";

const workshopFormats = [
  {
    name: "Half-Day Workshop",
    duration: "4 hours",
    price: "$2,500",
    description: "Focused session for specific challenges or quick strategic alignment",
    ideal: "Leadership alignment, quick assessments, specific problem-solving",
    includes: [
      "Pre-workshop stakeholder survey",
      "4-hour facilitated session",
      "Summary action plan",
      "2-week follow-up call",
    ],
  },
  {
    name: "Full-Day Workshop",
    duration: "8 hours",
    price: "$5,000",
    description: "Deep dive into complex topics with comprehensive outcomes",
    ideal: "Strategy development, process redesign, technology planning",
    includes: [
      "Pre-workshop research & interviews",
      "8-hour intensive session",
      "Comprehensive workshop report",
      "Prioritized recommendations",
      "30-day email support",
    ],
    popular: true,
  },
  {
    name: "Multi-Day Workshop",
    duration: "2-3 days",
    price: "$7,500 - $10,000",
    description: "Transformational engagement for major strategic initiatives",
    ideal: "Digital transformation kickoffs, major architecture decisions, team building",
    includes: [
      "Extensive pre-workshop discovery",
      "Multiple facilitated sessions",
      "Detailed strategy document",
      "Implementation roadmap",
      "60-day advisory support",
    ],
  },
];

const availableWorkshops = [
  {
    icon: Lightbulb,
    title: "AI Strategy Workshop",
    description: "Identify high-impact AI opportunities and build a practical adoption roadmap",
    outcomes: [
      "AI readiness assessment",
      "Prioritized use case canvas",
      "90-day AI action plan",
      "Technology & talent recommendations",
    ],
    format: "Half-day or Full-day",
  },
  {
    icon: Rocket,
    title: "Digital Transformation Kickoff",
    description: "Align leadership on transformation vision, priorities, and execution approach",
    outcomes: [
      "Transformation vision statement",
      "Current state assessment",
      "Priority initiative roadmap",
      "Change management framework",
    ],
    format: "Full-day or Multi-day",
  },
  {
    icon: Zap,
    title: "Process Mapping & Automation",
    description: "Map critical workflows and identify automation opportunities with ROI analysis",
    outcomes: [
      "Process heat map & bottlenecks",
      "Automation opportunity scorecard",
      "Quick wins identification",
      "Implementation priority matrix",
    ],
    format: "Half-day or Full-day",
  },
  {
    icon: Target,
    title: "Technology Stack Review",
    description: "Evaluate your current stack, identify gaps, and plan modernization",
    outcomes: [
      "Architecture assessment",
      "Gap analysis & risk register",
      "Modernization roadmap",
      "Vendor evaluation framework",
    ],
    format: "Half-day or Full-day",
  },
];

const whatsIncluded = [
  {
    icon: FileText,
    title: "Pre-Workshop Preparation",
    description: "We do our homework. Stakeholder surveys, document review, and pre-work to ensure productive sessions.",
  },
  {
    icon: Users,
    title: "Expert Facilitation",
    description: "Skilled facilitators who keep discussions on track, draw out insights, and ensure everyone's voice is heard.",
  },
  {
    icon: Presentation,
    title: "Custom Materials",
    description: "Workbooks, templates, and visual aids designed specifically for your workshop objectives.",
  },
  {
    icon: MessageSquare,
    title: "Follow-Up Support",
    description: "Post-workshop calls and email support to help you implement what you've learned.",
  },
];

const relatedServices = [
  {
    title: "AI Strategy",
    description: "Comprehensive AI consulting and strategy development",
    href: "/solutions/services/ai-strategy",
    icon: Lightbulb,
  },
  {
    title: "Digital Transformation",
    description: "End-to-end transformation guidance and execution",
    href: "/solutions/services/digital-transformation",
    icon: Rocket,
  },
  {
    title: "Process Automation",
    description: "Identify and automate repetitive workflows",
    href: "/solutions/services/process-automation",
    icon: Zap,
  },
  {
    title: "Technology Architecture",
    description: "Modernize your technology stack and systems",
    href: "/solutions/services/technology-architecture",
    icon: Target,
  },
];

export function WorkshopsClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - No framer-motion */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-void">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">
                Workshops
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-white tracking-tight">
              Intensive Workshops for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Immediate Impact
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Accelerate decision-making and align your team with focused,
              facilitated workshops designed to deliver actionable outcomes in hours, not weeks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                asChild
              >
                <Link href="/solutions/contact?topic=workshops">
                  Book a Workshop
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#formats">View Formats</Link>
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

      {/* Workshop Formats */}
      <section id="formats" className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Workshop Formats
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Choose Your Format
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Flexible durations to match your needs, from focused half-day sessions 
              to transformational multi-day engagements.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {workshopFormats.map((format, index) => (
              <FadeIn key={format.name} delay={index * 0.1}>
                <motion.div
                  className={`relative p-6 lg:p-8 rounded-2xl h-full flex flex-col ${
                    format.popular
                      ? "bg-gradient-to-b from-amber-500/10 to-card border-2 border-amber-500/30"
                      : "bg-card border border-border hover:border-amber-500/30"
                  } transition-all duration-300`}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {format.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-white text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-sm text-amber-400 font-medium">{format.duration}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{format.name}</h3>
                  <p className="text-3xl font-display font-bold text-amber-400 mb-4">
                    {format.price}
                  </p>
                  <p className="text-muted-foreground mb-4">{format.description}</p>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Ideal for:</p>
                    <p className="text-sm text-muted-foreground">{format.ideal}</p>
                  </div>

                  <ul className="space-y-2 mb-8 flex-1">
                    {format.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      format.popular
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                        : "border-amber-500/30 hover:bg-amber-500/10"
                    }`}
                    variant={format.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/solutions/contact?topic=workshops">
                      Book This Workshop
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Available Workshops */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Available Workshops
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Workshop Topics
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expert-led workshops on the most critical business challenges
            </p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {availableWorkshops.map((workshop) => (
              <div
                key={workshop.title}
                className="group p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 hover:bg-card transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <workshop.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{workshop.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {workshop.description}
                    </p>
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-2">Key Outcomes:</p>
                      <ul className="space-y-1">
                        {workshop.outcomes.map((outcome) => (
                          <li
                            key={outcome}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <span className="w-1 h-1 rounded-full bg-amber-400" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-amber-400">
                      Available in {workshop.format}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              What&apos;s Included
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every workshop includes comprehensive support before, during, and after
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {whatsIncluded.map((item) => (
              <div
                key={item.title}
                className="text-center p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Custom Workshops CTA */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center p-8 lg:p-12 rounded-2xl border bg-gradient-to-b from-amber-500/5 to-transparent">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Need a Custom Workshop?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                We design bespoke workshops for unique challenges. Whether it&apos;s team alignment, 
                strategic planning, or technology evaluation, we&apos;ll create a tailored experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                  asChild
                >
                  <Link href="/solutions/contact?topic=custom-workshop">
                    Discuss Custom Workshop
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/solutions/engagement">
                    View All Engagement Options
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Explore Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Related Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Workshops are a great starting point. Explore our full range of consulting services.
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {relatedServices.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 hover:bg-card transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </Link>
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
              Ready to Accelerate Your Strategy?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Book a workshop today and get actionable insights in days, not months.
              Let&apos;s turn ideas into execution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                asChild
              >
                <Link href="/solutions/contact?topic=workshops">
                  Schedule Your Workshop
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/solutions/engagement">Compare Engagement Options</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
