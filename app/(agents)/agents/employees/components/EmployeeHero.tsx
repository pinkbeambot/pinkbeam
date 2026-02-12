"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, ChevronDown } from "lucide-react";

interface EmployeeHeroProps {
  name: string;
  role: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  ctaText: string;
  ctaHref?: string;
}

export function EmployeeHero({
  name,
  role,
  tagline,
  description,
  icon: Icon,
  iconColor,
  ctaText,
  ctaHref = "#pricing",
}: EmployeeHeroProps) {
  return (
    <section className="relative h-[40vh] min-h-[450px] max-h-[550px] flex items-center justify-center overflow-hidden bg-gradient-void">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-beam-glow opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,110,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,110,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-8"
          >
            <span className="text-sm font-medium text-pink-500">AI Employee</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{role}</span>
          </motion.div>
          
          {/* Icon & Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4 mb-5"
          >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", iconColor)}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white">Meet {name}</h1>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-4"
          >
            {tagline}
          </motion.h2>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mb-6"
          >
            {description}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-beam text-white font-display font-semibold rounded-lg shadow-beam hover:shadow-glow-pink-md transition-shadow"
            >
              {ctaText}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
