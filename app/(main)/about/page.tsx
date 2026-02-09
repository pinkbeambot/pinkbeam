import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import {
  OrganizationSchema,
  BreadcrumbSchema,
  WebPageSchema,
} from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "About — Pink Beam | AI Employees for Your Business",
  description:
    "Learn about Pink Beam's mission to democratize AI employees. Meet our AI team and discover how we're building the future of work.",
  alternates: {
    canonical: "https://pinkbeam.io/about",
  },
  openGraph: {
    title: "About — Pink Beam | AI Employees for Your Business",
    description:
      "Learn about Pink Beam's mission to democratize AI employees. Meet our AI team and discover the future of work.",
    url: "https://pinkbeam.io/about",
    images: [
      {
        url: "/api/og?title=About+Pink+Beam&subtitle=Building+the+Future+of+Work&type=default",
        width: 1200,
        height: 630,
        alt: "About Pink Beam - Building the Future of Work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Pink Beam | AI Employees for Your Business",
    description:
      "Learn about Pink Beam's mission to democratize AI employees.",
    images: ["/api/og?title=About+Pink+Beam&subtitle=Building+the+Future+of+Work&type=default"],
  },
};

export default function AboutPage() {
  return (
    <>
      <OrganizationSchema />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pinkbeam.io/" },
          { name: "About", item: "https://pinkbeam.io/about" },
        ]}
      />
      <WebPageSchema
        title="About — Pink Beam | AI Employees for Your Business"
        description="Learn about Pink Beam's mission to democratize AI employees. Meet our AI team."
        url="https://pinkbeam.io/about"
      />
      <AboutClient />
    </>
  );
}
