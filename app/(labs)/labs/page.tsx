import type { Metadata } from "next";
import { LabsPageClient } from "./LabsPageClient";

export const metadata: Metadata = {
  title: "Pink Beam Labs — Custom Software Development",
  description:
    "Custom software development for startups and enterprises. Web apps, mobile apps, APIs, and AI solutions.",
  alternates: {
    canonical: "https://pinkbeam.io/labs",
  },
};

export default function LabsPage() {
  return <LabsPageClient />;
}
