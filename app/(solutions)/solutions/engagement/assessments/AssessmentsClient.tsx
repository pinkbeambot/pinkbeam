"use client";

import { motion } from "framer-motion";
import { FadeIn, StaggerContainer } from "@/components/animations";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Lightbulb,
  Zap,
  Target,
  Check,
  FileText,
  Presentation,
  BarChart3,
  Clock,
  Users,
  ClipboardList,
  TrendingUp,
  Shield,
  ChevronDown,
} from "lucide-react";

const assessmentTypes = [
  {
    icon: Lightbulb,
    name: "AI Readiness Assessment",
    price: "$15,000 - $25,000",
    duration: "2-3 weeks",
    description: "Evaluate your organization's readiness to adopt AI across data, technology, talent, and culture dimensions.",
    includes: [
      "Data infrastructure evaluation",
      "Technical capability audit",
      "AI use case identification",
      "Talent gap analysis",
      "AI readiness scorecard",
      "Prioritized AI roadmap",
    ],
    idealFor: [
      "Organizations considering AI adoption",
      "Companies evaluating AI investments",
      "Leadership teams needing AI clarity",
    ],
  },
  {
    icon: TrendingUp,
    name: "Digital Maturity Assessment",
    price: "$10,000 - $18,000",
    duration: "2 weeks",
    description: "Comprehensive evaluation of your digital capabilities across strategy, operations, technology, and customer experience.",
    includes: [
      "Digital capability scoring",
      "Benchmarking vs. industry",
      "Gap analysis & priorities",
      "Digital transformation roadmap",
      "Investment recommendations",
      "Quick wins identification",
    ],
    idealFor: [
      "Organizations planning digital transformation",
      "Companies lagging behind competitors",
      "Leadership seeking digital clarity",
    ],
  },
  {
    icon: Zap,
    name: "Process Automation Audit",
    price: "$10,000 - $15,000",
    duration: "2 weeks",
    description: "Identify automation opportunities across your workflows with detailed ROI analysis and implementation priorities.",
    includes: [
      "Process inventory & mapping",
      "Automation opportunity scoring",
      "ROI analysis by process",
      "Tool recommendations",
      "Implementation roadmap",
      "Business case development",
    ],
    idealFor: [
      "Operations leaders seeking efficiency",
      "Teams drowning in manual work",
      "Organizations with legacy processes",
    ],
  },
  {
    icon: Shield,
    name: "Technology Architecture Review",
    price: "$12,000 - $20,000",
    duration: "2-3 weeks",
    description: "Evaluate your current technology stack, identify risks, and plan modernization with detailed architecture recommendations.",
    includes: [
      "Architecture documentation review",
      "Technical debt assessment",
      "Scalability & performance analysis",
      "Security & compliance review",
      "Modernization roadmap",
      "Technology recommendations",
    ],
    idealFor: [
      "CTOs and technical leaders",
      "Organizations planning platform changes",
      "Companies experiencing tech issues",
    ],
  },
];

const processSteps = [
  {
    number: "1",
    title: "Discovery & Planning",
    duration: "Days 1-3",
    description: "We kick off with stakeholder alignment, define assessment scope, and gather initial documentation.",
    activities: [
      "Kickoff meeting with key stakeholders",
      "Scope definition & timeline alignment",
      "Document & data request",
      "Stakeholder interview scheduling",
    ],
  },
  {
    number: "2",
    title: "Data Collection",
    duration: "Week 1",
    description: "Deep dive into your organization through interviews, document review, and system analysis.",
    activities: [
      "Leadership & team interviews",
      "Systems & data review",
      "Process observation",
      "Benchmark data collection",
    ],
  },
  {
    number: "3",
    title: "Analysis & Synthesis",
    duration: "Week 2",
    description: "We analyze findings, identify patterns, and develop actionable recommendations.",
    activities: [
      "Capability scoring & benchmarking",
      "Gap analysis & risk assessment",
      "Opportunity prioritization",
      "Recommendation development",
    ],
  },
  {
    number: "4",
    title: "Deliverable Creation",
    duration: "Week 2-3",
    description: "We compile findings into comprehensive reports with clear roadmaps and next steps.",
    activities: [
      "Report writing & visualization",
      "Roadmap development",
      "Presentation preparation",
      "Stakeholder review",
    ],
  },
  {
    number: "5",
    title: "Presentation & Next Steps",
    duration: "Final Week",
    description: "We present findings, discuss recommendations, and define your path forward.",
    activities: [
      "Executive presentation",
      "Q&A and discussion",
      "Implementation planning",
      "Support transition",
    ],
  },
];

const deliverables = [
  {
    icon: FileText,
    title: "Executive Summary",
    description: "Concise overview of findings, scores, and key recommendations for leadership.",
  },
  {
    icon: BarChart3,
    title: "Detailed Assessment Report",
    description: "Comprehensive analysis with scores, benchmarks, and detailed findings.",
  },
  {
    icon: Presentation,
    title: "Strategic Roadmap",
    description: "Phased implementation plan with timelines, priorities, and resource requirements.",
  },
  {
    icon: ClipboardList,
    title: "Action Plan",
    description: "Specific, prioritized actions with owners and timeframes for immediate execution.",
  },
  {
    icon: Users,
    title: "Stakeholder Workshop",
    description: "Interactive presentation of findings with team alignment and planning session.",
  },
  {
    icon: Clock,
    title: "30-Day Support",
    description: "Email and call support to answer questions as you review and act on recommendations.",
  },
];

