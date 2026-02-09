"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

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
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-void">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-beam-glow opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent-purple/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,110,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,110,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
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
            className="flex items-center gap-4 mb-6"
          >
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", iconColor)}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-h1 font-display font-bold text-white">Meet {name}</h1>
            </div>
          </motion.div>
          
          {/* Tagline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-h2 md:text-hero font-display font-bold text-white mb-6"
          >
            {tagline}
          </motion.h2>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lead text-muted-foreground max-w-2xl mb-10"
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-beam text-white font-display font-semibold rounded-lg shadow-beam hover:shadow-glow-pink-md transition-shadow"
            >
              {ctaText}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
