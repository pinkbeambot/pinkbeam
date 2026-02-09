import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import {
  OrganizationSchema,
  BreadcrumbSchema,
  WebPageSchema,
} from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Contact — Pink Beam | Get in Touch",
  description:
    "Contact Pink Beam for sales inquiries, support requests, or general questions. We're here to help you build your AI workforce.",
  alternates: {
    canonical: "https://pinkbeam.io/contact",
  },
  openGraph: {
    title: "Contact — Pink Beam | Get in Touch",
    description:
      "Contact Pink Beam for sales inquiries, support requests, or general questions. We're here to help.",
    url: "https://pinkbeam.io/contact",
    images: [
      {
        url: "/api/og?title=Contact+Pink+Beam&subtitle=Get+in+Touch&type=default",
        width: 1200,
        height: 630,
        alt: "Contact Pink Beam - Get in Touch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Pink Beam | Get in Touch",
    description:
      "Contact Pink Beam for sales inquiries, support requests, or general questions.",
    images: ["/api/og?title=Contact+Pink+Beam&subtitle=Get+in+Touch&type=default"],
  },
};

export default function ContactPage() {
  return (
    <>
      <OrganizationSchema />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pinkbeam.io/" },
          { name: "Contact", item: "https://pinkbeam.io/contact" },
        ]}
      />
      <WebPageSchema
        title="Contact — Pink Beam | Get in Touch"
        description="Contact Pink Beam for sales inquiries, support requests, or general questions."
        url="https://pinkbeam.io/contact"
      />
      <ContactClient />
    </>
  );
}
