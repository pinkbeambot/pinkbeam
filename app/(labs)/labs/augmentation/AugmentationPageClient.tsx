"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerContainer, StaggerGrid } from "@/components/animations";
import {
  ArrowRight,
  Users,
  Code2,
  GitPullRequest,
  GraduationCap,
  Clock,
  MessageSquare,
  Check,
  Zap,
  ChevronDown
} from "lucide-react";

const benefits = [
  {
    title: "Senior Engineers",
    description: "Experienced developers with 8+ years in production environments",
    icon: Code2,
  },
  {
    title: "Flexible Engagement",
    description: "Scale up or down based on your project needs",
    icon: Clock,
  },
  {
    title: "Code Review",
    description: "Improve code quality through thorough reviews and feedback",
    icon: GitPullRequest,
  },
  {
    title: "Mentorship",
    description: "Knowledge transfer and upskilling for your existing team",
    icon: GraduationCap,
  },
  {
    title: "Agile Collaboration",
    description: "Daily standups, sprint planning, and transparent communication",
    icon: MessageSquare,
  },
  {
    title: "Fast Integration",
    description: "Quick onboarding and immediate productivity",
    icon: Zap,
  },
];

const engagementModels = [
  {
    name: "Part-Time Support",
    description: "2-3 days per week for ongoing projects",
    ideal: "Small teams needing specialized expertise",
  },
  {
    name: "Full-Time Embed",
    description: "Dedicated engineer on your team",
    ideal: "Teams needing to accelerate delivery",
  },
  {
    name: "Team Augmentation",
    description: "Multiple engineers for larger initiatives",
    ideal: "Projects requiring significant bandwidth",
  },
  {
    name: "Advisory Retainer",
    description: "On-call architecture and code review",
    ideal: "Teams needing occasional expert guidance",
  },
];

const techStack = [
  "React & Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "AWS/GCP",
  "GraphQL",
  "DevOps",
];

function AugmentationHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-void">
      {/* Cyan glow effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="text-center max-w-3xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">
                Team Augmentation
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-white tracking-tight">
              Scale your team with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
                senior engineers
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Experienced developers that integrate seamlessly with your workflow.
              Flexible engagement, immediate impact.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90 shadow-lg shadow-cyan-500/25"
                asChild
              >
                <Link href="/contact">
                  Find Engineers
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/labs">
                  Back to Labs
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs uppercase tracking-wider">Scroll</span>
        <ChevronDown className="w-5 h-5 text-cyan-400 animate-bounce" />
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
            Why Choose Us
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            More than just{" "}
            <span className="text-cyan-400">extra hands</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We become part of your team. Code review, mentorship, and best practices
            come standard.
          </p>
        </FadeIn>

        <StaggerGrid columns={3} className="max-w-5xl mx-auto gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="p-6 rounded-2xl border bg-card hover:border-cyan-500/30 transition-colors"
            >
              <benefit.icon className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

function EngagementSection() {
  return (
    <section className="py-24 lg:py-32 bg-background border-y">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
            Engagement Models
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Flexible{" "}
            <span className="text-cyan-400">engagement</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the model that fits your needs. All engagements include
            our standard quality practices.
          </p>
        </FadeIn>

        <StaggerGrid columns={2} className="max-w-4xl mx-auto gap-6 mb-16">
          {engagementModels.map((model) => (
            <div
              key={model.name}
              className="p-6 rounded-2xl border bg-card hover:border-cyan-500/30 transition-colors"
            >
              <h3 className="text-xl font-bold mb-2">{model.name}</h3>
              <p className="text-muted-foreground mb-4">{model.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-cyan-400 font-medium">Ideal for:</span>
                <span className="text-muted-foreground">{model.ideal}</span>
              </div>
            </div>
          ))}
        </StaggerGrid>

        <FadeIn className="max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl border bg-card">
            <h3 className="text-xl font-bold mb-6 text-center">Technologies We Work With</h3>
            <StaggerGrid columns={4} className="gap-3">
              {techStack.map((tech) => (
                <div
                  key={tech}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted"
                >
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium">{tech}</span>
                </div>
              ))}
            </StaggerGrid>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Need engineering help?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Let's discuss your team needs. We'll match you with engineers 
            who fit your stack and culture.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90 shadow-lg shadow-cyan-500/25"
            asChild
          >
            <Link href="/contact">
              Schedule a Call
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}

export function AugmentationPageClient() {
  return (
    <main className="min-h-screen">
      <AugmentationHero />
      <BenefitsSection />
      <EngagementSection />
      <CTASection />
    </main>
  );
}
