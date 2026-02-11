"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building2,
  Target,
  Mail,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { FadeInOnMount } from "@/components/animations";
import { Label } from "@/components/ui/label";

type EmployeeType = "researcher" | "analyst" | "strategist";
type FocusArea = "market-trends" | "competitor-intel" | "opportunities";

interface DemoFormData {
  employeeType: EmployeeType | null;
  competitors: string[];
  focusAreas: FocusArea[];
  email: string;
}

const steps = [
  { id: 1, title: "Employee Type", icon: User },
  { id: 2, title: "Competitors", icon: Building2 },
  { id: 3, title: "Focus Areas", icon: Target },
  { id: 4, title: "Your Email", icon: Mail },
];

const employeeTypes: { id: EmployeeType; title: string; description: string }[] = [
  {
    id: "researcher",
    title: "AI Researcher",
    description: "Deep-dive intelligence gathering and market analysis",
  },
  {
    id: "analyst",
    title: "AI Analyst",
    description: "Data-driven insights and performance metrics",
  },
  {
    id: "strategist",
    title: "AI Strategist",
    description: "Strategic recommendations and competitive positioning",
  },
];

const focusAreaOptions: { id: FocusArea; label: string }[] = [
  { id: "market-trends", label: "Market Trends" },
  { id: "competitor-intel", label: "Competitor Intelligence" },
  { id: "opportunities", label: "Strategic Opportunities" },
];

