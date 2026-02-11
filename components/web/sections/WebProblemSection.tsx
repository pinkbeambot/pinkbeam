"use client";

import { AlertCircle, Zap, Eye, TrendingDown, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { FadeIn } from "@/components/animations";

const painPoints = [
  {
    icon: Zap,
    title: "Slow & Sluggish",
    headline: "Visitors Leave Before You Get a Chance",
    description: "A slow website isn't just annoying—it's costing you sales. Over 50% of visitors abandon sites that take more than 3 seconds to load.",
    color: "bg-violet-500",
  },
  {
    icon: AlertCircle,
    title: "Not Mobile-Friendly",
    headline: "Missing Half Your Customers",
    description: "70% of web traffic is mobile. If your site doesn't look great on phones, you're turning away money in your pocket.",
    color: "bg-purple-500",
  },
  {
    icon: Eye,
    title: "Invisible on Search",
    headline: "Buried Where No One Can Find You",
    description: "Beautiful or not, if Google doesn't see it, nobody finds you. You're losing customers to competitors who show up first.",
    color: "bg-blue-500",
  },
  {
    icon: TrendingDown,
    title: "Outdated Design",
    headline: "Losing Trust Before They Even Read",
    description: "A dated website screams 'we're not serious.' Visitors make split-second judgments. Bad design = lost credibility = zero conversions.",
    color: "bg-pink-500",
  },
  {
    icon: BarChart3,
    title: "No Way to Measure Success",
    headline: "Flying Blind on What Actually Works",
    description: "Without analytics, you're just guessing. You don't know which visitors convert, where they're coming from, or why they leave.",
    color: "bg-cyan-500",
  },
];

export function WebProblemSection() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Your Website Isn't{" "}
            <span className="text-gradient-beam">Working for You</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            If any of these sound familiar, you're leaving money on the table.
            Most websites never reach their potential.
          </p>
        </FadeIn>

        {/* Pain Point Cards - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
          {painPoints.map((point) => {
            const Icon = point.icon;
            return (
              <Card key={point.title} variant="elevated" className="group h-full hover:border-violet-500/30 transition-all duration-300">
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
