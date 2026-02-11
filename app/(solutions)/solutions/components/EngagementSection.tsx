"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const engagements = [
  {
    name: "Workshops",
    price: "$2,500",
    description: "Intensive strategy sessions",
    duration: "Half-day to multi-day",
    features: [
      "Stakeholder alignment",
      "Opportunity mapping",
      "Quick wins identification",
      "Action plan delivery",
    ],
    href: "/solutions/engagement/workshops",
    popular: false,
  },
  {
    name: "Assessments",
    price: "$10,000",
    description: "Comprehensive deep dive",
    duration: "2-3 weeks",
    features: [
      "Current state analysis",
      "Technology audit",
      "Process optimization review",
      "Detailed recommendations",
      "Implementation roadmap",
    ],
    href: "/solutions/engagement/assessments",
    popular: true,
  },
  {
    name: "Retainers",
    price: "$5,000/mo",
    description: "Ongoing strategic partnership",
    duration: "Monthly engagement",
    features: [
      "Monthly strategy sessions",
      "Priority Slack support",
      "Quarterly business reviews",
      "Implementation guidance",
      "On-demand advisory",
    ],
    href: "/solutions/engagement/retainers",
    popular: false,
  },
  {
    name: "Projects",
    price: "Custom",
    description: "End-to-end delivery",
    duration: "2-12 months",
    features: [
      "Full project lifecycle",
      "Dedicated team",
      "Milestone-based delivery",
      "Knowledge transfer",
      "Post-launch support",
    ],
    href: "/solutions/engagement/projects",
    popular: false,
  },
];

export function EngagementSection() {
  return (
    <section id="engagements" className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeIn className="text-center mb-16" direction="up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            Engagement Options
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Path
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible engagement models designed to match your needs and budget
          </p>
        </FadeIn>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 max-w-6xl mx-auto">
          {engagements.map((engagement, index) => (
            <FadeIn key={engagement.name} delay={index * 0.15} direction="up">
              <motion.div
                className={`relative p-6 lg:p-8 rounded-2xl h-full flex flex-col ${
                  engagement.popular
                    ? "bg-gradient-to-b from-amber-500/10 to-card border-2 border-amber-500/30"
                    : "bg-card border border-border hover:border-amber-500/30"
                } transition-all duration-300`}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {/* Popular Badge */}
                {engagement.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-primary-foreground text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{engagement.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{engagement.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-display font-bold text-foreground">{engagement.price}</span>
                  </div>
                  <span className="text-sm text-amber-400">{engagement.duration}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {engagement.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-amber-400" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className={`w-full ${
                    engagement.popular
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                      : "border-amber-500/30 hover:bg-amber-500/10"
                  }`}
                  variant={engagement.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href={engagement.href}>
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        {/* Custom Enterprise Note */}
        <FadeIn delay={0.5} className="text-center mt-12">
          <p className="text-muted-foreground">
            Want to compare all options?{" "}
            <Link href="/solutions/engagement" className="text-amber-400 hover:text-amber-300 underline underline-offset-4">
              View all engagement models
            </Link>
            {" "}or{" "}
            <Link href="/solutions/contact" className="text-amber-400 hover:text-amber-300 underline underline-offset-4">
              discuss custom engagements
            </Link>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
