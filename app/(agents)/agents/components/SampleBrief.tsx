"use client";

import * as React from "react";
import { TrendingUp, Target, BookOpen, AlertCircle, Calendar } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SampleBrief() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Brief Header */}
      <Card variant="beam">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge variant="outline" className="mb-2">
                <Calendar className="w-3 h-3 mr-1" />
                Weekly Strategic Intelligence
              </Badge>
              <CardTitle className="text-2xl">Market Intelligence Brief</CardTitle>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{today}</p>
              <p className="text-sm text-muted-foreground">Period: Weekly</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Prepared by: <span className="text-foreground font-medium">AI Researcher</span> • 
            Coverage: <span className="text-foreground font-medium">SaaS Industry</span>
          </p>
        </CardContent>
      </Card>

      {/* Expandable Sections */}
      <Accordion type="multiple" defaultValue={["executive-summary"]} className="space-y-4">
        {/* Executive Summary */}
        <AccordionItem value="executive-summary" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-display font-semibold hover:no-underline">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-pink-500" />
              Executive Summary
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                This week has seen significant movement in the competitive landscape, 
                with major players announcing strategic pivots that could reshape market 
                dynamics. Our analysis reveals three critical trends that demand immediate 
                attention from leadership teams.
              </p>
              <p>
                First, the accelerated adoption of AI-powered features across customer 
                support platforms is creating new expectations for response times and 
                personalization. Companies that fail to adapt risk losing market share 
                to more agile competitors who are leveraging these technologies to 
                deliver superior customer experiences.
              </p>
              <p>
                Second, pricing pressures continue to mount as economic uncertainty 
                drives enterprises to scrutinize software spend more carefully. We&apos;ve 
                observed an 18% increase in competitive displacement activity, with 
                buyers prioritizing solutions that demonstrate clear ROI within the 
                first 90 days of implementation.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Competitor Moves */}
        <AccordionItem value="competitor-moves" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-display font-semibold hover:no-underline">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-accent-purple" />
              Competitor Moves
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">Competitor A Announces Major Platform Overhaul</h4>
                  <Badge variant="secondary">High Impact</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Announced a complete redesign of their core platform with embedded 
                  AI capabilities throughout. The rollout is scheduled for Q2 2026, 
                  positioning them to capture mid-market share with aggressive pricing 
                  starting at $49/user/month.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">Competitor B Expands Enterprise Sales Team</h4>
                  <Badge variant="outline">Medium Impact</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Hired 50 new enterprise account executives focused specifically on 
                  displacing incumbent solutions. They&apos;re offering migration incentives 
                  up to $100K for deals over $500K ARR, targeting financial services 
                  and healthcare verticals.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">Competitor C Acquires Analytics Startup</h4>
                  <Badge variant="outline">Medium Impact</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Acquired DataFlow Analytics for $180M to bolster their reporting 
                  capabilities. Integration timeline suggests new analytics features 
                  will be available to customers by Q3 2026, closing a key feature gap 
                  that had been a competitive disadvantage.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Industry Trends */}
        <AccordionItem value="industry-trends" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-display font-semibold hover:no-underline">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-cyan" />
              Industry Trends
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold text-foreground mb-2">
                  Trend 1: Vertical-Specific Solutions Gaining Traction
                </h4>
                <p className="text-sm text-muted-foreground">
                  Generic horizontal solutions are losing ground to purpose-built 
                  vertical offerings. Healthcare and financial services are leading 
                  this shift, with buyers willing to pay 30-40% premiums for solutions 
                  that address industry-specific compliance and workflow requirements 
                  out of the box.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold text-foreground mb-2">
                  Trend 2: API-First Architecture Becoming Table Stakes
                </h4>
                <p className="text-sm text-muted-foreground">
                  Enterprise buyers now expect comprehensive API coverage as a baseline 
                  requirement. RFPs increasingly include technical assessments of API 
                  completeness, documentation quality, and webhook support. Vendors 
                  without robust API strategies are being excluded from consideration 
                  early in evaluation cycles.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold text-foreground mb-2">
                  Trend 3: Consolidation of Point Solutions Accelerating
                </h4>
                <p className="text-sm text-muted-foreground">
                  CIOs are actively seeking to reduce vendor sprawl, driving demand 
                  for unified platforms that can replace 3-5 existing point solutions. 
                  This trend favors established players with broad feature sets and 
                  creates headwinds for best-of-breed startups lacking platform breadth.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Opportunities */}
        <AccordionItem value="opportunities" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-display font-semibold hover:no-underline">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Strategic Opportunities
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-500">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Launch Targeted Campaign Against Competitor A&apos;s Legacy Customers
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Their platform overhaul creates uncertainty for existing customers. 
                      We should launch a retention-risk campaign targeting their enterprise 
                      accounts with migration incentives and dedicated success resources.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-500">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Accelerate Healthcare Vertical Go-to-Market
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The trend toward vertical-specific solutions creates an opening. 
                      We should fast-track our HIPAA compliance roadmap and develop 
                      healthcare-specific case studies to capture this expanding segment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-500">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Bundle Strategy for Consolidation Trend
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Position our platform as a consolidation solution with bundled 
                      pricing that undercuts the total cost of 3-4 point solutions. 
                      Develop ROI calculator to quantify savings in sales conversations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Key Readings */}
        <AccordionItem value="key-readings" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-display font-semibold hover:no-underline">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              Key Readings
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-3">
              <a
                href="#"
                className="block p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
              >
                <h4 className="font-medium text-foreground group-hover:text-pink-500 transition-colors mb-1">
                  The State of SaaS: 2026 Market Analysis Report
                </h4>
                <p className="text-sm text-muted-foreground">
                  Comprehensive analysis of SaaS market trends, pricing pressures, and 
                  emerging competitive dynamics. Essential reading for strategic planning.
                </p>
                <span className="text-xs text-muted-foreground mt-2 block">
                  Source: TechCrunch • 8 min read
                </span>
              </a>

              <a
                href="#"
                className="block p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
              >
                <h4 className="font-medium text-foreground group-hover:text-pink-500 transition-colors mb-1">
                  AI in Customer Support: Adoption Benchmarks and ROI Data
                </h4>
                <p className="text-sm text-muted-foreground">
                  New research reveals how leading companies are measuring AI ROI in 
                  support operations, with benchmark data on cost savings and CSAT impacts.
                </p>
                <span className="text-xs text-muted-foreground mt-2 block">
                  Source: Gartner Research • 12 min read
                </span>
              </a>

              <a
                href="#"
                className="block p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
              >
                <h4 className="font-medium text-foreground group-hover:text-pink-500 transition-colors mb-1">
                  Enterprise Software Buying Behavior Shifts in 2026
                </h4>
                <p className="text-sm text-muted-foreground">
                  Survey of 500 enterprise buyers reveals changing evaluation criteria, 
                  budget allocation trends, and vendor selection priorities for the year ahead.
                </p>
                <span className="text-xs text-muted-foreground mt-2 block">
                  Source: McKinsey Digital • 10 min read
                </span>
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
