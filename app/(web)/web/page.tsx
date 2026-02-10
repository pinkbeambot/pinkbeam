import type { Metadata } from "next";
import { WebPageClient } from "./WebPageClient";

export const metadata: Metadata = {
  title: "Pink Beam Web — Website & SEO Services",
  description:
    "High-performance websites, SEO optimization, and ongoing maintenance. Starting at $2,000.",
  alternates: {
    canonical: "https://pinkbeam.io/web",
  },
};

export default function WebPage() {
  return <WebPageClient />;
}
