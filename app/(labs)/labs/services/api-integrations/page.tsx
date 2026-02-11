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
import { Plug } from "lucide-react";

const hero = {
  badge: {
    icon: Plug,
    text: "API & Integration Development",
  },
  title: (
    <>
      Connect systems,{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-cyan-400">
        unlock potential
      </span>
    </>
  ),
  description: "Custom APIs and third-party integrations that connect your ecosystem. We build the bridges that make your data flow and your systems talk.",
  primaryCta: {
    text: "Start Integration",
    href: "/contact",
  },
  secondaryCta: {
    text: "View Case Studies",
    href: "/labs/case-studies",
  },
};

const painPoints = [
  "Data silos prevent you from getting a unified view of your business",
  "Manual data transfers between systems waste hours of productive time",
  "Legacy APIs are slow, unreliable, and holding back innovation",
  "Integration projects always seem to run over budget and behind schedule",
];

const approaches = [
  {
    title: "API-First Design",
    description: "We design APIs before writing implementation. Clear contracts, comprehensive documentation, and developer-friendly interfaces from day one.",
  },
  {
    title: "Resilient Architecture",
    description: "Circuit breakers, retry logic, and graceful degradation ensure your integrations stay up even when third parties don't.",
  },
  {
    title: "Observability Built-In",
    description: "Comprehensive logging, tracing, and monitoring from the start. Know what's happening across your integrations at all times.",
  },
];

const technologies = [
  { name: "Node.js", description: "Server runtime" },
  { name: "GraphQL", description: "Query language" },
  { name: "REST", description: "API architecture" },
  { name: "gRPC", description: "High-performance RPC" },
  { name: "Webhooks", description: "Event-driven" },
  { name: "WebSockets", description: "Real-time comms" },
  { name: "PostgreSQL", description: "Primary database" },
  { name: "Redis", description: "Caching & queues" },
  { name: "Kafka", description: "Event streaming" },
  { name: "RabbitMQ", description: "Message broker" },
  { name: "AWS Lambda", description: "Serverless compute" },
  { name: "OpenAPI", description: "API specification" },
];

const processSteps = [
  {
    number: "01",
    title: "Discovery & Mapping",
    description: "We audit your current systems, map data flows, and identify integration points. Understanding the landscape before building the bridges.",
  },
  {
    number: "02",
    title: "Architecture & Design",
    description: "API contracts, data schemas, and integration patterns designed for scalability and maintainability. We plan for the future.",
  },
  {
    number: "03",
    title: "Development & Testing",
    description: "Clean implementations with comprehensive test coverage. We simulate failures, test edge cases, and ensure reliability.",
  },
  {
    number: "04",
    title: "Deployment & Monitoring",
    description: "Production deployment with full observability. Real-time dashboards alert you to issues before they impact users.",
  },
];

const faqs = [
  {
    question: "What types of integrations do you build?",
    answer: "We build REST and GraphQL APIs, third-party SaaS integrations (Salesforce, HubSpot, Stripe, etc.), legacy system connectors, real-time data sync, ETL pipelines, and event-driven architectures. If systems need to talk, we make it happen.",
  },
  {
    question: "How do you ensure API security?",
    answer: "We implement OAuth 2.0, JWT authentication, API key management, rate limiting, request validation, and encrypted transport. For sensitive data, we add field-level encryption and audit logging. Security is never an afterthought.",
  },
  {
    question: "Can you integrate with legacy or proprietary systems?",
    answer: "Yes, we've integrated with COBOL mainframes, custom ERPs, and systems that 'can't be integrated.' Sometimes it requires creative solutions like screen scraping, file-based transfers, or custom middleware—but we find a way.",
  },
  {
    question: "How do you handle API versioning?",
    answer: "We follow semantic versioning and maintain backward compatibility within major versions. URL versioning (/v1/, /v2/) or header-based versioning depending on your needs. Deprecation notices give clients time to migrate.",
  },
  {
    question: "What about real-time integrations?",
    answer: "We use WebSockets, Server-Sent Events (SSE), and webhook patterns for real-time needs. For high-throughput scenarios, we implement event streaming with Kafka or similar technologies.",
  },
  {
    question: "Do you provide API documentation?",
    answer: "Absolutely. Auto-generated OpenAPI/Swagger docs, interactive playgrounds, SDKs for popular languages, and comprehensive developer guides. Your API consumers will thank you.",
  },
];

const caseStudy = {
  title: "HealthSync: Healthcare Integration",
  description: "A HIPAA-compliant integration platform connecting 12 disparate healthcare systems, reducing data entry time by 85% and eliminating duplicate records.",
  stats: [
    { label: "Systems Connected", value: "12" },
    { label: "Time Saved", value: "85%" },
    { label: "Uptime", value: "99.9%" },
  ],
};

export default function APIIntegrationsPage() {
  return (
    <ServicePageLayout hero={hero}>
      <ProblemStatement
        title="Disconnected systems drain productivity"
        description="When your tools don't talk to each other, your team pays the price. We fix that."
        painPoints={painPoints}
      />

      <ApproachSection
        title="Integration done right"
        description="Robust, scalable, and maintainable connections between your systems."
        approaches={approaches}
      />

      <TechStackSection
        title="Integration technologies"
        description="Modern tools for reliable, high-performance APIs and integrations."
        technologies={technologies}
      />

      <ProcessSteps
        title="How we build integrations"
        description="A systematic approach to connecting your ecosystem."
        steps={processSteps}
      />

      <CaseStudyTeaser
        title={caseStudy.title}
        description={caseStudy.description}
        stats={caseStudy.stats}
      />

      <FAQSection faqs={faqs} />

      <CTASection
        title="Ready to connect your systems?"
        description="Let's discuss your integration challenges. We'll architect a solution that brings your data together."
        buttonText="Get Integration Help"
        buttonHref="/contact"
      />
    </ServicePageLayout>
  );
}
