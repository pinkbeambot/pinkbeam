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
  Rocket,
  Search,
  Lightbulb,
  Settings,
  TrendingUp,
  FileText,
  Presentation,
  Users,
  Code,
  Lightbulb as AIIcon,
  Cog,
  Users as TeamIcon,
  ChartBar,
  Shield,
} from "lucide-react";

const processSteps = [
  {
    number: "1",
    title: "Assess",
    description:
      "We conduct a comprehensive audit of your current technology stack, processes, and organizational capabilities. This includes stakeholder interviews, system analysis, and maturity assessments to establish a baseline.",
    icon: Search,
  },
  {
    number: "2",
    title: "Strategize",
    description:
      "Based on our findings, we develop a tailored digital transformation roadmap that aligns with your business objectives. We prioritize initiatives by impact and feasibility, creating a phased approach to minimize disruption.",
    icon: Lightbulb,
  },
  {
    number: "3",
    title: "Implement",
    description:
      "We work alongside your team to execute the transformation plan. This includes technology selection, vendor management, change management, and hands-on implementation support to ensure successful adoption.",
    icon: Settings,
  },
  {
    number: "4",
    title: "Optimize",
    description:
      "Transformation is ongoing. We establish metrics, monitor progress, and continuously refine your digital capabilities to ensure you're getting maximum value and staying ahead of market changes.",
    icon: TrendingUp,
  },
];

const deliverables = [
  {
    icon: FileText,
    title: "Digital Maturity Assessment",
    description:
      "Comprehensive analysis of your current digital capabilities across technology, processes, people, and culture.",
  },
  {
    icon: Presentation,
    title: "Transformation Roadmap",
    description:
      "3-year strategic roadmap with prioritized initiatives, timelines, resource requirements, and success metrics.",
  },
  {
    icon: Code,
    title: "Technology Architecture",
    description:
      "Recommended tech stack with integration patterns, vendor evaluations, and migration strategies.",
  },
  {
    icon: Users,
    title: "Change Management Plan",
    description:
      "Detailed plan for organizational change, including training programs, communication strategies, and adoption metrics.",
  },
  {
    icon: TrendingUp,
    title: "ROI Analysis",
    description:
      "Detailed financial model projecting costs, benefits, and payback period for each initiative.",
  },
  {
    icon: FileText,
    title: "Implementation Playbooks",
    description:
      "Step-by-step guides for executing each phase of the transformation.",
  },
];

const timeline = [
  {
    phase: "Discovery & Assessment",
    duration: "2-4 weeks",
    description:
      "Comprehensive audit of current state including stakeholder interviews and system analysis",
  },
  {
    phase: "Strategy Development",
    duration: "3-4 weeks",
    description:
      "Creating the transformation roadmap with prioritized initiatives and resource planning",
  },
  {
    phase: "Implementation Planning",
    duration: "2-3 weeks",
    description:
      "Detailed planning for Phase 1 execution including vendor selection and team preparation",
  },
  {
    phase: "Execution & Optimization",
    duration: "Ongoing",
    description:
      "Continuous implementation support, progress monitoring, and iterative improvements",
  },
];

const faqs = [
  {
    question: "How long does a typical digital transformation take?",
    answer:
      "Digital transformation is a journey, not a destination. Initial strategic phases typically take 8-12 weeks, while full implementation spans 12-24 months depending on scope. We use an agile approach, delivering value in 90-day increments so you see results quickly.",
  },
  {
    question: "What size companies do you work with?",
    answer:
      "We primarily work with mid-market companies (50-1000 employees) and enterprise divisions. This is where we can make the biggest impact—organizations large enough to have complex challenges but agile enough to move quickly.",
  },
  {
    question: "How do you measure transformation success?",
    answer:
      "We establish clear KPIs aligned with business objectives: operational efficiency metrics, customer satisfaction scores, time-to-market improvements, cost savings, and revenue growth. We create dashboards for real-time tracking and monthly business reviews.",
  },
  {
    question: "What industries do you specialize in?",
    answer:
      "We have deep expertise in professional services, manufacturing, healthcare, and retail. However, our methodologies are industry-agnostic and have been successfully applied across B2B and B2C sectors.",
  },
  {
    question: "Do you implement the technology or just advise?",
    answer:
      "We do both. Our advisory services provide strategy and roadmaps, while our Labs team can handle implementation for complex technical projects. We also work alongside your internal teams or preferred vendors.",
  },
  {
    question: "How do you handle change management?",
    answer:
      "Change management is integrated into everything we do. We include stakeholder alignment, communication planning, training programs, and adoption metrics. Our approach addresses both the technical and human sides of transformation.",
  },
  {
    question: "What makes Pink Beam different from other consultancies?",
    answer:
      "We combine strategic consulting with hands-on technical expertise. We're not just PowerPoint consultants—we actually build and implement solutions. Our fixed-price engagement models align our incentives with your success.",
  },
  {
    question: "What happens after the initial transformation?",
    answer:
      "We offer ongoing advisory retainers for continuous optimization, quarterly strategy reviews, and access to our team for emerging technology evaluation. Many clients engage us for 2-3 years as their trusted digital transformation partner.",
  },
];

