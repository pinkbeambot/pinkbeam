"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MessageCircle } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <FadeIn direction="up">
            <div className="relative p-8 lg:p-12 rounded-3xl bg-gradient-to-b from-card to-muted border border-amber-500/20 overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/5 rounded-full blur-2xl" />
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-20 h-px bg-gradient-to-r from-amber-500 to-transparent" />
              <div className="absolute top-0 left-0 w-px h-20 bg-gradient-to-b from-amber-500 to-transparent" />
              <div className="absolute bottom-0 right-0 w-20 h-px bg-gradient-to-l from-amber-500 to-transparent" />
              <div className="absolute bottom-0 right-0 w-px h-20 bg-gradient-to-t from-amber-500 to-transparent" />
              
              <div className="relative text-center">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span className="text-sm font-medium text-amber-400">
                    Now Accepting New Clients
                  </span>
                </motion.div>

                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                  Ready to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                    Transform
                  </span>{" "}
                  Your Business?
                </h2>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Let's discuss your challenges and opportunities. Book a free 30-minute consultation to explore how we can help accelerate your growth.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                    asChild
                  >
                    <Link href="/contact">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule a Call
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto border-amber-500/30 hover:bg-amber-500/10"
                    asChild
                  >
                    <Link href="/contact">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send a Message
                    </Link>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-10 pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">Trusted by innovative companies</p>
                  <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
                    {["TechCorp", "StartupXYZ", "InnovateLab", "FutureScale"].map((company) => (
                      <span key={company} className="text-sm font-medium text-muted-foreground">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