const sampleDeliverable = {
  title: "Sample: AI Readiness Assessment Report",
  sections: [
    {
      title: "Executive Summary",
      content: "One-page overview with readiness score, top 3 priorities, and recommended next steps.",
    },
    {
      title: "Current State Analysis",
      content: "Detailed evaluation of data, technology, talent, and organizational readiness dimensions.",
    },
    {
      title: "Gap Analysis",
      content: "Clear identification of capability gaps and their impact on AI initiative success.",
    },
    {
      title: "Prioritized Opportunities",
      content: "Ranked list of AI use cases with business case, feasibility, and implementation complexity.",
    },
    {
      title: "90-Day Roadmap",
      content: "Immediate action items, quick wins, and foundational steps for AI readiness.",
    },
    {
      title: "12-Month Strategy",
      content: "Longer-term roadmap for building AI capabilities and scaling successful initiatives.",
    },
  ],
};

const relatedServices = [
  {
    title: "Workshops",
    description: "Accelerate decisions with facilitated workshop sessions",
    href: "/solutions/engagement/workshops",
    icon: Users,
  },
  {
    title: "Retainers",
    description: "Ongoing advisory support for continuous improvement",
    href: "/solutions/engagement/retainers",
    icon: Clock,
  },
  {
    title: "Projects",
    description: "End-to-end execution of strategic initiatives",
    href: "/solutions/engagement/projects",
    icon: Target,
  },
];

export function AssessmentsClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - No framer-motion */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-void">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <Search className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">
                Assessments
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-white tracking-tight">
              Know Where You{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Stand
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Comprehensive assessments that give you clarity on your current state,
              identify opportunities, and provide a clear roadmap for improvement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                asChild
              >
                <Link href="/solutions/contact?topic=assessments">
                  Request an Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#types">View Assessment Types</Link>
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

      {/* Assessment Types */}
      <section id="types" className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Assessment Types
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Choose Your Focus Area
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Specialized assessments tailored to your specific strategic needs
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {assessmentTypes.map((assessment, index) => (
              <FadeIn key={assessment.name} delay={index * 0.1}>
                <motion.div
                  className="p-6 lg:p-8 rounded-2xl h-full flex flex-col bg-card border border-border hover:border-amber-500/30 transition-all duration-300"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <assessment.icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{assessment.name}</h3>
                      <p className="text-amber-400 font-medium">{assessment.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{assessment.duration}</span>
                  </div>

                  <p className="text-muted-foreground mb-6">{assessment.description}</p>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">What&apos;s Included:</p>
                    <ul className="space-y-1">
                      {assessment.includes.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Check className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Ideal for:</p>
                    <ul className="space-y-1">
                      {assessment.idealFor.map((item) => (
                        <li key={item} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-amber-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Our Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              The Assessment Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A structured 2-3 week process designed to deliver maximum insight with minimal disruption
            </p>
          </FadeIn>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/50 via-amber-500/30 to-transparent hidden md:block" />

              <StaggerContainer className="space-y-8 md:space-y-12">
                {processSteps.map((step) => (
                  <div
                    key={step.number}
                    className="relative flex flex-col md:flex-row gap-6 md:gap-8"
                  >
                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/25">
                        {step.number}
                      </div>
                    </div>

                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{step.title}</h3>
                        <span className="text-sm text-amber-400 font-medium">{step.duration}</span>
                      </div>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      <ul className="space-y-1">
                        {step.activities.map((activity) => (
                          <li
                            key={activity}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <span className="w-1 h-1 rounded-full bg-amber-400" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              What You Receive
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Comprehensive Deliverables
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every assessment includes these deliverables to ensure you can act on our recommendations
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {deliverables.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 hover:bg-card transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Sample Deliverable Preview */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Sample Deliverable
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Your Report Looks Like
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional, actionable reports designed for both executive consumption and detailed planning
            </p>
          </FadeIn>

          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="p-8 rounded-2xl border bg-gradient-to-b from-amber-500/5 to-transparent">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
                  <FileText className="w-6 h-6 text-amber-400" />
                  <h3 className="text-xl font-bold">{sampleDeliverable.title}</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {sampleDeliverable.sections.map((section, idx) => (
                    <div
                      key={section.title}
                      className="p-4 rounded-lg border border-border bg-card"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs text-amber-400 font-medium">
                          {idx + 1}
                        </span>
                        <h4 className="font-medium">{section.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{section.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Investment & Timeline Summary */}
      <section className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center p-8 lg:p-12 rounded-2xl border bg-gradient-to-b from-amber-500/5 to-transparent">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Investment & Timeline
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Clear pricing and predictable timelines so you can plan with confidence
              </p>

              <div className="grid sm:grid-cols-2 gap-8 mb-8">
                <div className="p-6 rounded-xl border bg-card">
                  <p className="text-sm text-muted-foreground mb-2">Investment Range</p>
                  <p className="text-4xl font-bold text-amber-400">$10,000 - $25,000</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on scope and organization size
                  </p>
                </div>
                <div className="p-6 rounded-xl border bg-card">
                  <p className="text-sm text-muted-foreground mb-2">Timeline</p>
                  <p className="text-4xl font-bold text-amber-400">2-3 Weeks</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    From kickoff to final deliverables
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                asChild
              >
                <Link href="/solutions/contact?topic=assessments">
                  Schedule an Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Related Engagement Options */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Other Ways to Engage
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Explore Other Engagement Models
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Assessments are often the starting point. Explore how we can continue working together.
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {relatedServices.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 hover:bg-card transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
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
              Ready to Gain Clarity?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Schedule a free consultation to discuss which assessment is right for your organization 
              and how we can help you move forward with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                asChild
              >
                <Link href="/solutions/contact?topic=assessments">
                  Book a Consultation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/solutions/engagement">View All Engagement Options</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
