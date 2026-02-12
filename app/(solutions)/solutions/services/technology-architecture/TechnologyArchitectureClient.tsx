"use client";

import {
  ServiceHero,
  ProcessTimeline,
  DeliverablesList,
  InvestmentCard,
  FAQSection,
  RelatedServices,
  CTABanner,
} from "../components";
import { FadeIn, StaggerContainer } from "@/components/animations";
import {
  Shield,
  Search,
  Lightbulb,
  Settings,
  Rocket,
  FileText,
  Code,
  Lock,
  Server,
  TrendingUp,
  Rocket as TransformIcon,
  Lightbulb as AIIcon,
  Cog,
  ChartBar,
  Cloud,
  Database,
  Layers,
  ArrowLeftRight,
  ShieldCheck,
} from "lucide-react";

const processSteps = [
  {
    number: "1",
    title: "Architecture Assessment",
    description:
      "We evaluate your current technology landscape—systems, integrations, data flows, and technical debt. Our assessment identifies bottlenecks, risks, and opportunities for modernization.",
    icon: Search,
  },
  {
    number: "2",
    title: "Target Architecture Design",
    description:
      "We design a future-state architecture aligned with your business goals. This includes technology stack recommendations, integration patterns, and a phased modernization roadmap.",
    icon: Lightbulb,
  },
  {
    number: "3",
    title: "Migration Planning",
    description:
      "We develop detailed migration plans that minimize risk and business disruption. This includes data migration strategies, cutover plans, rollback procedures, and testing approaches.",
    icon: Settings,
  },
  {
    number: "4",
    title: "Implementation Support",
    description:
      "We provide hands-on support during implementation—architecture governance, vendor management, technical oversight, and knowledge transfer to your team.",
    icon: Rocket,
  },
];

const deliverables = [
  {
    icon: FileText,
    title: "Current State Assessment",
    description:
      "Comprehensive analysis of existing architecture, technical debt inventory, and performance bottlenecks.",
  },
  {
    icon: Code,
    title: "Target Architecture Blueprint",
    description:
      "Detailed future-state architecture with system diagrams, integration patterns, and technology recommendations.",
  },
  {
    icon: Layers,
    title: "Integration Strategy",
    description:
      "API design patterns, event-driven architecture, and data synchronization approaches.",
  },
  {
    icon: Lock,
    title: "Security & Compliance Plan",
    description:
      "Security architecture, compliance mapping, and risk mitigation strategies.",
  },
  {
    icon: Rocket,
    title: "Migration Roadmap",
    description:
      "Phased migration plan with timelines, resource requirements, and risk mitigation strategies.",
  },
  {
    icon: FileText,
    title: "Implementation Guidelines",
    description:
      "Standards, best practices, and governance frameworks for maintaining architectural integrity.",
  },
];

const timeline = [
  {
    phase: "Architecture Assessment",
    duration: "3-4 weeks",
    description:
      "Evaluating current systems, integrations, and technical debt",
  },
  {
    phase: "Target Architecture Design",
    duration: "4-6 weeks",
    description:
      "Designing future-state architecture and technology recommendations",
  },
  {
    phase: "Migration Planning",
    duration: "3-4 weeks",
    description:
      "Developing detailed migration plans and risk mitigation strategies",
  },
  {
    phase: "Implementation Support",
    duration: "Ongoing",
    description:
      "Architecture governance and oversight during migration execution",
  },
];

const modernizationStrategies = [
  {
    icon: Cloud,
    title: "Cloud Migration",
    description:
      "Strategic migration to cloud infrastructure with rehosting, refactoring, or rebuilding options based on your needs.",
  },
  {
    icon: Database,
    title: "Data Modernization",
    description:
      "Migrate from legacy databases to modern data platforms with improved performance and analytics capabilities.",
  },
  {
    icon: Code,
    title: "Application Modernization",
    description:
      "Transform monolithic applications into microservices or serverless architectures for better scalability.",
  },
  {
    icon: Layers,
    title: "API-First Architecture",
    description:
      "Design systems around APIs to enable integration, reusability, and future extensibility.",
  },
];

