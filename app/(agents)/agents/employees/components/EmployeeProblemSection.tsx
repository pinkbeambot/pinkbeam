"use client";

import { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/utils";

interface Problem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface EmployeeProblemSectionProps {
  title: string;
  description: string;
  problems: Problem[];
  colorClass: string; // e.g., "text-pink-500", "text-purple-500"
}

export function EmployeeProblemSection({
  title,
  description,
  problems,
  colorClass,
}: EmployeeProblemSectionProps) {
  return (
    <section className="py-20 md:py-32 bg-surface-sunken">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            {title}
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </FadeIn>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, idx) => {
            const Icon = problem.icon;
            return (
              <FadeIn key={idx} delay={idx * 0.05}>
                <div className="h-full p-6 rounded-xl border border-border bg-background hover:border-border/50 transition-colors">
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-br",
                    colorClass === "text-pink-500" && "from-pink-500/10 to-pink-500/5",
                    colorClass === "text-purple-500" && "from-purple-500/10 to-purple-500/5",
                    colorClass === "text-cyan-500" && "from-cyan-500/10 to-cyan-500/5",
                    colorClass === "text-amber-500" && "from-amber-500/10 to-amber-500/5",
                    colorClass === "text-indigo-500" && "from-indigo-500/10 to-indigo-500/5"
                  )}>
                    <Icon className={cn("w-6 h-6", colorClass)} />
                  </div>
                  <h3 className="text-h4 font-display font-bold mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
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
