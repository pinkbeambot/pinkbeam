"use client";

import { useState } from "react";
import { FadeIn } from "@/components/animations";
import { Card, CardContent } from "@/components/ui";
import { Zap, TrendingUp } from "lucide-react";

export function LabsROICalculator() {
  const [teamSize, setTeamSize] = useState(3);
  const [projectMonths, setProjectMonths] = useState(4);
  const [complexity, setComplexity] = useState("standard");

  // Calculate costs
  const baseRate = 150000; // Annual senior dev cost
  const teamHiringCost = teamSize * baseRate * (projectMonths / 12);
  const teamHiringTotal = teamHiringCost + teamSize * 10000; // Plus overhead

  const customSoftwareCosts = {
    simple: 35000,
    standard: 60000,
    complex: 100000,
  };

  const customCost = customSoftwareCosts[complexity as keyof typeof customSoftwareCosts];
  const savings = teamHiringTotal - customCost;
  const savingsPercent = Math.round((savings / teamHiringTotal) * 100);

  return (
    <section className="py-20 md:py-32 bg-surface-sunken">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-h2 font-display font-bold mb-4">
            Custom Software vs{" "}
            <span className="text-gradient-cyan">Hiring</span>
          </h2>
          <p className="text-lead text-muted-foreground">
            See how building custom software compares to hiring developers
            for the same project.
          </p>
        </FadeIn>

        {/* Calculator */}
        <FadeIn delay={0.1}>
          <Card variant="elevated" className="border-cyan-500/30 mb-8">
            <CardContent className="p-8 md:p-12">
              {/* Input Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Team Size */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-4">
                    Team Size: <span className="text-cyan-500">{teamSize} people</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>1</span>
                    <span>8</span>
                  </div>
                </div>

                {/* Project Duration */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-4">
                    Project Duration: <span className="text-cyan-500">{projectMonths} months</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={projectMonths}
                    onChange={(e) => setProjectMonths(parseInt(e.target.value))}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>1</span>
                    <span>12</span>
                  </div>
                </div>

                {/* Complexity */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-4">
                    Project Complexity
                  </label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="simple">Simple MVP</option>
                    <option value="standard">Standard Project</option>
                    <option value="complex">Enterprise System</option>
                  </select>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6">
                {/* Cost Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hiring Cost */}
                  <div className="p-6 rounded-lg bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-red-500" />
                      <p className="text-sm text-muted-foreground">If You Hire</p>
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-2">
                      ${(teamHiringTotal / 1000).toFixed(0)}k
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• {teamSize} developers @ ${(baseRate / 1000).toFixed(0)}k/year</li>
                      <li>• For {projectMonths} months</li>
                      <li>• Plus overhead & benefits</li>
                      <li>• Ramp-up time: 2-4 weeks</li>
                    </ul>
                  </div>

                  {/* Custom Software Cost */}
                  <div className="p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <p className="text-sm text-muted-foreground">Custom Software</p>
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-2">
                      ${(customCost / 1000).toFixed(0)}k
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Fixed or retainer pricing</li>
                      <li>• Dedicated expert team</li>
                      <li>• Production-ready code</li>
                      <li>• Fast delivery: {projectMonths} weeks</li>
                    </ul>
                  </div>
                </div>

                {/* Savings Highlight */}
                <div className="p-6 rounded-lg bg-gradient-to-r from-cyan-500/10 to-cyan-400/10 border-2 border-cyan-500/50">
                  <p className="text-sm text-muted-foreground mb-1">Your Savings</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-cyan-500">
                      ${(savings / 1000).toFixed(0)}k
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      ({savingsPercent}% less)
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    By building custom software instead of hiring, you save money AND get faster delivery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Bottom Note */}
        <FadeIn delay={0.2} className="text-center p-6 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
          <p className="text-body text-muted-foreground">
            <span className="font-semibold text-foreground">Note:</span> These estimates are based on typical
            market rates ($150k/year senior dev) and custom software pricing. Actual costs may vary based on
            specific requirements and scope.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
