"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeInOnMount } from "@/components/animations";
import { ArrowRight, ChevronDown, Globe } from "lucide-react";

export function WebHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0F]">
      {/* Violet Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <FadeInOnMount delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8">
              <Globe className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-medium text-violet-500">
                Web Services
              </span>
            </div>
          </FadeInOnMount>
          
          {/* Main Headline */}
          <FadeInOnMount delay={0.1}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 text-white tracking-tight">
              Websites that{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-violet-400">
                convert
              </span>
            </h1>
          </FadeInOnMount>
          
          {/* Subheadline */}
          <FadeInOnMount delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              High-performance websites, SEO optimization, and ongoing maintenance. 
              Built for speed, designed for results.
            </p>
          </FadeInOnMount>
          
          {/* CTA Buttons */}
          <FadeInOnMount delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-violet-500 to-violet-600 hover:opacity-90 shadow-lg shadow-violet-500/25" asChild>
                <Link href="/contact">
                  Get a Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Link href="#features" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full">
                  View Services
                </Button>
              </Link>
            </div>
          </FadeInOnMount>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
