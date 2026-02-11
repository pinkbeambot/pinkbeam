"use client";

import { FadeIn } from "@/components/animations";

const techCategories = [
  {
    category: "Frontend",
    techs: ["React", "Next.js 15", "TypeScript", "Tailwind CSS"],
  },
  {
    category: "Backend",
    techs: ["Node.js", "Python", "PostgreSQL", "Prisma ORM"],
  },
  {
    category: "DevOps & Infrastructure",
    techs: ["AWS", "Docker", "GitHub Actions", "Vercel"],
  },
  {
    category: "AI & ML",
    techs: ["OpenAI APIs", "Claude", "Anthropic SDK", "LangChain"],
  },
  {
    category: "Testing & Quality",
    techs: ["Vitest", "Playwright", "ESLint", "TypeScript"],
  },
  {
    category: "Mobile",
    techs: ["React Native", "Flutter", "Expo", "Swift"],
  },
];

export function LabsTechnologyStack() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Modern Tech Stack, <span className="text-gradient-cyan">Battle-Tested</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            We use industry-standard technologies that scale. Future-proof your
            investment with tools built for production.
          </p>
        </FadeIn>

        {/* Tech Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCategories.map((category, idx) => (
            <FadeIn key={category.category} delay={0.05 + idx * 0.05}>
              <div className="p-6 rounded-xl border border-cyan-500/20 bg-card hover:border-cyan-500/40 transition-colors">
                <h3 className="text-h4 font-display font-bold text-foreground mb-4">
                  {category.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.techs.map((tech) => (
                    <div
                      key={tech}
                      className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium border border-cyan-500/20 hover:border-cyan-500/40 transition-colors"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Bottom message */}
        <FadeIn delay={0.3} className="mt-12 p-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
          <p className="text-center text-body text-muted-foreground">
            Not seeing your preferred tech stack? No problem. We're language and
            framework agnostic. If it solves the problem, we'll build with it.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
