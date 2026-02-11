"use client";

import * as React from "react";
import { FadeIn } from "@/components/animations";
import { Clock, DollarSign, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TimelineItem {
  phase: string;
  duration: string;
  description: string;
}

interface InvestmentTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

interface InvestmentCardProps {
  timeline: TimelineItem[];
  tiers?: InvestmentTier[];
  priceRange?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function InvestmentCard({
  timeline,
  tiers,
  priceRange,
  ctaText = "Book Discovery Call",
  ctaHref = "/solutions/contact",
}: InvestmentCardProps) {
  return (
    <section className="py-24 lg:py-32 bg-muted/30 border-y">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Timeline & Investment
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Clear Roadmap, Predictable Investment
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparent timelines and flexible engagement options designed to
              fit your needs.
            </p>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Timeline */}
            <FadeIn>
              <div className="p-6 lg:p-8 rounded-2xl border bg-card h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold">Project Timeline</h3>
                </div>

                <div className="space-y-6">
                  {timeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        {index < timeline.length - 1 && (
                          <div className="w-0.5 flex-1 bg-amber-500/20 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-amber-500">
                            {item.duration}
                          </span>
                        </div>
                        <h4 className="font-semibold mb-1">{item.phase}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Investment */}
            <FadeIn delay={0.1}>
              <div className="p-6 lg:p-8 rounded-2xl border bg-card h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold">Investment</h3>
                </div>

                {priceRange ? (
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">
                      Starting from
                    </p>
                    <p className="text-4xl font-bold text-amber-500">
                      {priceRange}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Custom quotes based on scope and complexity
                    </p>
                  </div>
                ) : null}

                {tiers ? (
                  <div className="space-y-4">
                    {tiers.map((tier, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border ${
                          tier.recommended
                            ? "border-amber-500/50 bg-amber-500/5"
                            : "border-border/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{tier.name}</span>
                          <span className="text-amber-500 font-bold">
                            {tier.price}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {tier.description}
                        </p>
                        <ul className="space-y-1">
                          {tier.features.map((feature, fIndex) => (
                            <li
                              key={fIndex}
                              className="text-sm text-muted-foreground flex items-center gap-2"
                            >
                              <span className="w-1 h-1 rounded-full bg-amber-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-4">
                    All engagements include ongoing support and knowledge
                    transfer.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* CTA */}
          <FadeIn className="text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
              asChild
            >
              <Link href={ctaHref}>
                {ctaText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
