import type { Metadata } from "next";
import { createMetadata, serviceMetadata, structuredData } from "@/lib/metadata";
import { MVPPageClient } from "./MVPPageClient";

export const metadata: Metadata = createMetadata({
  title: "MVP Development — Launch in Weeks",
  description: "Build and launch your MVP in 4-8 weeks. Lean, validated, and ready for market. React, Next.js, and scalable architecture.",
  path: "/labs/mvp",
});

// JSON-LD structured data
const serviceJsonLd = structuredData.service({
  name: "MVP Development",
  description: "Rapid MVP development for startups and new products",
  path: "/labs/mvp",
});

const webPageJsonLd = structuredData.webPage({
  title: "MVP Development — Launch in Weeks",
  description: "Build and launch your MVP in 4-8 weeks. Lean, validated, and ready for market.",
  path: "/labs/mvp",
});

export default function MVPPage() {
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
      <MVPPageClient />
    </>
  );
}
