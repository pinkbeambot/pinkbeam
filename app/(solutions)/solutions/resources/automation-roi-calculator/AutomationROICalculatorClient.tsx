'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, TrendingUp, Clock, DollarSign, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/animations';

export function AutomationROICalculatorClient() {
  // Input state
  const [processesPerWeek, setProcessesPerWeek] = useState(100);
  const [timePerProcess, setTimePerProcess] = useState(30); // minutes
  const [hourlyRate, setHourlyRate] = useState(50);
  const [errorRate, setErrorRate] = useState(5); // percentage
  const [automationCost, setAutomationCost] = useState(25000);
  const [automationEfficiency, setAutomationEfficiency] = useState(80); // percentage

  // Calculations
  const results = useMemo(() => {
    const weeklyHours = (processesPerWeek * timePerProcess) / 60;
    const weeklyLaborCost = weeklyHours * hourlyRate;
    const annualLaborCost = weeklyLaborCost * 52;

    const errorCostPerYear = annualLaborCost * (errorRate / 100) * 0.5; // Assume errors cost 50% to fix

    const automatedTimePerProcess = timePerProcess * (1 - automationEfficiency / 100);
    const weeklyHoursAfter = (processesPerWeek * automatedTimePerProcess) / 60;
    const weeklyLaborCostAfter = weeklyHoursAfter * hourlyRate;
    const annualLaborCostAfter = weeklyLaborCostAfter * 52;

    const annualSavings = annualLaborCost - annualLaborCostAfter + errorCostPerYear;
    const roi = (annualSavings / automationCost) * 100;
    const paybackPeriod = automationCost / (annualSavings / 12);
    const threeYearValue = annualSavings * 3 - automationCost;

    return {
      weeklyHours,
      weeklyLaborCost,
      annualLaborCost,
      errorCostPerYear,
      weeklyHoursAfter,
      annualLaborCostAfter,
      annualSavings,
      roi,
      paybackPeriod,
      threeYearValue,
      hoursSavedPerWeek: weeklyHours - weeklyHoursAfter,
    };
  }, [processesPerWeek, timePerProcess, hourlyRate, errorRate, automationCost, automationEfficiency]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b border-border/50">
        <div className="container py-4">
          <Link 
            href="/solutions/resources"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 lg:py-20">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 px-3 py-1 border-amber-500/30 text-amber-500">
                Interactive Tool
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Process Automation ROI Calculator
              </h1>
              <p className="text-lg text-muted-foreground">
                Estimate the potential return on investment for automating your business processes. 
                Discover cost savings, efficiency gains, and payback period.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Calculator */}
      <section className="pb-20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <FadeIn delay={0.1}>
                <Card>
                  <CardContent className="p-6 space-y-8">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-amber-500" />
                      Current Process
                    </h2>

                    {/* Processes per week */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Processes per Week</Label>
                        <span className="text-sm font-medium">{processesPerWeek}</span>
                      </div>
                      <Slider
                        value={[processesPerWeek]}
                        onValueChange={([v]) => setProcessesPerWeek(v)}
                        min={10}
                        max={1000}
                        step={10}
                      />
                    </div>

                    {/* Time per process */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Time per Process (minutes)</Label>
                        <span className="text-sm font-medium">{timePerProcess} min</span>
                      </div>
                      <Slider
                        value={[timePerProcess]}
                        onValueChange={([v]) => setTimePerProcess(v)}
                        min={5}
                        max={120}
                        step={5}
                      />
                    </div>

                    {/* Hourly rate */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Average Hourly Rate ($)</Label>
                        <span className="text-sm font-medium">${hourlyRate}/hr</span>
                      </div>
                      <Slider
                        value={[hourlyRate]}
                        onValueChange={([v]) => setHourlyRate(v)}
                        min={15}
                        max={200}
                        step={5}
                      />
                    </div>

                    {/* Error rate */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Current Error Rate (%)</Label>
                        <span className="text-sm font-medium">{errorRate}%</span>
                      </div>
                      <Slider
                        value={[errorRate]}
                        onValueChange={([v]) => setErrorRate(v)}
                        min={0}
                        max={20}
                        step={0.5}
                      />
                    </div>

                    <h2 className="text-xl font-semibold flex items-center gap-2 pt-4 border-t">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                      Automation Scenario
                    </h2>

                    {/* Automation cost */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Implementation Cost ($)</Label>
                        <span className="text-sm font-medium">${automationCost.toLocaleString()}</span>
                      </div>
                      <Slider
                        value={[automationCost]}
                        onValueChange={([v]) => setAutomationCost(v)}
                        min={5000}
                        max={100000}
                        step={1000}
                      />
                    </div>

                    {/* Automation efficiency */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Efficiency Improvement (%)</Label>
                        <span className="text-sm font-medium">{automationEfficiency}%</span>
                      </div>
                      <Slider
                        value={[automationEfficiency]}
                        onValueChange={([v]) => setAutomationEfficiency(v)}
                        min={50}
                        max={95}
                        step={5}
                      />
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              {/* Results */}
              <FadeIn delay={0.2}>
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-amber-500/5 to-amber-600/5 border-amber-500/20">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-6">Your Results</h2>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-background rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Annual Savings</p>
                          <p className="text-3xl font-bold text-amber-500">
                            ${Math.round(results.annualSavings).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-background rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">ROI</p>
                          <p className="text-3xl font-bold text-green-500">
                            {Math.round(results.roi)}%
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm">Payback Period</span>
                          </div>
                          <span className="font-semibold">
                            {results.paybackPeriod < 1 
                              ? `${Math.round(results.paybackPeriod * 30)} days` 
                              : `${Math.round(results.paybackPeriod)} months`}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                          <div className="flex items-center gap-3">
                            <DollarSign className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm">3-Year Value</span>
                          </div>
                          <span className="font-semibold text-green-600">
                            ${Math.round(results.threeYearValue).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm">Hours Saved/Week</span>
                          </div>
                          <span className="font-semibold">
                            {Math.round(results.hoursSavedPerWeek)} hrs
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Detailed Breakdown */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Detailed Breakdown</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Current Annual Labor Cost</span>
                          <span>${Math.round(results.annualLaborCost).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Post-Automation Labor Cost</span>
                          <span>${Math.round(results.annualLaborCostAfter).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Annual Error Cost</span>
                          <span>${Math.round(results.errorCostPerYear).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                          <span className="text-muted-foreground">Current Weekly Hours</span>
                          <span>{Math.round(results.weeklyHours)} hrs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Post-Automation Weekly Hours</span>
                          <span>{Math.round(results.weeklyHoursAfter)} hrs</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-3">
                    <Button className="flex-1 bg-amber-500 hover:bg-amber-600" asChild>
                      <Link href="/solutions/contact">
                        Discuss Your Project
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href="/solutions/resources/process-automation-roi-calculator">
                        Download Full Calculator
                      </Link>
                    </Button>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
