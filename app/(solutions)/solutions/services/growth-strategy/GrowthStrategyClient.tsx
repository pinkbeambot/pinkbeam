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
  ChartBar,
  Search,
  Target,
  Rocket,
  TrendingUp,
  FileText,
  Presentation,
  Users,
  Globe,
  Zap,
  Rocket as TransformIcon,
  Lightbulb,
  Cog,
  Shield,
  BarChart3,
  MousePointer,
  Mail,
  Share2,
  Megaphone,
} from "lucide-react";

const processSteps = [
  {
    number: "1",
    title: "Growth Audit",
    description:
      "We analyze your current growth engine—acquisition channels, conversion funnels, retention metrics, and unit economics. This reveals bottlenecks, opportunities, and untapped potential.",
    icon: Search,
  },
  {
    number: "2",
    title: "Opportunity Mapping",
    description:
      "We identify growth opportunities across market expansion, product development, channel optimization, and operational efficiency. Each opportunity is sized and prioritized by impact and effort.",
    icon: Target,
  },
  {
    number: "3",
    title: "Strategy Development",
    description:
      "We create a comprehensive growth strategy with clear objectives, initiatives, resource requirements, and success metrics. The plan balances quick wins with long-term capability building.",
    icon: Rocket,
  },
  {
    number: "4",
    title: "Execution Support",
    description:
      "We provide ongoing support for strategy execution—experiment design, performance tracking, and iterative optimization based on data and market feedback.",
    icon: TrendingUp,
  },
];

const deliverables = [
  {
    icon: FileText,
    title: "Growth Audit Report",
    description:
      "Comprehensive analysis of current growth performance, funnel metrics, and competitive positioning.",
  },
  {
    icon: Target,
    title: "Opportunity Assessment",
    description:
      "Prioritized list of growth initiatives with market sizing, effort estimates, and expected impact.",
  },
  {
    icon: Presentation,
    title: "Growth Strategy Playbook",
    description:
      "Detailed strategic plan with objectives, initiatives, timelines, resource requirements, and success metrics.",
  },
  {
    icon: Zap,
    title: "Channel Strategy",
    description:
      "Multi-channel growth plan covering digital, partnerships, and emerging opportunities.",
  },
  {
    icon: BarChart3,
    title: "KPI Framework",
    description:
      "North Star metric definition, leading indicators, and dashboard specifications for tracking growth.",
  },
  {
    icon: FileText,
    title: "Experiment Roadmap",
    description:
      "Prioritized testing plan to validate assumptions and optimize growth tactics iteratively.",
  },
];

const timeline = [
  {
    phase: "Growth Audit",
    duration: "2-3 weeks",
    description:
      "Deep analysis of current growth performance and competitive landscape",
  },
  {
    phase: "Opportunity Mapping",
    duration: "2-3 weeks",
    description:
      "Identifying and prioritizing growth initiatives across channels and markets",
  },
  {
    phase: "Strategy Development",
    duration: "3-4 weeks",
    description:
      "Creating comprehensive growth strategy with detailed execution plans",
  },
  {
    phase: "Execution Support",
    duration: "Ongoing",
    description:
      "Quarterly reviews, experiment design, and continuous optimization",
  },
];

const expansionStrategies = [
  {
    icon: Globe,
    title: "Geographic Expansion",
    description:
      "Enter new markets with localized strategies, partnerships, and go-to-market plans.",
  },
  {
    icon: Users,
    title: "Customer Segment Expansion",
    description:
      "Identify and target new customer segments with tailored value propositions.",
  },
  {
    icon: Zap,
    title: "Product Line Extension",
    description:
      "Develop adjacent products and services that leverage existing capabilities.",
  },
  {
    icon: Share2,
    title: "Partnership & Channel Growth",
    description:
      "Build strategic partnerships and channel programs for scaled distribution.",
  },
];

