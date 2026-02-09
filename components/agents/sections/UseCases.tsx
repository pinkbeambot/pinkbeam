"use client";

import { Rocket, Building2, Building, User, Briefcase, Settings, Megaphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { StaggerContainer, FadeIn } from "@/components/animations";

const industryUseCases = [
  {
    icon: Rocket,
    title: "Startups",
    headline: "Move Faster with Less Burn",
    description: "Launch, iterate, and scale without hiring a 20-person team. One AI employee costs less than a single contractor—and works 10x faster.",
    color: "bg-pink-500",
  },
  {
    icon: Building2,
    title: "Agencies",
    headline: "Deliver More Without Hiring More",
    description: "Handle 3x the client load without expanding headcount. Your AI team drafts, designs, and researches—your humans just review and refine.",
    color: "bg-accent-purple",
  },
  {
    icon: Building,
    title: "Enterprise",
    headline: "Automate the Work That Slips Through Cracks",
    description: "Supplement your existing team with AI employees that handle overflow, after-hours coverage, and repetitive tasks humans shouldn't touch.",
    color: "bg-accent-indigo",
  },
];

const roleUseCases = [
  {
    icon: User,
    title: "For Founders",
    headline: "Get Your Time Back",
    description: "Stop doing $15/hour work. Your AI employees handle research, outreach, and support so you can focus on product, strategy, and fundraising.",
    color: "bg-accent-cyan",
  },
  {
    icon: Briefcase,
    title: "For Sales Leaders",
    headline: "Build Pipeline on Autopilot",
    description: "Your AI SDR works 24/7 identifying prospects, personalizing outreach, and booking meetings. Your human closers just show up and sell.",
    color: "bg-accent-amber",
  },
  {
    icon: Settings,
    title: "For Ops Leaders",
    headline: "Scale Without the Headcount Chaos",
    description: "Add capacity instantly without the recruiting, onboarding, and management overhead. Scale up during busy seasons. Scale down when you need to.",
    color: "bg-pink-400",
  },
  {
    icon: Megaphone,
    title: "For Marketing Leaders",
    headline: "Publish Consistently, Finally",
    description: "Your AI content team produces weekly blogs, daily social posts, and ongoing email campaigns—without the freelancer hunt or agency fees.",
    color: "bg-pink-500",
  },
];

export function UseCases() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Who Is Pink Beam{" "}
            <span className="text-gradient-beam">For</span>?
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Whether you're a solo founder or leading a team, our AI employees 
            adapt to your needs and deliver results.
          </p>
        </FadeIn>

        {/* Industry Verticals */}
        <div className="mb-20">
          <FadeIn>
            <h3 className="text-h4 font-display font-semibold text-center mb-8">
              By Industry
            </h3>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industryUseCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <Card key={useCase.title} variant="elevated" className="group h-full">
                  <CardContent className="pt-6 flex flex-col h-full">
                    <div className={`${useCase.color} w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-h4 font-display font-semibold mb-2">
                      {useCase.headline}
                    </h4>
                    <p className="text-body text-muted-foreground flex-1">
                      {useCase.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Role-Based Use Cases */}
        <div>
          <FadeIn>
            <h3 className="text-h4 font-display font-semibold text-center mb-8">
              By Role
            </h3>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roleUseCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <Card key={useCase.title} variant="outlined" className="group h-full">
                  <CardContent className="pt-6 flex flex-col h-full">
                    <div className={`${useCase.color} w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-h4 font-display font-semibold mb-2 text-base">
                      {useCase.headline}
                    </h4>
                    <p className="text-small text-muted-foreground flex-1">
                      {useCase.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
