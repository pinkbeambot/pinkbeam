"use client";

import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { FadeIn } from "@/components/animations";

const testimonials = [
  {
    quote: "Pink Beam's AI employees replaced 3 full-time hires. Sarah does our research, Mike handles sales outreach, and Alex manages support. Best decision we made.",
    author: "Founder",
    company: "SaaS Startup",
    service: "AI Employees",
    initials: "SA",
    color: "bg-pink-500",
  },
  {
    quote: "The website they built converted 3x better than our previous site. It was ready in weeks, not months, and we get ongoing optimization.",
    author: "Marketing Director",
    company: "E-commerce",
    service: "Websites",
    initials: "MD",
    color: "bg-violet-500",
  },
  {
    quote: "Custom software that actually works. The team understood our needs, built quickly, and continues to support and improve it. Worth every penny.",
    author: "CTO",
    company: "B2B SaaS",
    service: "Custom Software",
    initials: "CT",
    color: "bg-cyan-500",
  },
];

export function HomeTestimonialsSection() {
  return (
    <section className="py-20 md:py-32 bg-surface-sunken">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Trusted by teams that{" "}
            <span className="text-gradient-beam">scale fast</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Real results from real companies using Pink Beam services.
          </p>
        </FadeIn>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <Card variant="elevated" className="h-full flex flex-col">
                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                  {/* Quote Icon */}
                  <Quote className="w-6 h-6 text-pink-500/40 mb-4" />

                  {/* Quote */}
                  <p className="text-body font-medium text-foreground mb-6 flex-1">
                    "{testimonial.quote}"
                  </p>

                  {/* Service Badge */}
                  <div className="mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${testimonial.color} text-white`}>
                      {testimonial.service}
                    </span>
                  </div>

                  {/* Attribution */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <div className={`${testimonial.color} w-10 h-10 rounded-full flex items-center justify-center shrink-0`}>
                      <span className="text-white font-display font-bold text-sm">
                        {testimonial.initials}
                      </span>
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground text-sm">
                        {testimonial.author}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
