"use client";

import { Quote } from "lucide-react";

const founderQuote = {
  quote: "We're building AI employees because we needed them ourselves. Sarah, Mike, and Alex handle our research, sales, and support—so our team can focus on building.",
  name: "Founders",
  company: "Pink Beam",
  initials: "PB",
  color: "bg-pink-500",
};

export function WhyWeBuild() {
  return (
    <section className="py-20 md:py-32 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Why We Built{" "}
            <span className="text-gradient-beam">Pink Beam</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            We're not here to replace your team. We're here to help you scale without burning out.
          </p>
        </div>

        {/* Quote */}
        <div>
          <div className="relative max-w-3xl mx-auto">
            {/* Quote Icon */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center">
              <Quote className="w-6 h-6 text-pink-500" />
            </div>

            {/* Quote Content */}
            <div className="bg-surface-elevated rounded-2xl p-8 md:p-12 border border-border pt-16 text-center">
              <blockquote className="text-h4 md:text-h3 font-display font-medium text-foreground mb-8 leading-relaxed">
                "{founderQuote.quote}"
              </blockquote>

              {/* Attribution */}
              <div className="flex items-center justify-center gap-4">
                <div className={`${founderQuote.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                  <span className="text-white font-display font-bold">
                    {founderQuote.initials}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-display font-semibold text-foreground">
                    {founderQuote.name}
                  </p>
                  <p className="text-small text-muted-foreground">
                    {founderQuote.company}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
