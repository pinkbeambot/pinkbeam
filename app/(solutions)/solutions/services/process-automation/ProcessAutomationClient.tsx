"use client";

import React from "react";
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
  Cog,
  Search,
  Target,
  Zap,
  FileText,
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  Rocket,
  Lightbulb,
  Shield,
  ChartBar,
  Building2,
  Wallet,
  HeadphonesIcon,
  Factory,
} from "lucide-react";

const processSteps = [
  {
    number: "1",
    title: "Process Discovery",
    description:
      "We map your current workflows, identify bottlenecks, and quantify the time and cost of manual activities. Process mining and stakeholder interviews reveal automation opportunities.",
    icon: Search,
  },
  {
    number: "2",
    title: "Opportunity Assessment",
    description:
      "We evaluate each process for automation feasibility, considering volume, complexity, standardization, and system integration requirements. ROI modeling helps prioritize the quick wins.",
    icon: Target,
  },
  {
    number: "3",
    title: "Solution Design",
    description:
      "We design the automation architecture, selecting the right mix of RPA, workflow automation, and AI-powered solutions. Integration points, exception handling, and governance are all planned.",
    icon: Settings,
  },
  {
    number: "4",
    title: "Build & Deploy",
    description:
      "We develop, test, and deploy automation solutions with proper change management. Training and documentation ensure your team can maintain and extend automations.",
    icon: Zap,
  },
];

const deliverables = [
  {
    icon: FileText,
    title: "Process Assessment Report",
    description:
      "Comprehensive analysis of your current processes with automation potential ranked by ROI and complexity.",
  },
  {
    icon: Target,
    title: "Automation Roadmap",
    description:
      "Prioritized implementation plan with timeline, resource requirements, and expected outcomes for each automation.",
  },
  {
    icon: Settings,
    title: "Technical Architecture",
    description:
      "Detailed design of automation solutions including tool selection, integration patterns, and data flows.",
  },
  {
    icon: Zap,
    title: "Deployed Automations",
    description:
      "Fully functional automation solutions with documentation, testing, and handover to your team.",
  },
  {
    icon: Users,
    title: "Change Management Plan",
    description:
      "Strategy for workforce transition, training programs, and communication to ensure smooth adoption.",
  },
  {
    icon: TrendingUp,
    title: "ROI Dashboard",
    description:
      "Real-time tracking of automation performance including time saved, errors reduced, and cost benefits.",
  },
];

const timeline = [
  {
    phase: "Process Discovery",
    duration: "2-3 weeks",
    description:
      "Mapping current workflows and identifying automation opportunities",
  },
  {
    phase: "Opportunity Assessment",
    duration: "2 weeks",
    description:
      "Evaluating feasibility and building business cases for each opportunity",
  },
  {
    phase: "Solution Design",
    duration: "2-3 weeks",
    description:
      "Designing automation architecture and selecting appropriate tools",
  },
  {
    phase: "Implementation",
    duration: "4-12 weeks",
    description:
      "Building, testing, and deploying automation solutions iteratively",
  },
];

const automationByFunction = [
  {
    icon: Factory,
    function: "Operations",
    examples: [
      "Order processing and fulfillment",
      "Inventory management updates",
      "Supply chain tracking",
      "Quality control reporting",
      "Vendor onboarding",
    ],
  },
  {
    icon: Wallet,
    function: "Finance",
    examples: [
      "Invoice processing and matching",
      "Expense report validation",
      "Accounts reconciliation",
      "Financial reporting",
      "Compliance documentation",
    ],
  },
  {
    icon: Users,
    function: "HR",
    examples: [
      "Employee onboarding workflows",
      "Payroll data preparation",
      "Benefits administration",
      "Time-off request processing",
      "Performance review reminders",
    ],
  },
  {
    icon: HeadphonesIcon,
    function: "Customer Service",
    examples: [
      "Ticket routing and prioritization",
      "Customer data updates",
      "Response template population",
      "Feedback collection",
      "Escalation handling",
    ],
  },
];

