"use client";

import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/animations/FadeIn";

interface TeamCardProps {
  name: string;
  role: string;
  description: string;
  color?: string;
  delay?: number;
}

export function TeamCard({ name, role, description, color = "bg-pink-500", delay = 0 }: TeamCardProps) {
  // Generate initials from name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <FadeIn delay={delay} direction="up" once>
      <div className="group relative bg-card border border-border rounded-xl p-6 hover:border-pink-500/30 transition-all duration-300 hover:shadow-beam">
        {/* Avatar Placeholder */}
        <div className="mb-4">
          <div
            className={cn(
              "w-16 h-16 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg shadow-lg",
              color
            )}
          >
            {initials}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h3 className="font-display font-semibold text-lg text-foreground">
            {name}
          </h3>
          <p className="text-sm font-medium text-pink-500">{role}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Decorative glow on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </FadeIn>
  );
}

export default TeamCard;
