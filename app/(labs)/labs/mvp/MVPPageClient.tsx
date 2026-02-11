"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerContainer, StaggerGrid } from "@/components/animations";
import {
  ArrowRight,
  Rocket,
  Clock,
  Target,
  TrendingUp,
  Check,
  Zap,
  Shield,
  Code2,
  Users,
  ChevronDown
} from "lucide-react";

const features = [
  {
    title: "Rapid Development",
    description: "4-8 week delivery for core MVP features",
    icon: Clock,
  },
  {
    title: "Tech Stack",
    description: "React, Next.js, TypeScript, PostgreSQL",
    icon: Code2,
  },
  {
    title: "Scalable Foundation",
    description: "Built to grow with your user base",
    icon: TrendingUp,
  },
  {
    title: "User Validation",
    description: "Features prioritized by user impact",
    icon: Target,
  },
];

const process = [
  "Discovery & scoping (Week 1)",
  "Wireframes & architecture (Week 1-2)",
  "Core feature development (Week 2-6)",
  "Testing & refinement (Week 6-7)",
  "Launch & handoff (Week 7-8)",
];

const deliverables = [
  "Fully functional web application",
  "Source code with documentation",
  "Deployment & hosting setup",
  "Admin dashboard",
  "User authentication system",
  "2 weeks post-launch support",
];

function MVPHero() {
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
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">
                MVP Development
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-white tracking-tight">
              Launch your MVP in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
                4-8 weeks
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Skip the months of development. We build lean, validated MVPs that get you
              to market fast—so you can test, learn, and iterate.
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
                  Start Your MVP
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

function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
            What You Get
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything to get you{" "}
            <span className="text-cyan-400">market-ready</span>
          </h2>
        </FadeIn>

        <StaggerGrid columns={2} className="max-w-4xl mx-auto gap-6 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl border bg-card hover:border-cyan-500/30 transition-colors"
            >
              <feature.icon className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="py-24 lg:py-32 bg-background border-y">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <FadeIn>
            <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
              Timeline
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              The 8-week{" "}
              <span className="text-cyan-400">roadmap</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              A proven process that takes you from concept to launch.
              Weekly check-ins keep you in the loop.
            </p>

            <StaggerContainer className="space-y-4">
              {process.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-cyan-400">{index + 1}</span>
                  </div>
                  <p className="text-foreground pt-1">{step}</p>
                </div>
              ))}
            </StaggerContainer>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
              Deliverables
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              What you{" "}
              <span className="text-cyan-400">receive</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              A complete package that sets you up for success from day one.
            </p>

            <StaggerContainer className="space-y-3">
              {deliverables.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </StaggerContainer>
          </FadeIn>
        </div>
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
            Ready to launch?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Let's discuss your MVP. We'll help you scope it, estimate it, 
            and build it—fast.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90 shadow-lg shadow-cyan-500/25"
            asChild
          >
            <Link href="/contact">
              Get a Quote
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}

export function MVPPageClient() {
  return (
    <main className="min-h-screen">
      <MVPHero />
      <FeaturesSection />
      <ProcessSection />
      <CTASection />
    </main>
  );
}
