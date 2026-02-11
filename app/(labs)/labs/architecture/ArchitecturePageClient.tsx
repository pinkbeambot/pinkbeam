"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerContainer, StaggerGrid } from "@/components/animations";
import {
  ArrowRight,
  Layers,
  Database,
  Cloud,
  Shield,
  Network,
  Server,
  Code2,
  Check,
  ChevronDown
} from "lucide-react";

const services = [
  {
    title: "System Design",
    description: "High-level and detailed system architecture for complex applications",
    icon: Network,
  },
  {
    title: "Database Design",
    description: "Schema design, optimization, and data modeling for scale",
    icon: Database,
  },
  {
    title: "Cloud Architecture",
    description: "AWS, GCP, and Azure infrastructure design and best practices",
    icon: Cloud,
  },
  {
    title: "API Design",
    description: "RESTful and GraphQL API design with documentation",
    icon: Code2,
  },
  {
    title: "Security Review",
    description: "Security architecture and compliance planning",
    icon: Shield,
  },
  {
    title: "Performance Planning",
    description: "Scalability planning and performance optimization strategies",
    icon: Server,
  },
];

const deliverables = [
  "Technical architecture documents",
  "System diagrams and flowcharts",
  "Technology stack recommendations",
  "Infrastructure cost estimates",
  "Implementation roadmap",
  "Risk assessment and mitigation plan",
];

function ArchitectureHero() {
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
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">
                Technical Architecture
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-white tracking-tight">
              Design systems that{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
                scale
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Expert architecture for complex technical challenges. We design robust,
              scalable systems that grow with your business.
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
                  Discuss Your Project
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

function ServicesSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
            Our Expertise
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Architecture{" "}
            <span className="text-cyan-400">services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From initial design to migration planning, we provide the expertise
            you need to build systems that last.
          </p>
        </FadeIn>

        <StaggerGrid columns={3} className="max-w-5xl mx-auto gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="p-6 rounded-2xl border bg-card hover:border-cyan-500/30 transition-colors"
            >
              <service.icon className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

function DeliverablesSection() {
  return (
    <section className="py-24 lg:py-32 bg-background border-y">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
          <FadeIn>
            <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
              Deliverables
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Complete{" "}
              <span className="text-cyan-400">documentation</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Every architecture engagement delivers comprehensive documentation
              that your team can use to implement and maintain the system.
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

          <FadeIn delay={0.2}>
            <div className="p-8 rounded-2xl border bg-card">
              <h3 className="text-xl font-bold mb-4">Engagement Options</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Architecture Review</span>
                    <Badge variant="outline">1-2 weeks</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Review existing architecture and provide recommendations
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Greenfield Design</span>
                    <Badge variant="outline">2-4 weeks</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Complete architecture for new systems from scratch
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Ongoing Advisory</span>
                    <Badge variant="outline">Monthly</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Regular architecture reviews and guidance
                  </p>
                </div>
              </div>
            </div>
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
            Ready to architect?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Let's discuss your technical challenges. We'll help you design 
            a system that meets your needs today and scales for tomorrow.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90 shadow-lg shadow-cyan-500/25"
            asChild
          >
            <Link href="/contact">
              Schedule a Consultation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}

export function ArchitecturePageClient() {
  return (
    <main className="min-h-screen">
      <ArchitectureHero />
      <ServicesSection />
      <DeliverablesSection />
      <CTASection />
    </main>
  );
}
