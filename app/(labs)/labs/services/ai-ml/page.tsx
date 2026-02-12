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
import { Brain } from "lucide-react";

const hero = {
  badge: {
    icon: Brain,
    text: "AI/ML Integration",
  },
  title: (
    <>
      Harness AI to{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-cyan-400">
        transform your business
      </span>
    </>
  ),
  description: "From LLM-powered features to intelligent automation—we integrate cutting-edge AI into your products and workflows for real competitive advantage.",
  primaryCta: {
    text: "Explore AI Solutions",
    href: "/contact",
  },
  secondaryCta: {
    text: "View Pricing",
    href: "/labs/pricing",
  },
};

const painPoints = [
  "Repetitive manual tasks are consuming your team's time and energy",
  "You're sitting on valuable data but can't extract actionable insights",
  "Customer support costs are climbing while satisfaction scores drop",
  "Competitors are leveraging AI and you're falling behind the curve",
];

const approaches = [
  {
    title: "Pragmatic AI",
    description: "We focus on practical applications that deliver ROI. No hype, just results—from intelligent search to automated content generation.",
  },
  {
    title: "Human-in-the-Loop",
    description: "AI augments human capabilities, not replaces them. Thoughtful interfaces that combine machine efficiency with human judgment.",
  },
  {
    title: "Responsible Implementation",
    description: "We consider bias, privacy, and transparency. Ethical AI that's trustworthy and compliant with evolving regulations.",
  },
];

const technologies = [
  { name: "OpenAI", description: "GPT-4, embeddings" },
  { name: "Anthropic", description: "Claude models" },
  { name: "LangChain", description: "LLM orchestration" },
  { name: "Pinecone", description: "Vector database" },
  { name: "Weaviate", description: "Semantic search" },
  { name: "Hugging Face", description: "Model hub" },
  { name: "TensorFlow", description: "ML framework" },
  { name: "PyTorch", description: "Deep learning" },
  { name: "Scikit-learn", description: "Classical ML" },
  { name: " spaCy", description: "NLP processing" },
  { name: "FastAPI", description: "ML serving" },
  { name: "Ray", description: "Distributed compute" },
];

const processSteps = [
  {
    number: "01",
    title: "Use Case Discovery",
    description: "We identify high-impact AI opportunities in your business. Feasibility analysis and ROI modeling ensure we pursue the right problems.",
  },
  {
    number: "02",
    title: "Data Strategy",
    description: "Data audit, cleaning pipelines, and annotation strategies. Quality data is the foundation of effective AI.",
  },
  {
    number: "03",
    title: "Model Development",
    description: "Prototyping, training, and evaluation. We compare foundation models vs. custom training to find the optimal approach.",
  },
  {
    number: "04",
    title: "Integration & Deploy",
    description: "Production deployment with monitoring, fallback mechanisms, and continuous improvement pipelines.",
  },
];

const faqs = [
  {
    question: "What AI capabilities do you integrate?",
    answer: "We implement LLM-powered features (chatbots, content generation, summarization), intelligent search and recommendations, document processing and OCR, predictive analytics, computer vision, and workflow automation. We match the right AI technique to your specific use case.",
  },
  {
    question: "Do we need our own data to use AI?",
    answer: "Not always. Foundation models like GPT-4 work out of the box for many use cases. For domain-specific applications, we can often start with pre-trained models and fine-tune with limited data. We also help clients collect and structure data for future AI initiatives.",
  },
  {
    question: "How do you handle AI accuracy and hallucinations?",
    answer: "We implement RAG (Retrieval-Augmented Generation) to ground LLM outputs in your data, add validation layers, use structured outputs, and implement confidence scoring. For critical applications, we maintain human review workflows.",
  },
  {
    question: "Is our data safe with AI integrations?",
    answer: "We prioritize data security through encrypted connections, private deployments, and careful API provider selection. For sensitive data, we can deploy models in your infrastructure or use privacy-preserving techniques. Your data never trains public models without explicit consent.",
  },
  {
    question: "How long does AI integration take?",
    answer: "Simple LLM features can be live in 2-3 weeks. Complex custom models may take 2-4 months. We typically start with a proof-of-concept to validate the approach before full implementation.",
  },
  {
    question: "What does AI integration cost?",
    answer: "Costs vary widely. A basic chatbot integration starts around $15K. Custom ML models and enterprise-scale deployments range from $50K-$200K+. We provide detailed estimates after understanding your requirements.",
  },
  {
    question: "How do you measure AI success?",
    answer: "We define KPIs upfront—whether that's time saved, accuracy improvements, user engagement, or revenue impact. Our implementations include analytics dashboards to track real business outcomes.",
  },
];

const caseStudy = {
  title: "DocuMind: AI Document Processing",
  description: "An intelligent document processing system that extracts data from unstructured documents with 98% accuracy, saving a legal firm 200+ hours monthly.",
  stats: [
    { label: "Accuracy", value: "98%" },
    { label: "Time Saved", value: "200h/mo" },
    { label: "ROI", value: "450%" },
  ],
};

export default function AIMLPage() {
  return (
    <ServicePageLayout hero={hero}>
      <ProblemStatement
        title="AI isn't the future—it's now"
        description="Businesses leveraging AI are outpacing competitors. Don't get left behind."
        painPoints={painPoints}
      />

      <ApproachSection
        title="AI that actually works"
        description="Practical, responsible AI integration that delivers measurable results."
        approaches={approaches}
      />

      <TechStackSection
        title="AI & ML stack"
        description="Cutting-edge tools for intelligent applications."
        technologies={technologies}
      />

      <ProcessSteps
        title="Bringing AI to your business"
        description="From concept to production—how we implement AI solutions."
        steps={processSteps}
      />

      <CaseStudyTeaser
        title={caseStudy.title}
        description={caseStudy.description}
        stats={caseStudy.stats}
      />

      <FAQSection faqs={faqs} />

      <CTASection
        title="Ready to leverage AI?"
        description="Let's explore how AI can transform your business. We'll identify opportunities and build solutions that deliver real value."
        buttonText="Discuss AI Opportunities"
        buttonHref="/contact"
      />
    </ServicePageLayout>
  );
}
