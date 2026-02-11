"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, FadeInOnMount, StaggerContainer, StaggerGrid } from "@/components/animations";
import { 
  ArrowRight, 
  Rocket, 
  Layers, 
  Users, 
  Search,
  ChevronDown,
  Code2,
  Database,
  Cloud,
  Cpu,
  Shield,
  Zap,
  GitBranch,
  Terminal,
  Workflow
} from "lucide-react";

// Tech stack icons data
const techStack = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Framework" },
  { name: "TypeScript", category: "Language" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Language" },
  { name: "PostgreSQL", category: "Database" },
  { name: "AWS", category: "Cloud" },
  { name: "Docker", category: "DevOps" },
];

// Services data
const services = [
  {
    id: "mvp",
    title: "MVP Development",
    description: "Launch your product in weeks, not months. We build lean, validated MVPs that get you to market fast.",
    icon: Rocket,
    features: ["4-8 week delivery", "React/Next.js stack", "Scalable architecture", "Post-launch support"],
    href: "/labs/mvp",
    color: "cyan",
  },
  {
    id: "architecture",
    title: "Technical Architecture",
    description: "Design systems that scale. We architect robust solutions for complex technical challenges.",
    icon: Layers,
    features: ["System design", "Tech stack selection", "API design", "Performance planning"],
    href: "/labs/architecture",
    color: "cyan",
  },
  {
    id: "augmentation",
    title: "Team Augmentation",
    description: "Scale your team with experienced engineers. We integrate seamlessly with your existing workflows.",
    icon: Users,
    features: ["Senior engineers", "Flexible engagement", "Code review & mentorship", "Agile collaboration"],
    href: "/labs/augmentation",
    color: "cyan",
  },
  {
    id: "audit",
    title: "Code Audit & Optimization",
    description: "Identify bottlenecks and improve performance. We audit, recommend, and implement fixes.",
    icon: Search,
    features: ["Performance audit", "Security review", "Code quality analysis", "Optimization roadmap"],
    href: "#contact",
    color: "cyan",
  },
];

// Process steps
const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description: "We dive deep into your business, users, and technical requirements to understand the full picture.",
    icon: Search,
    duration: "1-2 weeks",
  },
  {
    step: "02",
    title: "Design",
    description: "Architecture, UI/UX, and technical planning. We create detailed specs before writing code.",
    icon: Layers,
    duration: "2-3 weeks",
  },
  {
    step: "03",
    title: "Development",
    description: "Agile sprints with weekly demos. You see progress in real-time and provide feedback.",
    icon: Code2,
    duration: "4-12 weeks",
  },
  {
    step: "04",
    title: "Deploy",
    description: "CI/CD setup, monitoring, and launch support. We ensure smooth deployment and handoff.",
    icon: Rocket,
    duration: "Ongoing",
  },
];

// Development principles
const principles = [
  { title: "Clean Code", description: "Maintainable, well-documented code", icon: Terminal },
  { title: "Test Coverage", description: "Unit, integration, and E2E tests", icon: Shield },
  { title: "CI/CD", description: "Automated deployment pipelines", icon: GitBranch },
  { title: "Performance", description: "Optimized for speed and scale", icon: Zap },
];

// Hero Section
function LabsHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-void">
      {/* Cyan glow effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge with cyan */}
          <FadeInOnMount delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">
                Custom Software Development
              </span>
            </div>
          </FadeInOnMount>
          
          {/* Headline with cyan gradient */}
          <FadeInOnMount delay={0.1}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 text-white tracking-tight">
              Custom Software{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
                That Ships
              </span>
            </h1>
          </FadeInOnMount>
          
          {/* Subheadline */}
          <FadeInOnMount delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              From MVP to enterprise systems, we build software that solves real problems. 
              Fast delivery, clean code, and engineering excellence.
            </p>
          </FadeInOnMount>
          
          {/* CTA Buttons */}
          <FadeInOnMount delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90 shadow-lg shadow-cyan-500/25" 
                asChild
              >
                <Link href="/contact">
                  Start Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Link href="#case-studies" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full">
                  See Case Studies
                </Button>
              </Link>
            </div>
          </FadeInOnMount>
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

// Services Section
function ServicesSection() {
  return (
    <section id="services" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
            Our Services
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Engineering expertise,{" "}
            <span className="text-cyan-400">on demand</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you need a full product built or specialized technical help, 
            we deliver high-quality software that drives results.
          </p>
        </FadeIn>

        <StaggerGrid columns={2} className="max-w-5xl mx-auto gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative p-6 lg:p-8 rounded-2xl border bg-card hover:bg-card/80 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                  <service.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

// Process Section
function ProcessSection() {
  return (
    <section id="process" className="py-24 lg:py-32 bg-background border-y">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
            Our Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            From idea to{" "}
            <span className="text-cyan-400">production</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A battle-tested process that delivers results. Transparent, collaborative, 
            and focused on shipping.
          </p>
        </FadeIn>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/50 via-cyan-400/20 to-transparent hidden md:block" />
            
            <StaggerContainer className="space-y-8">
              {processSteps.map((step) => (
                <div key={step.step} className="relative flex gap-6 md:gap-8">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-cyan-400" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                      <span className="text-sm font-medium text-cyan-400">
                        Step {step.step}
                      </span>
                      <span className="hidden sm:inline text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {step.duration}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground max-w-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

// Trust Section
function TrustSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Tech Stack */}
          <div>
            <FadeIn>
              <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
                Tech Stack
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Modern tools,{" "}
                <span className="text-cyan-400">proven results</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                We use industry-leading technologies that scale with your business. 
                From startup MVPs to enterprise systems.
              </p>
            </FadeIn>
            
            <StaggerGrid columns={4} className="gap-3">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="p-3 rounded-xl border bg-card text-center hover:border-cyan-500/30 transition-colors"
                >
                  <div className="text-sm font-medium">{tech.name}</div>
                  <div className="text-xs text-muted-foreground">{tech.category}</div>
                </div>
              ))}
            </StaggerGrid>
          </div>

          {/* Principles */}
          <div>
            <FadeIn>
              <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
                Our Principles
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Built to{" "}
                <span className="text-cyan-400">last</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Every line of code we write follows these core principles. 
                Your future self (and team) will thank you.
              </p>
            </FadeIn>
            
            <StaggerContainer className="grid grid-cols-2 gap-4">
              {principles.map((principle) => (
                <div
                  key={principle.title}
                  className="p-4 rounded-xl border bg-card hover:border-cyan-500/30 transition-colors"
                >
                  <principle.icon className="w-6 h-6 text-cyan-400 mb-3" />
                  <h3 className="font-semibold mb-1">{principle.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {principle.description}
                  </p>
                </div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-6 border-cyan-500/30 text-cyan-400">
            Start Your Project
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to build something{" "}
            <span className="text-cyan-400">great?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Let's discuss your project. We'll help you scope it, estimate it, 
            and build it—on time and on budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            <Button size="lg" variant="outline" asChild>
              <Link href="mailto:labs@pinkbeam.io">
                Email Us Directly
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// Main Page Component
export function LabsPageClient() {
  return (
    <main className="min-h-screen">
      <LabsHero />
      <ServicesSection />
      <ProcessSection />
      <TrustSection />
      <CTASection />
    </main>
  );
}

export default LabsPageClient;
