"use client";

import { Quote } from "lucide-react";
import { FadeIn } from "@/components/animations";

const testimonial = {
  quote: "We build websites that convert. Not just pretty designs—sites that actually move the needle for your business. Every feature, every line of code is built with one goal: turn visitors into customers.",
  name: "Pink Beam Team",
  company: "Web Services",
  initials: "PB",
  color: "bg-violet-500",
};

export function WebTestimonialsSection() {
  return (
    <section className="py-20 md:py-32 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Why We Build Websites
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Every project is built with conversion and user experience in mind.
          </p>
        </FadeIn>

        {/* Quote */}
        <FadeIn delay={0.1}>
          <div className="relative max-w-3xl mx-auto">
            {/* Quote Icon */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center">
              <Quote className="w-6 h-6 text-violet-500" />
            </div>

            {/* Quote Content */}
            <div className="bg-surface-elevated rounded-2xl p-8 md:p-12 border border-border pt-16 text-center">
              <blockquote className="text-h4 md:text-h3 font-display font-medium text-foreground mb-8 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Attribution */}
              <div className="flex items-center justify-center gap-4">
                <div className={`${testimonial.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                  <span className="text-white font-display font-bold">
                    {testimonial.initials}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-display font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-small text-muted-foreground">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
