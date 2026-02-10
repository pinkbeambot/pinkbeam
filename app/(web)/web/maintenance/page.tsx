import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { MaintenancePageClient } from "./MaintenancePageClient";

export const metadata: Metadata = createMetadata({
  title: "Website Maintenance & Support",
  description: "Professional website maintenance, security, and support. Keep your site secure, fast, and up-to-date.",
  path: "/web/maintenance",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Website Maintenance & Support",
  description: "Professional website maintenance, security, and support services",
  path: "/web/maintenance",
});

const webPageJsonLd = structuredData.webPage({
  title: "Website Maintenance & Support",
  description: "Professional website maintenance, security, and support. Keep your site secure, fast, and up-to-date.",
  path: "/web/maintenance",
});

export default function MaintenancePage() {
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
      <MaintenancePageClient />
    </>
  );
}
