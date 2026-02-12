import type { Metadata } from "next";
import VideoClient from "./VideoClient";
import {
  SoftwareApplicationSchema,
  BreadcrumbSchema,
  WebPageSchema,
} from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "FLUX — AI Motion Designer — Pink Beam",
  description:
    "Hire FLUX, your AI Motion Designer. Creates product explainers, social video cuts, motion graphics, and multi-format exports for $447/month.",
  alternates: {
    canonical: "https://pinkbeam.io/agents/employees/video",
  },
  openGraph: {
    title: "FLUX — AI Motion Designer — Pink Beam",
    description:
      "Hire FLUX, your AI Motion Designer. Creates product explainers, social video cuts, and motion graphics.",
    url: "https://pinkbeam.io/agents/employees/video",
    images: [
      {
        url: "/api/og?type=employee&employee=FLUX&subtitle=AI+Motion+Designer",
        width: 1200,
        height: 630,
        alt: "FLUX - AI Motion Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FLUX — AI Motion Designer — Pink Beam",
    description:
      "Hire FLUX, your AI Motion Designer. Creates product explainers and motion graphics.",
    images: ["/api/og?type=employee&employee=FLUX&subtitle=AI+Motion+Designer"],
  },
};

export default function VideoPage() {
  return (
    <>
      <SoftwareApplicationSchema
        name="FLUX — AI Motion Designer"
        description="AI-powered motion designer creating product explainers, social clips, and motion graphics."
        applicationCategory="DesignApplication"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pinkbeam.io/" },
          { name: "AI Employees", item: "https://pinkbeam.io/agents/employees/video" },
          { name: "FLUX — Video", item: "https://pinkbeam.io/agents/employees/video" },
        ]}
      />
      <WebPageSchema
        title="FLUX — AI Motion Designer — Pink Beam"
        description="Hire FLUX, your AI Motion Designer. Creates product explainers and motion graphics."
        url="https://pinkbeam.io/agents/employees/video"
      />
      <VideoClient />
    </>
  );
}
