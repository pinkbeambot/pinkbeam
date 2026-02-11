import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import { ProcessAutomationClient } from "./ProcessAutomationClient";

export const metadata: Metadata = createMetadata({
  title: "Process Automation Consulting — Pink Beam Solutions",
  description:
    "Automate the repetitive, focus on what matters. Identify and automate workflows to increase efficiency and reduce operational costs.",
  path: "/solutions/services/process-automation",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Process Automation Consulting",
  description:
    "Strategic process automation services to identify repetitive workflows, implement RPA and intelligent automation solutions, and deliver measurable efficiency gains.",
  path: "/solutions/services/process-automation",
});

const webPageJsonLd = structuredData.webPage({
  title: "Process Automation Consulting — Pink Beam Solutions",
  description:
    "Identify and automate repetitive workflows to increase efficiency and reduce operational costs with our proven automation methodology.",
  path: "/solutions/services/process-automation",
  datePublished: "2026-02-10",
  dateModified: "2026-02-10",
});

export default function ProcessAutomationPage() {
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
      <ProcessAutomationClient />
    </>
  );
}
