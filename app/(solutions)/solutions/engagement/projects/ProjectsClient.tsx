"use client";

import { motion } from "framer-motion";
import { FadeIn, StaggerContainer } from "@/components/animations";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Target,
  Check,
  Lightbulb,
  Users,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Rocket,
  BarChart3,
  DollarSign,
  Search,
  PenTool,
  Truck,
  ChevronDown,
} from "lucide-react";

const projectTypes = [
  {
    icon: Lightbulb,
    title: "AI Implementation Projects",
    description: "End-to-end AI solution development, from proof-of-concept to production deployment",
    scope: [
      "AI use case development",
      "Data preparation & pipeline",
      "Model development & training",
      "Integration & deployment",
      "Monitoring & maintenance",
    ],
    duration: "3-6 months",
    investment: "$50,000 - $250,000",
  },
  {
    icon: Rocket,
    title: "Digital Transformation",
    description: "Comprehensive transformation of business processes, customer experience, and operations",
    scope: [
      "Current state assessment",
      "Transformation strategy",
      "Process redesign",
      "Technology implementation",
      "Change management",
    ],
    duration: "6-12 months",
    investment: "$100,000 - $500,000",
  },
  {
    icon: Zap,
    title: "Process Automation",
    description: "Identify, design, and implement automation solutions for maximum efficiency gains",
    scope: [
      "Process mapping & analysis",
      "Automation architecture",
      "Bot/workflow development",
      "Integration implementation",
      "Training & handover",
    ],
    duration: "2-6 months",
    investment: "$30,000 - $150,000",
  },
  {
    icon: Shield,
    title: "Technology Modernization",
    description: "Legacy system upgrades, platform migrations, and architecture modernization",
    scope: [
      "Architecture assessment",
      "Migration planning",
      "Platform implementation",
      "Data migration",
      "Go-live support",
    ],
    duration: "3-9 months",
    investment: "$75,000 - $300,000",
  },
];

const projectLifecycle = [
  {
    number: "1",
    title: "Discover",
    icon: Search,
    description: "We understand your business, challenges, and goals through in-depth discovery",
    activities: [
      "Stakeholder interviews",
      "Current state analysis",
      "Requirements gathering",
      "Success criteria definition",
      "Project scope & approach",
    ],
    deliverables: [
      "Discovery findings report",
      "Detailed project scope",
      "Technical approach document",
      "Project timeline & budget",
    ],
  },
  {
    number: "2",
    title: "Design",
    icon: PenTool,
    description: "We design the solution architecture, user experience, and implementation approach",
    activities: [
      "Solution architecture design",
      "User experience design",
      "Technical specifications",
      "Data modeling",
      "Security & compliance review",
    ],
    deliverables: [
      "Architecture diagrams",
      "UX/UI mockups & prototypes",
      "Technical specifications",
      "Implementation plan",
    ],
  },
  {
    number: "3",
    title: "Deliver",
    icon: Truck,
    description: "We build, test, and deploy the solution with iterative feedback and refinement",
    activities: [
      "Agile development sprints",
      "Quality assurance & testing",
      "User acceptance testing",
      "Production deployment",
      "Training & documentation",
    ],
    deliverables: [
      "Working solution",
      "Technical documentation",
      "User guides & training",
      "Support transition",
    ],
  },
];

const teamComposition = [
  {
    role: "Project Lead",
    description: "Overall project management, stakeholder communication, and delivery accountability",
    involvement: "Full-time throughout",
  },
  {
    role: "Solution Architect",
    description: "Technical design, architecture decisions, and integration strategy",
    involvement: "50-100% during design, 25% during delivery",
  },
  {
    role: "Subject Matter Experts",
    description: "Domain expertise in AI, automation, or specific technologies",
    involvement: "As needed for specific challenges",
  },
  {
    role: "Technical Team",
    description: "Developers, data engineers, and QA specialists for implementation",
    involvement: "Full-time during delivery phase",
  },
];

