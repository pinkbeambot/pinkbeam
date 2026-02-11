"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw, TrendingUp, CheckCircle, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// ==================== AUTOMATION ROI CALCULATOR ====================

interface ROICalculatorState {
  hourlyRate: number;
  hoursPerWeek: number;
  automationRate: number;
  implementationCost: number;
  monthlyMaintenance: number;
}

function AutomationROICalculator() {
  const [inputs, setInputs] = useState<ROICalculatorState>({
    hourlyRate: 50,
    hoursPerWeek: 40,
    automationRate: 60,
    implementationCost: 25000,
    monthlyMaintenance: 500,
  });

  const calculateROI = () => {
    const weeklyLaborCost = inputs.hourlyRate * inputs.hoursPerWeek;
    const annualLaborCost = weeklyLaborCost * 52;
    const annualSavings = annualLaborCost * (inputs.automationRate / 100);
    const annualCosts = inputs.implementationCost + (inputs.monthlyMaintenance * 12);
    const netBenefit = annualSavings - annualCosts;
    const roi = annualCosts > 0 ? ((netBenefit / inputs.implementationCost) * 100) : 0;
    const paybackMonths = annualSavings > 0 ? (inputs.implementationCost / (annualSavings / 12)) : 0;

    return {
      annualSavings,
      netBenefit,
      roi,
      paybackMonths,
      threeYearValue: netBenefit * 3,
    };
  };

  const results = calculateROI();

  const reset = () => {
    setInputs({
      hourlyRate: 50,
      hoursPerWeek: 40,
      automationRate: 60,
      implementationCost: 25000,
      monthlyMaintenance: 500,
    });
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Automation ROI Calculator</h3>
            <p className="text-sm text-gray-400">Estimate the return on your process automation investment</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Average Hourly Rate ($)</Label>
              <Input
                type="number"
                value={inputs.hourlyRate}
                onChange={(e) => setInputs({ ...inputs, hourlyRate: Number(e.target.value) })}
                className="mt-1.5 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Hours Spent per Week on Process</Label>
              <Input
                type="number"
                value={inputs.hoursPerWeek}
                onChange={(e) => setInputs({ ...inputs, hoursPerWeek: Number(e.target.value) })}
                className="mt-1.5 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Expected Automation Rate (%)</Label>
              <Input
                type="number"
                max={100}
                value={inputs.automationRate}
                onChange={(e) => setInputs({ ...inputs, automationRate: Number(e.target.value) })}
                className="mt-1.5 bg-white/5 border-white/10 text-white"
              />
              <Progress value={inputs.automationRate} className="mt-2" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Implementation Cost ($)</Label>
              <Input
                type="number"
                value={inputs.implementationCost}
                onChange={(e) => setInputs({ ...inputs, implementationCost: Number(e.target.value) })}
                className="mt-1.5 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Monthly Maintenance Cost ($)</Label>
              <Input
                type="number"
                value={inputs.monthlyMaintenance}
                onChange={(e) => setInputs({ ...inputs, monthlyMaintenance: Number(e.target.value) })}
                className="mt-1.5 bg-white/5 border-white/10 text-white"
              />
            </div>
            <Button onClick={reset} variant="outline" className="w-full border-white/10 text-gray-400">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <Separator className="bg-white/10" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="text-sm text-gray-400">Annual Savings</p>
            <p className="text-2xl font-bold text-amber-400">
              ${Math.round(results.annualSavings).toLocaleString()}
            </p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-sm text-gray-400">Net Benefit (Year 1)</p>
            <p className="text-2xl font-bold text-green-400">
              ${Math.round(results.netBenefit).toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <p className="text-sm text-gray-400">ROI</p>
            <p className="text-2xl font-bold text-purple-400">
              {Math.round(results.roi)}%
            </p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="text-sm text-gray-400">Payback Period</p>
            <p className="text-2xl font-bold text-amber-400">
              {results.paybackMonths.toFixed(1)} months
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">3-Year Value</p>
              <p className="text-3xl font-bold text-white">
                ${Math.round(results.threeYearValue).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-amber-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== AI READINESS SCORE ====================

interface ReadinessQuestion {
  id: string;
  text: string;
  category: string;
}

const readinessQuestions: ReadinessQuestion[] = [
  // Leadership & Strategy
  { id: "exec-support", text: "Executive leadership actively supports AI initiatives", category: "Leadership" },
  { id: "ai-strategy", text: "We have a documented AI strategy aligned with business goals", category: "Leadership" },
  { id: "budget", text: "Budget is allocated for AI/ML projects", category: "Leadership" },
  // Data
  { id: "data-quality", text: "Our data is of sufficient quality for AI applications", category: "Data" },
  { id: "data-access", text: "Data is accessible and well-documented", category: "Data" },
  { id: "data-governance", text: "We have data governance policies in place", category: "Data" },
  // Technology
  { id: "infrastructure", text: "Our infrastructure can support AI workloads", category: "Technology" },
  { id: "cloud-ready", text: "We have cloud capabilities or modern infrastructure", category: "Technology" },
  // Talent
  { id: "ai-talent", text: "We have staff with AI/ML expertise", category: "Talent" },
  { id: "training", text: "Training programs exist for AI skills development", category: "Talent" },
  // Culture
  { id: "innovation", text: "Our culture encourages experimentation and innovation", category: "Culture" },
  { id: "ethics", text: "We have considered AI ethics and responsible AI practices", category: "Culture" },
];

function AIReadinessScore() {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleAnswer = (questionId: string, score: number) => {
    setAnswers({ ...answers, [questionId]: score });
  };

  const calculateScore = () => {
    const totalQuestions = readinessQuestions.length;
    const answeredQuestions = Object.keys(answers).length;
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = totalQuestions * 5;
    const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

    const categoryScores: Record<string, { score: number; count: number }> = {};
    readinessQuestions.forEach((q) => {
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = { score: 0, count: 0 };
      }
      if (answers[q.id] !== undefined) {
        categoryScores[q.category].score += answers[q.id];
        categoryScores[q.category].count += 1;
      }
    });

    return { percentage, answeredQuestions, totalQuestions, categoryScores };
  };

  const getReadinessLevel = (percentage: number) => {
    if (percentage >= 80) return { level: "Highly Ready", color: "text-green-400", bg: "bg-green-500/20" };
    if (percentage >= 60) return { level: "Moderately Ready", color: "text-amber-400", bg: "bg-amber-500/20" };
    if (percentage >= 40) return { level: "Developing", color: "text-amber-400", bg: "bg-amber-500/20" };
    return { level: "Early Stage", color: "text-red-400", bg: "bg-red-500/20" };
  };

  const results = calculateScore();
  const readiness = getReadinessLevel(results.percentage);

  const reset = () => setAnswers({});

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Readiness Score</h3>
            <p className="text-sm text-gray-400">Assess your organization&apos;s readiness for AI adoption</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {readinessQuestions.map((question) => (
              <div key={question.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-300">{question.text}</Label>
                  <Badge variant="outline" className="text-xs border-white/20 text-gray-500">
                    {question.category}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleAnswer(question.id, score)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        answers[question.id] === score
                          ? "bg-amber-500 text-white"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>
              </div>
            ))}
            <Button onClick={reset} variant="outline" className="w-full border-white/10 text-gray-400">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="space-y-6">
            <div className={`p-6 rounded-xl ${readiness.bg} border border-white/10`}>
              <p className="text-sm text-gray-400 mb-2">Overall Readiness</p>
              <p className={`text-4xl font-bold ${readiness.color}`}>{readiness.level}</p>
              <div className="mt-4">
                <Progress value={results.percentage} className="h-3" />
                <p className="text-right text-sm text-gray-400 mt-2">
                  {Math.round(results.percentage)}% ({results.answeredQuestions}/{results.totalQuestions} answered)
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Scores by Category</h4>
              {Object.entries(results.categoryScores).map(([category, data]) => {
                const categoryPercentage = data.count > 0 ? (data.score / (data.count * 5)) * 100 : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{category}</span>
                      <span className="text-white">{Math.round(categoryPercentage)}%</span>
                    </div>
                    <Progress value={categoryPercentage} className="h-2" />
                  </div>
                );
              })}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-2">Recommendations</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {results.percentage < 40 && (
                  <>
                    <li>• Focus on building executive support and strategy</li>
                    <li>• Invest in data foundation and governance</li>
                    <li>• Start with education and awareness programs</li>
                  </>
                )}
                {results.percentage >= 40 && results.percentage < 60 && (
                  <>
                    <li>• Strengthen data infrastructure and quality</li>
                    <li>• Develop internal AI talent or partnerships</li>
                    <li>• Pilot small AI projects to build momentum</li>
                  </>
                )}
                {results.percentage >= 60 && results.percentage < 80 && (
                  <>
                    <li>• Scale successful pilots to production</li>
                    <li>• Formalize AI governance and ethics framework</li>
                    <li>• Expand training programs across teams</li>
                  </>
                )}
                {results.percentage >= 80 && (
                  <>
                    <li>• Consider advanced AI/ML capabilities</li>
                    <li>• Share learnings and become an industry leader</li>
                    <li>• Explore emerging AI technologies</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== PROJECT COST ESTIMATOR ====================

interface CostEstimatorState {
  projectType: string;
  teamSize: number;
  duration: number;
  complexity: number;
  integrations: number;
  compliance: boolean;
}

function ProjectCostEstimator() {
  const [inputs, setInputs] = useState<CostEstimatorState>({
    projectType: "digital-transformation",
    teamSize: 5,
    duration: 6,
    complexity: 3,
    integrations: 3,
    compliance: false,
  });

  const calculateEstimate = () => {
    const baseRates: Record<string, number> = {
      "digital-transformation": 180,
      "ai-implementation": 220,
      "process-automation": 160,
      "consulting": 200,
    };

    const baseRate = baseRates[inputs.projectType] || 180;
    const hoursPerMonth = inputs.teamSize * 160;
    const baseCost = hoursPerMonth * inputs.duration * baseRate;
    
    const complexityMultiplier = 1 + ((inputs.complexity - 1) * 0.2);
    const integrationCost = inputs.integrations * 5000;
    const complianceCost = inputs.compliance ? 25000 : 0;

    const totalCost = (baseCost * complexityMultiplier) + integrationCost + complianceCost;
    const monthlyBurn = totalCost / inputs.duration;

    return {
      totalCost,
      monthlyBurn,
      breakdown: {
        labor: baseCost * complexityMultiplier,
        integrations: integrationCost,
        compliance: complianceCost,
      },
    };
  };

  const estimate = calculateEstimate();

  const reset = () => {
    setInputs({
      projectType: "digital-transformation",
      teamSize: 5,
      duration: 6,
      complexity: 3,
      integrations: 3,
      compliance: false,
    });
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Project Cost Estimator</h3>
            <p className="text-sm text-gray-400">Get a rough estimate for your consulting engagement</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Project Type</Label>
              <select
                value={inputs.projectType}
                onChange={(e) => setInputs({ ...inputs, projectType: e.target.value })}
                className="w-full mt-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="digital-transformation" className="bg-background">Digital Transformation</option>
                <option value="ai-implementation" className="bg-background">AI Implementation</option>
                <option value="process-automation" className="bg-background">Process Automation</option>
                <option value="consulting" className="bg-background">Strategic Consulting</option>
              </select>
            </div>
            <div>
              <Label className="text-gray-300">Team Size</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={inputs.teamSize}
                onChange={(e) => setInputs({ ...inputs, teamSize: Number(e.target.value) })}
                className="mt-1.5 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Duration (months)</Label>
              <Input
                type="number"
                min={1}
                max={24}
                value={inputs.duration}
                onChange={(e) => setInputs({ ...inputs, duration: Number(e.target.value) })}
                className="mt-1.5 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Complexity Level (1-5)</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={inputs.complexity}
                onChange={(e) => setInputs({ ...inputs, complexity: Number(e.target.value) })}
                className="mt-1.5 bg-white/5 border-white/10 text-white"
              />
              <Progress value={(inputs.complexity / 5) * 100} className="mt-2" />
            </div>
            <div>
              <Label className="text-gray-300">Number of Integrations</Label>
              <Input
                type="number"
                min={0}
                max={20}
                value={inputs.integrations}
                onChange={(e) => setInputs({ ...inputs, integrations: Number(e.target.value) })}
                className="mt-1.5 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <Label className="text-gray-300">Compliance Requirements</Label>
              <input
                type="checkbox"
                checked={inputs.compliance}
                onChange={(e) => setInputs({ ...inputs, compliance: e.target.checked })}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500"
              />
            </div>
            <Button onClick={reset} variant="outline" className="w-full border-white/10 text-gray-400">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <Separator className="bg-white/10" />

        <div className="bg-gradient-to-r from-green-500/10 to-amber-500/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400">Estimated Total Cost</p>
              <p className="text-4xl font-bold text-white">
                ${Math.round(estimate.totalCost).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Monthly Burn Rate</p>
              <p className="text-xl font-semibold text-amber-400">
                ${Math.round(estimate.monthlyBurn).toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            * This is a rough estimate. Actual costs may vary based on specific requirements and scope.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-400">Labor</p>
            <p className="text-lg font-semibold text-white">
              ${Math.round(estimate.breakdown.labor).toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-400">Integrations</p>
            <p className="text-lg font-semibold text-white">
              ${Math.round(estimate.breakdown.integrations).toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-400">Compliance</p>
            <p className="text-lg font-semibold text-white">
              ${Math.round(estimate.breakdown.compliance).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== MAIN PAGE COMPONENT ====================

export function CalculatorsPageClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 bg-amber-500/20 text-amber-300 border-amber-500/30">
                Free Tools
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Interactive{" "}
                <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                  Calculators
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Free tools to help you estimate ROI, assess readiness, and plan your 
                digital transformation initiatives.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Calculators */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <AutomationROICalculator />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AIReadinessScore />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ProjectCostEstimator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 border-amber-500/20">
              <CardContent className="p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Want a Detailed Assessment?
                </h2>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                  Our experts can provide a comprehensive analysis tailored to your 
                  specific situation and goals.
                </p>
                <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                  <Link href="/solutions/engagement">
                    Schedule a Consultation
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
