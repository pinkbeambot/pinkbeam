"use client";

import * as React from "react";
import Link from "next/link";
import { FadeIn, StaggerContainer } from "@/components/animations";
import { ArrowRight, LucideIcon } from "lucide-react";

interface RelatedService {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

interface RelatedServicesProps {
  services: RelatedService[];
  currentService: string;
  title?: string;
}

export function RelatedServices({
  services,
  currentService,
  title = "Explore Other Services",
}: RelatedServicesProps) {
  const otherServices = services.filter(
    (service) => service.title !== currentService
  );

  return (
    <section className="py-24 lg:py-32 bg-muted/30 border-y">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            More Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions designed to work together for maximum
            impact.
          </p>
        </FadeIn>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {otherServices.slice(0, 4).map((service, index) => (
            <Link
              key={index}
              href={service.href}
              className="group p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 hover:bg-card transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <service.icon className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-amber-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {service.description}
              </p>
              <div className="flex items-center text-sm text-amber-500 font-medium">
                Learn more
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
