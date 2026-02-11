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
import { Globe } from "lucide-react";

const hero = {
  badge: {
    icon: Globe,
    text: "Web Application Development",
  },
  title: (
    <>
      Build web apps that{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-cyan-400">
        scale and perform
      </span>
    </>
  ),
  description: "Custom web applications built with modern technologies. From complex dashboards to customer portals—we engineer solutions that drive business results.",
  primaryCta: {
    text: "Start Your Project",
    href: "/contact",
  },
  secondaryCta: {
    text: "View Case Studies",
    href: "/labs/case-studies",
  },
};

const painPoints = [
  "Off-the-shelf software doesn't fit your unique workflows and creates inefficiencies",
  "Legacy systems are slow, unreliable, and holding back your team's productivity",
  "Technical debt is mounting, making every new feature harder to implement",
  "Your current solution can't scale with your growing user base or data volume",
];

const approaches = [
  {
    title: "User-Centered Design",
    description: "We start with your users. Deep research and prototyping ensure we build what people actually need.",
  },
  {
    title: "Scalable Architecture",
    description: "Cloud-native, microservices-ready architecture that grows with your business without breaking.",
  },
  {
    title: "Iterative Delivery",
    description: "Weekly demos and continuous feedback keep us aligned and your project on track.",
  },
];

const technologies = [
  { name: "React", description: "Component-based UI" },
  { name: "Next.js", description: "Full-stack framework" },
  { name: "TypeScript", description: "Type-safe code" },
  { name: "Node.js", description: "Server runtime" },
  { name: "PostgreSQL", description: "Relational database" },
  { name: "MongoDB", description: "NoSQL database" },
  { name: "Redis", description: "Caching layer" },
  { name: "Docker", description: "Containerization" },
  { name: "AWS", description: "Cloud infrastructure" },
  { name: "Vercel", description: "Edge deployment" },
  { name: "GraphQL", description: "API query language" },
  { name: "tRPC", description: "Type-safe APIs" },
];

const processSteps = [
  {
    number: "01",
    title: "Discovery",
    description: "We dive deep into your business, users, and technical requirements. Stakeholder interviews, competitive analysis, and feasibility studies set the foundation.",
  },
  {
    number: "02",
    title: "Design",
    description: "Wireframes evolve into high-fidelity prototypes. We validate UX through testing and refine until the flow feels intuitive.",
  },
  {
    number: "03",
    title: "Develop",
    description: "Agile sprints with bi-weekly releases. Clean code, comprehensive tests, and continuous integration ensure quality at every step.",
  },
  {
    number: "04",
    title: "Deploy",
    description: "Production-ready deployment with monitoring, logging, and automated scaling. We handle the DevOps so you can focus on your business.",
  },
];

const faqs = [
  {
    question: "How long does it take to build a web application?",
    answer: "Timeline depends on complexity. A focused MVP typically takes 8-12 weeks. Enterprise applications with complex integrations may take 4-6 months. We'll provide a detailed estimate after our discovery phase.",
  },
  {
    question: "What technologies do you specialize in?",
    answer: "We're full-stack experts with deep experience in React, Next.js, Node.js, and TypeScript. For databases, we work with PostgreSQL, MongoDB, and cloud-native solutions. We choose the right stack for your specific needs.",
  },
  {
    question: "Do you handle ongoing maintenance?",
    answer: "Yes, we offer maintenance retainers that include security updates, performance monitoring, bug fixes, and feature enhancements. Most clients start with a 3-month post-launch support period.",
  },
  {
    question: "Can you integrate with our existing systems?",
    answer: "Absolutely. We've integrated with countless third-party APIs, legacy databases, and enterprise systems like Salesforce, HubSpot, and custom internal tools. Integration challenges are our specialty.",
  },
  {
    question: "How do you ensure application security?",
    answer: "Security is baked into our process: encrypted connections, secure authentication, input validation, regular dependency updates, and OWASP compliance. We also offer security audits for sensitive applications.",
  },
  {
    question: "Will we own the source code?",
    answer: "Yes, 100%. Upon project completion, you receive full ownership of all source code, documentation, and assets. No lock-in, no hidden fees—it's your intellectual property.",
  },
];

const caseStudy = {
  title: "LogiTrack: Logistics Dashboard",
  description: "A real-time logistics management platform that reduced operational overhead by 40% for a mid-sized shipping company.",
  stats: [
    { label: "Performance Boost", value: "3x" },
    { label: "User Adoption", value: "94%" },
    { label: "ROI", value: "280%" },
  ],
};

export default function WebApplicationsPage() {
  return (
    <ServicePageLayout hero={hero}>
      <ProblemStatement
        title="Why custom web applications?"
        description="Generic software forces you to adapt your business to its limitations. Custom solutions adapt to you."
        painPoints={painPoints}
      />

      <ApproachSection
        title="How we build"
        description="Our proven methodology delivers results."
        approaches={approaches}
      />

      <TechStackSection
        title="Technologies we use"
        description="Modern, proven technologies that power world-class applications."
        technologies={technologies}
      />

      <ProcessSteps
        title="From idea to launch"
        description="A battle-tested process that ensures success."
        steps={processSteps}
      />

      <CaseStudyTeaser
        title={caseStudy.title}
        description={caseStudy.description}
        stats={caseStudy.stats}
      />

      <FAQSection faqs={faqs} />

      <CTASection
        title="Ready to build your web application?"
        description="Let's discuss your project. We'll help you scope it, plan it, and bring it to life."
        buttonText="Book a Consultation"
        buttonHref="/contact"
      />
    </ServicePageLayout>
  );
}
