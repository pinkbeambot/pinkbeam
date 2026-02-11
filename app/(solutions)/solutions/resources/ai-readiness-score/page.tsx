import type { Metadata } from "next";
import { AIReadinessScoreClient } from "./AIReadinessScoreClient";

export const metadata: Metadata = {
  title: "AI Readiness Assessment | Pink Beam Solutions",
  description: "Assess your organization's readiness for AI adoption. Evaluate your data, technology, people, and strategy preparedness.",
};

export default function AIReadinessScorePage() {
  return <AIReadinessScoreClient />;
}
