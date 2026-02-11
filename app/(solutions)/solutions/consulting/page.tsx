import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Consulting Services — Strategic Business Advisory",
  description: "Expert consulting services for digital transformation, AI strategy, and business optimization.",
};

export default function ConsultingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero — Full Screen with amber gradient */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-void">
        {/* Amber gradient backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <span className="text-sm font-medium text-amber-400">
                Consulting Services
              </span>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 text-white tracking-tight">
              Strategic{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Consulting
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Expert guidance to navigate digital transformation and unlock new growth opportunities.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a 
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:opacity-90 shadow-lg shadow-amber-500/25 transition-opacity"
              >
                Book a Consultation
                <span>→</span>
              </a>
              <a 
                href="#areas"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-amber-500/30 text-white hover:bg-amber-500/10 transition-colors"
              >
                Explore Services
              </a>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ChevronDown className="w-5 h-5 text-amber-400 animate-bounce" />
        </div>
      </section>

      {/* Consulting Areas Section */}
      <section id="areas" className="py-20 lg:py-32 border-t border-border bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Areas of Expertise
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive consulting across key business domains
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "AI Strategy", desc: "Develop and execute AI strategies that drive real business value." },
              { title: "Process Optimization", desc: "Streamline operations and eliminate inefficiencies." },
              { title: "Growth Strategy", desc: "Data-driven growth planning to scale sustainably." },
              { title: "Organizational Design", desc: "Structure your team for the AI era." },
            ].map((area) => (
              <div key={area.title} className="group p-6 rounded-xl border border-border bg-card hover:border-amber-500/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                  <span className="text-amber-400 text-xl">◆</span>
                </div>
                <h3 className="font-semibold mb-2">{area.title}</h3>
                <p className="text-sm text-muted-foreground">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 border-t border-border bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-muted-foreground mb-8">
              Book a free consultation to discuss your challenges and opportunities.
            </p>
            <a 
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:opacity-90 shadow-lg shadow-amber-500/25 transition-opacity"
            >
              Get Started
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
