import type { Metadata } from "next";
import CalculatorClient from "./CalculatorClient";
import {
  BreadcrumbSchema,
  WebPageSchema,
} from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "ROI Calculator — Pink Beam | Calculate Your Savings",
  description:
    "Use our ROI calculator to see how much you can save by hiring AI employees. Compare human vs AI employee costs and discover your potential savings.",
  alternates: {
    canonical: "https://pinkbeam.io/agents/calculator",
  },
  openGraph: {
    title: "ROI Calculator — Pink Beam | Calculate Your Savings",
    description:
      "Use our ROI calculator to see how much you can save by hiring AI employees. Compare costs and discover your savings.",
    url: "https://pinkbeam.io/agents/calculator",
    images: [
      {
        url: "/api/og?title=ROI+Calculator&subtitle=Calculate+Your+AI+Savings&type=default",
        width: 1200,
        height: 630,
        alt: "Pink Beam ROI Calculator - Calculate Your AI Savings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ROI Calculator — Pink Beam | Calculate Your Savings",
    description:
      "Use our ROI calculator to see how much you can save by hiring AI employees.",
    images: ["/api/og?title=ROI+Calculator&subtitle=Calculate+Your+AI+Savings&type=default"],
  },
};

export default function CalculatorPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pinkbeam.io/" },
          { name: "ROI Calculator", item: "https://pinkbeam.io/agents/calculator" },
        ]}
      />
      <WebPageSchema
        title="ROI Calculator — Pink Beam | Calculate Your Savings"
        description="Use our ROI calculator to see how much you can save by hiring AI employees."
        url="https://pinkbeam.io/agents/calculator"
      />
      <CalculatorClient />
    </>
  );
}
