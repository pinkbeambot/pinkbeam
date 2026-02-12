"use client";

import { DollarSign } from "lucide-react";
import { CompactHero } from "@/components/sections/CompactHero";

export function LabsPricingHero() {
  return (
    <CompactHero
      icon={DollarSign}
      title="Software Pricing That Makes Sense"
      highlightText="Makes Sense"
      subtitle="From quick MVPs to enterprise systems, we offer flexible pricing models designed for your project scope and timeline."
      accentColor="cyan-500"
    />
  );
}
