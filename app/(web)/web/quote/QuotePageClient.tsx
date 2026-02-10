"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Check, Send, Save } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { WebHero } from "../components/WebHero";

// Form data types
interface QuoteFormData {
  // Step 1: Contact
  fullName: string;
  email: string;
  phone: string;
  company: string;
  website: string;

  // Step 2: Project
  projectType: string;
  services: string[];
  pageCount: string;
  needsEcommerce: boolean;
  cmsPreference: string;
  budgetRange: string;
  timeline: string;

  // Step 3: Details
  description: string;
  referralSource: string;
  agreedToTerms: boolean;
  marketingConsent: boolean;
}

const initialFormData: QuoteFormData = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  projectType: "",
  services: [],
  pageCount: "",
  needsEcommerce: false,
  cmsPreference: "",
  budgetRange: "",
  timeline: "",
  description: "",
  referralSource: "",
  agreedToTerms: false,
  marketingConsent: false,
};

const projectTypes = [
  { value: "new", label: "New Website" },
  { value: "redesign", label: "Website Redesign" },
  { value: "migration", label: "Platform Migration" },
  { value: "ecommerce", label: "E-commerce Store" },
  { value: "other", label: "Other" },
];

const serviceOptions = [
  { value: "design", label: "Web Design" },
  { value: "development", label: "Development" },
  { value: "seo", label: "SEO" },
  { value: "maintenance", label: "Maintenance" },
];

const cmsOptions = [
  { value: "none", label: "No CMS needed" },
  { value: "wordpress", label: "WordPress" },
  { value: "custom", label: "Custom CMS" },
  { value: "shopify", label: "Shopify" },
  { value: "other", label: "Other" },
];

const budgetRanges = [
  { value: "2k-5k", label: "$2,000 - $5,000" },
  { value: "5k-10k", label: "$5,000 - $10,000" },
  { value: "10k-25k", label: "$10,000 - $25,000" },
  { value: "25k+", label: "$25,000+" },
  { value: "unsure", label: "Not sure yet" },
];

const timelines = [
  { value: "urgent", label: "ASAP (Rush project)" },
  { value: "1-3months", label: "1-3 months" },
  { value: "3-6months", label: "3-6 months" },
  { value: "flexible", label: "Flexible" },
];

const referralSources = [
  { value: "google", label: "Google Search" },
  { value: "social", label: "Social Media" },
  { value: "referral", label: "Referral" },
  { value: "other", label: "Other" },
];

// Progress bar component
function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <div className="w-full bg-muted rounded-full h-2 mb-8">
      <div
        className="bg-gradient-to-r from-violet-500 to-violet-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// Validation functions
function validateStep1(data: QuoteFormData): string[] {
  const errors: string[] = [];
  if (!data.fullName.trim()) errors.push("Full name is required");
  if (!data.email.trim()) errors.push("Email is required");
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Valid email is required");
  }
  return errors;
}

function validateStep2(data: QuoteFormData): string[] {
  const errors: string[] = [];
  if (!data.projectType) errors.push("Project type is required");
  if (data.services.length === 0) errors.push("At least one service is required");
  if (!data.budgetRange) errors.push("Budget range is required");
  if (!data.timeline) errors.push("Timeline is required");
  return errors;
}

function validateStep3(data: QuoteFormData): string[] {
  const errors: string[] = [];
  if (!data.description.trim()) errors.push("Project description is required");
  if (!data.agreedToTerms) errors.push("You must agree to the terms");
  return errors;
}