const pricingModels = [
  {
    name: "Fixed Fee",
    icon: DollarSign,
    description: "Agreed scope and price upfront. Best for well-defined projects with clear requirements.",
    bestFor: [
      "Projects with clear, stable requirements",
      "Budget-conscious organizations",
      "Risk-averse stakeholders",
    ],
    considerations: [
      "Scope changes require change orders",
      "Detailed requirements needed upfront",
      "Fixed timeline commitments",
    ],
    example: "A $75,000 fixed fee for implementing a specific automation workflow with defined integrations.",
  },
  {
    name: "Time & Materials",
    icon: Clock,
    description: "Pay for actual time spent at agreed hourly rates. Best for evolving or exploratory projects.",
    bestFor: [
      "Projects with evolving requirements",
      "Research & development initiatives",
      "Agile/iterative development",
    ],
    considerations: [
      "Budget requires active management",
      "Monthly reporting on burn rate",
      "Flexibility to pivot as needed",
    ],
    example: "$200/hr for senior consultants, with monthly budget reviews and scope adjustments.",
  },
  {
    name: "Hybrid",
    icon: Target,
    description: "Fixed fee for defined scope with T&M for exploratory or variable elements.",
    bestFor: [
      "Projects with known and unknown elements",
      "Phased implementations",
      "Balancing certainty and flexibility",
    ],
    considerations: [
      "Clear delineation of fixed vs. variable",
      "Best of both pricing models",
      "Requires thoughtful scoping",
    ],
    example: "Fixed $50K for core platform + T&M for custom integrations to be determined.",
  },
];

const successMetrics = [
  {
    icon: BarChart3,
    title: "Clear KPIs",
    description: "We define measurable success criteria at the start of every project",
  },
  {
    icon: Target,
    title: "Milestone-Based",
    description: "Progress measured against agreed milestones with regular checkpoints",
  },
  {
    icon: TrendingUp,
    title: "Business Outcomes",
    description: "Focus on real business impact, not just project completion",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Proactive identification and mitigation of project risks",
  },
];

const successStories = [
  {
    metric: "40%",
    label: "Cost Reduction",
    description: "Average operational cost savings from process automation projects",
  },
  {
    metric: "3-6 mo",
    label: "Time to Value",
    description: "Typical timeline from project start to first measurable results",
  },
  {
    metric: "95%",
    label: "On-Time Delivery",
    description: "Percentage of projects delivered on or before schedule",
  },
];

const relatedServices = [
  {
    title: "Workshops",
    description: "Accelerate decisions with facilitated sessions",
    href: "/solutions/engagement/workshops",
    icon: Lightbulb,
  },
  {
    title: "Assessments",
    description: "Understand your current state and opportunities",
    href: "/solutions/engagement/assessments",
    icon: Search,
  },
  {
    title: "Retainers",
    description: "Ongoing advisory support for continuous improvement",
    href: "/solutions/engagement/retainers",
    icon: Clock,
  },
];

