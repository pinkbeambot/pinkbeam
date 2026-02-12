import type { Metadata } from "next";
import ContentClient from "./ContentClient";
import {
  SoftwareApplicationSchema,
  BreadcrumbSchema,
  WebPageSchema,
} from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Casey — AI Content Marketing Specialist — Pink Beam",
  description:
    "Hire Casey, your AI Content Marketing Specialist. Transforms one piece of content into 5+ formats, adapts tone for each platform, and schedules optimal posting times.",
  alternates: {
    canonical: "https://pinkbeam.io/agents/employees/content",
  },
  openGraph: {
    title: "Casey — AI Content Marketing Specialist — Pink Beam",
    description:
      "Hire Casey, your AI Content Marketing Specialist. Transforms content into 5+ formats and schedules optimal posting times.",
    url: "https://pinkbeam.io/agents/employees/content",
    images: [
      {
        url: "/api/og?type=employee&employee=Casey&subtitle=AI+Content+Marketing+Specialist",
        width: 1200,
        height: 630,
        alt: "Casey - AI Content Marketing Specialist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casey — AI Content Marketing Specialist — Pink Beam",
    description:
      "Hire Casey, your AI Content Marketing Specialist. Transforms content into 5+ formats and schedules optimal posting times.",
    images: ["/api/og?type=employee&employee=Casey&subtitle=AI+Content+Marketing+Specialist"],
  },
};

export default function ContentPage() {
  return (
    <>
      <SoftwareApplicationSchema
        name="Casey — AI Content Marketing Specialist"
        description="AI-powered content marketing specialist that transforms content into multiple formats and manages social media presence."
        applicationCategory="BusinessApplication"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pinkbeam.io/" },
          { name: "AI Employees", item: "https://pinkbeam.io/agents/employees/content" },
          { name: "Casey — Content", item: "https://pinkbeam.io/agents/employees/content" },
        ]}
      />
      <WebPageSchema
        title="Casey — AI Content Marketing Specialist — Pink Beam"
        description="Hire Casey, your AI Content Marketing Specialist. Transforms content into multiple formats."
        url="https://pinkbeam.io/agents/employees/content"
      />
      <ContentClient />
    </>
  );
}
