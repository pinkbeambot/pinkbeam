import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  OrganizationSchema,
  WebPageSchema,
} from "@/components/seo/StructuredData";
import { Users, Globe, Code2, Lightbulb, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Pink Beam — AI-Powered Business Solutions",
  description:
    "Pink Beam offers AI employees, website services, custom software development, and strategic consulting. Build your AI workforce or hire experts.",
  alternates: {
    canonical: "https://pinkbeam.io/",
  },
};

const services = [
  {
    id: "agents",
    name: "Agents",
    description: "AI employees for your business — research, sales, support, content, and design.",
    icon: Users,
    href: "/agents",
    color: "from-pink-500 to-pink-600",
    features: ["Sarah (Research)", "Mike (Sales)", "Alex (Support)", "Casey (Content)", "Lumen (Design)"],
  },
  {
    id: "web",
    name: "Web",
    description: "High-performance websites, SEO optimization, and ongoing maintenance.",
    icon: Globe,
    href: "/web",
    color: "from-violet-500 to-violet-600",
    features: ["Custom Design", "SEO Optimization", "Performance Tuning", "Analytics Setup"],
  },
  {
    id: "labs",
    name: "Labs",
    description: "Custom software development for startups and enterprises.",
    icon: Code2,
    href: "/labs",
    color: "from-cyan-500 to-cyan-600",
    features: ["Web Applications", "Mobile Apps", "APIs & Integrations", "AI Solutions"],
  },
  {
    id: "solutions",
    name: "Solutions",
    description: "Strategic consulting for digital transformation and AI adoption.",
    icon: Lightbulb,
    href: "/solutions",
    color: "from-amber-500 to-amber-600",
    features: ["Digital Strategy", "AI Consulting", "Process Automation", "Growth Planning"],
  },
];

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <WebPageSchema
        title="Pink Beam — AI-Powered Business Solutions"
        description="Pink Beam offers AI employees, website services, custom software development, and strategic consulting."
        url="https://pinkbeam.io/"
      />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 via-transparent to-transparent" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="text-gradient-beam">Pink Beam</span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground mb-4">
                AI-powered solutions for modern businesses
              </p>
              <p className="text-lg text-muted-foreground/80 mb-10 max-w-2xl mx-auto">
                Hire AI employees, build high-performance websites, develop custom software, 
                or get strategic consulting. One platform, infinite possibilities.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Choose Your Path</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Each Pink Beam service is designed to help you scale faster and work smarter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={service.href}
                  className="group relative p-6 lg:p-8 rounded-2xl border bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-pink-500 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-1 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="text-sm text-muted-foreground/80 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-pink-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center text-pink-500 font-medium">
                    Explore {service.name}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-32 border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of businesses using Pink Beam to scale their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-beam hover:opacity-90">
                <Link href="/agents">Explore AI Employees</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
