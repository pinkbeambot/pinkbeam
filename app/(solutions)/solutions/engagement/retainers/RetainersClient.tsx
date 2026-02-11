"use client";

import { motion } from "framer-motion";
import { FadeIn, StaggerContainer } from "@/components/animations";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  Clock,
  Check,
  MessageSquare,
  Target,
  Lightbulb,
  Shield,
  Zap,
  Briefcase,
  BarChart3,
  Award,
  ChevronDown,
} from "lucide-react";

const retainerTiers = [
  {
    name: "Advisory",
    hours: "10 hrs/month",
    price: "$5,000",
    period: "/month",
    description: "Strategic guidance and advisory for organizations with internal execution capability",
    responseTime: "48-hour response",
    features: [
      "Monthly strategy session (2 hrs)",
      "Email & Slack support",
      "Quarterly business reviews",
      "Technology roadmap reviews",
      "Vendor evaluation support",
      "Best practices guidance",
    ],
    activities: [
      "Architecture reviews",
      "Technology decisions",
      "Team structure advice",
      "Risk assessments",
      "Strategic planning",
    ],
    ideal: "Startups, small teams, or companies with strong internal technical teams who need periodic strategic guidance",
  },
  {
    name: "Active",
    hours: "20 hrs/month",
    price: "$10,000",
    period: "/month",
    description: "Hands-on involvement for organizations needing regular support with implementation",
    responseTime: "24-hour response",
    features: [
      "Bi-weekly working sessions",
      "Priority Slack support",
      "Monthly business reviews",
      "Hands-on implementation help",
      "Vendor management",
      "Team mentoring",
      "Documentation review",
    ],
    activities: [
      "Architecture design",
      "Code reviews",
      "Process implementation",
      "Vendor negotiations",
      "Team coaching",
      "Project oversight",
    ],
    ideal: "Growing companies scaling their technology, managing multiple initiatives, or filling a temporary leadership gap",
    popular: true,
  },
  {
    name: "Embedded",
    hours: "40 hrs/month",
    price: "$20,000",
    period: "/month",
    description: "Dedicated fractional CTO/CIO for organizations needing near full-time leadership",
    responseTime: "Same-day response",
    features: [
      "Weekly dedicated time",
      "Dedicated Slack channel",
      "Weekly business reviews",
      "Direct team management",
      "Full vendor oversight",
      "Hands-on execution",
      "Board/advisor reporting",
    ],
    activities: [
      "Full tech leadership",
      "Team hiring & management",
      "Strategic execution",
      "Board presentations",
      "Investor relations",
      "Operational oversight",
    ],
    ideal: "Companies in transition, scaling rapidly, or without internal technical leadership who need executive-level technology direction",
  },
];

const includedInAllTiers = [
  {
    icon: MessageSquare,
    title: "Direct Access",
    description: "Direct communication with your dedicated advisor via Slack, email, and scheduled calls",
  },
  {
    icon: Clock,
    title: "Committed Response Times",
    description: "Guaranteed response times based on your tier, with escalation paths for urgent issues",
  },
  {
    icon: Briefcase,
    title: "Flexible Time Allocation",
    description: "Use your hours how you need them—strategy sessions, implementation help, or team coaching",
  },
  {
    icon: BarChart3,
    title: "Regular Reviews",
    description: "Structured check-ins to review progress, adjust priorities, and plan upcoming work",
  },
  {
    icon: Shield,
    title: "Knowledge Transfer",
    description: "Documentation and training to build your team's capabilities over time",
  },
  {
    icon: Award,
    title: "No Long-Term Lock-in",
    description: "Month-to-month agreements with 30-day notice. Stay because it's working, not because you're stuck",
  },
];

const typicalActivities = [
  {
    category: "Strategic",
    icon: Lightbulb,
    items: [
      "Technology roadmap development",
      "Architecture planning & review",
      "Budget planning & forecasting",
      "Risk assessment & mitigation",
      "M&A technical due diligence",
    ],
  },
  {
    category: "Operational",
    icon: Zap,
    items: [
      "Vendor selection & management",
      "Security & compliance reviews",
      "Process optimization",
      "Technical debt evaluation",
      "Performance monitoring setup",
    ],
  },
  {
    category: "Team",
    icon: Users,
    items: [
      "Hiring & interviewing support",
      "Team structure & org design",
      "Engineering culture development",
      "Performance review guidance",
      "Skills development planning",
    ],
  },
  {
    category: "Execution",
    icon: Target,
    items: [
      "Project planning & oversight",
      "Code & architecture reviews",
      "Incident response guidance",
      "Release management",
      "Technical documentation",
    ],
  },
];

