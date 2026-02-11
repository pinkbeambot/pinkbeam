"use client";

import * as React from "react";
import { FadeIn, StaggerContainer } from "@/components/animations";
import { Check, FileText, Lightbulb, Presentation, Users } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Deliverable {
  icon?: LucideIcon;
  title: string;
  description: string;
}

interface DeliverablesListProps {
  deliverables: Deliverable[];
  title?: string;
  description?: string;
}

const defaultIcon = FileText;

export function DeliverablesList({
  deliverables,
  title = "What You Get",
  description = "Comprehensive deliverables designed to drive immediate impact and long-term success.",
}: DeliverablesListProps) {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            Deliverables
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </FadeIn>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {deliverables.map((item, index) => {
            const Icon = item.icon || defaultIcon;
            return (
              <div
                key={index}
                className="group p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 hover:bg-card transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
