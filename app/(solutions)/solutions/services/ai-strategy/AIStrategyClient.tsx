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
  Lightbulb,
  Search,
  Target,
  Zap,
  FileText,
  Presentation,
  Users,
  TrendingUp,
  Shield,
  Rocket,
  Cog,
  ChartBar,
  Heart,
  Building2,
  ShoppingCart,
  Factory,
  Landmark,
} from "lucide-react";

const processSteps = [
  {
    number: "1",
    title: "AI Readiness Assessment",
    description:
      "We evaluate your current data infrastructure, technical capabilities, organizational readiness, and identify quick wins versus long-term opportunities.",
    icon: Search,
  },
  {
    number: "2",
    title: "Use Case Prioritization",
    description:
      "We identify and rank AI opportunities by business impact, technical feasibility, and implementation complexity to create a focused roadmap.",
    icon: Target,
  },
  {
    number: "3",
    title: "Strategy & Roadmap",
    description:
      "We develop a comprehensive AI strategy including technology selection, talent requirements, governance frameworks, and a phased implementation plan.",
    icon: Lightbulb,
  },
  {
    number: "4",
    title: "Pilot & Scale",
    description:
      "We help you execute pilot projects to prove value, then scale successful initiatives across the organization with proper change management.",
    icon: Zap,
  },
];

const deliverables = [
  {
    icon: FileText,
    title: "AI Readiness Report",
    description:
      "Comprehensive assessment of your organization's AI maturity across data, technology, talent, and culture dimensions.",
  },
  {
    icon: Target,
    title: "Prioritized Use Case Canvas",
    description:
      "Ranked list of AI opportunities with business case, technical requirements, and implementation complexity for each.",
  },
  {
    icon: Presentation,
    title: "AI Strategy Playbook",
    description:
      "Executive-level strategy document with vision, objectives, governance model, and 3-year roadmap.",
  },
  {
    icon: Shield,
    title: "Responsible AI Framework",
    description:
      "Ethics guidelines, bias detection protocols, and governance structures for responsible AI deployment.",
  },
  {
    icon: Users,
    title: "Talent & Organization Plan",
    description:
      "Staffing recommendations, skills gap analysis, and organizational design for AI capabilities.",
  },
  {
    icon: TrendingUp,
    title: "ROI Model & KPIs",
    description:
      "Financial projections, success metrics, and measurement framework for tracking AI initiative performance.",
  },
];

const timeline = [
  {
    phase: "Discovery & Assessment",
    duration: "2-3 weeks",
    description:
      "Comprehensive AI readiness evaluation and stakeholder interviews",
  },
  {
    phase: "Use Case Development",
    duration: "2-3 weeks",
    description:
      "Identifying and prioritizing AI opportunities across your business",
  },
  {
    phase: "Strategy Formulation",
    duration: "3-4 weeks",
    description:
      "Developing comprehensive AI strategy and implementation roadmap",
  },
  {
    phase: "Pilot Planning",
    duration: "2 weeks",
    description:
      "Detailed planning for initial AI pilot projects with clear success criteria",
  },
];

const industryUseCases = [
  {
    icon: Heart,
    industry: "Healthcare",
    useCases: [
      "Clinical decision support systems",
      "Patient risk stratification",
      "Medical imaging analysis",
      "Operational efficiency optimization",
    ],
  },
  {
    icon: Landmark,
    industry: "Finance",
    useCases: [
      "Fraud detection & prevention",
      "Algorithmic trading strategies",
      "Credit risk assessment",
      "Customer service automation",
    ],
  },
  {
    icon: ShoppingCart,
    industry: "Retail",
    useCases: [
      "Demand forecasting",
      "Personalized recommendations",
      "Inventory optimization",
      "Dynamic pricing models",
    ],
  },
  {
    icon: Factory,
    industry: "Manufacturing",
    useCases: [
      "Predictive maintenance",
      "Quality control automation",
      "Supply chain optimization",
      "Production scheduling",
    ],
  },
];

