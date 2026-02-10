"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { LabsHero } from "./components/LabsHero";

const capabilities = [
  "Web Applications",
  "Mobile Apps",
  "APIs & Integrations",
  "AI/ML Solutions",
  "Process Automation",
  "Legacy Modernization",
];

export function LabsPageClient() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <LabsHero />

      {/* Capabilities */}
      <section id="services" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What we build</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Any software. Any stack. Built for scale.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {capabilities.map((capability, index) => (
              <FadeIn key={capability} delay={index * 0.1} direction="up">
                <div className="flex items-center gap-3 p-4 rounded-xl border bg-card h-full">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-cyan-500" />
                  </div>
                  <span className="font-medium">{capability}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-32 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How we work</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparent process, regular updates, delivery-focused
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Discovery", desc: "Understand your needs" },
              { step: "02", title: "Design", desc: "Architecture & UI/UX" },
              { step: "03", title: "Develop", desc: "Build with updates" },
              { step: "04", title: "Deploy", desc: "Launch & support" },
            ].map((item, index) => (
              <FadeIn key={item.step} delay={index * 0.1} direction="up">
                <div className="text-center p-6">
                  <div className="text-4xl font-bold text-cyan-500 mb-2">{item.step}</div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center" direction="up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Have a project in mind?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Let's talk about what you want to build.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90">
              Schedule a Consultation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
