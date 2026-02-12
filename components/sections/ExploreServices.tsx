"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/animations";
import { ArrowRight, Zap, Code, Briefcase, Globe } from "lucide-react";

const allServices = [
  {
    slug: "agents",
    name: "AI Employees",
    description: "Hire AI workers for research, sales, support, content, and design",
    icon: Zap,
    color: "pink",
  },
  {
    slug: "web",
    name: "Web Services",
    description: "Professional websites, design, and maintenance",
    icon: Globe,
    color: "violet",
  },
  {
    slug: "labs",
    name: "Custom Software",
    description: "Web apps, mobile apps, AI/ML solutions, and APIs",
    icon: Code,
    color: "cyan",
  },
  {
    slug: "solutions",
    name: "Strategic Consulting",
    description: "AI strategy, digital transformation, and technology advisory",
    icon: Briefcase,
    color: "amber",
  },
];

interface ExploreServicesProps {
  currentService: "agents" | "web" | "labs" | "solutions";
}

export function ExploreServices({ currentService }: ExploreServicesProps) {
  const otherServices = allServices.filter((s) => s.slug !== currentService);

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-h2 font-display font-bold mb-4">
            Explore Our Other Services
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Pink Beam offers a complete suite of AI and technology solutions to help your business grow.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <FadeIn key={service.slug} delay={index * 0.1}>
                <Card className="p-6 h-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-lg bg-${service.color}-500/10 flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 text-${service.color}-500`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <Button variant="ghost" className="group-hover:translate-x-1 transition-transform" asChild>
                    <Link href={`/${service.slug}`}>
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