const caseStudy = {
  client: "Mid-Size SaaS Company",
  situation: "Rapid growth had outpaced their technical infrastructure. The founding CTO had moved to a product role, leaving a leadership gap just as they were scaling from 20 to 100 employees.",
  engagement: "Active Retainer (20 hrs/mo)",
  duration: "18 months",
  results: [
    {
      metric: "3x",
      label: "Team Growth",
      description: "Scaled engineering team from 8 to 24 engineers with improved hiring process",
    },
    {
      metric: "40%",
      label: "Cost Reduction",
      description: "Reduced cloud infrastructure costs through architecture optimization",
    },
    {
      metric: "99.9%",
      label: "Uptime",
      description: "Improved system reliability from 97% to 99.9% availability",
    },
  ],
  quote: "Having Pink Beam as our fractional CTO gave us executive-level technical leadership without the $400K+ salary. They helped us navigate scaling challenges we couldn't have handled alone.",
  attribution: "CEO, SaaS Company",
};

const comparisonTable = {
  features: [
    "Monthly Hours",
    "Response Time",
    "Strategy Sessions",
    "Slack Support",
    "Implementation Help",
    "Vendor Management",
    "Team Mentoring",
    "Board Reporting",
  ],
  tiers: [
    {
      name: "Advisory",
      values: ["10 hrs", "48 hours", "Monthly", "Email + Slack", "Limited", "Advisory", "Guidance", "—"],
    },
    {
      name: "Active",
      values: ["20 hrs", "24 hours", "Bi-weekly", "Priority Slack", "Included", "Hands-on", "Coaching", "On request"],
    },
    {
      name: "Embedded",
      values: ["40 hrs", "Same day", "Weekly", "Dedicated channel", "Extensive", "Full oversight", "Management", "Included"],
    },
  ],
};

const relatedServices = [
  {
    title: "Workshops",
    description: "Accelerate decisions with facilitated sessions",
    href: "/solutions/engagement/workshops",
    icon: Lightbulb,
  },
  {
    title: "Assessments",
    description: "Understand your current state and opportunities",
    href: "/solutions/engagement/assessments",
    icon: Target,
  },
  {
    title: "Projects",
    description: "End-to-end execution of strategic initiatives",
    href: "/solutions/engagement/projects",
    icon: Zap,
  },
];

