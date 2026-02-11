"use client";

import { FadeIn } from "@/components/animations";
import { motion } from "framer-motion";
import { CheckCircle2, Target, Zap, Puzzle, ArrowRight } from "lucide-react";
import Link from "next/link";

const differentiators = [
  {
    icon: CheckCircle2,
    title: "Practitioner-led",
    headline: "We don't just advise, we implement",
    description: "Our consultants have built and led transformation initiatives at scale. We bring battle-tested expertise, not theoretical frameworks. Every recommendation comes from hands-on experience.",
    highlights: ["Former CTOs & VPs", "Real implementation experience", "No junior staff on your account"],
    gradient: "from-amber-500 to-amber-400",
  },
  {
    icon: Target,
    title: "Outcome-based",
    headline: "Success metrics defined upfront",
    description: "We start every engagement by defining what success looks like in measurable terms. Our fees are tied to outcomes, not hours. If you don't see results, we don't consider the job done.",
    highlights: ["KPIs agreed upfront", "Results-driven pricing", "Regular progress reviews"],
    gradient: "from-amber-400 to-amber-300",
  },
  {
    icon: Zap,
    title: "Technology-enabled",
    headline: "AI-accelerated delivery",
    description: "We leverage cutting-edge AI tools and automation to deliver faster and more cost-effectively than traditional consultancies. What takes others months, we accomplish in weeks.",
    highlights: ["Proprietary AI tools", "Rapid analysis & insights", "Continuous innovation"],
    gradient: "from-amber-500 to-amber-400",
  },
  {
    icon: Puzzle,
    title: "Integrated ecosystem",
    headline: "Connect strategy to execution",
    description: "Pink Beam's unique ecosystem means we don't just plan—we build. From strategy through to software development and AI implementation, we ensure nothing gets lost in translation.",
    highlights: ["Strategy to implementation", "Access to Labs & Agents", "End-to-end ownership"],
    gradient: "from-amber-400 to-amber-300",
  },
];

export function DifferentiationSection() {
  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeIn className="text-center mb-16" direction="up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            Why Pink Beam
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            What makes us{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              different
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're not a traditional consultancy. We're operators who consult, backed by a full technology ecosystem.
          </p>
        </FadeIn>

        {/* Differentiators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {differentiators.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.1} direction="up">
              <motion.div
                className="group relative p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-amber-500/30 transition-all duration-300 h-full"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  {/* Icon and Title Row */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0`}>
                      <item.icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-amber-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-amber-400 text-sm font-medium">
                        {item.headline}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-5">
                    {item.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </FadeIn>
          ))}
        </div>

        {/* Bottom CTA */}
        <FadeIn delay={0.4} direction="up">
          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-medium group"
            >
              <span>Learn more about our approach</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