const roiExamples = [
  {
    metric: "40%",
    label: "Cost Reduction",
    description: "Average operational cost savings from AI automation",
  },
  {
    metric: "3-5x",
    label: "ROI",
    description: "Typical return on investment within 18 months",
  },
  {
    metric: "60%",
    label: "Faster Decisions",
    description: "Reduction in time-to-insight for data-driven decisions",
  },
];

const faqs = [
  {
    question: "How do you identify the right AI use cases for my business?",
    answer:
      "We use a structured framework that evaluates potential use cases across four dimensions: business impact (revenue/cost savings), technical feasibility (data availability, complexity), strategic alignment, and implementation risk. We prioritize quick wins that build momentum while planning for transformational initiatives.",
  },
  {
    question: "What does AI readiness mean, and how do you assess it?",
    answer:
      "AI readiness encompasses data infrastructure quality, technical capabilities, organizational culture, and talent availability. Our assessment evaluates data accessibility and quality, existing technology stack, leadership commitment, change readiness, and skills gaps—providing a clear picture of what's needed before AI implementation.",
  },
  {
    question: "How do you address AI ethics and responsible AI?",
    answer:
      "Responsible AI is integrated into every engagement. We help establish governance frameworks, bias detection protocols, transparency standards, and human oversight mechanisms. Our approach ensures AI solutions are fair, explainable, and aligned with your values and regulatory requirements.",
  },
  {
    question: "What kind of ROI can we expect from AI initiatives?",
    answer:
      "ROI varies by use case, but clients typically see 3-5x returns within 18 months. Automation use cases often deliver 30-50% cost savings, while revenue-focused AI (personalization, pricing) can drive 10-20% top-line growth. We build detailed financial models for each initiative.",
  },
  {
    question: "Do we need a lot of data to get started with AI?",
    answer:
      "Not necessarily. While more data generally improves AI performance, many valuable use cases work with limited datasets. We help identify what's possible with your current data and develop strategies to improve data quality and collection where needed. Some AI applications can even work with synthetic or publicly available data.",
  },
  {
    question: "How long does it take to implement an AI strategy?",
    answer:
      "Strategy development takes 6-10 weeks. Initial pilots typically deliver results within 3-6 months. Full organizational AI transformation is a 2-3 year journey, but we design roadmaps to deliver business value at every stage rather than waiting for completion.",
  },
  {
    question: "Can you help with implementation, or is it just strategy?",
    answer:
      "We do both. Our Solutions team provides strategic guidance and roadmap development, while our Labs team handles technical implementation for complex AI projects. We can also work with your internal teams or preferred vendors to ensure successful execution.",
  },
  {
    question: "What if we don't have AI talent in-house?",
    answer:
      "This is common and expected. We provide talent strategy recommendations including hiring profiles, training programs, and partnership models. Our managed AI services can fill capability gaps while you build internal expertise. We also offer AI employee solutions through our Agents platform.",
  },
];

const relatedServices = [
  {
    title: "Digital Transformation",
    description: "Transform your business for the digital age",
    href: "/solutions/services/digital-transformation",
    icon: Rocket,
  },
  {
    title: "Process Automation",
    description: "Automate repetitive workflows to increase efficiency",
    href: "/solutions/services/process-automation",
    icon: Cog,
  },
  {
    title: "Technology Architecture",
    description: "Build scalable systems that grow with your ambition",
    href: "/solutions/services/technology-architecture",
    icon: Shield,
  },
  {
    title: "Growth Strategy",
    description: "Sustainable growth through strategic innovation",
    href: "/solutions/services/growth-strategy",
    icon: ChartBar,
  },
  {
    title: "AI Strategy",
    description: "Develop a comprehensive AI roadmap tailored to your goals",
    href: "/solutions/services/ai-strategy",
    icon: Lightbulb,
  },
];

