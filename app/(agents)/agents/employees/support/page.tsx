import type { Metadata } from "next";
import SupportClient from "./SupportClient";
import {
  SoftwareApplicationSchema,
  BreadcrumbSchema,
  WebPageSchema,
} from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Alex — AI Customer Support Specialist | Pink Beam",
  description:
    "Hire Alex, your AI Customer Support Specialist. Provides 24/7 instant support, resolves 70%+ tickets autonomously, and seamlessly escalates complex issues.",
  alternates: {
    canonical: "https://pinkbeam.io/agents/employees/support",
  },
  openGraph: {
    title: "Alex — AI Customer Support Specialist | Pink Beam",
    description:
      "Hire Alex, your AI Customer Support Specialist. Provides 24/7 instant support and resolves 70%+ tickets autonomously.",
    url: "https://pinkbeam.io/agents/employees/support",
    images: [
      {
        url: "/api/og?type=employee&employee=Alex&subtitle=AI+Customer+Support+Specialist",
        width: 1200,
        height: 630,
        alt: "Alex - AI Customer Support Specialist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex — AI Customer Support Specialist | Pink Beam",
    description:
      "Hire Alex, your AI Customer Support Specialist. Provides 24/7 instant support and resolves 70%+ tickets autonomously.",
    images: ["/api/og?type=employee&employee=Alex&subtitle=AI+Customer+Support+Specialist"],
  },
};

export default function SupportPage() {
  return (
    <>
      <SoftwareApplicationSchema
        name="Alex — AI Customer Support Specialist"
        description="AI-powered customer support specialist providing 24/7 instant responses and autonomous ticket resolution."
        applicationCategory="BusinessApplication"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pinkbeam.io/" },
          { name: "AI Employees", item: "https://pinkbeam.io/agents/employees/support" },
          { name: "Alex — Support", item: "https://pinkbeam.io/agents/employees/support" },
        ]}
      />
      <WebPageSchema
        title="Alex — AI Customer Support Specialist | Pink Beam"
        description="Hire Alex, your AI Customer Support Specialist. Provides 24/7 instant support."
        url="https://pinkbeam.io/agents/employees/support"
      />
      <SupportClient />
    </>
  );
}
