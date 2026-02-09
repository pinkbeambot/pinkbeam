"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator } from "lucide-react";

// Loading fallback for ROI Calculator
function ROICalculatorSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-beam-glow pointer-events-none" />
        <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Calculator className="w-4 h-4" />
              ROI Calculator
            </div>
            <h1 className="text-hero font-display font-bold mb-6">
              Calculate Your{" "}
              <span className="text-gradient-beam">Savings</span>
            </h1>
            <p className="text-lead text-muted-foreground">
              See how much you can save by replacing human hours with AI employees.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-12 w-full bg-muted rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-12 w-full bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-14 w-full bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>

            <Card className="border-border/50 border-dashed">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 animate-pulse" />
                <div className="h-6 w-48 bg-muted rounded mx-auto mb-2 animate-pulse" />
                <div className="h-4 w-64 bg-muted rounded mx-auto animate-pulse" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

// Dynamically import the heavy ROI Calculator component
const ROICalculatorContent = dynamic(
  () => import("./ROICalculatorContent"),
  {
    loading: ROICalculatorSkeleton,
    ssr: false, // Disable SSR for this client-heavy component
  }
);

export default function CalculatorClient() {
  return (
    <Suspense fallback={<ROICalculatorSkeleton />}>
      <ROICalculatorContent />
    </Suspense>
  );
}
