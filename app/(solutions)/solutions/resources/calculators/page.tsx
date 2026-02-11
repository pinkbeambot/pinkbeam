import type { Metadata } from "next";
import { CalculatorsPageClient } from "./CalculatorsPageClient";

export const metadata: Metadata = {
  title: "Interactive Calculators | Pink Beam Solutions",
  description: "Free interactive calculators to estimate ROI, assess readiness, and plan your digital transformation initiatives.",
};

export default function CalculatorsPage() {
  return <CalculatorsPageClient />;
}
