import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Users, Target, ChevronDown } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = createMetadata({
  title: "Workshops — Interactive Strategy Sessions",
  description: "Hands-on workshops for AI strategy, digital transformation, and team alignment. Learn by doing with Pink Beam Solutions.",
  path: "/solutions/workshops",
});

const workshops = [
  {
    title: "AI Strategy Workshop",
    duration: "2 hours",
    attendees: "Up to 8 people",
    description: "Identify AI opportunities in your business and create a prioritized action plan.",
    outcomes: [
      "AI opportunity map",
      "Prioritized use cases",
      "Implementation roadmap",
      "Resource requirements",
    ],
  },
  {
    title: "Digital Transformation Intensive",
    duration: "Half day",
    attendees: "Up to 12 people",
    description: "Comprehensive session to align your team on digital transformation priorities.",
    outcomes: [
      "Current state assessment",
      "Transformation roadmap",
      "Change management plan",
      "Quick wins identification",
    ],
  },
  {
    title: "Process Automation Masterclass",
    duration: "2 hours",
    attendees: "Up to 10 people",
    description: "Learn to identify and automate repetitive processes in your organization.",
    outcomes: [
      "Process audit framework",
      "Automation candidates",
      "Tool selection guide",
      "ROI calculation model",
    ],
  },
];

export default function WorkshopsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-void">
        {/* Amber Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
              Workshops
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
              Learn by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Doing
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Interactive workshops that deliver actionable insights and tangible outcomes for your team.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
              asChild
            >
              <Link href="/contact">
                Book a Workshop
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm">Scroll</span>
          <ChevronDown className="w-5 h-5 text-amber-400 animate-bounce" />
        </div>
      </section>

      {/* Workshops List */}
      <section className="py-16 lg:py-24 border-t border-border bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Available Workshops
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our curated selection of strategy workshops
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {workshops.map((workshop) => (
              <div key={workshop.title} className="h-full p-6 rounded-2xl bg-card border border-border hover:border-amber-500/30 transition-colors flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">{workshop.title}</h3>
                  <p className="text-muted-foreground text-sm">{workshop.description}</p>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400">
                    <Clock className="w-3 h-3" />
                    {workshop.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400">
                    <Users className="w-3 h-3" />
                    {workshop.attendees}
                  </span>
                </div>

                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Deliverables</p>
                  <ul className="space-y-1">
                    {workshop.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="w-3 h-3 text-amber-400 shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full mt-6 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30" asChild>
                  <Link href="/contact">Request This Workshop</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Workshops */}
      <section className="py-16 border-t border-border bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center p-8 rounded-2xl bg-gradient-to-b from-amber-500/5 to-transparent border border-amber-500/20">
            <Calendar className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold mb-2">Need a Custom Workshop?</h3>
            <p className="text-muted-foreground mb-6">
              We design tailored workshops for your specific challenges and team needs. 
              Let&apos;s discuss what would work best for your organization.
            </p>
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90" asChild>
              <Link href="/contact">
                Schedule a Call
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