export function ProjectsClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - No framer-motion */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-void">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <Rocket className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">
                Project-Based
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-white tracking-tight">
              End-to-End Project{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Delivery
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Complete project delivery from concept to completion. We handle the full lifecycle
              so you can focus on your business while we deliver results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                asChild
              >
                <Link href="/solutions/contact?topic=projects">
                  Discuss Your Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#types">View Project Types</Link>
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

      {/* Project Types */}
      <section id="types" className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Project Types
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What We Deliver
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              End-to-end project execution across a range of strategic initiatives
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {projectTypes.map((project, index) => (
              <FadeIn key={project.title} delay={index * 0.1}>
                <motion.div
                  className="p-6 lg:p-8 rounded-2xl h-full flex flex-col bg-card border border-border hover:border-amber-500/30 transition-all duration-300"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <project.icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold">{project.title}</h3>
                  </div>

                  <p className="text-muted-foreground mb-6">{project.description}</p>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Typical Scope:</p>
                    <ul className="space-y-1">
                      {project.scope.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Check className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm text-amber-400">{project.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Investment</p>
                      <p className="text-sm text-amber-400">{project.investment}</p>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Project Lifecycle */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              How We Work
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Project Lifecycle
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A proven three-phase approach: Discover → Design → Deliver
            </p>
          </FadeIn>

          <div className="max-w-5xl mx-auto">
            <StaggerContainer className="space-y-12">
              {projectLifecycle.map((phase) => (
                <div
                  key={phase.number}
                  className="relative flex flex-col md:flex-row gap-6 md:gap-8 p-6 rounded-2xl border bg-card/50"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-amber-500/25">
                      <phase.icon className="w-8 h-8" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-amber-400 font-medium">Phase {phase.number}</span>
                      <h3 className="text-2xl font-bold">{phase.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">{phase.description}</p>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium mb-2">Activities:</p>
                        <ul className="space-y-1">
                          {phase.activities.map((activity) => (
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
                      <div>
                        <p className="text-sm font-medium mb-2">Deliverables:</p>
                        <ul className="space-y-1">
                          {phase.deliverables.map((deliverable) => (
                            <li
                              key={deliverable}
                              className="text-sm text-muted-foreground flex items-center gap-2"
                            >
                              <span className="w-1 h-1 rounded-full bg-amber-400" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Team Composition */}
      <section className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Who&apos;s on Your Project Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The right mix of expertise tailored to your project needs
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {teamComposition.map((member) => (
              <div
                key={member.role}
                className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{member.role}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{member.description}</p>
                    <p className="text-xs text-amber-400">{member.involvement}</p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing Models */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Flexible Pricing Models
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the pricing approach that best fits your project and risk tolerance
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingModels.map((model, index) => (
              <FadeIn key={model.name} delay={index * 0.1}>
                <div className="p-6 rounded-2xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <model.icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold">{model.name}</h3>
                  </div>

                  <p className="text-muted-foreground mb-6">{model.description}</p>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Best For:</p>
                    <ul className="space-y-1">
                      {model.bestFor.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Check className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Considerations:</p>
                    <ul className="space-y-1">
                      {model.considerations.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-amber-400 mt-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      <span className="text-amber-400">Example:</span> {model.example}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Success
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How We Measure Success
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Focus on outcomes, not just outputs
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            {successMetrics.map((metric) => (
              <div
                key={metric.title}
                className="text-center p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <metric.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-semibold mb-2">{metric.title}</h3>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </div>
            ))}
          </div>

          <FadeIn>
            <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6">
              {successStories.map((story) => (
                <div
                  key={story.label}
                  className="text-center p-6 rounded-xl border bg-gradient-to-b from-amber-500/5 to-transparent"
                >
                  <div className="text-4xl font-bold text-amber-400 mb-2">{story.metric}</div>
                  <div className="font-semibold mb-1">{story.label}</div>
                  <p className="text-sm text-muted-foreground">{story.description}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Project Guarantee */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center p-8 lg:p-12 rounded-2xl border bg-gradient-to-b from-amber-500/5 to-transparent">
              <Shield className="w-12 h-12 text-amber-400 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Our Project Commitment
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                We stand behind our work. Every project engagement includes:
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left mb-8">
                {[
                  {
                    title: "Regular Reporting",
                    description: "Weekly status updates with progress, risks, and next steps",
                  },
                  {
                    title: "Scope Management",
                    description: "Clear change control process for scope adjustments",
                  },
                  {
                    title: "Knowledge Transfer",
                    description: "Documentation and training for your team",
                  },
                  {
                    title: "30-Day Support",
                    description: "Post-launch support included in every project",
                  },
                  {
                    title: "Escalation Path",
                    description: "Clear escalation process for any issues",
                  },
                  {
                    title: "Quality Assurance",
                    description: "Rigorous testing and review before delivery",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                asChild
              >
                <Link href="/solutions/contact?topic=projects">
                  Start Your Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Related Engagement Options */}
      <section className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Other Ways to Engage
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Explore Other Engagement Models
            </h2>
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
              Ready to Execute Your Vision?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Let&apos;s discuss your project and how we can help you deliver results. 
              Schedule a free consultation to explore your options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                asChild
              >
                <Link href="/solutions/contact?topic=projects">
                  Request Project Consultation
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
