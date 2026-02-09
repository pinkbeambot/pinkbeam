"use client";

import { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function ValueCard({ icon: Icon, title, description, delay = 0 }: ValueCardProps) {
  return (
    <FadeIn delay={delay} direction="up" once>
      <div className="group relative bg-card border border-border rounded-xl p-6 hover:border-pink-500/30 transition-all duration-300">
        {/* Icon */}
        <div className="mb-4">
          <div className="w-12 h-12 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
            <Icon className="w-6 h-6 text-pink-500" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="font-display font-semibold text-lg text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </FadeIn>
  );
}

export default ValueCard;