const relatedServices = [
  {
    title: "AI Strategy",
    description: "Develop a comprehensive AI roadmap tailored to your goals",
    href: "/solutions/services/ai-strategy",
    icon: AIIcon,
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
    title: "Digital Transformation",
    description: "Transform your business for the digital age",
    href: "/solutions/services/digital-transformation",
    icon: Rocket,
  },
];

export function DigitalTransformationClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <ServiceHero
        badge={{ icon: Rocket, text: "Digital Transformation" }}
        title={
          <>
            Transform Your Business
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              for the Digital Age
            </span>
          </>
        }
        description="Navigate the complexities of digital transformation with expert guidance. We help you modernize operations, integrate cutting-edge technology, and build a foundation for sustainable growth."
        primaryCta={{ text: "Book Discovery Call", href: "/solutions/contact" }}
        secondaryCta={{ text: "View Case Studies", href: "/solutions/case-studies" }}
      />

      {/* What is Digital Transformation */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                What We Do
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                What is Digital Transformation?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Digital transformation is the integration of digital technology
                into all areas of your business, fundamentally changing how you
                operate and deliver value to customers. It's not just about
                technology—it's about reimagining your business model,
                streamlining processes, and creating a culture of continuous
                innovation.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="grid sm:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-500 mb-2">
                    70%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    of digital transformations fail without proper strategy
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-500 mb-2">
                    3x
                  </div>
                  <p className="text-sm text-muted-foreground">
                    faster growth for digitally mature organizations
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-500 mb-2">
                    23%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    higher profitability for digital leaders
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-24 lg:py-32 bg-muted/30 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                Common Challenges
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Barriers to Digital Success
              </h2>
              <p className="text-lg text-muted-foreground">
                We help organizations overcome the obstacles that derail most
                transformation initiatives.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Legacy System Complexity",
                  description:
                    "Outdated technology stacks that are expensive to maintain and difficult to integrate with modern solutions.",
                },
                {
                  title: "Siloed Data & Operations",
                  description:
                    "Information trapped in departmental silos, preventing a unified view of the customer and business.",
                },
                {
                  title: "Manual Processes",
                  description:
                    "Time-consuming manual workflows that create bottlenecks, errors, and prevent scaling.",
                },
                {
                  title: "Change Resistance",
                  description:
                    "Organizational inertia and lack of buy-in that prevents adoption of new technologies and processes.",
                },
                {
                  title: "Unclear Strategy",
                  description:
                    "Piecemeal technology investments without a coherent vision connecting initiatives to business outcomes.",
                },
                {
                  title: "Skills Gaps",
                  description:
                    "Lack of internal expertise to implement, manage, and optimize new digital capabilities.",
                },
              ].map((challenge, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500 mb-4" />
                  <h3 className="font-semibold mb-2">{challenge.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {challenge.description}
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
        title="Our Methodology"
        description="A proven framework for delivering successful digital transformations"
      />

      {/* Deliverables */}
      <DeliverablesList
        deliverables={deliverables}
        title="What You Get"
        description="Comprehensive deliverables that provide clarity, direction, and measurable outcomes"
      />

      {/* Investment */}
      <InvestmentCard
        timeline={timeline}
        priceRange="$25,000"
        ctaText="Book Discovery Call"
        ctaHref="/solutions/contact"
      />

      {/* FAQ */}
      <FAQSection faqs={faqs} />

      {/* Related Services */}
      <RelatedServices
        services={relatedServices}
        currentService="Digital Transformation"
      />

      {/* Final CTA */}
      <CTABanner
        title="Ready to Transform Your Business?"
        description="Let's discuss how we can help you navigate your digital transformation journey. Schedule a free discovery call to explore your challenges and opportunities."
        buttonText="Book Your Discovery Call"
        buttonHref="/solutions/contact"
      />
    </main>
  );
}