export function QuotePageClient() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("quoteFormData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch {
        // Invalid saved data, ignore
      }
    }

    // Pre-fill from URL params
    const type = searchParams.get("type");
    const budget = searchParams.get("budget");
    
    if (type) {
      const typeMap: Record<string, string> = {
        landing: "new",
        starter: "new",
        business: "new",
        ecommerce: "ecommerce",
        custom: "other",
      };
      setFormData((prev) => ({
        ...prev,
        projectType: typeMap[type] || "",
        services: type === "ecommerce" ? ["design", "development"] : [],
      }));
    }
  }, [searchParams]);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("quoteFormData", JSON.stringify(formData));
      setLastSaved(new Date());
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

  const updateFormData = (updates: Partial<QuoteFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setErrors([]);
  };

  const handleNext = () => {
    let validationErrors: string[] = [];
    
    if (currentStep === 1) validationErrors = validateStep1(formData);
    else if (currentStep === 2) validationErrors = validateStep2(formData);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3));
    setErrors([]);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors([]);
  };

  const handleSubmit = async () => {
    const validationErrors = validateStep3(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.fieldErrors) {
          const fieldErrors = Object.values(data.error.fieldErrors).flat() as string[];
          setErrors(fieldErrors.length > 0 ? fieldErrors : ["Failed to submit. Please try again."]);
        } else {
          setErrors([typeof data.error === "string" ? data.error : "Failed to submit. Please try again."]);
        }
        return;
      }

      localStorage.removeItem("quoteFormData");
      setIsSuccess(true);
    } catch {
      setErrors(["Network error. Please check your connection and try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen">
        <WebHero />
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Quote Request Submitted!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Thank you for your interest. We'll review your project details and get back to you within 24 hours.
              </p>
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </FadeIn>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <WebHero />
      
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Request a Quote
              </h1>
              <p className="text-muted-foreground">
                Tell us about your project and we'll get back to you within 24 hours.
              </p>
            </div>

            <ProgressBar currentStep={currentStep} totalSteps={3} />

            {lastSaved && (
              <p className="text-xs text-muted-foreground text-center mb-4">
                <Save className="w-3 h-3 inline mr-1" />
                Auto-saved at {lastSaved.toLocaleTimeString()}
              </p>
            )}

            {/* Error Display */}
            {errors.length > 0 && (
              <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-medium mb-2">Please fix the following:</p>
                <ul className="text-sm text-destructive list-disc list-inside">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step 1: Contact Information */}
            {currentStep === 1 && (
              <FadeIn>
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => updateFormData({ fullName: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData({ email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData({ phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => updateFormData({ company: e.target.value })}
                        placeholder="Acme Inc."
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Current Website (if any)</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => updateFormData({ website: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Step 2: Project Details */}
            {currentStep === 2 && (
              <FadeIn>
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Project Details</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Project Type *</Label>
                      <Select
                        value={formData.projectType}
                        onValueChange={(value) => updateFormData({ projectType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="mb-2 block">Services Needed *</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {serviceOptions.map((service) => (
                          <div key={service.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={service.value}
                              checked={formData.services.includes(service.value)}
                              onCheckedChange={(checked) => {
                                const newServices = checked
                                  ? [...formData.services, service.value]
                                  : formData.services.filter((s) => s !== service.value);
                                updateFormData({ services: newServices });
                              }}
                            />
                            <Label htmlFor={service.value} className="text-sm font-normal">
                              {service.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="pageCount">Estimated Number of Pages</Label>
                      <Input
                        id="pageCount"
                        type="number"
                        value={formData.pageCount}
                        onChange={(e) => updateFormData({ pageCount: e.target.value })}
                        placeholder="5"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="needsEcommerce"
                        checked={formData.needsEcommerce}
                        onCheckedChange={(checked) =>
                          updateFormData({ needsEcommerce: checked as boolean })
                        }
                      />
                      <Label htmlFor="needsEcommerce" className="font-normal">
                        E-commerce functionality needed
                      </Label>
                    </div>

                    <div>
                      <Label>CMS Preference</Label>
                      <Select
                        value={formData.cmsPreference}
                        onValueChange={(value) => updateFormData({ cmsPreference: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select CMS preference" />
                        </SelectTrigger>
                        <SelectContent>
                          {cmsOptions.map((cms) => (
                            <SelectItem key={cms.value} value={cms.value}>
                              {cms.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Budget Range *</Label>
                      <Select
                        value={formData.budgetRange}
                        onValueChange={(value) => updateFormData({ budgetRange: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Timeline *</Label>
                      <Select
                        value={formData.timeline}
                        onValueChange={(value) => updateFormData({ timeline: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {timelines.map((timeline) => (
                            <SelectItem key={timeline.value} value={timeline.value}>
                              {timeline.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Step 3: Additional Information */}
            {currentStep === 3 && (
              <FadeIn>
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Additional Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Project Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => updateFormData({ description: e.target.value })}
                        placeholder="Tell us about your project goals, target audience, and any specific requirements..."
                        rows={5}
                      />
                    </div>

                    <div>
                      <Label>How did you hear about us?</Label>
                      <Select
                        value={formData.referralSource}
                        onValueChange={(value) => updateFormData({ referralSource: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select referral source" />
                        </SelectTrigger>
                        <SelectContent>
                          {referralSources.map((source) => (
                            <SelectItem key={source.value} value={source.value}>
                              {source.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreedToTerms"
                        checked={formData.agreedToTerms}
                        onCheckedChange={(checked) =>
                          updateFormData({ agreedToTerms: checked as boolean })
                        }
                      />
                      <Label htmlFor="agreedToTerms" className="text-sm font-normal leading-tight">
                        I agree to be contacted about my project inquiry *
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="marketingConsent"
                        checked={formData.marketingConsent}
                        onCheckedChange={(checked) =>
                          updateFormData({ marketingConsent: checked as boolean })
                        }
                      />
                      <Label htmlFor="marketingConsent" className="text-sm font-normal leading-tight">
                        Send me occasional updates and marketing (optional)
                      </Label>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-violet-500 to-violet-600"
                >
                  {isSubmitting ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      Submit Request
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