const digitalGrowthChannels = [
  {
    icon: MousePointer,
    channel: "Paid Acquisition",
    tactics: [
      "Search engine marketing",
      "Social media advertising",
      "Programmatic display",
      "Retargeting campaigns",
    ],
  },
  {
    icon: FileText,
    channel: "Content Marketing",
    tactics: [
      "SEO-optimized content",
      "Thought leadership",
      "Video marketing",
      "Podcast guesting",
    ],
  },
  {
    icon: Megaphone,
    channel: "Social & Community",
    tactics: [
      "Organic social strategy",
      "Community building",
      "Influencer partnerships",
      "User-generated content",
    ],
  },
  {
    icon: Mail,
    channel: "Email & CRM",
    tactics: [
      "Lifecycle email sequences",
      "Marketing automation",
      "Personalization at scale",
      "Win-back campaigns",
    ],
  },
];

const kpiFrameworks = [
  {
    category: "Acquisition",
    metrics: [
      "Customer Acquisition Cost (CAC)",
      "Channel-specific ROI",
      "Lead velocity rate",
      "Traffic growth rate",
    ],
  },
  {
    category: "Activation",
    metrics: [
      "Trial-to-paid conversion",
      "Time to first value",
      "Activation rate",
      "Feature adoption",
    ],
  },
  {
    category: "Retention",
    metrics: [
      "Monthly/Annual churn rate",
      "Net Revenue Retention",
      "Customer Lifetime Value",
      "Engagement score",
    ],
  },
  {
    category: "Revenue",
    metrics: [
      "Monthly Recurring Revenue",
      "Average Revenue Per User",
      "Expansion revenue",
      "Unit economics",
    ],
  },
];

const faqs = [
  {
    question: "How is growth strategy different from marketing?",
    answer:
      "Growth strategy is broader than marketing—it encompasses product, operations, partnerships, and organizational capabilities in addition to customer acquisition. We focus on sustainable, scalable growth engines rather than just campaign tactics. Marketing execution is one component of a comprehensive growth strategy.",
  },
  {
    question: "What stage companies do you work with?",
    answer:
      "We work with growth-stage companies (Series A to D) and established enterprises looking to accelerate. The ideal fit is companies with product-market fit who need help scaling efficiently, entering new markets, or building sustainable growth engines.",
  },
  {
    question: "How do you measure growth strategy success?",
    answer:
      "We define clear metrics upfront based on your business model and goals. Common metrics include CAC efficiency, payback period, net revenue retention, growth rate improvements, and market share gains. We establish tracking dashboards and review progress monthly.",
  },
  {
    question: "Can you help with execution or just strategy?",
    answer:
      "We do both. Our engagements typically include strategy development plus 3-6 months of execution support. This includes experiment design, weekly check-ins, channel optimization, and tactical guidance. For hands-on campaign management, we can work with your team or recommend specialized partners.",
  },
  {
    question: "How long before we see results?",
    answer:
      "Quick wins often emerge within 30-60 days as we optimize existing channels and fix conversion bottlenecks. Major strategic initiatives like market expansion or product launches typically show results in 6-12 months. We design roadmaps to deliver value at every stage.",
  },
  {
    question: "What technology do you recommend for growth?",
    answer:
      "We take a tool-agnostic approach, recommending based on your needs and existing stack. Common tools include analytics platforms (Amplitude, Mixpanel), CRMs (HubSpot, Salesforce), marketing automation, and customer data platforms. We help integrate these into a cohesive growth stack.",
  },
  {
    question: "How do you approach market expansion?",
    answer:
      "We use a phased approach: market research and sizing, competitive analysis, localization requirements, partnership opportunities, and go-to-market planning. We help prioritize markets by opportunity size, competitive intensity, and strategic fit. Pilot programs validate assumptions before full investment.",
  },
  {
    question: "What's included in the growth audit?",
    answer:
      "Our audit covers your entire growth funnel: acquisition channel performance, conversion rate analysis, retention metrics, pricing strategy, competitive positioning, and operational capabilities. We interview stakeholders, analyze data, and provide a detailed findings report with prioritized recommendations.",
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
    icon: Lightbulb,
  },
  {
    title: "Process Automation",
    description: "Automate repetitive workflows",
    href: "/solutions/services/process-automation",
    icon: Cog,
  },
  {
    title: "Technology Architecture",
    description: "Build scalable systems",
    href: "/solutions/services/technology-architecture",
    icon: Shield,
  },
  {
    title: "Growth Strategy",
    description: "Sustainable growth through innovation",
    href: "/solutions/services/growth-strategy",
    icon: ChartBar,
  },
];

