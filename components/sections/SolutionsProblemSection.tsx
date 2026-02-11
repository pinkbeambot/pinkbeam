"use client";

import { FadeIn } from "@/components/animations";
import {
  UserX,
  HelpCircle,
  TrendingDown,
  Clock,
  ShieldAlert,
} from "lucide-react";

const problems = [
  {
    icon: UserX,
    title: "No Tech Leadership",
    description:
      "You need a CTO-level perspective but can't justify a $300K+ salary. Strategic decisions are being made without technical expertise.",
    featured: true,
  },
  {
    icon: HelpCircle,
    title: "Unclear AI Strategy",
    description:
      "Everyone says you need AI, but you don't know where to start, what's real vs. hype, or how to prioritize the opportunities.",
    featured: true,
  },
  {
    icon: TrendingDown,
    title: "Stalled Growth",
    description:
      "Your business has hit a ceiling. Manual processes, outdated systems, and ad-hoc decisions are limiting what's possible.",
    featured: false,
  },
  {
    icon: Clock,
    title: "Wasted Tech Spend",
    description:
      "You're paying for tools and systems that don't work together. Every new initiative feels like starting from scratch.",
    featured: false,
  },
  {
    icon: ShieldAlert,
    title: "Risk Without Visibility",
    description:
      "You don't know what you don't know. Security gaps, technical debt, and architectural weaknesses are hidden until they break.",
    featured: false,
  },
];

export function SolutionsProblemSection() {
  const featuredProblems = problems.filter((p) => p.featured);
  const otherProblems = problems.filter((p) => !p.featured);

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Sound{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Familiar?
            </span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Growing companies face the same strategic challenges. You need
            expert guidance, not another generic consultant.
          </p>
        </FadeIn>

        {/* Featured Problems - Top Row (2 cards, bigger) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {featuredProblems.map((problem, idx) => {
            const Icon = problem.icon;
            return (
              <FadeIn key={problem.title} delay={0.05 + idx * 0.05}>
                <div className="group p-8 md:p-10 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-amber-600/5 hover:border-amber-500/50 hover:shadow-lg transition-all duration-300">
                  <div className="bg-amber-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-amber-500" />
                  </div>
                  <h3 className="text-h3 font-display font-bold text-foreground mb-3">
                    {problem.title}
                  </h3>
                  <p className="text-body text-muted-foreground">
                    {problem.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Secondary Problems - Bottom Row (3 cards, smaller) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherProblems.map((problem, idx) => {
            const Icon = problem.icon;
            return (
              <FadeIn key={problem.title} delay={0.1 + idx * 0.05}>
                <div className="group p-6 md:p-8 rounded-2xl border border-border bg-card hover:border-amber-500/30 hover:shadow-lg transition-all duration-300">
                  <div className="bg-amber-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-h4 font-display font-bold text-foreground mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-body text-muted-foreground">
                    {problem.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
