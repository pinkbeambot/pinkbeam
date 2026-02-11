import type { Metadata } from "next";
import SDRClient from "./SDRClient";
import {
  SoftwareApplicationSchema,
  BreadcrumbSchema,
  WebPageSchema,
} from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Mike — AI Sales Development Rep | Pink Beam",
  description:
    "Hire Mike, your AI Sales Development Representative. Researches prospects, writes personalized emails, and books qualified meetings for $497/month.",
  alternates: {
    canonical: "https://pinkbeam.io/agents/employees/sdr",
  },
  openGraph: {
    title: "Mike — AI Sales Development Rep | Pink Beam",
    description:
      "Hire Mike, your AI Sales Development Representative. Researches prospects, writes personalized emails, and books qualified meetings.",
    url: "https://pinkbeam.io/agents/employees/sdr",
    images: [
      {
        url: "/api/og?type=employee&employee=Mike&subtitle=AI+Sales+Development+Representative",
        width: 1200,
        height: 630,
        alt: "Mike - AI Sales Development Representative",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mike — AI Sales Development Rep | Pink Beam",
    description:
      "Hire Mike, your AI Sales Development Representative. Researches prospects and books qualified meetings.",
    images: ["/api/og?type=employee&employee=Mike&subtitle=AI+Sales+Development+Representative"],
  },
};

export default function SDRPage() {
  return (
    <>
      <SoftwareApplicationSchema
        name="Mike — AI Sales Development Representative"
        description="AI-powered SDR that researches prospects, writes personalized outreach, and books qualified meetings on your calendar."
        applicationCategory="BusinessApplication"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pinkbeam.io/" },
          { name: "AI Employees", item: "https://pinkbeam.io/agents/employees/sdr" },
          { name: "Mike — SDR", item: "https://pinkbeam.io/agents/employees/sdr" },
        ]}
      />
      <WebPageSchema
        title="Mike — AI Sales Development Rep | Pink Beam"
        description="Hire Mike, your AI Sales Development Representative. Researches prospects and books qualified meetings."
        url="https://pinkbeam.io/agents/employees/sdr"
      />
      <SDRClient />
    </>
  );
}
