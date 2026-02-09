"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CapabilityCardProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description: string;
  className?: string;
}

export function CapabilityCard({
  icon: Icon,
  iconColor = "bg-pink-500",
  title,
  description,
  className,
}: CapabilityCardProps) {
  return (
    <div className={cn("group p-6 bg-surface-elevated rounded-xl border border-border hover:border-pink-500/30 transition-all hover:shadow-lg", className)}>
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", iconColor)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-h4 font-display font-semibold mb-2">{title}</h3>
      <p className="text-body text-muted-foreground">{description}</p>
    </div>
  );
}
