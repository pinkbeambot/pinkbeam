import type { Metadata } from "next";
import DesignerClient from "./DesignerClient";
import {
  SoftwareApplicationSchema,
  BreadcrumbSchema,
  WebPageSchema,
} from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "LUMEN — AI Visual Designer | Pink Beam",
  description:
    "Hire LUMEN, your AI Visual Designer. Creates marketing assets, brand collateral, social graphics, and presentations for $347/month.",
  alternates: {
    canonical: "https://pinkbeam.io/agents/employees/designer",
  },
  openGraph: {
    title: "LUMEN — AI Visual Designer | Pink Beam",
    description:
      "Hire LUMEN, your AI Visual Designer. Creates marketing assets, brand collateral, and social graphics.",
    url: "https://pinkbeam.io/agents/employees/designer",
    images: [
      {
        url: "/api/og?type=employee&employee=LUMEN&subtitle=AI+Visual+Designer",
        width: 1200,
        height: 630,
        alt: "LUMEN - AI Visual Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LUMEN — AI Visual Designer | Pink Beam",
    description:
      "Hire LUMEN, your AI Visual Designer. Creates marketing assets and social graphics.",
    images: ["/api/og?type=employee&employee=LUMEN&subtitle=AI+Visual+Designer"],
  },
};

export default function DesignerPage() {
  return (
    <>
      <SoftwareApplicationSchema
        name="LUMEN — AI Visual Designer"
        description="AI-powered visual designer creating marketing assets, brand collateral, and social graphics."
        applicationCategory="DesignApplication"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pinkbeam.io/" },
          { name: "AI Employees", item: "https://pinkbeam.io/agents/employees/designer" },
          { name: "LUMEN — Designer", item: "https://pinkbeam.io/agents/employees/designer" },
        ]}
      />
      <WebPageSchema
        title="LUMEN — AI Visual Designer | Pink Beam"
        description="Hire LUMEN, your AI Visual Designer. Creates marketing assets and social graphics."
        url="https://pinkbeam.io/agents/employees/designer"
      />
      <DesignerClient />
    </>
  );
}
