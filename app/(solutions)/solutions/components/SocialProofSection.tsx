"use client";

import { FadeIn } from "@/components/animations";
import { motion } from "framer-motion";
import { Award, Building2, TrendingUp, Users } from "lucide-react";

const stats = [
  {
    value: "50+",
    label: "Transformations",
    description: "Successful digital transformations delivered",
    icon: Building2,
  },
  {
    value: "$10M+",
    label: "Value Delivered",
    description: "Measurable ROI for our clients",
    icon: TrendingUp,
  },
  {
    value: "95%",
    label: "Client Retention",
    description: "Long-term partnerships that last",
    icon: Users,
  },
];

const awards = [
  "Top Consulting Firm 2024",
  "AI Innovation Award",
  "Digital Excellence",
];

export function SocialProofSection() {
  return (
    <section className="py-20 lg:py-24 bg-background relative overflow-hidden">
      {/* Top border line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeIn className="text-center mb-12" direction="up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            Trusted by Leaders
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">
            Powering transformations for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              industry leaders
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From Fortune 500 companies to high-growth startups, we partner with organizations ready to lead.
          </p>
        </FadeIn>

        {/* Client Logos Row */}
        <FadeIn delay={0.1} direction="up">
          <div className="mb-16">
            <p className="text-center text-sm text-muted-foreground/60 mb-6 uppercase tracking-wider">
              Trusted by leading companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
              {["TechCorp Global", "InnovateLab", "FutureScale Inc", "Vertex Systems", "Nexus Dynamics"].map((company, i) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-400/10 flex items-center justify-center border border-amber-500/20">
                    <span className="text-amber-400 font-bold text-sm">
                      {company.charAt(0)}
                    </span>
                  </div>
                  <span className="text-muted-foreground/50 font-medium text-sm group-hover:text-muted-foreground/70 transition-colors">
                    {company}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Stats Grid */}
        <FadeIn delay={0.2} direction="up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-6 rounded-2xl bg-card border border-border hover:border-amber-500/30 transition-all duration-300 text-center group"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <stat.icon className="w-5 h-5 text-amber-400" />
                </div>
                
                {/* Value */}
                <div className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                
                {/* Label */}
                <div className="text-amber-400 font-medium mb-2">
                  {stat.label}
                </div>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>

                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* Awards & Recognition */}
        <FadeIn delay={0.3} direction="up">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground/60">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-sm">Recognized Excellence:</span>
            </div>
            {awards.map((award) => (
              <div
                key={award}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/5 border border-amber-500/10"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-sm text-muted-foreground">{award}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
