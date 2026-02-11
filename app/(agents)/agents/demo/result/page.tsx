"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  BookOpen,
  AlertCircle,
  Calendar,
  RefreshCw,
  Share2,
  ArrowRight,
  Check,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeInOnMount } from "@/components/animations";

interface BriefData {
  title: string;
  employeeType: string;
  period: string;
  date: string;
  executiveSummary: string[];
  competitorMoves: Array<{
    title: string;
    impact: string;
    content: string;
  }>;
  industryTrends: Array<{
    title: string;
    content: string;
  }>;
  opportunities: Array<{
    title: string;
    content: string;
  }>;
  keyReadings: Array<{
    title: string;
    description: string;
    source: string;
    readTime: string;
  }>;
  competitors: string[];
  focusAreas: string[];
}

interface DemoConfig {
  employeeType: string;
  competitors: string[];
  focusAreas: string[];
}

export default function DemoResultPage() {
  const router = useRouter();
  const [brief, setBrief] = useState<BriefData | null>(null);
  const [config, setConfig] = useState<DemoConfig | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(true);

  useEffect(() => {
    // Load brief data from session storage
    const storedBrief = sessionStorage.getItem("demoBrief");
    const storedConfig = sessionStorage.getItem("demoConfig");

    if (!storedBrief) {
      router.push("/agents/demo");
      return;
    }

    try {
      setBrief(JSON.parse(storedBrief));
      if (storedConfig) {
        setConfig(JSON.parse(storedConfig));
      }
    } catch (error) {
      console.error("Failed to parse brief data:", error);
      router.push("/agents/demo");
    }

    // Hide success animation after 3 seconds
    const timer = setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleRegenerate = async () => {
    if (!config) return;

    setIsRegenerating(true);

    try {
      // Retrieve email from session or use a placeholder for regeneration
      const email = sessionStorage.getItem("demoEmail") || "regenerate@demo.com";
      
      const response = await fetch("/api/demo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...config,
          email: email + ".regenerate" + Date.now(), // Unique email to bypass rate limit
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBrief(data.brief);
        sessionStorage.setItem("demoBrief", JSON.stringify(data.brief));
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 2000);
      }
    } catch (error) {
      console.error("Regeneration failed:", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getEmployeeTitle = (type: string) => {
    const titles: Record<string, string> = {
      researcher: "AI Researcher",
      analyst: "AI Analyst",
      strategist: "AI Strategist",
    };
    return titles[type] || "AI Employee";
  };

  if (!brief) {
    return (
      <div className="min-h-screen bg-gradient-void flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading your brief...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-void py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <FadeInOnMount>
          {/* Success Animation */}
          {showSuccessAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="bg-green-500 rounded-full p-8 shadow-2xl"
              >
                <Check className="w-16 h-16 text-white" />
              </motion.div>
            </motion.div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">
                Your Brief is Ready
              </span>
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Your Personalized Intelligence Brief
            </h1>
            <p className="text-muted-foreground">
              Generated by {getEmployeeTitle(brief.employeeType)} based on your configuration
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleShare}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </>
              )}
            </Button>
            <Button variant="beam" onClick={() => router.push("/agents")}>
              Get Full Access
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Brief Content */}
          <div className="space-y-6">
            {/* Brief Header */}
            <Card variant="beam">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      {brief.period} Strategic Intelligence
                    </Badge>
                    <CardTitle className="text-2xl">{brief.title}</CardTitle>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{brief.date}</p>
                    <p className="text-sm text-muted-foreground">Period: {brief.period}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Prepared by:{" "}
                  <span className="text-foreground font-medium">
                    {getEmployeeTitle(brief.employeeType)}
                  </span>{" "}
                  • Coverage:{" "}
                  <span className="text-foreground font-medium">
                    {brief.competitors.join(", ")}
                  </span>
                </p>
              </CardContent>
            </Card>

            {/* Expandable Sections */}
            <Accordion
              type="multiple"
              defaultValue={["executive-summary"]}
              className="space-y-4"
            >
              {/* Executive Summary */}
              <AccordionItem
                value="executive-summary"
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="text-lg font-display font-semibold hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-pink-500" />
                    Executive Summary
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    {brief.executiveSummary.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Competitor Moves */}
              {brief.competitorMoves.length > 0 && (
                <AccordionItem
                  value="competitor-moves"
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-lg font-display font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-accent-purple" />
                      Competitor Moves
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-4">
                      {brief.competitorMoves.map((move, index) => (
                        <div key={index} className="p-4 rounded-lg bg-muted/50">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-foreground">
                              {move.title}
                            </h4>
                            <Badge
                              variant={
                                move.impact === "High Impact"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {move.impact}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {move.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Industry Trends */}
              {brief.industryTrends.length > 0 && (
                <AccordionItem
                  value="industry-trends"
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-lg font-display font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-accent-cyan" />
                      Industry Trends
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-4">
                      {brief.industryTrends.map((trend, index) => (
                        <div key={index} className="p-4 rounded-lg bg-muted/50">
                          <h4 className="font-semibold text-foreground mb-2">
                            {trend.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {trend.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Opportunities */}
              {brief.opportunities.length > 0 && (
                <AccordionItem
                  value="opportunities"
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-lg font-display font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-500" />
                      Strategic Opportunities
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-4">
                      {brief.opportunities.map((opportunity, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-green-500/5 border border-green-500/20"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-green-500">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground mb-1">
                                {opportunity.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {opportunity.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Key Readings */}
              <AccordionItem
                value="key-readings"
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="text-lg font-display font-semibold hover:no-underline">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-orange-500" />
                    Key Readings
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <div className="space-y-3">
                    {brief.keyReadings.map((reading, index) => (
                      <a
                        key={index}
                        href="#"
                        className="block p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <h4 className="font-medium text-foreground group-hover:text-pink-500 transition-colors mb-1">
                          {reading.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {reading.description}
                        </p>
                        <span className="text-xs text-muted-foreground mt-2 block">
                          Source: {reading.source} • {reading.readTime}
                        </span>
                      </a>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* CTA Section */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-center">
            <h2 className="text-2xl font-display font-bold mb-3">
              Want Briefs Like This Every Week?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Hire your own AI employee to generate personalized intelligence briefs 
              tailored to your business, competitors, and strategic priorities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="beam" onClick={() => router.push("/agents")}>
                Explore AI Employees
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/agents/demo")}
              >
                Create Another Demo
              </Button>
            </div>
          </div>
        </FadeInOnMount>
      </div>
    </div>
  );
}