export function RetainersClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - No framer-motion */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-void">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">
                Retainers
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-white tracking-tight">
              Fractional CTO/CIO{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Expertise
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Executive-level technology leadership without the full-time commitment.
              Strategic guidance, hands-on support, and ongoing partnership tailored to your needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                asChild
              >
                <Link href="/solutions/contact?topic=retainers">
                  Schedule a Consultation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#tiers">View Retainer Tiers</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm">Scroll</span>
          <ChevronDown className="w-5 h-5 text-amber-400 animate-bounce" />
        </div>
      </section>

      {/* Why Fractional Section */}
      <section className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Why Fractional?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Executive Leadership Without the Overhead
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get the strategic guidance you need, when you need it, without the cost and commitment of a full-time executive
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                metric: "$300K+",
                label: "Typical CTO Salary",
                description: "Plus benefits, bonuses, and equity. A significant investment for any organization.",
              },
              {
                metric: "$60K+",
                label: "Starting Retainer Cost",
                description: "Annual cost for Advisory tier. Scale up or down based on your evolving needs.",
              },
              {
                metric: "0",
                label: "Hiring Risk",
                description: "No lengthy search, no equity negotiations, no severance. Month-to-month flexibility.",
              },
              {
                metric: "Day 1",
                label: "Ready to Help",
                description: "Skip the onboarding. We bring expertise, frameworks, and proven playbooks.",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="text-4xl font-bold text-amber-400 mb-2">{stat.metric}</div>
                <div className="font-semibold mb-2">{stat.label}</div>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Retainer Tiers */}
      <section id="tiers" className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Retainer Tiers
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Choose Your Level of Engagement
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three tiers designed to match your needs and budget. Scale up or down as your needs evolve.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {retainerTiers.map((tier, index) => (
              <FadeIn key={tier.name} delay={index * 0.1}>
                <motion.div
                  className={`relative p-6 lg:p-8 rounded-2xl h-full flex flex-col ${
                    tier.popular
                      ? "bg-gradient-to-b from-amber-500/10 to-card border-2 border-amber-500/30"
                      : "bg-card border border-border hover:border-amber-500/30"
                  } transition-all duration-300`}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-white text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                    <p className="text-sm text-amber-400 font-medium">{tier.hours}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-display font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">{tier.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400">{tier.responseTime}</span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">What&apos;s Included:</p>
                    <ul className="space-y-1">
                      {tier.features.map((feature) => (
                        <li key={feature} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Check className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Typical activities:</p>
                    <ul className="space-y-1">
                      {tier.activities.map((activity) => (
                        <li key={activity} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-amber-400" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-4">{tier.ideal}</p>
                    <Button
                      className={`w-full ${
                        tier.popular
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                          : "border-amber-500/30 hover:bg-amber-500/10"
                      }`}
                      variant={tier.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/solutions/contact?topic=retainers">
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included in All Tiers */}
      <section className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Standard Inclusions
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What You Get With Every Tier
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Core benefits included in all retainer engagements
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {includedInAllTiers.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 hover:bg-card transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Typical Activities */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              How We Help
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Typical Activities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Examples of how we put your retainer hours to work
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {typicalActivities.map((category) => (
              <div
                key={category.category}
                className="p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                  <category.icon className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-semibold mb-4">{category.category}</h3>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-amber-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                  Case Study
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Real Results from Retainer Engagements
                </h2>
              </div>

              <div className="p-8 rounded-2xl border bg-gradient-to-b from-amber-500/5 to-transparent">
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">{caseStudy.client}</h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">The Situation:</span>
                        <p className="mt-1">{caseStudy.situation}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Our Engagement:</span>
                        <p className="mt-1">{caseStudy.engagement} for {caseStudy.duration}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {caseStudy.results.map((result) => (
                      <div
                        key={result.label}
                        className="p-4 rounded-lg border bg-card text-center"
                      >
                        <div className="text-2xl font-bold text-amber-400">{result.metric}</div>
                        <div className="font-medium text-sm">{result.label}</div>
                        <p className="text-xs text-muted-foreground mt-1">{result.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <blockquote className="border-l-2 border-amber-400 pl-6 italic text-muted-foreground">
                  &ldquo;{caseStudy.quote}&rdquo;
                  <footer className="mt-2 text-sm not-italic">
                    — {caseStudy.attribution}
                  </footer>
                </blockquote>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Compare Retainer Tiers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Side-by-side comparison of what&apos;s included in each tier
            </p>
          </FadeIn>

          <FadeIn>
            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-medium text-muted-foreground">Feature</th>
                    {comparisonTable.tiers.map((tier) => (
                      <th key={tier.name} className="text-center py-4 px-4 font-semibold">
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.features.map((feature, index) => (
                    <tr key={feature} className="border-b border-border">
                      <td className="py-4 px-4 text-sm">{feature}</td>
                      {comparisonTable.tiers.map((tier) => (
                        <td key={tier.name} className="text-center py-4 px-4 text-sm text-muted-foreground">
                          {tier.values[index]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-4 px-4"></td>
                    {comparisonTable.tiers.map((tier) => (
                      <td key={tier.name} className="text-center py-4 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-500/30 hover:bg-amber-500/10"
                          asChild
                        >
                          <Link href="/solutions/contact?topic=retainers">
                            Select
                          </Link>
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Related Engagement Options */}
      <section className="py-24 lg:py-32 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Other Engagement Models
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Explore Other Ways to Work Together
            </h2>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {relatedServices.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group p-6 rounded-xl border bg-card/50 hover:border-amber-500/30 hover:bg-card transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </Link>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready for Strategic Technology Leadership?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Schedule a free consultation to discuss which retainer tier fits your needs 
              and how we can help you achieve your technology goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                asChild
              >
                <Link href="/solutions/contact?topic=retainers">
                  Book a Consultation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/solutions/engagement">Compare All Options</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
