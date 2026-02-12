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
import { Smartphone } from "lucide-react";

const hero = {
  badge: {
    icon: Smartphone,
    text: "Mobile Application Development",
  },
  title: (
    <>
      Mobile apps that users{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-cyan-400">
        love and keep
      </span>
    </>
  ),
  description: "Native and cross-platform mobile apps built for performance and engagement. From iOS to Android—we create experiences that drive user retention.",
  primaryCta: {
    text: "Build Your App",
    href: "/contact",
  },
  secondaryCta: {
    text: "View Pricing",
    href: "/labs/pricing",
  },
};

const painPoints = [
  "Poor app performance is driving users away and hurting your ratings",
  "Inconsistent experiences across iOS and Android frustrate your users",
  "High development costs for maintaining separate native codebases",
  "Slow release cycles prevent you from iterating based on user feedback",
];

const approaches = [
  {
    title: "Cross-Platform First",
    description: "Build once, deploy everywhere. React Native delivers native performance with shared codebase efficiency.",
  },
  {
    title: "Native When Needed",
    description: "For performance-critical features, we go native. Swift and Kotlin for the parts that matter most.",
  },
  {
    title: "Continuous Deployment",
    description: "Over-the-air updates and automated pipelines mean faster iterations and happier users.",
  },
];

const technologies = [
  { name: "React Native", description: "Cross-platform framework" },
  { name: "Swift", description: "iOS native development" },
  { name: "Kotlin", description: "Android native development" },
  { name: "Flutter", description: "UI toolkit" },
  { name: "Firebase", description: "Backend services" },
  { name: "Expo", description: "React Native platform" },
  { name: "Redux", description: "State management" },
  { name: "Fastlane", description: "Deployment automation" },
  { name: "App Center", description: "CI/CD for mobile" },
  { name: "OneSignal", description: "Push notifications" },
  { name: "RevenueCat", description: "In-app purchases" },
  { name: "Sentry", description: "Error monitoring" },
];

const processSteps = [
  {
    number: "01",
    title: "Strategy & UX",
    description: "We map user journeys and define core features. Platform-specific guidelines ensure your app feels native on every device.",
  },
  {
    number: "02",
    title: "UI Design",
    description: "Pixel-perfect designs that respect platform conventions while maintaining your brand identity across iOS and Android.",
  },
  {
    number: "03",
    title: "Development",
    description: "Clean, testable code with real device testing throughout. We optimize for battery life, memory usage, and smooth animations.",
  },
  {
    number: "04",
    title: "Launch & Iterate",
    description: "App store optimization, submission assistance, and post-launch analytics to guide your product roadmap.",
  },
];

const faqs = [
  {
    question: "Should I build native or use React Native?",
    answer: "For most apps, React Native offers the best balance of performance and development speed. We recommend native development (Swift/Kotlin) for graphics-intensive apps like games, or apps requiring deep hardware integration. We'll help you choose based on your specific requirements.",
  },
  {
    question: "How long does mobile app development take?",
    answer: "A focused MVP typically takes 10-14 weeks. Complex apps with advanced features like real-time sync, custom animations, or hardware integration may take 4-6 months. We break projects into phases so you can launch core features first.",
  },
  {
    question: "Do you handle app store submissions?",
    answer: "Absolutely. We guide you through the entire submission process including app store listings, screenshots, descriptions, and compliance requirements. We've navigated rejections and know how to get apps approved.",
  },
  {
    question: "Can you work with our existing backend?",
    answer: "Yes, we integrate with REST APIs, GraphQL, Firebase, and custom backends. We'll review your API documentation and ensure smooth data flow between your mobile app and existing systems.",
  },
  {
    question: "How do you ensure app security?",
    answer: "We implement certificate pinning, encrypted local storage, secure authentication flows, and code obfuscation. For apps handling sensitive data, we add additional layers like biometric authentication and runtime application security protection (RASP).",
  },
  {
    question: "What about maintenance and updates?",
    answer: "We offer ongoing maintenance packages covering OS updates, dependency upgrades, bug fixes, and new feature development. iOS and Android release major updates annually, and we ensure your app stays compatible and leverages new platform features.",
  },
  {
    question: "Do you provide source code and documentation?",
    answer: "Yes, you receive complete source code, technical documentation, and deployment guides upon project completion. We believe in transparency—you own everything we build.",
  },
];

const caseStudy = {
  title: "FitTrack Pro: Fitness Platform",
  description: "A comprehensive fitness tracking app with social features that achieved 100K+ downloads in the first month and 4.8-star rating.",
  stats: [
    { label: "Downloads", value: "100K+" },
    { label: "User Rating", value: "4.8★" },
    { label: "Retention", value: "65%" },
  ],
};

export default function MobileApplicationsPage() {
  return (
    <ServicePageLayout hero={hero}>
      <ProblemStatement
        title="The mobile challenge"
        description="Users expect native performance and seamless experiences. Falling short means losing them to competitors."
        painPoints={painPoints}
      />

      <ApproachSection
        title="How we build mobile apps"
        description="Smart architecture decisions that balance speed, cost, and quality."
        approaches={approaches}
      />

      <TechStackSection
        title="Mobile technologies"
        description="The right tools for every platform and use case."
        technologies={technologies}
      />

      <ProcessSteps
        title="App development process"
        description="From concept to App Store—our proven path to launch."
        steps={processSteps}
      />

      <CaseStudyTeaser
        title={caseStudy.title}
        description={caseStudy.description}
        stats={caseStudy.stats}
      />

      <FAQSection faqs={faqs} />

      <CTASection
        title="Ready to go mobile?"
        description="Let's bring your app idea to life. We'll help you choose the right approach and build something users love."
        buttonText="Discuss Your App"
        buttonHref="/contact"
      />
    </ServicePageLayout>
  );
}