const integrationPatterns = [
  {
    title: "Event-Driven Architecture",
    description:
      "Asynchronous, loosely coupled systems that react to events in real-time for maximum scalability.",
  },
  {
    title: "API Gateway Pattern",
    description:
      "Centralized API management with routing, authentication, rate limiting, and protocol translation.",
  },
  {
    title: "Microservices Integration",
    description:
      "Service mesh and inter-service communication patterns for distributed systems.",
  },
  {
    title: "Legacy System Bridging",
    description:
      "Strategies for integrating modern applications with existing legacy systems without disruption.",
  },
  {
    title: "Data Synchronization",
    description:
      "Patterns for keeping data consistent across distributed systems and multiple databases.",
  },
  {
    title: "Hybrid Cloud Integration",
    description:
      "Connecting on-premises systems with cloud services for gradual cloud adoption.",
  },
];

const securityCompliance = [
  {
    icon: ShieldCheck,
    title: "Zero Trust Architecture",
    description:
      "Security model that verifies every access request regardless of source—never trust, always verify.",
  },
  {
    icon: Lock,
    title: "Data Protection",
    description:
      "Encryption at rest and in transit, data classification, and privacy by design principles.",
  },
  {
    icon: Server,
    title: "Infrastructure Security",
    description:
      "Secure configurations, vulnerability management, and infrastructure as code security.",
  },
  {
    icon: FileText,
    title: "Compliance Mapping",
    description:
      "Architecture aligned with SOC 2, GDPR, HIPAA, PCI-DSS, and industry-specific regulations.",
  },
];

const faqs = [
  {
    question: "When should we consider modernizing our architecture?",
    answer:
      "Key indicators include: difficulty scaling to meet demand, excessive maintenance costs of legacy systems, long time-to-market for new features, frequent outages or performance issues, security vulnerabilities, and inability to integrate with modern tools. If technical debt is slowing innovation, it's time to modernize.",
  },
  {
    question: "How do you minimize risk during migration?",
    answer:
      "We use proven strategies: incremental migration (strangler fig pattern), feature toggles for rollback capability, parallel running of old and new systems, comprehensive testing at each stage, and detailed rollback procedures. We never recommend 'big bang' migrations for critical systems.",
  },
  {
    question: "Should we move everything to the cloud?",
    answer:
      "Not necessarily. We evaluate each workload's characteristics—some may benefit from cloud elasticity, while others might be more cost-effective on-premises. We design hybrid architectures that place workloads optimally based on performance, cost, compliance, and operational requirements.",
  },
  {
    question: "How do you handle legacy system integration?",
    answer:
      "We use anti-corruption layers, adapters, and API facades to modernize incrementally. Rather than replacing everything at once, we create clean interfaces that let new systems work with legacy data and processes while gradually transitioning functionality.",
  },
  {
    question: "What's the difference between monoliths and microservices?",
    answer:
      "Monoliths are single, unified applications while microservices are independent, loosely coupled services. We don't blindly advocate microservices—they add complexity. We recommend them when you need independent scaling, deployment, or team autonomy. Often a modular monolith is the right starting point.",
  },
  {
    question: "How do you ensure security in the architecture?",
    answer:
      "Security is built in from the start, not bolted on. We implement defense in depth, zero trust principles, encryption everywhere, and continuous security monitoring. Compliance requirements are mapped to architectural controls and validated throughout implementation.",
  },
  {
    question: "Can you work with our existing development team?",
    answer:
      "Absolutely. We typically work alongside your teams, providing architecture guidance, code reviews, and knowledge transfer. Our goal is to leave you with the capabilities to maintain and evolve the architecture independently.",
  },
  {
    question: "How do you measure architecture success?",
    answer:
      "We define success metrics upfront: deployment frequency, lead time for changes, mean time to recovery, availability SLAs, performance benchmarks, cost per transaction, and developer productivity. These metrics guide architecture decisions and validate outcomes.",
  },
];

