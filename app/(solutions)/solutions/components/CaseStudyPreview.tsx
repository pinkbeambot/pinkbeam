"use client";

import { FadeIn } from "@/components/animations";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Clock, DollarSign, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const results = [
  { icon: TrendingUp, value: "40%", label: "Efficiency Gain" },
  { icon: DollarSign, value: "$2M", label: "Cost Savings" },
  { icon: Clock, value: "6mo", label: "Implementation" },
];

export function CaseStudyPreview() {
  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeIn className="text-center mb-12" direction="up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Real results,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              real impact
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how we've helped organizations like yours transform challenges into competitive advantages.
          </p>
        </FadeIn>

        {/* Featured Case Study Card */}
        <FadeIn delay={0.1} direction="up">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="relative rounded-3xl overflow-hidden border border-border hover:border-amber-500/30 transition-all duration-300 group bg-gradient-to-br from-card via-muted to-card"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-8 p-8 lg:p-12">
                {/* Left: Story Content */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Client Badge */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-400/10 border border-amber-500/20 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-foreground font-semibold">Fortune 500 Retailer</p>
                      <p className="text-sm text-muted-foreground">Global omnichannel retail</p>
                    </div>
                  </div>

                  {/* Challenge */}
                  <div>
                    <h3 className="text-sm font-medium text-amber-400 mb-2 uppercase tracking-wider">
                      The Challenge
                    </h3>
                    <p className="text-muted-foreground">
                      Legacy systems and fragmented data were limiting growth and preventing real-time inventory decisions. Manual processes were creating bottlenecks across 500+ locations.
                    </p>
                  </div>

                  {/* Solution */}
                  <div>
                    <h3 className="text-sm font-medium text-amber-400 mb-2 uppercase tracking-wider">
                      Our Solution
                    </h3>
                    <p className="text-muted-foreground">
                      End-to-end digital transformation strategy with AI-powered demand forecasting, integrated supply chain platform, and automated inventory management.
                    </p>
                  </div>

                  {/* Link */}
                  <Link
                    href="/solutions/case-studies"
                    className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-medium group/link"
                  >
                    <span>Read the full case study</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Right: Results */}
                <div className="lg:col-span-2">
                  <div className="h-full p-6 lg:p-8 rounded-2xl bg-muted/50 border border-border">
                    <h3 className="text-sm font-medium text-foreground mb-6 uppercase tracking-wider">
                      Results Achieved
                    </h3>
                    
                    <div className="space-y-6">
                      {results.map((result, index) => (
                        <motion.div
                          key={result.label}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4"
                        >
                          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <result.icon className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <p className="text-2xl font-display font-bold text-foreground">
                              {result.value}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {result.label}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Quote */}
                    <div className="mt-8 pt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground italic">
                        "Pink Beam didn't just give us a roadmap—they helped us execute it. The results exceeded our expectations."
                      </p>
                      <p className="text-sm text-amber-400 mt-2">
                        — VP of Digital Transformation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.2} direction="up">
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-amber-500/30 hover:bg-amber-500/10"
              asChild
            >
              <Link href="/solutions/case-studies">
                View All Case Studies
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
