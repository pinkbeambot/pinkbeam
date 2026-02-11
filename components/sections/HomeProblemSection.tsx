"use client";

import { TrendingDown, Users, Clock, Zap, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { FadeIn } from "@/components/animations";

const painPoints = [
  {
    icon: Users,
    title: "Hiring Nightmare",
    headline: "Finding talent is slow and expensive",
    description: "Recruiting takes months and costs tens of thousands. You need skilled people yesterday, not next quarter.",
    color: "bg-pink-500",
  },
  {
    icon: Clock,
    title: "Time Killer",
    headline: "Drowning in repetitive work",
    description: "Your team spends 60% of their time on tasks that don't move the needle. Emails, data entry, manual processes.",
    color: "bg-violet-500",
  },
  {
    icon: Zap,
    title: "Scaling Pains",
    headline: "Growth means hiring more people",
    description: "Every time you scale, quality drops, costs skyrocket, and complexity explodes. There has to be a better way.",
    color: "bg-cyan-500",
  },
  {
    icon: Target,
    title: "Tech Debt",
    headline: "Your systems can't keep up",
    description: "Custom software takes months and hundreds of thousands. Your website doesn't convert. You're stuck with outdated tools.",
    color: "bg-amber-500",
  },
  {
    icon: TrendingDown,
    title: "Market Pressure",
    headline: "Competitors are moving faster",
    description: "Your rival launched a feature in days. You're still planning. They're hiring at scale. You're stuck.",
    color: "bg-pink-400",
  },
];

export function HomeProblemSection() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Every Business Faces the Same{" "}
            <span className="text-gradient-beam">Challenges</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            You're trying to scale without burning out, grow without exploding costs,
            and ship faster than your competitors. Sound familiar?
          </p>
        </FadeIn>

        {/* Pain Point Cards - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
          {painPoints.map((point) => {
            const Icon = point.icon;
            return (
              <Card key={point.title} variant="elevated" className="group h-full hover:border-pink-500/30 transition-all duration-300">
                <CardContent className="p-5 flex flex-col h-full">
                  {/* Icon */}
                  <div className={`${point.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <p className="text-xs text-muted-foreground mb-2 font-medium">
                    {point.title}
                  </p>
                  <h3 className="text-sm font-display font-semibold mb-3 text-foreground leading-snug">
                    {point.headline}
                  </h3>
                  <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
                    {point.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
