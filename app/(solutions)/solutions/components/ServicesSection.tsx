"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations";
import { 
  Lightbulb, 
  Cog, 
  Users, 
  ChartBar, 
  Rocket, 
  Shield,
  ArrowRight
} from "lucide-react";

const services = [
  {
    icon: Lightbulb,
    title: "AI Strategy",
    description: "Develop a comprehensive AI roadmap tailored to your business goals and competitive landscape.",
    href: "/solutions/services/ai-strategy",
    color: "from-amber-500 to-amber-400",
  },
  {
    icon: Cog,
    title: "Process Automation",
    description: "Identify and automate repetitive workflows to increase efficiency and reduce operational costs.",
    href: "/solutions/services/process-automation",
    color: "from-amber-400 to-amber-300",
  },
  {
    icon: Users,
    title: "Team Structure",
    description: "Design optimal organizational structures and team configurations for the AI era.",
    href: "/solutions/contact",
    color: "from-amber-500 to-amber-400",
  },
  {
    icon: ChartBar,
    title: "Growth Strategy",
    description: "Create data-driven growth strategies that leverage technology for scalable expansion.",
    href: "/solutions/services/growth-strategy",
    color: "from-amber-400 to-amber-300",
  },
  {
    icon: Rocket,
    title: "Digital Transformation",
    description: "Guide your organization through comprehensive digital transformation initiatives.",
    href: "/solutions/services/digital-transformation",
    color: "from-amber-500 to-amber-400",
  },
  {
    icon: Shield,
    title: "Technology Architecture",
    description: "Plan and prioritize technology investments aligned with business objectives.",
    href: "/solutions/services/technology-architecture",
    color: "from-amber-400 to-amber-300",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeIn className="text-center mb-16" direction="up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            What We Do
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Strategic Services for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Modern Business
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive consulting services designed to accelerate your digital transformation journey
          </p>
        </FadeIn>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <FadeIn key={service.title} delay={index * 0.1} direction="up">
              <Link href={service.href} className="block h-full">
                <motion.div
                  className="group relative p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-amber-500/30 transition-all duration-300 h-full"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Icon */}
                  <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20`}>
                    <service.icon className="w-6 h-6 text-foreground" />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-amber-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center text-sm text-amber-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