const relatedServices = [
  {
    title: "Digital Transformation",
    description: "Transform your business for the digital age",
    href: "/solutions/services/digital-transformation",
    icon: TransformIcon,
  },
  {
    title: "AI Strategy",
    description: "Develop a comprehensive AI roadmap",
    href: "/solutions/services/ai-strategy",
    icon: AIIcon,
  },
  {
    title: "Process Automation",
    description: "Automate repetitive workflows",
    href: "/solutions/services/process-automation",
    icon: Cog,
  },
  {
    title: "Growth Strategy",
    description: "Sustainable growth through strategic innovation",
    href: "/solutions/services/growth-strategy",
    icon: ChartBar,
  },
  {
    title: "Technology Architecture",
    description: "Build scalable systems",
    href: "/solutions/services/technology-architecture",
    icon: Shield,
  },
];

export function TechnologyArchitectureClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <ServiceHero
        badge={{ icon: Shield, text: "Technology Architecture" }}
        title={
          <>
            Build Systems That Scale
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              With Your Ambition
            </span>
          </>
        }
        description="Future-proof your technology foundation. We design scalable, secure architectures that support growth, enable innovation, and transform technical debt into competitive advantage."
        primaryCta={{ text: "Book Discovery Call", href: "/contact" }}
        secondaryCta={{ text: "View Architecture Guide", href: "#assessment" }}
      />

      {/* Architecture Assessment */}
      <section id="assessment" className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                Assessment Approach
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Architecture Assessment
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our comprehensive assessment goes beyond surface-level
                documentation. We analyze your systems' inner workings to
                identify the real constraints, risks, and opportunities that
                impact your business.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "System Inventory",
                  description:
                    "Catalog of all applications, databases, infrastructure, and their interdependencies.",
                },
                {
                  title: "Performance Analysis",
                  description:
                    "Bottleneck identification, scalability limits, and resource utilization patterns.",
                },
                {
                  title: "Technical Debt Audit",
                  description:
                    "Assessment of code quality, outdated dependencies, and architectural shortcuts.",
                },
                {
                  title: "Risk Assessment",
                  description:
                    "Security vulnerabilities, single points of failure, and compliance gaps.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500 mb-4" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Modernization Strategies */}
      <section className="py-24 lg:py-32 bg-muted/30 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Modernization
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Modernization Strategies
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Multiple approaches to evolve your technology stack based on your
              constraints and goals
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modernizationStrategies.map((strategy, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                  <strategy.icon className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {strategy.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {strategy.description}
                </p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Integration Patterns */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                Integration
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Integration Patterns
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Proven patterns for connecting systems, data, and services in
                scalable, maintainable ways.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrationPatterns.map((pattern, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500 mb-4" />
                  <h3 className="font-semibold mb-2">{pattern.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {pattern.description}
                  </p>
                </div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-24 lg:py-32 bg-muted/30 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                Security
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Security & Compliance
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Security isn't an afterthought—it's foundational to everything
                we design. We build architectures that protect your data,
                systems, and reputation.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 gap-6">
              {securityCompliance.map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <ProcessTimeline
        steps={processSteps}
        title="Our Architecture Process"
        description="A structured approach to designing and implementing scalable, secure technology architectures"
      />

      {/* Deliverables */}
      <DeliverablesList
        deliverables={deliverables}
        title="What You Get"
        description="Comprehensive architecture deliverables that guide implementation and ensure long-term success"
      />

      {/* Investment */}
      <InvestmentCard
        timeline={timeline}
        priceRange="$30,000"
        ctaText="Start Architecture Assessment"
        ctaHref="/contact"
      />

      {/* FAQ */}
      <FAQSection faqs={faqs} />

      {/* Related Services */}
      <RelatedServices
        services={relatedServices}
        currentService="Technology Architecture"
      />

      {/* Final CTA */}
      <CTABanner
        title="Ready to Modernize Your Architecture?"
        description="Let's assess your current technology landscape and design a future-proof architecture. Schedule a free discovery call to explore your modernization opportunities."
        buttonText="Book Architecture Review"
        buttonHref="/contact"
      />
    </main>
  );
}
