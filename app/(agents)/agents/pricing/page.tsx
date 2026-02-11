import type { Metadata } from "next";
import PricingClient from "./PricingClient";
import {
  BreadcrumbSchema,
  WebPageSchema,
} from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Pricing — Pink Beam AI Employees",
  description:
    "Simple, transparent pricing for AI employees. Hire AI employees for $397/month. No hidden fees, no surprises. Starter, Growth, and Scale plans available.",
  alternates: {
    canonical: "https://pinkbeam.io/agents/pricing",
  },
  openGraph: {
    title: "Pricing — Pink Beam AI Employees",
    description:
      "Simple, transparent pricing for AI employees. Hire AI employees for $397/month. No hidden fees, no surprises.",
    url: "https://pinkbeam.io/agents/pricing",
    images: [
      {
        url: "/api/og?type=pricing",
        width: 1200,
        height: 630,
        alt: "Pink Beam Pricing - $397/month per AI employee",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Pink Beam AI Employees",
    description:
      "Simple, transparent pricing for AI employees. Hire AI employees for $397/month.",
    images: ["/api/og?type=pricing"],
  },
};

export default function PricingPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pinkbeam.io/" },
          { name: "Pricing", item: "https://pinkbeam.io/agents/pricing" },
        ]}
      />
      <WebPageSchema
        title="Pricing — Pink Beam AI Employees"
        description="Simple, transparent pricing for AI employees. Hire AI employees for $397/month."
        url="https://pinkbeam.io/agents/pricing"
      />
      <PricingClient />
    </>
  );
}
