import type { Metadata } from "next";
import {
  OrganizationSchema,
  WebPageSchema,
} from "@/components/seo/StructuredData";
import { Hero } from "./components/Hero";
import { ServicesSection } from "./components/ServicesSection";
import { CTASection } from "./components/CTASection";

export const metadata: Metadata = {
  title: "Pink Beam — AI-Powered Business Solutions",
  description:
    "Pink Beam offers AI employees, website services, custom software development, and strategic consulting. Build your AI workforce or hire experts.",
  alternates: {
    canonical: "https://pinkbeam.io/",
  },
};

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <WebPageSchema
        title="Pink Beam — AI-Powered Business Solutions"
        description="Pink Beam offers AI employees, website services, custom software development, and strategic consulting."
        url="https://pinkbeam.io/"
      />
      <main className="min-h-screen">
        <Hero />
        <ServicesSection />
        <CTASection />
      </main>
    </>
  );
}
