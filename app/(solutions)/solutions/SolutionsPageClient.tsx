"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { SolutionsHero } from "./components/SolutionsHero";

const services = [
  "Digital Transformation",
  "AI Strategy",
  "Process Automation",
  "Technology Roadmaps",
  "Team Structure",
  "Growth Planning",
];

const engagements = [
  {
    name: "Workshop",
    price: "$2,500",
    description: "2-hour strategy session",
    features: ["Stakeholder alignment", "Opportunity mapping", "Action plan"],
  },
  {
    name: "Assessment",
    price: "$10,000",
    description: "1-week deep dive",
    features: ["Current state analysis", "Technology review", "Recommendations", "Implementation roadmap"],
  },
  {
    name: "Retainer",
    price: "$5,000/mo",
    description: "Ongoing advisory",
    features: ["Monthly strategy calls", "Slack/email support", "Priority access", "Quarterly reviews"],
  },
];

export function SolutionsPageClient() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <SolutionsHero />

      {/* Services */}
      <section id="services" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What we do</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Strategic guidance for every stage of your journey
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <FadeIn key={service} delay={index * 0.1} direction="up">
                <div className="flex items-center gap-3 p-4 rounded-xl border bg-card h-full">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="font-medium">{service}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-20 lg:py-32 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Engagement options</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the engagement model that fits your needs
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {engagements.map((engagement, index) => (
              <FadeIn key={engagement.name} delay={index * 0.15} direction="up">
                <div className="p-6 lg:p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow h-full flex flex-col">
                  <h3 className="text-xl font-bold mb-2">{engagement.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{engagement.description}</p>
                  <div className="text-3xl font-bold mb-6">{engagement.price}</div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {engagement.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-amber-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={engagement.name === "Assessment" ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
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
              Ready to transform?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Let's discuss your challenges and opportunities.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90">
              Schedule a Call
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
