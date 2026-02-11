"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn, SlideUp } from "@/components/animations";
import {
  Calculator,
  Users,
  DollarSign,
  Clock,
  Share2,
  ArrowRight,
  TrendingDown,
  Clock4,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

// Animated number counter component
function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1.5,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

  return (
    <span>
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </span>
  );
}

// Input field component with label and icon
function InputField({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "number",
  min = 0,
}: {
  label: string;
  icon: React.ElementType;
  value: number;
  onChange: (value: number) => void;
  placeholder: string;
  type?: string;
  min?: number;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        {label}
      </label>
      <Input
        type={type}
        min={min}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        placeholder={placeholder}
        className="h-12 text-lg font-mono border-border/50 focus:border-primary focus:ring-primary/20"
      />
    </div>
  );
}

// Result card component
function ResultCard({
  label,
  value,
  prefix = "",
  suffix = "",
  highlight = false,
  delay = 0,
  icon: Icon,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  highlight?: boolean;
  delay?: number;
  icon: React.ElementType;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="will-change-transform"
    >
      <Card
        className={`overflow-hidden ${
          highlight
            ? "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
            : "border-border/50"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2 rounded-lg ${
                highlight ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
          </div>
          <div
            className={`text-3xl md:text-4xl font-display font-bold ${
              highlight ? "text-gradient-beam" : "text-foreground"
            }`}
          >
            <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Bar chart component (CSS-based)
function CostComparisonChart({
  humanCost,
  aiCost,
}: {
  humanCost: number;
  aiCost: number;
}) {
  const maxValue = Math.max(humanCost, aiCost);
  const humanPercent = (humanCost / maxValue) * 100;
  const aiPercent = (aiCost / maxValue) * 100;

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-primary" />
          Cost Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Human Cost Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-muted-foreground">Human Team Cost</span>
            <span className="font-mono font-semibold text-foreground">
              ${humanCost.toLocaleString()}/mo
            </span>
          </div>
          <div className="h-8 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${humanPercent}%` }}
              transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="h-full bg-gradient-to-r from-void-400 to-void-500 rounded-full will-change-transform"
            />
          </div>
        </div>

        {/* AI Cost Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" />
              Pink Beam AI Cost
            </span>
            <span className="font-mono font-semibold text-primary">
              ${aiCost.toLocaleString()}/mo
            </span>
          </div>
          <div className="h-8 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${aiPercent}%` }}
              transition={{ duration: 1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="h-full bg-gradient-beam rounded-full will-change-transform"
            />
          </div>
        </div>

        {/* Savings indicator */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly Savings</span>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-xl font-display font-bold text-gradient-beam will-change-transform"
            >
              ${(humanCost - aiCost).toLocaleString()}
            </motion.span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main calculator component
export function ROICalculator() {
  // Input states
  const [teamSize, setTeamSize] = useState<number>(5);
  const [avgSalary, setAvgSalary] = useState<number>(60000);
  const [researchHours, setResearchHours] = useState<number>(10);
  const [salesHours, setSalesHours] = useState<number>(15);
  const [supportHours, setSupportHours] = useState<number>(20);
  const [contentHours, setContentHours] = useState<number>(8);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // AI pricing constants
  const AI_PRICING = {
    research: 500,
    sales: 600,
    support: 600,
    content: 500,
  };

  // Calculations
  const hourlyRate = avgSalary / 2080; // 2080 work hours per year
  const weeksPerMonth = 4.3;

  // Hours cost calculations
  const researchCost = researchHours * hourlyRate * weeksPerMonth;
  const salesCost = salesHours * hourlyRate * weeksPerMonth;
  const supportCost = supportHours * hourlyRate * weeksPerMonth;
  const contentCost = contentHours * hourlyRate * weeksPerMonth;
  const totalHoursCost = researchCost + salesCost + supportCost + contentCost;

  // Team cost
  const monthlyTeamCost = (avgSalary / 12) * teamSize;

  // Total human cost (team + hours)
  const totalHumanCost = monthlyTeamCost + totalHoursCost;

  // AI cost (based on which tasks have hours allocated)
  const aiResearchCost = researchHours > 0 ? AI_PRICING.research : 0;
  const aiSalesCost = salesHours > 0 ? AI_PRICING.sales : 0;
  const aiSupportCost = supportHours > 0 ? AI_PRICING.support : 0;
  const aiContentCost = contentHours > 0 ? AI_PRICING.content : 0;
  const totalAICost = aiResearchCost + aiSalesCost + aiSupportCost + aiContentCost;

  // Savings
  const monthlySavings = totalHumanCost - totalAICost;
  const annualSavings = monthlySavings * 12;
  const totalHoursPerWeek = researchHours + salesHours + supportHours + contentHours;
  const roiPercentage = totalHumanCost > 0 ? (monthlySavings / totalHumanCost) * 100 : 0;

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleShare = () => {
    const shareText = `
🚀 My AI Savings with Pink Beam:

💰 Current monthly cost: $${Math.round(totalHumanCost).toLocaleString()}
🤖 Pink Beam AI cost: $${totalAICost.toLocaleString()}
💸 Monthly savings: $${Math.round(monthlySavings).toLocaleString()}
📈 Annual savings: $${Math.round(annualSavings).toLocaleString()}
⏰ Hours saved per week: ${totalHoursPerWeek}

Calculate your savings at https://pinkbeam.io/calculator
    `.trim();

    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 md:py-24 bg-background border-t">
      <div className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-beam-glow pointer-events-none opacity-50" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Calculator className="w-4 h-4" />
                ROI Calculator
              </div>
              <h1 className="text-hero font-display font-bold mb-6">
                Calculate Your{" "}
                <span className="text-gradient-beam">Savings</span>
              </h1>
              <p className="text-lead text-muted-foreground">
                See how much you can save by replacing human hours with AI employees.
                Our calculator compares your current costs with Pink Beam&apos;s AI workforce pricing.
              </p>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Input Form */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="will-change-transform"
            >
              <Card className="border-border/50 shadow-lg shadow-void-900/5">
                <CardHeader className="pb-4">
                  <CardTitle className="text-h3 font-display flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    Your Team
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField
                      label="Team Size"
                      icon={Users}
                      value={teamSize}
                      onChange={setTeamSize}
                      placeholder="e.g., 5"
                    />
                    <InputField
                      label="Average Salary ($/year)"
                      icon={DollarSign}
                      value={avgSalary}
                      onChange={setAvgSalary}
                      placeholder="e.g., 60000"
                    />
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <h3 className="text-h4 font-display mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Hours Spent Per Week
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <InputField
                        label="Research Tasks"
                        icon={Clock4}
                        value={researchHours}
                        onChange={setResearchHours}
                        placeholder="e.g., 10"
                      />
                      <InputField
                        label="Sales Outreach"
                        icon={Clock4}
                        value={salesHours}
                        onChange={setSalesHours}
                        placeholder="e.g., 15"
                      />
                      <InputField
                        label="Customer Support"
                        icon={Clock4}
                        value={supportHours}
                        onChange={setSupportHours}
                        placeholder="e.g., 20"
                      />
                      <InputField
                        label="Content Creation"
                        icon={Clock4}
                        value={contentHours}
                        onChange={setContentHours}
                        placeholder="e.g., 8"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleCalculate}
                    size="lg"
                    className="w-full h-14 text-lg font-display bg-gradient-beam hover:opacity-90 shadow-beam hover:shadow-glow-pink-md transition-all"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Savings
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Section */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {showResults ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6 will-change-transform"
                  >
                    {/* Main Results Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <ResultCard
                        label="Current Monthly Cost"
                        value={Math.round(totalHumanCost)}
                        prefix="$"
                        icon={DollarSign}
                        delay={0.1}
                      />
                      <ResultCard
                        label="Pink Beam AI Cost"
                        value={totalAICost}
                        prefix="$"
                        icon={Sparkles}
                        delay={0.2}
                      />
                      <ResultCard
                        label="Monthly Savings"
                        value={Math.round(monthlySavings)}
                        prefix="$"
                        highlight
                        icon={TrendingDown}
                        delay={0.3}
                      />
                      <ResultCard
                        label="Annual Savings"
                        value={Math.round(annualSavings)}
                        prefix="$"
                        highlight
                        icon={TrendingDown}
                        delay={0.4}
                      />
                    </div>

                    {/* Chart */}
                    <CostComparisonChart humanCost={totalHumanCost} aiCost={totalAICost} />

                    {/* Additional Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="grid grid-cols-2 gap-4 will-change-transform"
                    >
                      <Card className="border-border/50">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <Clock4 className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Hours Saved/Week</p>
                            <p className="text-2xl font-display font-bold text-foreground">
                              <AnimatedNumber value={totalHoursPerWeek} suffix="h" />
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-border/50">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <TrendingDown className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">ROI</p>
                            <p className="text-2xl font-display font-bold text-gradient-beam">
                              <AnimatedNumber value={Math.round(roiPercentage)} suffix="%" />
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Share & CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="flex flex-col sm:flex-row gap-4 will-change-transform"
                    >
                      <Button
                        onClick={handleShare}
                        variant="outline"
                        size="lg"
                        className="flex-1 h-12"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2 text-success-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Results
                          </>
                        )}
                      </Button>
                      <Button
                        size="lg"
                        className="flex-1 h-12 bg-gradient-beam hover:opacity-90 shadow-beam hover:shadow-glow-pink-md transition-all font-display"
                        asChild
                      >
                        <a href="/agents">
                          Start Saving Today
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </motion.div>

                    {/* Breakdown Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="will-change-transform"
                    >
                      <Card className="border-border/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-display">Cost Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {researchHours > 0 && (
                            <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                              <span className="text-sm text-muted-foreground">Research AI</span>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground line-through">
                                  ${Math.round(researchCost).toLocaleString()}/mo
                                </span>
                                <span className="font-mono font-medium text-primary">
                                  ${AI_PRICING.research}/mo
                                </span>
                              </div>
                            </div>
                          )}
                          {salesHours > 0 && (
                            <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                              <span className="text-sm text-muted-foreground">Sales AI</span>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground line-through">
                                  ${Math.round(salesCost).toLocaleString()}/mo
                                </span>
                                <span className="font-mono font-medium text-primary">
                                  ${AI_PRICING.sales}/mo
                                </span>
                              </div>
                            </div>
                          )}
                          {supportHours > 0 && (
                            <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                              <span className="text-sm text-muted-foreground">Support AI</span>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground line-through">
                                  ${Math.round(supportCost).toLocaleString()}/mo
                                </span>
                                <span className="font-mono font-medium text-primary">
                                  ${AI_PRICING.support}/mo
                                </span>
                              </div>
                            </div>
                          )}
                          {contentHours > 0 && (
                            <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                              <span className="text-sm text-muted-foreground">Content AI</span>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground line-through">
                                  ${Math.round(contentCost).toLocaleString()}/mo
                                </span>
                                <span className="font-mono font-medium text-primary">
                                  ${AI_PRICING.content}/mo
                                </span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex items-center justify-center will-change-transform"
                  >
                    <Card className="border-border/50 border-dashed w-full">
                      <CardContent className="p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Calculator className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-h4 font-display mb-2">Ready to Calculate</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                          Enter your team details and hours spent on tasks, then click
                          Calculate Savings to see your potential ROI.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