export function GrowthStrategyClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <ServiceHero
        badge={{ icon: ChartBar, text: "Growth Strategy" }}
        title={
          <>
            Sustainable Growth Through
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Strategic Innovation
            </span>
          </>
        }
        description="Build scalable growth engines powered by data and technology. We help you identify opportunities, optimize channels, and create sustainable competitive advantages in your market."
        primaryCta={{ text: "Book Discovery Call", href: "/contact" }}
        secondaryCta={{ text: "View Growth Framework", href: "#audit" }}
      />

      {/* Growth Audit */}
      <section id="audit" className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                Growth Audit
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Understanding Your Growth Engine
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Before we can optimize growth, we need to understand how your
                business acquires, activates, and retains customers. Our
                comprehensive audit reveals the levers that drive sustainable
                growth.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Funnel Analysis",
                  description:
                    "Deep dive into your acquisition, activation, retention, and referral metrics to identify bottlenecks.",
                },
                {
                  title: "Channel Performance",
                  description:
                    "Evaluation of each acquisition channel's efficiency, scalability, and ROI.",
                },
                {
                  title: "Unit Economics",
                  description:
                    "Analysis of CAC, LTV, payback period, and margins to ensure sustainable unit economics.",
                },
                {
                  title: "Competitive Positioning",
                  description:
                    "Assessment of your market position, differentiation, and competitive threats.",
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

      {/* Expansion Strategies */}
      <section className="py-24 lg:py-32 bg-muted/30 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Market Expansion
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Growth Through Expansion
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Strategic approaches to entering new markets and reaching new
              customers
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expansionStrategies.map((strategy, index) => (
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

      {/* Digital Growth Channels */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Digital Channels
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Digital Growth Channels
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Multi-channel strategies for scalable customer acquisition
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {digitalGrowthChannels.map((channel, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                  <channel.icon className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold mb-4">
                  {channel.channel}
                </h3>
                <ul className="space-y-2">
                  {channel.tactics.map((tactic, tIndex) => (
                    <li
                      key={tIndex}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      {tactic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* KPI Frameworks */}
      <section className="py-24 lg:py-32 bg-muted/30 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                Measurement
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Metrics That Matter
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We help you establish clear KPI frameworks that track progress,
                guide decisions, and align teams around growth objectives.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 gap-6">
              {kpiFrameworks.map((framework, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
                >
                  <h3 className="font-semibold mb-4">{framework.category}</h3>
                  <ul className="space-y-2">
                    {framework.metrics.map((metric, mIndex) => (
                      <li
                        key={mIndex}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-amber-500" />
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <ProcessTimeline
        steps={processSteps}
        title="Our Growth Process"
        description="A data-driven approach to identifying opportunities and building sustainable growth engines"
      />

      {/* Deliverables */}
      <DeliverablesList
        deliverables={deliverables}
        title="What You Get"
        description="Comprehensive growth strategy deliverables from audit through execution support"
      />

      {/* Investment */}
      <InvestmentCard
        timeline={timeline}
        priceRange="$20,000"
        ctaText="Start Growth Audit"
        ctaHref="/contact"
      />

      {/* FAQ */}
      <FAQSection faqs={faqs} />

      {/* Related Services */}
      <RelatedServices
        services={relatedServices}
        currentService="Growth Strategy"
      />

      {/* Final CTA */}
      <CTABanner
        title="Ready to Accelerate Your Growth?"
        description="Let's analyze your growth engine and identify your biggest opportunities. Schedule a free discovery call to start building your scalable growth strategy."
        buttonText="Book Growth Assessment"
        buttonHref="/contact"
      />
    </main>
  );
}
