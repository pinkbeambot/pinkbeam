"use client";

import { Rocket, Building2, Building, User, Briefcase, Settings, Megaphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

const industryUseCases = [
  {
    icon: Rocket,
    title: "Startups",
    headline: "Move Faster with Less Burn",
    description: "$397/month per AI employee vs $5-8k/month for hiring. Pre-seed to Series A founders use Pink Beam to validate ideas, generate leads, and launch products without the payroll overhead.",
    color: "bg-pink-500",
  },
  {
    icon: Building2,
    title: "Agencies",
    headline: "Deliver More Without Hiring More",
    description: "Web agencies, design firms, and consultancies handle 2-3x client load while maintaining margins. AI handles research, drafting, and design—your team reviews and refines the output.",
    color: "bg-accent-purple",
  },
  {
    icon: Building,
    title: "Enterprise",
    headline: "Automate the Work That Slips Through Cracks",
    description: "Mid-market and enterprise teams use Pink Beam for support overflow, after-hours coverage, data processing, and repetitive tasks. Reduce support tickets by 40%, improve response times, no additional hiring.",
    color: "bg-accent-indigo",
  },
];

const roleUseCases = [
  {
    icon: User,
    title: "For Founders",
    headline: "Get Your Time Back",
    description: "Automate customer research, competitive analysis, email responses, and documentation. Reclaim 20+ hours/week for product and strategy instead of admin work.",
    color: "bg-accent-cyan",
  },
  {
    icon: Briefcase,
    title: "For Sales Leaders",
    headline: "Build Pipeline on Autopilot",
    description: "AI prospecting, personalized outreach, and meeting scheduling 24/7. Close higher-value deals while reps focus on selling. Typical: 2-3x more qualified leads.",
    color: "bg-accent-amber",
  },
  {
    icon: Settings,
    title: "For Ops Leaders",
    headline: "Scale Without the Headcount Chaos",
    description: "Automate scheduling, data entry, process documentation, and vendor management. Add 3-5 FTE capacity in days, not months. Adjust staffing in real-time without hiring cycles.",
    color: "bg-pink-400",
  },
  {
    icon: Megaphone,
    title: "For Marketing Leaders",
    headline: "Publish Consistently, Finally",
    description: "Weekly blog posts, daily social content, and email campaigns generated and scheduled automatically. Maintain consistency without the freelancer drama or $10k/month agency fees.",
    color: "bg-pink-500",
  },
];

export function WhoIsPinkBeamFor() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Who Is Pink Beam{" "}
            <span className="text-gradient-beam">For</span>?
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Whether you're a solo founder or leading a team, Pink Beam solutions
            adapt to your needs and deliver results.
          </p>
        </div>

        {/* Industry Verticals */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-h4 font-display font-semibold">
              By Industry
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>
        </div>

        {/* Role-Based Use Cases */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-h4 font-display font-semibold">
              By Role
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </div>
        </div>
      </div>
    </section>
  );
}
