"use client";

import { LabsHero } from "@/components/sections/LabsHero";
import { LabsProblemSection } from "@/components/sections/LabsProblemSection";
import { LabsServicesShowcase } from "@/components/sections/LabsServicesShowcase";
import { LabsPricingPreview } from "@/components/sections/LabsPricingPreview";
import { LabsProcessTimeline } from "@/components/sections/LabsProcessTimeline";
import { LabsTechnologyStack } from "@/components/sections/LabsTechnologyStack";
import { LabsFAQSection } from "@/components/sections/LabsFAQSection";
import { ExploreServices } from "@/components/sections/ExploreServices";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations";
import { ArrowRight } from "lucide-react";

// Final CTA Section
function LabsCTASection() {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-6 border-cyan-500/30 text-cyan-500">
            Ready to Build?
          </Badge>
          <h2 className="text-h2 font-display font-bold mb-6">
            Let's Build Something{" "}
            <span className="text-gradient-cyan">Amazing</span>
          </h2>
          <p className="text-lead text-muted-foreground mb-10">
            Your custom software project starts with a conversation. We'll help you
            scope it, estimate it, and build it—on time and on budget.
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

// Main Page Component
export function LabsPageClient() {
  return (
    <main className="min-h-screen">
      <LabsHero />
      <LabsProblemSection />
      <LabsServicesShowcase />
      <LabsPricingPreview />
      <LabsProcessTimeline />
      <LabsTechnologyStack />
      <ExploreServices currentService="labs" />
      <LabsFAQSection />
      <LabsCTASection />
    </main>
  );
}

export default LabsPageClient;
