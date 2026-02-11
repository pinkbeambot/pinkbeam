"use client";

import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/utils";

interface EmployeeVALISQuoteProps {
  quote: string;
  colorClass: string; // e.g., "border-pink-500/30 bg-pink-500/5 text-pink-400"
}

export function EmployeeVALISQuote({ quote, colorClass }: EmployeeVALISQuoteProps) {
  const borderColorClass = colorClass.split(" ")[0]; // Extract border color
  const bgColorClass = colorClass.split(" ")[1]; // Extract bg color
  const textColorClass = colorClass.split(" ")[2]; // Extract text color

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className={cn(
            "p-6 md:p-8 rounded-xl border",
            borderColorClass,
            bgColorClass
          )}>
            <p className={cn("text-lg md:text-xl italic mb-3", textColorClass)}>
              &quot;{quote}&quot;
            </p>
            <p className="text-sm text-muted-foreground">— VALIS</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
