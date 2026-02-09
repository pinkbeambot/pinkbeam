import type { Metadata } from "next";
import {
  Hero,
  ProblemSection,
  SolutionSection,
  HowItWorks,
  EmployeeTabs,
  UseCases,
  TrustSignals,
  Testimonials,
  FAQ,
  FinalCTA,
} from "@/components/agents/sections";
import {
  OrganizationSchema,
  BreadcrumbSchema,
  WebPageSchema,
} from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Pink Beam — Hire AI Employees for $500/Month",
  description:
    "Build your AI workforce with Pink Beam. Hire AI employees for research, sales, support, content, and design starting at $500/month. Replace $12K+ human salaries.",
  alternates: {
    canonical: "https://pinkbeam.io/agents",
  },
  openGraph: {
    title: "Pink Beam — Hire AI Employees for $500/Month",
    description:
      "Build your AI workforce with Pink Beam. Hire AI employees for research, sales, support, and design starting at $500/month.",
    url: "https://pinkbeam.io/agents",
    images: [
      {
        url: "/api/og?title=Pink+Beam&subtitle=AI+Employees+for+Your+Business&type=default",
        width: 1200,
        height: 630,
        alt: "Pink Beam - AI Employees for Your Business",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pink Beam — Hire AI Employees for $500/Month",
    description:
      "Build your AI workforce with Pink Beam. Hire AI employees for research, sales, support, and design starting at $500/month.",
    images: ["/api/og?title=Pink+Beam&subtitle=AI+Employees+for+Your+Business&type=default"],
  },
};

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pinkbeam.io/" },
          { name: "AI Employees", item: "https://pinkbeam.io/agents" },
        ]}
      />
      <WebPageSchema
        title="Pink Beam — Hire AI Employees for $500/Month"
        description="Build your AI workforce with Pink Beam. Hire AI employees for research, sales, support, content, and design starting at $500/month."
        url="https://pinkbeam.io/agents"
      />
      <main className="min-h-screen">
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <EmployeeTabs />
        <UseCases />
        <TrustSignals />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
    </>
  );
}
