"use client";

import { FadeIn } from "@/components/animations";

interface Integration {
  name: string;
  icon: string;
}

interface IntegrationShowcaseProps {
  title: string;
  description: string;
  integrations: Integration[];
}

export function IntegrationShowcase({
  title,
  description,
  integrations,
}: IntegrationShowcaseProps) {
  return (
    <section className="py-16 bg-surface-sunken">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-10">
          <h3 className="text-h3 font-display font-bold mb-2">{title}</h3>
          <p className="text-body text-muted-foreground">{description}</p>
        </FadeIn>
        
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-3 bg-surface-elevated rounded-full border border-border hover:border-pink-500/30 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <span className="text-pink-500 font-display font-bold text-sm">
                    {integration.icon}
                  </span>
                </div>
                <span className="font-medium text-foreground">{integration.name}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