export function AIStrategyClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <ServiceHero
        badge={{ icon: Lightbulb, text: "AI Strategy" }}
        title={
          <>
            AI That Actually Works
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              for Your Business
            </span>
          </>
        }
        description="Cut through the AI hype. We help you identify real opportunities, build practical roadmaps, and implement AI solutions that deliver measurable business results."
        primaryCta={{ text: "Book Discovery Call", href: "/contact" }}
        secondaryCta={{ text: "View AI Readiness Guide", href: "#readiness" }}
      />

      {/* AI Readiness Section */}
      <section id="readiness" className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                AI Readiness Framework
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Are You Ready for AI?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Before investing in AI, you need to understand your readiness
                across four critical dimensions. Our assessment provides a clear
                picture of where you stand and what's needed to succeed.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Data Foundation",
                  description:
                    "Quality, accessibility, and governance of your data assets. AI is only as good as the data it learns from.",
                  icon: FileText,
                },
                {
                  title: "Technical Infrastructure",
                  description:
                    "Cloud capabilities, integration architecture, and scalability to support AI workloads.",
                  icon: Zap,
                },
                {
                  title: "Organizational Readiness",
                  description:
                    "Leadership commitment, change readiness, and cultural appetite for AI-driven transformation.",
                  icon: Users,
                },
                {
                  title: "Talent & Skills",
                  description:
                    "Availability of data scientists, ML engineers, and business analysts to develop and manage AI solutions.",
                  icon: Target,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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

      {/* Use Cases by Industry */}
      <section className="py-24 lg:py-32 bg-muted/30 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Use Cases
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              AI Applications by Industry
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how AI creates value across different sectors with
              proven, high-impact use cases.
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industryUseCases.map((industry, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                  <industry.icon className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold mb-4">
                  {industry.industry}
                </h3>
                <ul className="space-y-2">
                  {industry.useCases.map((useCase, uIndex) => (
                    <li
                      key={uIndex}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Responsible AI */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                Responsible AI
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Building AI You Can Trust
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Responsible AI isn't just about compliance—it's about building
                systems that are fair, transparent, and aligned with your
                values. We help you establish governance frameworks that build
                trust with customers, employees, and regulators.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Fairness & Bias Detection",
                  description:
                    "Systems to detect and mitigate bias in training data and model outputs.",
                },
                {
                  title: "Explainability",
                  description:
                    "Transparent AI that can explain its decisions in human-understandable terms.",
                },
                {
                  title: "Privacy Protection",
                  description:
                    "Techniques to train AI while protecting sensitive personal information.",
                },
                {
                  title: "Human Oversight",
                  description:
                    "Governance structures ensuring humans remain in control of critical decisions.",
                },
                {
                  title: "Security",
                  description:
                    "Protection against adversarial attacks and data poisoning.",
                },
                {
                  title: "Accountability",
                  description:
                    "Clear ownership and audit trails for AI system decisions and outcomes.",
                },
              ].map((principle, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500 mb-4" />
                  <h3 className="font-semibold mb-2">{principle.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {principle.description}
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
        title="Our AI Strategy Process"
        description="A proven approach to developing AI strategies that deliver results"
      />

      {/* ROI Examples */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Proven Results
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Real AI ROI
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Typical outcomes from well-executed AI initiatives
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {roiExamples.map((example, index) => (
                <div key={index} className="text-center p-8 rounded-2xl border bg-card">
                  <div className="text-4xl sm:text-5xl font-bold text-amber-500 mb-2">
                    {example.metric}
                  </div>
                  <div className="font-semibold mb-2">{example.label}</div>
                  <p className="text-sm text-muted-foreground">
                    {example.description}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Deliverables */}
      <DeliverablesList
        deliverables={deliverables}
        title="What You Get"
        description="Comprehensive deliverables to guide your AI journey from strategy to execution"
      />

      {/* Investment */}
      <InvestmentCard
        timeline={timeline}
        priceRange="$20,000"
        ctaText="Book AI Strategy Session"
        ctaHref="/contact"
      />

      {/* FAQ */}
      <FAQSection faqs={faqs} />

      {/* Related Services */}
      <RelatedServices
        services={relatedServices}
        currentService="AI Strategy"
      />

      {/* Final CTA */}
      <CTABanner
        title="Ready to Unlock AI's Potential?"
        description="Let's explore how AI can transform your business. Schedule a free AI readiness assessment and discover your highest-impact opportunities."
        buttonText="Schedule AI Assessment"
        buttonHref="/contact"
      />
    </main>
  );
}
