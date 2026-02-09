import Link from "next/link";
import { Users, Globe, Code2, Lightbulb, ArrowRight } from "lucide-react";

const services = [
  {
    id: "agents",
    name: "Agents",
    description: "AI employees for your business — research, sales, support, content, and design.",
    icon: Users,
    href: "/agents",
    color: "from-pink-500 to-pink-600",
    badge: "Most Popular",
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

export function ServicesSection() {
  return (
    <section id="services" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Choose Your Path
          </h2>
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
              {service.badge && (
                <span className="absolute top-4 right-4 text-xs font-medium px-2 py-1 rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20">
                  {service.badge}
                </span>
              )}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}>
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2 group-hover:text-pink-500 transition-colors">
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
  );
}
