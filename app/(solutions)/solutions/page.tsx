import type { Metadata } from "next";
import { SolutionsPageClient } from "./SolutionsPageClient";

export const metadata: Metadata = {
  title: "Pink Beam Solutions — Strategic Consulting",
  description:
    "Strategic consulting for digital transformation and AI adoption. Workshops, assessments, and ongoing advisory.",
  alternates: {
    canonical: "https://pinkbeam.io/solutions",
  },
};

export default function SolutionsPage() {
  return <SolutionsPageClient />;
}
