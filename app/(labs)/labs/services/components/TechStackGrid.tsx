"use client";

import { FadeIn, StaggerGrid } from "@/components/animations";

interface TechItem {
  name: string;
  description?: string;
  category?: string;
}

interface TechStackGridProps {
  technologies: TechItem[];
  columns?: 2 | 3 | 4;
}

export function TechStackGrid({ technologies, columns = 4 }: TechStackGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <StaggerGrid columns={columns} className={`gap-4 ${gridCols[columns]}`}>
      {technologies.map((tech) => (
        <div
          key={tech.name}
          className="p-4 rounded-xl border bg-card hover:border-cyan-500/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
              <span className="text-sm font-bold text-cyan-400">
                {tech.name.charAt(0)}
              </span>
            </div>
            <div>
              <h4 className="font-semibold">{tech.name}</h4>
              {tech.description && (
                <p className="text-xs text-muted-foreground">{tech.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </StaggerGrid>
  );
}

interface TechStackSectionProps {
  title: string;
  description: string;
  technologies: TechItem[];
}

export function TechStackSection({ title, description, technologies }: TechStackSectionProps) {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </FadeIn>

        <div className="max-w-5xl mx-auto">
          <TechStackGrid technologies={technologies} columns={4} />
        </div>
      </div>
    </section>
  );
}
