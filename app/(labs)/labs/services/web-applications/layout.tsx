import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import WebApplicationsPage from "./page";

export const metadata: Metadata = createMetadata({
  title: "Web Application Development",
  description: "Custom web applications built with React, Next.js, and modern technologies. Scalable, secure, and tailored to your business needs.",
  path: "/labs/services/web-applications",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Web Application Development",
  description: "Custom web application development services using modern technologies",
  path: "/labs/services/web-applications",
});

const webPageJsonLd = structuredData.webPage({
  title: "Web Application Development Services",
  description: "Custom web applications built with React, Next.js, and modern technologies. Scalable, secure, and tailored to your business needs.",
  path: "/labs/services/web-applications",
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <WebApplicationsPage />
    </>
  );
}
