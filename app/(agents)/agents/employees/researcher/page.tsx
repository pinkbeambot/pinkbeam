import type { Metadata } from "next";
import ResearcherClient from "./ResearcherClient";
import {
  SoftwareApplicationSchema,
  BreadcrumbSchema,
  WebPageSchema,
} from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Sarah — AI Market Intelligence Analyst — Pink Beam",
  description:
    "Hire Sarah, your AI Market Intelligence Analyst. Monitors competitors, tracks funding rounds, and delivers weekly intelligence briefs for $397/month.",
  alternates: {
    canonical: "https://pinkbeam.io/agents/employees/researcher",
  },
  openGraph: {
    title: "Sarah — AI Market Intelligence Analyst — Pink Beam",
    description:
      "Hire Sarah, your AI Market Intelligence Analyst. Monitors competitors, tracks funding rounds, and delivers weekly intelligence briefs.",
    url: "https://pinkbeam.io/agents/employees/researcher",
    images: [
      {
        url: "/api/og?type=employee&employee=Sarah&subtitle=AI+Market+Intelligence+Analyst",
        width: 1200,
        height: 630,
        alt: "Sarah - AI Market Intelligence Analyst",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarah — AI Market Intelligence Analyst — Pink Beam",
    description:
      "Hire Sarah, your AI Market Intelligence Analyst. Monitors competitors and delivers weekly intelligence briefs.",
    images: ["/api/og?type=employee&employee=Sarah&subtitle=AI+Market+Intelligence+Analyst"],
  },
};

export default function ResearcherPage() {
  return (
    <>
      <SoftwareApplicationSchema
        name="Sarah — AI Market Intelligence Analyst"
        description="AI-powered market intelligence analyst that monitors competitors, tracks funding rounds, and delivers weekly intelligence briefs."
        applicationCategory="BusinessApplication"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pinkbeam.io/" },
          { name: "AI Employees", item: "https://pinkbeam.io/agents/employees/researcher" },
          { name: "Sarah — Researcher", item: "https://pinkbeam.io/agents/employees/researcher" },
        ]}
      />
      <WebPageSchema
        title="Sarah — AI Market Intelligence Analyst — Pink Beam"
        description="Hire Sarah, your AI Market Intelligence Analyst. Monitors competitors and delivers weekly intelligence briefs."
        url="https://pinkbeam.io/agents/employees/researcher"
      />
      <ResearcherClient />
    </>
  );
}
