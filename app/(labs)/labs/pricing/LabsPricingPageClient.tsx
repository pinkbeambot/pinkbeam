"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";
import { ArrowRight } from "lucide-react";
import { LabsPricingHero } from "@/components/sections/LabsPricingHero";
import { LabsPricingModels } from "@/components/sections/LabsPricingModels";
import { LabsProjectRanges } from "@/components/sections/LabsProjectRanges";
import { LabsFeatureComparison } from "@/components/sections/LabsFeatureComparison";
import { LabsROICalculator } from "@/components/sections/LabsROICalculator";
import { LabsPricingFAQ } from "@/components/sections/LabsPricingFAQ";

function PricingCTASection() {
  return (
    <section className="py-20 md:py-32 bg-surface-sunken relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto">
          <h2 className="text-h2 font-display font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lead text-muted-foreground mb-10">
            Let's discuss your project requirements, timeline, and budget. We'll
            provide a detailed estimate and answer all your questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90 shadow-lg shadow-cyan-500/25"
              asChild
            >
              <Link href="/contact">
                Schedule Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="mailto:labs@pinkbeam.io">
                Email Us
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function LabsPricingPageClient() {
  return (
    <main className="min-h-screen">
      <LabsPricingHero />
      <LabsPricingModels />
      <LabsProjectRanges />
      <LabsROICalculator />
      <LabsFeatureComparison />
      <LabsPricingFAQ />
      <PricingCTASection />
    </main>
  );
}

export default LabsPricingPageClient;
