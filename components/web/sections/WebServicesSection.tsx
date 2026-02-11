"use client";

import Link from "next/link";
import { Palette, Code, Search, BarChart3, PenTool, Wrench, Check, ArrowRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { FadeIn } from "@/components/animations";

const servicesTabs = [
  {
    id: "design",
    label: "Design",
    icon: Palette,
    title: "Website Design",
    description: "Custom designs that convert",
    capabilities: [
      "Custom Design: Unique designs tailored to your brand identity and goals",
      "Responsive Design: Perfect on desktop, tablet, and mobile devices",
      "User Experience: Intuitive navigation that guides visitors to conversion",
      "Brand Integration: Your brand voice, colors, and messaging throughout",
      "Accessibility: Built with accessibility standards so everyone can use it",
    ],
    color: "bg-violet-500",
  },
  {
    id: "development",
    label: "Development",
    icon: Code,
    title: "Web Development",
    description: "Fast, reliable, scalable",
    capabilities: [
      "Modern Tech Stack: Built with Next.js, React, and latest frameworks",
      "Performance: Pages load in under 2 seconds, fully optimized",
      "Security: SSL, regular updates, and security best practices",
      "Scalability: Built to handle growth without slowing down",
      "Maintenance-Ready: Clean code structure that's easy to maintain",
    ],
    color: "bg-blue-500",
  },
  {
    id: "seo",
    label: "SEO",
    icon: Search,
    title: "SEO Optimization",
    description: "Rank higher, get found",
    capabilities: [
      "Technical SEO: Site structure, speed, and Core Web Vitals optimization",
      "Content Strategy: Keyword research and content planning",
      "On-Page SEO: Meta tags, headers, and structured data implementation",
      "Link Building: Strategic linking to improve domain authority",
      "Analytics & Reporting: Monthly reports tracking your progress",
    ],
    color: "bg-cyan-500",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    title: "Analytics & Tracking",
    description: "Know what actually works",
    capabilities: [
      "Google Analytics Setup: Full implementation with custom dashboards",
      "Conversion Tracking: Know which actions lead to sales",
      "Heat Mapping: See where visitors click and what they avoid",
      "User Flow Analysis: Understand the customer journey end-to-end",
      "Monthly Reports: Actionable insights to improve performance",
    ],
    color: "bg-pink-500",
  },
  {
    id: "content",
    label: "Content",
    icon: PenTool,
    title: "Content Updates",
    description: "Keep it fresh & engaging",
    capabilities: [
      "Regular Updates: Keep your site content fresh and accurate",
      "Blog Management: Planning, writing, and publishing blog posts",
      "Copywriting: Compelling copy that drives conversions",
      "Multimedia: Photos, videos, and graphics optimized for web",
      "SEO Content: Every piece optimized for search engines",
    ],
    color: "bg-purple-500",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: Wrench,
    title: "Maintenance & Support",
    description: "Always available, always secure",
    capabilities: [
      "Security Updates: Regular patches and security monitoring",
      "Performance Monitoring: We keep an eye on speed and uptime",
      "Backup Management: Daily backups in case anything goes wrong",
      "Priority Support: Fast response when issues arise",
      "Peace of Mind: We handle the technical stuff so you don't have to",
    ],
    color: "bg-amber-500",
  },
];

export function WebServicesSection() {
  return (
    <section className="py-20 md:py-32 bg-surface-sunken">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-12">
          <h2 className="text-h2 font-display font-bold mb-4">
            What We Deliver,{" "}
            <span className="text-gradient-beam">In Detail</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            From design to launch to ongoing support—we handle every aspect
            of building a website that converts.
          </p>
        </FadeIn>

        {/* Tabs */}
        <FadeIn delay={0.1}>
          <Tabs defaultValue="design" className="w-full">
            <TabsList className="w-full flex flex-wrap justify-center h-auto gap-2 bg-transparent mb-8">
              {servicesTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-surface-elevated data-[state=active]:border-violet-500/30 data-[state=active]:shadow-sm border border-transparent rounded-lg"
                  >
                    <div className={`${tab.color} w-6 h-6 rounded-md flex items-center justify-center`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-display font-medium">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {servicesTabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="bg-surface-elevated rounded-xl p-6 md:p-8 border border-border"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left: Service Info */}
                  <div className="md:w-1/3">
                    <div className={`${tab.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4`}>
                      <tab.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-h3 font-display font-bold mb-2">{tab.title}</h3>
                    <p className="text-body text-violet-500 font-medium mb-6">{tab.description}</p>
                    <Link href="/web/quote">
                      <Button variant="beam" size="sm" className="w-full group">
                        Get a Quote
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>

                  {/* Right: Capabilities */}
                  <div className="md:w-2/3">
                    <h4 className="text-small font-display font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                      Key Services
                    </h4>
                    <ul className="space-y-4">
                      {tab.capabilities.map((capability, index) => {
                        const [title, description] = capability.split(": ");
                        return (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-violet-500" />
                            </div>
                            <div>
                              <span className="font-medium text-foreground">{title}:</span>{" "}
                              <span className="text-muted-foreground">{description}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </FadeIn>
      </div>
    </section>
  );
}
