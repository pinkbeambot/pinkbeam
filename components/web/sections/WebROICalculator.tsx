"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui";
import { TrendingUp } from "lucide-react";
import { FadeIn } from "@/components/animations";

export function WebROICalculator() {
  const [monthlyVisitors, setMonthlyVisitors] = useState(5000);
  const [currentConversionRate, setCurrentConversionRate] = useState(1);
  const [averageOrderValue, setAverageOrderValue] = useState(100);

  // Improved site conversion potential
  const improvementMultiplier = 2.5; // Assume 2.5x improvement from redesign
  const newConversionRate = currentConversionRate * improvementMultiplier;

  // Calculate current revenue
  const currentRevenue = monthlyVisitors * (currentConversionRate / 100) * averageOrderValue;

  // Calculate new revenue with improved site
  const newRevenue = monthlyVisitors * (newConversionRate / 100) * averageOrderValue;

  // Calculate monthly increase
  const monthlyIncrease = newRevenue - currentRevenue;

  // Annual increase
  const annualIncrease = monthlyIncrease * 12;

  // Average project cost
  const avgProjectCost = 7500;

  // ROI calculation: how many months to pay for itself
  const monthsToROI = monthlyIncrease > 0 ? avgProjectCost / monthlyIncrease : 0;

  return (
    <section className="py-20 md:py-32 bg-surface-sunken">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/10 mb-6">
            <TrendingUp className="w-7 h-7 text-violet-500" />
          </div>
          <h2 className="text-h2 font-display font-bold mb-4">
            Your Website as an{" "}
            <span className="text-gradient-beam">Investment</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            A modern, conversion-optimized website isn't an expense—it's revenue generating.
            See what your improved site could earn.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Inputs */}
            <div className="space-y-8">
              {/* Monthly Visitors */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-foreground">
                    Monthly Visitors
                  </label>
                  <span className="text-2xl font-bold text-violet-500">
                    {monthlyVisitors.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[monthlyVisitors]}
                  onValueChange={(value) => setMonthlyVisitors(value[0])}
                  min={100}
                  max={50000}
                  step={100}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  How many people visit your site each month?
                </p>
              </div>

              {/* Conversion Rate */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-foreground">
                    Current Conversion Rate
                  </label>
                  <span className="text-2xl font-bold text-violet-500">
                    {currentConversionRate.toFixed(2)}%
                  </span>
                </div>
                <Slider
                  value={[currentConversionRate]}
                  onValueChange={(value) => setCurrentConversionRate(value[0])}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  % of visitors who make a purchase or take action
                </p>
              </div>

              {/* Average Order Value */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-foreground">
                    Average Order Value
                  </label>
                  <span className="text-2xl font-bold text-violet-500">
                    ${averageOrderValue.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[averageOrderValue]}
                  onValueChange={(value) => setAverageOrderValue(value[0])}
                  min={10}
                  max={5000}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Average revenue per customer
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {/* Current Revenue */}
              <Card variant="elevated">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">Current Monthly Revenue</p>
                  <p className="text-h3 font-display font-bold text-foreground mb-4">
                    ${currentRevenue.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @ {currentConversionRate.toFixed(2)}% conversion
                  </p>
                </CardContent>
              </Card>

              {/* New Revenue */}
              <Card variant="elevated" className="border-violet-500/30 bg-violet-500/5">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">Potential Monthly Revenue</p>
                  <p className="text-h3 font-display font-bold text-violet-500 mb-4">
                    ${newRevenue.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @ {newConversionRate.toFixed(2)}% conversion (2.5x improvement)
                  </p>
                </CardContent>
              </Card>

              {/* Monthly Increase */}
              <Card variant="elevated">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">Monthly Increase</p>
                  <p className="text-h3 font-display font-bold text-green-600 mb-4">
                    +${monthlyIncrease.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Additional revenue each month
                  </p>
                </CardContent>
              </Card>

              {/* Annual Impact */}
              <Card variant="elevated">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">Annual Impact</p>
                  <p className="text-h3 font-display font-bold text-foreground mb-4">
                    ${annualIncrease.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Additional revenue over 12 months
                  </p>
                </CardContent>
              </Card>

              {/* ROI Timeline */}
              <Card variant="elevated" className="border-green-500/30 bg-green-500/5">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">Payback Period</p>
                  <p className="text-h3 font-display font-bold text-green-600 mb-4">
                    {monthsToROI > 0 ? `${Math.round(monthsToROI)} months` : "Instant"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Time for the site to pay for itself
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </FadeIn>

        {/* Disclaimer */}
        <FadeIn delay={0.2} className="mt-12 text-center max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground">
            These calculations are estimates based on typical industry improvements. Actual results depend on your specific business,
            traffic quality, product/service, and implementation. Conservative estimates assume a 2.5x improvement in conversion rate
            from a modern, optimized website.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
