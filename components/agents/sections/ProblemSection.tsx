"use client";

import { Search, Users, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { StaggerContainer } from "@/components/animations";
import { FadeIn } from "@/components/animations";

const painPoints = [
  {
    icon: Search,
    title: "The Research Black Hole",
    headline: "Drowning in Information",
    description: "You're supposed to make strategic decisions, but you're stuck reading 47-page market reports, hunting through competitor pricing, and manually tracking industry news. By the time you've finished researching, the opportunity's gone.",
    color: "bg-pink-500",
  },
  {
    icon: Users,
    title: "The Sales Time Sink",
    headline: "Sales Outreach That Never Ends",
    description: "You know you should be prospecting, but crafting 50 personalized emails takes 4 hours you don't have. So you push it off. And your pipeline dries up. Again.",
    color: "bg-accent-purple",
  },
  {
    icon: Headphones,
    title: "The Support Trap",
    headline: "Tickets That Multiply Overnight",
    description: "Every morning starts with 30+ support requests. Password resets, feature questions, refund requests. You're paying yourself founder salary to do $15/hour work.",
    color: "bg-accent-cyan",
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            You're Doing Work You{" "}
            <span className="text-gradient-beam">Shouldn't</span> Be Doing
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Most founders spend 60% of their time on tasks that don't move the needle. 
            Here's what's actually eating your days:
          </p>
        </FadeIn>

        {/* Pain Point Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {painPoints.map((point) => {
            const Icon = point.icon;
            return (
              <Card key={point.title} variant="elevated" className="group h-full">
                <CardContent className="pt-6 flex flex-col h-full">
                  {/* Icon */}
                  <div className={`${point.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <p className="text-caption text-muted-foreground mb-2">
                    {point.title}
                  </p>
                  <h3 className="text-h4 font-display font-semibold mb-4">
                    {point.headline}
                  </h3>
                  <p className="text-body text-muted-foreground flex-1">
                    {point.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
