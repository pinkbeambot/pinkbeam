"use client";

import { AlertCircle, Clock, Users, Zap, TrendingDown } from "lucide-react";
import { FadeIn } from "@/components/animations";

const problems = [
  {
    icon: Clock,
    title: "Time-to-Market is Killing You",
    description:
      "Hiring developers takes months. Building in-house is slow. Your competitors are shipping faster. You need software now, not in six months.",
    color: "bg-cyan-500",
  },
  {
    icon: AlertCircle,
    title: "Technical Debt Compounds",
    description:
      "Rushed code, wrong architecture decisions, no tests. Your current system is becoming impossible to scale or modify. Rewrites are expensive.",
    color: "bg-cyan-500",
  },
  {
    icon: Users,
    title: "You Can't Find (or Keep) The Right Engineers",
    description:
      "The market is brutal. Senior developers are expensive or unavailable. Juniors need mentorship you don't have time to provide. Turnover kills momentum.",
    color: "bg-cyan-500",
  },
  {
    icon: TrendingDown,
    title: "Your Current System Isn't What You Need Anymore",
    description:
      "Off-the-shelf tools have limits. Your legacy system doesn't talk to anything. You need integrations, automations, and custom workflows—but refactoring is risky.",
    color: "bg-cyan-500",
  },
  {
    icon: Zap,
    title: "You're Stuck Between Build vs Buy",
    description:
      "Build it yourself and risk everything on tech decisions. Buy something and lose flexibility. Neither feels right. You need a third option.",
    color: "bg-cyan-500",
  },
];

export function LabsProblemSection() {
  return (
    <section className="py-20 md:py-32 bg-surface-sunken">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            The Problem With{" "}
            <span className="text-gradient-cyan">Most Software Projects</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Building custom software is hard. We've seen the failures—and we know
            how to avoid them.
          </p>
        </FadeIn>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <FadeIn key={problem.title} delay={0.05 + index * 0.05}>
                <div className="group h-full p-6 rounded-xl border border-cyan-500/20 bg-card hover:border-cyan-500/40 hover:bg-card/80 transition-all duration-300">
                  <div className={`${problem.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-display font-bold text-foreground mb-3">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
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
