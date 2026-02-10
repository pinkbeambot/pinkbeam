"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, TrendingUp, MapPin, FileText, BarChart3, Globe } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { WebHero } from "../components/WebHero";

const seoServices = [
  {
    icon: Search,
    title: "Technical SEO",
    description: "Site architecture, page speed, mobile optimization, and crawlability fixes.",
  },
  {
    icon: FileText,
    title: "Content Strategy",
    description: "Keyword research, content planning, and optimization for search intent.",
  },
  {
    icon: MapPin,
    title: "Local SEO",
    description: "Google Business Profile optimization, local citations, and review management.",
  },
  {
    icon: TrendingUp,
    title: "Link Building",
    description: "Quality backlinks through outreach, content marketing, and PR.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Monthly reports tracking rankings, traffic, and conversions.",
  },
  {
    icon: Globe,
    title: "Competitor Analysis",
    description: "Deep dives into what your competitors are doing and how to beat them.",
  },
];

const seoProcess = [
  {
    step: "01",
    title: "Audit",
    description: "Comprehensive technical and content audit to identify opportunities.",
  },
  {
    step: "02",
    title: "Strategy",
    description: "Custom SEO roadmap based on your goals, competitors, and market.",
  },
  {
    step: "03",
    title: "Optimization",
    description: "Implement on-page fixes, content improvements, and technical updates.",
  },
  {
    step: "04",
    title: "Content",
    description: "Create and optimize content that ranks and converts.",
  },
  {
    step: "05",
    title: "Monitor",
    description: "Track rankings, traffic, and adjust strategy based on data.",
  },
];

const faqs = [
  {
    question: "How long until I see SEO results?",
    answer: "Most clients see initial improvements in 2-3 months, with significant results around 6 months. SEO is a long-term investment that compounds over time.",
  },
  {
    question: "Do you guarantee first page rankings?",
    answer: "No one can guarantee specific rankings, and you should be wary of anyone who does. We guarantee best practices, transparent reporting, and continuous improvement based on data.",
  },
  {
    question: "What SEO tools do you use?",
    answer: "We use industry-standard tools including Ahrefs, SEMrush, Screaming Frog, and Google Search Console. We also build custom dashboards for client reporting.",
  },
  {
    question: "Is SEO included with web design?",
    answer: "Basic on-page SEO is included with all our web design packages. For ongoing SEO services, we offer separate monthly retainer packages.",
  },
];

export function SEOPageClient() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <WebHero />

      {/* Overview */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">SEO Services</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Rank Higher, Get Found
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Technical SEO, content strategy, and ongoing optimization to drive 
              organic traffic and grow your business.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-violet-500 to-violet-600" asChild>
              <Link href="/contact">
                Get SEO Audit
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 lg:py-32 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What we do</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive SEO services to improve your visibility
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {seoServices.map((service, index) => (
              <FadeIn key={service.title} delay={index * 0.1} direction="up">
                <div className="group p-6 rounded-2xl border bg-card h-full hover:shadow-lg hover:border-violet-500/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                    <service.icon className="w-6 h-6 text-violet-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-32 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our SEO process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Data-driven approach to improving your rankings
            </p>
          </FadeIn>

          <div className="max-w-4xl mx-auto">
            {seoProcess.map((item, index) => (
              <FadeIn key={item.step} delay={index * 0.1} direction="up">
                <div className="flex gap-6 mb-10 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-violet-500">{item.step}</span>
                    </div>
                    {index < seoProcess.length - 1 && (
                      <div className="w-px h-full bg-border mt-4" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-32 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Common questions</h2>
          </FadeIn>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="p-6 rounded-xl border bg-card">
                  <h3 className="font-bold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center" direction="up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to improve your rankings?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Get a free SEO audit and discover opportunities to grow your organic traffic.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-violet-500 to-violet-600" asChild>
              <Link href="/contact">
                Request Free Audit
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