const toolsAndTechnologies = [
  {
    category: "RPA Platforms",
    tools: ["UiPath", "Automation Anywhere", "Microsoft Power Automate", "Blue Prism"],
  },
  {
    category: "Workflow Automation",
    tools: ["Zapier", "Make", "n8n", "Workato"],
  },
  {
    category: "Document Processing",
    tools: ["AWS Textract", "Google Document AI", "Azure Form Recognizer", "ABBYY"],
  },
  {
    category: "Integration",
    tools: ["MuleSoft", "Boomi", "Custom APIs", "Webhook workflows"],
  },
];

const faqs = [
  {
    question: "What types of processes are best suited for automation?",
    answer:
      "Ideal automation candidates are repetitive, rule-based, high-volume processes with structured data inputs. Common examples include data entry, invoice processing, report generation, email routing, and system synchronizations. We help you identify processes with the highest ROI potential.",
  },
  {
    question: "How do you calculate ROI for automation?",
    answer:
      "We calculate ROI by measuring time saved (hours × hourly rate), error reduction (error rate × cost per error), improved compliance (risk reduction value), and employee satisfaction (retention cost savings). Most automations pay for themselves within 6-12 months.",
  },
  {
    question: "What's the difference between RPA and intelligent automation?",
    answer:
      "RPA (Robotic Process Automation) handles structured, rule-based tasks by mimicking human actions. Intelligent automation adds AI capabilities—natural language processing, computer vision, machine learning—to handle unstructured data, make decisions, and adapt to variations. We recommend the right approach for each use case.",
  },
  {
    question: "How long does it take to implement automation?",
    answer:
      "Simple automations can be deployed in 2-4 weeks. Complex enterprise workflows may take 8-12 weeks. We use an agile approach, delivering value incrementally and refining based on feedback. Our roadmap prioritizes quick wins to build momentum.",
  },
  {
    question: "Will automation replace our employees?",
    answer:
      "Automation typically augments rather than replaces employees. It handles repetitive tasks so your team can focus on high-value work requiring judgment, creativity, and human interaction. Most organizations see improved job satisfaction and redeploy staff to growth-focused activities.",
  },
  {
    question: "How do you handle exceptions and errors?",
    answer:
      "Every automation includes exception handling protocols. We design for common error scenarios, implement retry logic, and establish escalation paths to human reviewers when needed. Comprehensive logging and alerting ensure issues are caught and resolved quickly.",
  },
  {
    question: "What systems can you automate across?",
    answer:
      "We can automate across virtually any system with an interface—web applications, desktop software, databases, APIs, legacy mainframes, and more. Our tool-agnostic approach selects the best technology for your specific technology stack.",
  },
  {
    question: "How do you ensure security and compliance?",
    answer:
      "Security is built into every automation. We implement role-based access, encrypt sensitive data, maintain audit trails, and ensure compliance with SOC 2, GDPR, HIPAA, and other relevant standards. Automations often improve compliance by eliminating human error.",
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
    title: "AI Strategy",
    description: "Develop a comprehensive AI roadmap",
    href: "/solutions/services/ai-strategy",
    icon: Lightbulb,
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
    title: "Process Automation",
    description: "Automate repetitive workflows",
    href: "/solutions/services/process-automation",
    icon: Cog,
  },
];

