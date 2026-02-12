"use client";

import { Compass } from "lucide-react";
import { CompactHero } from "@/components/sections/CompactHero";

export function SolutionsPricingHero() {
  return (
    <CompactHero
      icon={Compass}
      title="Transparent Pricing"
      highlightText="Pricing"
      subtitle="Four engagement models, clear pricing, no surprises. Find the right fit for your stage, budget, and goals."
      accentColor="amber-500"
    />
  );
}
