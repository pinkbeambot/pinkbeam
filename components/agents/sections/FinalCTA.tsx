"use client";

import { useState } from "react";
import { ArrowRight, CreditCard, Calendar, CheckCircle, Quote } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { FadeIn, FadeInOnMount } from "@/components/animations";

const trustBadges = [
  { icon: CreditCard, text: "No credit card required" },
  { icon: Calendar, text: "14-day free trial" },
  { icon: CheckCircle, text: "Cancel anytime" },
];

export function FinalCTA() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // In a real app, you'd handle the signup here
    }
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-void relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-beam-glow opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Headline */}
          <FadeInOnMount>
            <h2 className="text-h1 md:text-hero font-display font-bold mb-6 text-white">
              Your AI Workforce Is{" "}
              <span className="text-gradient-beam">Waiting</span>
            </h2>
          </FadeInOnMount>

          {/* Supporting Text */}
          <FadeInOnMount delay={0.1}>
            <p className="text-lead text-muted-foreground max-w-2xl mx-auto mb-10">
              Join 100+ companies already scaling with AI employees. Start your 
              free trial today—no credit card required, no setup fees, cancel anytime.
            </p>
          </FadeInOnMount>

          {/* Email Capture Form */}
          <FadeInOnMount delay={0.2}>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-surface-elevated border-border"
                  />
                  <Button 
                    type="submit" 
                    size="lg" 
                    variant="beam"
                    className="h-12 shadow-beam whitespace-nowrap"
                  >
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            ) : (
              <div className="max-w-md mx-auto mb-8 p-6 rounded-xl bg-success-500/10 border border-success-500/20">
                <p className="text-success-600 dark:text-success-500 font-display font-semibold">
                  Thanks! Check your inbox to get started.
                </p>
              </div>
            )}
          </FadeInOnMount>

          {/* Trust Badges */}
          <FadeInOnMount delay={0.3}>
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.text} className="flex items-center gap-2 text-small text-muted-foreground">
                    <Icon className="w-4 h-4 text-pink-500" />
                    <span>{badge.text}</span>
                  </div>
                );
              })}
            </div>
          </FadeInOnMount>

          {/* Testimonial Quote */}
          <FadeInOnMount delay={0.4}>
            <div className="max-w-lg mx-auto pt-8 border-t border-border/50">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Quote className="w-4 h-4 text-pink-500" />
              </div>
              <blockquote className="text-body text-muted-foreground italic mb-3">
                "I've already hired Sarah and Mike. Best decision I made this year."
              </blockquote>
              <cite className="text-small text-muted-foreground not-italic">
                — David Chen, CEO at Nexus AI
              </cite>
            </div>
          </FadeInOnMount>
        </div>
      </div>
    </section>
  );
}
