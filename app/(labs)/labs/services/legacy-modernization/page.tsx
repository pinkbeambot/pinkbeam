"use client";

import { 
  ServicePageLayout, 
  ProblemStatement, 
  ApproachSection,
  TechStackSection,
  ProcessSteps,
  FAQSection,
  CaseStudyTeaser,
  CTASection 
} from "../components";
import { RefreshCw } from "lucide-react";

const hero = {
  badge: {
    icon: RefreshCw,
    text: "Legacy Modernization",
  },
  title: (
    <>
      Transform legacy systems into{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-cyan-400">
        modern assets
      </span>
    </>
  ),
  description: "Strategic modernization of legacy applications without disrupting your business. We refactor, rebuild, and replatform—carefully, systematically, and with minimal risk.",
  primaryCta: {
    text: "Modernize Now",
    href: "/contact",
  },
  secondaryCta: {
    text: "View Pricing",
    href: "/labs/pricing",
  },
};

const painPoints = [
  "Legacy systems are slow, crash frequently, and frustrate both users and developers",
  "Technical debt makes every new feature exponentially harder and more expensive",
  "Outdated technology prevents you from hiring top engineering talent",
  "Security vulnerabilities in old frameworks put your business at risk",
];

const approaches = [
  {
    title: "Strangler Fig Pattern",
    description: "Incrementally replace legacy systems piece by piece. No big-bang rewrites—just steady, low-risk progress with continuous value delivery.",
  },
  {
    title: "Business Continuity First",
    description: "Your systems stay running throughout. We plan migrations around your schedule, with rollback strategies for every change.",
  },
  {
    title: "Knowledge Transfer",
    description: "We document everything and train your team. No black boxes—you'll understand and own the modernized system.",
  },
];

const technologies = [
  { name: "Node.js", description: "Modern runtime" },
  { name: "React", description: "UI framework" },
  { name: "PostgreSQL", description: "Modern database" },
  { name: "Docker", description: "Containerization" },
  { name: "Kubernetes", description: "Orchestration" },
  { name: "AWS/Azure", description: "Cloud platforms" },
  { name: "GraphQL", description: "Modern APIs" },
  { name: "TypeScript", description: "Type safety" },
  { name: "Redis", description: "Caching layer" },
  { name: "Kafka", description: "Event streaming" },
  { name: "Terraform", description: "Infrastructure as Code" },
  { name: "GitHub Actions", description: "CI/CD pipelines" },
];

const processSteps = [
  {
    number: "01",
    title: "Audit & Assess",
    description: "Comprehensive analysis of your current system—architecture, dependencies, technical debt, and business criticality. We identify the highest-value modernization opportunities.",
  },
  {
    number: "02",
    title: "Plan & Prioritize",
    description: "Roadmap creation balancing risk, effort, and business value. We sequence changes to minimize disruption while delivering early wins.",
  },
  {
    number: "03",
    title: "Migrate & Modernize",
    description: "Incremental transformation with parallel running. Old and new systems coexist during transition, with data synchronized between them.",
  },
  {
    number: "04",
    title: "Validate & Optimize",
    description: "Rigorous testing, performance tuning, and team training. We don't just modernize—we optimize for your specific workloads.",
  },
];

const faqs = [
  {
    question: "What's your approach to legacy modernization?",
    answer: "We favor incremental modernization over big-bang rewrites. The Strangler Fig pattern lets us replace legacy components one at a time, reducing risk and maintaining business continuity. Each iteration delivers value while moving toward the target architecture.",
  },
  {
    question: "How do you minimize downtime during migration?",
    answer: "We use blue-green deployments, database replication, and feature flags to enable zero-downtime migrations. Critical systems run in parallel during transition. We schedule cutovers during low-traffic windows and always have rollback plans ready.",
  },
  {
    question: "Can you modernize while adding new features?",
    answer: "Yes, and this is often the best approach. We add new features to the modernized architecture while gradually migrating existing functionality. This delivers immediate business value and proves the new platform before full migration.",
  },
  {
    question: "What types of legacy systems do you modernize?",
    answer: "We've modernized monolithic Java EE applications, .NET Framework apps, PHP legacy systems, COBOL mainframes, VB6 applications, and aging Ruby on Rails codebases. Every stack, every era—we've seen it.",
  },
  {
    question: "How do you handle data migration?",
    answer: "Data migration gets its own detailed plan: schema mapping, transformation rules, validation checks, and reconciliation processes. We run parallel systems during transition, comparing outputs to ensure data integrity.",
  },
  {
    question: "What's the typical timeline for modernization?",
    answer: "It varies dramatically—a focused module might take 6-8 weeks, while enterprise-wide transformation could span 12-18 months. We break large efforts into phases, delivering modernized components every 2-3 months.",
  },
  {
    question: "How do you preserve business logic during modernization?",
    answer: "We start by documenting existing behavior—edge cases, business rules, and undocumented features discovered through code analysis. Test cases capture current functionality, ensuring the modernized system matches (or improves) legacy behavior.",
  },
];

const caseStudy = {
  title: "FinTech Modernization: Banking Platform",
  description: "Gradual modernization of a 15-year-old banking platform serving 2M+ users, reducing infrastructure costs by 60% and deployment time from weeks to minutes.",
  stats: [
    { label: "Cost Reduction", value: "60%" },
    { label: "Deploy Time", value: "-95%" },
    { label: "Uptime", value: "99.99%" },
  ],
};

export default function LegacyModernizationPage() {
  return (
    <ServicePageLayout hero={hero}>
      <ProblemStatement
        title="Legacy systems hold you back"
        description="Technical debt compounds over time. The longer you wait, the harder it gets—but starting doesn't have to be risky."
        painPoints={painPoints}
      />

      <ApproachSection
        title="Modernization without the risk"
        description="Proven patterns for transforming legacy systems while keeping your business running."
        approaches={approaches}
      />

      <TechStackSection
        title="Modernization targets"
        description="Current technologies we migrate legacy systems toward."
        technologies={technologies}
      />

      <ProcessSteps
        title="The modernization journey"
        description="A careful, systematic approach to transforming your legacy estate."
        steps={processSteps}
      />

      <CaseStudyTeaser
        title={caseStudy.title}
        description={caseStudy.description}
        stats={caseStudy.stats}
      />

      <FAQSection faqs={faqs} />

      <CTASection
        title="Ready to modernize?"
        description="Let's assess your legacy systems and create a modernization roadmap that works for your business."
        buttonText="Start Assessment"
        buttonHref="/contact"
      />
    </ServicePageLayout>
  );
}
