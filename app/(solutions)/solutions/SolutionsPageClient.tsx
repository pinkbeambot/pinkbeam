"use client";

import { SolutionsHero } from "@/components/sections/SolutionsHero";
import { SolutionsProblemSection } from "@/components/sections/SolutionsProblemSection";
import { SolutionsServicesShowcase } from "@/components/sections/SolutionsServicesShowcase";
import { SolutionsPricingPreview } from "@/components/sections/SolutionsPricingPreview";
import { SolutionsProcessTimeline } from "@/components/sections/SolutionsProcessTimeline";
import { SolutionsFAQSection } from "@/components/sections/SolutionsFAQSection";
import { ExploreServices } from "@/components/sections/ExploreServices";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations";
import { ArrowRight } from "lucide-react";

// Final CTA Section
function SolutionsCTASection() {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto">
          <Badge
            variant="outline"
            className="mb-6 border-amber-500/30 text-amber-500"
          >
            Ready to Talk Strategy?
          </Badge>
          <h2 className="text-h2 font-display font-bold mb-6">
            Let&apos;s Figure Out Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Next Move
            </span>
          </h2>
          <p className="text-lead text-muted-foreground mb-10">
            Book a free 30-minute consultation. We&apos;ll listen to your
            challenges, share honest recommendations, and help you decide if
            working together makes sense.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
              asChild
            >
              <Link href="/contact">
                Book a Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="mailto:solutions@pinkbeam.io">Email Us</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// Main Page Component
export function SolutionsPageClient() {
  return (
    <main className="min-h-screen">
      <SolutionsHero />
      <SolutionsProblemSection />
      <SolutionsServicesShowcase />
      <SolutionsPricingPreview />
      <SolutionsProcessTimeline />
      <ExploreServices currentService="solutions" />
      <SolutionsFAQSection />
      <SolutionsCTASection />
    </main>
  );
}

export default SolutionsPageClient;
