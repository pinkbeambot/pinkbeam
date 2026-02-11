import type { Metadata } from "next";
import { createMetadata, structuredData } from "@/lib/metadata";
import MobileApplicationsPage from "./page";

export const metadata: Metadata = createMetadata({
  title: "Mobile Application Development",
  description: "Native iOS and Android apps, plus cross-platform solutions with React Native. Build mobile experiences that users love.",
  path: "/labs/services/mobile-applications",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "Mobile Application Development",
  description: "Native and cross-platform mobile application development services",
  path: "/labs/services/mobile-applications",
});

const webPageJsonLd = structuredData.webPage({
  title: "Mobile Application Development Services",
  description: "Native iOS and Android apps, plus cross-platform solutions with React Native. Build mobile experiences that users love.",
  path: "/labs/services/mobile-applications",
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
      <MobileApplicationsPage />
    </>
  );
}