export default function DemoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<DemoFormData>({
    employeeType: null,
    competitors: ["", "", ""],
    focusAreas: [],
    email: "",
  });

  const progress = (currentStep / steps.length) * 100;

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.employeeType) {
          newErrors.employeeType = "Please select an employee type";
        }
        break;
      case 2:
        const validCompetitors = formData.competitors.filter((c) => c.trim() !== "");
        if (validCompetitors.length === 0) {
          newErrors.competitors = "Please enter at least one competitor";
        }
        break;
      case 3:
        if (formData.focusAreas.length === 0) {
          newErrors.focusAreas = "Please select at least one focus area";
        }
        break;
      case 4:
        if (!formData.email) {
          newErrors.email = "Please enter your email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/demo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeType: formData.employeeType,
          competitors: formData.competitors.filter((c) => c.trim() !== ""),
          focusAreas: formData.focusAreas,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store brief data in session storage for the result page
        sessionStorage.setItem("demoBrief", JSON.stringify(data.brief));
        sessionStorage.setItem("demoConfig", JSON.stringify({
          employeeType: formData.employeeType,
          competitors: formData.competitors.filter((c) => c.trim() !== ""),
          focusAreas: formData.focusAreas,
        }));
        router.push("/agents/demo/result");
      } else {
        setErrors({ submit: data.error || "Failed to generate brief. Please try again." });
        setIsSubmitting(false);
      }
    } catch {
      setErrors({ submit: "Network error. Please try again." });
      setIsSubmitting(false);
    }
  };

  const updateFormData = <K extends keyof DemoFormData>(
    key: K,
    value: DemoFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when user makes a change
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-void py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <FadeInOnMount>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-pink-500">
                Interactive Demo
              </span>
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Configure Your AI Brief
            </h1>
            <p className="text-muted-foreground">
              Customize your demo experience in just a few steps
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    step.id <= currentStep ? "text-pink-500" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      step.id < currentStep
                        ? "bg-pink-500 text-white"
                        : step.id === currentStep
                        ? "bg-pink-500/20 text-pink-500 border-2 border-pink-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.id < currentStep ? (
                      "✓"
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-xs hidden sm:block">{step.title}</span>
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <Card variant="elevated">
            <CardContent className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 1 && (
                    <StepOneEmployeeType
                      formData={formData}
                      updateFormData={updateFormData}
                      error={errors.employeeType}
                    />
                  )}
                  {currentStep === 2 && (
                    <StepTwoCompetitors
                      formData={formData}
                      updateFormData={updateFormData}
                      error={errors.competitors}
                    />
                  )}
                  {currentStep === 3 && (
                    <StepThreeFocusAreas
                      formData={formData}
                      updateFormData={updateFormData}
                      error={errors.focusAreas}
                    />
                  )}
                  {currentStep === 4 && (
                    <StepFourEmail
                      formData={formData}
                      updateFormData={updateFormData}
                      error={errors.email}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {errors.submit && (
                <p className="mt-4 text-sm text-red-500 text-center">
                  {errors.submit}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={handleNext} variant="beam">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                variant="beam"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Brief
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </FadeInOnMount>
      </div>
    </div>
  );
}

// Step Components
function StepOneEmployeeType({
  formData,
  updateFormData,
  error,
}: {
  formData: DemoFormData;
  updateFormData: <K extends keyof DemoFormData>(key: K, value: DemoFormData[K]) => void;
  error?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-display font-semibold mb-2">
          Select Employee Type
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose the AI employee that best fits your intelligence needs
        </p>
      </div>

      <div className="space-y-3">
        {employeeTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => updateFormData("employeeType", type.id)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              formData.employeeType === type.id
                ? "border-pink-500 bg-pink-500/5"
                : "border-border hover:border-pink-500/30 hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{type.title}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
              {formData.employeeType === type.id && (
                <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function StepTwoCompetitors({
  formData,
  updateFormData,
  error,
}: {
  formData: DemoFormData;
  updateFormData: <K extends keyof DemoFormData>(key: K, value: DemoFormData[K]) => void;
  error?: string;
}) {
  const updateCompetitor = (index: number, value: string) => {
    const newCompetitors = [...formData.competitors];
    newCompetitors[index] = value;
    updateFormData("competitors", newCompetitors);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-display font-semibold mb-2">
          Enter Your Competitors
        </h2>
        <p className="text-sm text-muted-foreground">
          Add up to 3 competitors you&apos;d like to monitor (at least 1 required)
        </p>
      </div>

      <div className="space-y-3">
        {[0, 1, 2].map((index) => (
          <div key={index}>
            <Label htmlFor={`competitor-${index}`} className="text-sm font-medium mb-2 block">
              Competitor {index + 1} {index === 0 && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={`competitor-${index}`}
              placeholder={`e.g., ${["Salesforce", "HubSpot", "Zendesk"][index]}`}
              value={formData.competitors[index]}
              onChange={(e) => updateCompetitor(index, e.target.value)}
            />
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function StepThreeFocusAreas({
  formData,
  updateFormData,
  error,
}: {
  formData: DemoFormData;
  updateFormData: <K extends keyof DemoFormData>(key: K, value: DemoFormData[K]) => void;
  error?: string;
}) {
  const toggleFocusArea = (area: FocusArea) => {
    const newAreas = formData.focusAreas.includes(area)
      ? formData.focusAreas.filter((a) => a !== area)
      : [...formData.focusAreas, area];
    updateFormData("focusAreas", newAreas);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-display font-semibold mb-2">
          Select Focus Areas
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose what intelligence areas matter most to your business
        </p>
      </div>

      <div className="space-y-3">
        {focusAreaOptions.map((area) => (
          <label
            key={area.id}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
              formData.focusAreas.includes(area.id)
                ? "border-pink-500 bg-pink-500/5"
                : "border-border hover:border-pink-500/30 hover:bg-muted/50"
            }`}
          >
            <Checkbox
              checked={formData.focusAreas.includes(area.id)}
              onCheckedChange={() => toggleFocusArea(area.id)}
              className="mr-4"
            />
            <span className="font-medium">{area.label}</span>
          </label>
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function StepFourEmail({
  formData,
  updateFormData,
  error,
}: {
  formData: DemoFormData;
  updateFormData: <K extends keyof DemoFormData>(key: K, value: DemoFormData[K]) => void;
  error?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-display font-semibold mb-2">
          Almost There!
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your email to receive your personalized brief
        </p>
      </div>

      <div className="p-4 rounded-lg bg-muted/50 mb-6">
        <h4 className="font-medium mb-2">Your Configuration:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • Employee: <span className="text-foreground capitalize">{formData.employeeType}</span>
          </li>
          <li>
            • Competitors: <span className="text-foreground">{formData.competitors.filter(c => c).join(", ")}</span>
          </li>
          <li>
            • Focus Areas: <span className="text-foreground">{formData.focusAreas.map(a => a.replace("-", " ")).join(", ")}</span>
          </li>
        </ul>
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-medium mb-2 block">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          error={!!error}
          errorMessage={error}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        We&apos;ll send you a copy of your brief and occasional updates about AI employees. 
        Unsubscribe anytime. One demo per email per day.
      </p>
    </div>
  );
}
