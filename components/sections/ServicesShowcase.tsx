"use client";

import Link from "next/link";
import { Zap, Code, Lightbulb, Briefcase, ArrowRight, Check, Badge as BadgeIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { Button, Badge } from "@/components/ui";
import { FadeIn } from "@/components/animations";

const services = [
  {
    id: "agents",
    name: "AI Employees",
    icon: Zap,
    description: "Hire autonomous AI employees that work 24/7",
    features: [
      "Research, sales, support, content & design",
      "Work around the clock, no time off",
      "Learn and improve from your feedback",
      "Perfect for scaling without hiring",
      "Start from $500/month",
    ],
    color: "bg-pink-500",
    textColor: "text-pink-500",
    borderColor: "border-pink-500/50",
    href: "/agents",
    featured: true,
  },
  {
    id: "web",
    name: "Custom Websites",
    icon: Code,
    description: "High-performance websites that convert",
    features: [
      "Design, development, SEO & launch",
      "Built for speed and conversions",
      "Includes ongoing maintenance plans",
      "ROI calculator & pricing transparency",
      "From $2,000",
    ],
    color: "bg-violet-500",
    textColor: "text-violet-500",
    borderColor: "border-violet-500/50",
    href: "/web",
    featured: false,
  },
  {
    id: "labs",
    name: "Custom Software",
    icon: Lightbulb,
    description: "Purpose-built software for your business",
    features: [
      "Full-stack web & mobile apps",
      "APIs, integrations & automations",
      "Scalable architecture from day one",
      "Ongoing support & updates",
      "Custom pricing",
    ],
    color: "bg-cyan-500",
    textColor: "text-cyan-500",
    borderColor: "border-cyan-500/50",
    href: "/labs",
    featured: false,
  },
  {
    id: "solutions",
    name: "Strategic Consulting",
    icon: Briefcase,
    description: "Expert guidance on scaling your business",
    features: [
      "Operational & technical strategy",
      "Process optimization",
      "Team building & training",
      "Growth roadmap development",
      "Hourly consulting rates",
    ],
    color: "bg-amber-500",
    textColor: "text-amber-500",
    borderColor: "border-amber-500/50",
    href: "/solutions",
    featured: false,
  },
];

export function ServicesShowcase() {
  const featuredService = services.find((s) => s.featured);
  const otherServices = services.filter((s) => !s.featured);

  return (
    <section id="services" className="py-20 md:py-32 bg-surface-sunken">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Complete Solutions,{" "}
            <span className="text-gradient-beam">Your Way</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Choose what you need. Use them together. Build your entire operation on one platform.
          </p>
        </FadeIn>

        {/* Featured Service (Agents) */}
        {featuredService && (
          <FadeIn delay={0.05} className="mb-12">
            <Link href={featuredService.href}>
              <div className={`group relative p-8 md:p-12 rounded-2xl border-2 ${featuredService.borderColor} bg-gradient-to-br from-pink-500/5 to-pink-600/5 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer`}>
                <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                  {/* Left: Icon and Title */}
                  <div className="md:w-1/3">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-xl ${featuredService.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <featuredService.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="mb-6">
                      <Badge className="bg-pink-500/20 text-pink-600 border-pink-500/30 mb-4">
                        Most Popular
                      </Badge>
                      <h3 className="text-h3 font-display font-bold text-foreground mb-2">
                        {featuredService.name}
                      </h3>
                      <p className="text-body text-pink-500 font-medium">
                        {featuredService.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Features */}
                  <div className="md:w-2/3">
                    <ul className="space-y-3 mb-8">
                      {featuredService.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                          <span className="text-body text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:opacity-90 group" asChild>
                      <span>
                        Hire AI Employees
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </FadeIn>
        )}

        {/* Other Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {otherServices.map((service, idx) => (
            <FadeIn key={service.id} delay={0.1 + idx * 0.05}>
              <Link href={service.href}>
                <Card variant="elevated" className={`group h-full border-2 ${service.borderColor} hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer`}>
                  <CardContent className="p-6 md:p-8 flex flex-col h-full">
                    {/* Icon */}
                    <div className={`${service.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-h4 font-display font-bold text-foreground mb-2">
                      {service.name}
                    </h3>
                    <p className={`text-sm font-medium ${service.textColor} mb-6`}>
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-8 flex-1">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Check className={`w-4 h-4 ${service.textColor} shrink-0 mt-0.5`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button variant="outline" className={`w-full border-current ${service.textColor} hover:bg-current/10`} asChild>
                      <span>
                        Explore
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