// Simple ROI Calculator Component
function ROICalculator() {
  const [hoursPerWeek, setHoursPerWeek] = React.useState(40);
  const [hourlyRate, setHourlyRate] = React.useState(50);
  const [implementationCost, setImplementationCost] = React.useState(15000);

  const weeklySavings = hoursPerWeek * hourlyRate;
  const annualSavings = weeklySavings * 52;
  const roi = ((annualSavings - implementationCost) / implementationCost) * 100;
  const paybackMonths = implementationCost / (annualSavings / 12);

  return (
    <div className="p-6 lg:p-8 rounded-2xl border bg-card">
      <h3 className="text-xl font-bold mb-6">Automation ROI Calculator</h3>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">
            Hours per week spent on manual tasks
          </label>
          <input
            type="range"
            min="5"
            max="200"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>{hoursPerWeek} hours/week</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Average hourly rate ($)
          </label>
          <input
            type="range"
            min="15"
            max="150"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>${hourlyRate}/hour</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Estimated implementation cost ($)
          </label>
          <input
            type="range"
            min="5000"
            max="100000"
            step="5000"
            value={implementationCost}
            onChange={(e) => setImplementationCost(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>${implementationCost.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-muted/50">
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">
            ${annualSavings.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Annual Savings</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">
            {Math.round(roi)}%
          </div>
          <div className="text-xs text-muted-foreground">1-Year ROI</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">
            {paybackMonths < 1
              ? "< 1 month"
              : `${Math.round(paybackMonths)} months`}
          </div>
          <div className="text-xs text-muted-foreground">Payback Period</div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        *This is a simplified estimate. Actual ROI depends on process
        complexity, error reduction, and other factors.
      </p>
    </div>
  );
}

export function ProcessAutomationClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <ServiceHero
        badge={{ icon: Cog, text: "Process Automation" }}
        title={
          <>
            Automate the Repetitive,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Focus on What Matters
            </span>
          </>
        }
        description="Identify and eliminate manual bottlenecks with intelligent automation. Our proven methodology delivers measurable efficiency gains—typically 30-50% cost reduction on automated processes."
        primaryCta={{ text: "Book Discovery Call", href: "/solutions/contact" }}
        secondaryCta={{ text: "Try ROI Calculator", href: "#roi" }}
      />

      {/* Process Assessment Section */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                Our Approach
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Process Assessment Methodology
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We don't just throw technology at problems. Our systematic
                approach identifies the highest-value automation opportunities
                and ensures solutions are sustainable, scalable, and aligned
                with your business goals.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Process Mining",
                  description:
                    "We analyze system logs and workflows to understand actual process execution, not just documented procedures.",
                },
                {
                  title: "Stakeholder Interviews",
                  description:
                    "We talk to the people doing the work to uncover pain points, workarounds, and improvement ideas.",
                },
                {
                  title: "Volume Analysis",
                  description:
                    "We quantify transaction volumes, frequency, and seasonality to size automation opportunities accurately.",
                },
                {
                  title: "Complexity Scoring",
                  description:
                    "We evaluate system integration requirements, exception handling needs, and decision complexity.",
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

      {/* Automation by Function */}
      <section className="py-24 lg:py-32 bg-muted/30 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              By Function
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Automation Opportunities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover high-impact automation use cases across every department
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {automationByFunction.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold mb-4">{item.function}</h3>
                <ul className="space-y-2">
                  {item.examples.map((example, eIndex) => (
                    <li
                      key={eIndex}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Tools & Technologies */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                Technology
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Tools & Technologies
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We select the best-fit technology for your environment—no
                vendor bias, just the right tool for the job.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 gap-6">
              {toolsAndTechnologies.map((category, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
                >
                  <h3 className="font-semibold mb-4">{category.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.tools.map((tool, tIndex) => (
                      <span
                        key={tIndex}
                        className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <ProcessTimeline
        steps={processSteps}
        title="Our Automation Process"
        description="A proven methodology for identifying, designing, and deploying automation solutions"
      />

      {/* ROI Calculator */}
      <section id="roi" className="py-24 lg:py-32 bg-muted/30 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              ROI Calculator
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Estimate Your Savings
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a quick estimate of potential time and cost savings from
              automation
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="max-w-2xl mx-auto">
              <ROICalculator />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Deliverables */}
      <DeliverablesList
        deliverables={deliverables}
        title="What You Get"
        description="End-to-end automation services from assessment through deployment and optimization"
      />

      {/* Investment */}
      <InvestmentCard
        timeline={timeline}
        priceRange="$15,000"
        ctaText="Start Automation Assessment"
        ctaHref="/solutions/contact"
      />

      {/* FAQ */}
      <FAQSection faqs={faqs} />

      {/* Related Services */}
      <RelatedServices
        services={relatedServices}
        currentService="Process Automation"
      />

      {/* Final CTA */}
      <CTABanner
        title="Ready to Eliminate Manual Work?"
        description="Let's identify your highest-value automation opportunities. Schedule a free process assessment and discover how much time and money you could save."
        buttonText="Book Process Assessment"
        buttonHref="/solutions/contact"
      />
    </main>
  );
}
