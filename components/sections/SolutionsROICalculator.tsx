"use client";

import { useState } from "react";
import { FadeIn } from "@/components/animations";
import { Card, CardContent } from "@/components/ui";
import { Calculator, TrendingUp, DollarSign, Clock } from "lucide-react";

export function SolutionsROICalculator() {
  const [teamSize, setTeamSize] = useState(15);
  const [avgSalary, setAvgSalary] = useState(120000);
  const [inefficiencyPercent, setInefficiencyPercent] = useState(20);
  const [ctoSalary] = useState(300000);

  // Calculations
  const totalPayroll = teamSize * avgSalary;
  const wastedSpend = totalPayroll * (inefficiencyPercent / 100);
  const retainerCost = 10000 * 12; // Active retainer annually
  const netSavings = wastedSpend - retainerCost;
  const roi = retainerCost > 0 ? ((netSavings / retainerCost) * 100) : 0;
  const ctoCostSavings = ctoSalary - retainerCost;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Calculator className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">
              ROI Calculator
            </span>
          </div>
          <h2 className="text-h2 font-display font-bold mb-4">
            What&apos;s Strategic Guidance{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Worth?
            </span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            See how a fractional CTO compares to a full-time hire and how
            strategic guidance reduces wasted technology spend.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Input Controls */}
            <Card variant="elevated" className="border-amber-500/30">
              <CardContent className="p-8">
                <h3 className="text-h4 font-display font-bold text-foreground mb-6">
                  Your Situation
                </h3>

                <div className="space-y-8">
                  {/* Team Size */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">
                        Team Size
                      </label>
                      <span className="text-sm font-bold text-amber-500">
                        {teamSize} people
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={teamSize}
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>5</span>
                      <span>100</span>
                    </div>
                  </div>

                  {/* Average Salary */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">
                        Avg Employee Cost
                      </label>
                      <span className="text-sm font-bold text-amber-500">
                        {formatCurrency(avgSalary)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="250000"
                      step="10000"
                      value={avgSalary}
                      onChange={(e) => setAvgSalary(Number(e.target.value))}
                      className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>$50K</span>
                      <span>$250K</span>
                    </div>
                  </div>

                  {/* Inefficiency */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">
                        Estimated Inefficiency
                      </label>
                      <span className="text-sm font-bold text-amber-500">
                        {inefficiencyPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={inefficiencyPercent}
                      onChange={(e) =>
                        setInefficiencyPercent(Number(e.target.value))
                      }
                      className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>5%</span>
                      <span>40%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      How much of your team&apos;s effort is lost to wrong
                      priorities, bad tooling, or misaligned strategy?
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card variant="elevated" className="border-amber-500/30">
              <CardContent className="p-8">
                <h3 className="text-h4 font-display font-bold text-foreground mb-6">
                  The Numbers
                </h3>

                <div className="space-y-6">
                  {/* CTO Comparison */}
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign className="w-5 h-5 text-amber-500" />
                      <span className="text-sm font-semibold text-foreground">
                        vs. Hiring a Full-Time CTO
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Full-time CTO
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {formatCurrency(ctoSalary)}/yr
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Fractional CTO
                        </p>
                        <p className="text-lg font-bold text-amber-500">
                          {formatCurrency(retainerCost)}/yr
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-amber-400 font-medium mt-2">
                      Save {formatCurrency(ctoCostSavings)}/year
                    </p>
                  </div>

                  {/* Wasted Spend */}
                  <div className="p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5 text-amber-500" />
                      <span className="text-sm font-semibold text-foreground">
                        Wasted Technology Spend
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(wastedSpend)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /year
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      At {inefficiencyPercent}% inefficiency across{" "}
                      {formatCurrency(totalPayroll)} total payroll
                    </p>
                  </div>

                  {/* Net ROI */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                      <span className="text-sm font-semibold text-foreground">
                        Net Savings with Strategic Guidance
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-amber-500">
                      {formatCurrency(Math.max(0, netSavings))}
                      <span className="text-sm font-normal text-muted-foreground">
                        /year
                      </span>
                    </p>
                    {roi > 0 && (
                      <p className="text-sm text-amber-400 font-medium mt-1">
                        {Math.round(roi)}% ROI on retainer investment
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-6">
                  Even reducing inefficiency by half through better strategic
                  decisions pays for the engagement many times over.
                </p>
              </CardContent>
            </Card>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
