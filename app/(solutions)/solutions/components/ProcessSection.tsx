"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations";
import { Search, Palette, Truck, ArrowRight } from "lucide-react";

const processSteps = [
  {
    number: "01",
    icon: Search,
    title: "Discover",
    description: "We dive deep into your business to understand your challenges, opportunities, and goals through comprehensive analysis and stakeholder interviews.",
    details: [
      "Current state assessment",
      "Stakeholder alignment workshops",
      "Opportunity identification",
      "Competitive landscape analysis",
    ],
    color: "amber",
  },
  {
    number: "02",
    icon: Palette,
    title: "Design",
    description: "We architect tailored solutions that align with your business objectives, creating detailed roadmaps and implementation strategies.",
    details: [
      "Solution architecture",
      "Implementation roadmap",
      "Resource planning",
      "Risk assessment",
    ],
    color: "amber",
  },
  {
    number: "03",
    icon: Truck,
    title: "Deliver",
    description: "We execute with precision, providing hands-on support throughout implementation and ensuring sustainable results.",
    details: [
      "Phased implementation",
      "Change management support",
      "Performance monitoring",
      "Continuous optimization",
    ],
    color: "amber",
  },
];

export function ProcessSection() {
  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeIn className="text-center mb-16 lg:mb-24" direction="up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            Our Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            How We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Work
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A proven methodology that delivers results through discovery, design, and delivery
          </p>
        </FadeIn>

        {/* Process Steps */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-px">
            <div className="mx-auto max-w-4xl h-full bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {processSteps.map((step, index) => (
              <FadeIn key={step.title} delay={index * 0.2} direction="up">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Step Card */}
                  <div className="relative p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-amber-500/30 transition-all duration-300 h-full">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-6 lg:left-8">
                      <span className="text-5xl lg:text-6xl font-display font-bold text-amber-500/20">
                        {step.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="relative mt-8 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <step.icon className="w-7 h-7 text-foreground" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Details List */}
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Arrow Connector (Desktop) */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-24 -right-6 z-10 items-center justify-center w-12 h-12">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30">
                        <ArrowRight className="w-4 h-4 text-amber-400" />
                      </div>
                    </div>
                  )}
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
