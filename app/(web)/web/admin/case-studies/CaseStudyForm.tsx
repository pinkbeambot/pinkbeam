"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  INDUSTRIES,
  SERVICES,
  ENGAGEMENT_TYPES,
  type CaseStudy,
  type CaseStudyMetric,
} from "@/lib/case-studies-types";
import { Plus, X } from "lucide-react";

interface CaseStudyFormProps {
  caseStudy?: CaseStudy;
  onSubmit: (data: Partial<CaseStudy>) => void;
  onCancel: () => void;
}

export function CaseStudyForm({
  caseStudy,
  onSubmit,
  onCancel,
}: CaseStudyFormProps) {
  const [formData, setFormData] = useState<Partial<CaseStudy>>({
    title: caseStudy?.title || "",
    slug: caseStudy?.slug || "",
    clientName: caseStudy?.clientName || "",
    industry: caseStudy?.industry || INDUSTRIES[0],
    isAnonymous: caseStudy?.isAnonymous || false,
    challenge: caseStudy?.challenge || "",
    solution: caseStudy?.solution || "",
    results: caseStudy?.results || "",
    metrics: caseStudy?.metrics || [{ label: "", value: "" }],
    services: caseStudy?.services || [],
    engagementType: caseStudy?.engagementType || ENGAGEMENT_TYPES[0],
    testimonial: caseStudy?.testimonial || "",
    testimonialAuthor: caseStudy?.testimonialAuthor || "",
    testimonialTitle: caseStudy?.testimonialTitle || "",
    published: caseStudy?.published || false,
    featured: caseStudy?.featured || false,
  });

  const [newMetric, setNewMetric] = useState<CaseStudyMetric>({
    label: "",
    value: "",
  });

  const handleChange = (
    field: keyof CaseStudy,
    value: string | boolean | string[] | CaseStudyMetric[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSlugGenerate = () => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const addMetric = () => {
    if (newMetric.label && newMetric.value) {
      setFormData((prev) => ({
        ...prev,
        metrics: [...(prev.metrics || []), newMetric],
      }));
      setNewMetric({ label: "", value: "" });
    }
  };

  const removeMetric = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      metrics: prev.metrics?.filter((_, i) => i !== index) || [],
    }));
  };

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services?.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...(prev.services || []), service],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Basic Info */}
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                onBlur={handleSlugGenerate}
                placeholder="e.g., Healthcare AI Transformation"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                placeholder="healthcare-ai-transformation"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleChange("clientName", e.target.value)}
                placeholder="e.g., MediCare Plus"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                required
              >
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="engagementType">Engagement Type *</Label>
            <select
              id="engagementType"
              value={formData.engagementType}
              onChange={(e) => handleChange("engagementType", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              required
            >
              {ENGAGEMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isAnonymous"
              checked={formData.isAnonymous}
              onCheckedChange={(checked) =>
                handleChange("isAnonymous", checked as boolean)
              }
            />
            <Label htmlFor="isAnonymous" className="cursor-pointer">
              Anonymous Client (hide company name publicly)
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Services Provided *</Label>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map((service) => (
                <Badge
                  key={service}
                  variant={
                    formData.services?.includes(service) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleService(service)}
                >
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Content */}
        <TabsContent value="content" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="challenge">Challenge *</Label>
            <Textarea
              id="challenge"
              value={formData.challenge}
              onChange={(e) => handleChange("challenge", e.target.value)}
              placeholder="Describe the client's challenges and pain points..."
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="solution">Solution *</Label>
            <Textarea
              id="solution"
              value={formData.solution}
              onChange={(e) => handleChange("solution", e.target.value)}
              placeholder="Describe the solution and approach we took..."
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="results">Results *</Label>
            <Textarea
              id="results"
              value={formData.results}
              onChange={(e) => handleChange("results", e.target.value)}
              placeholder="Describe the results and outcomes achieved..."
              rows={5}
              required
            />
          </div>
        </TabsContent>

        {/* Metrics */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="space-y-2">
            <Label>Key Metrics</Label>
            <div className="space-y-2">
              {formData.metrics?.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 rounded-lg bg-muted"
                >
                  <div className="flex-1">
                    <p className="font-medium">{metric.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMetric(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Label (e.g., ROI Improvement)"
                value={newMetric.label}
                onChange={(e) =>
                  setNewMetric((prev) => ({ ...prev, label: e.target.value }))
                }
              />
              <Input
                placeholder="Value (e.g., 300%)"
                value={newMetric.value}
                onChange={(e) =>
                  setNewMetric((prev) => ({ ...prev, value: e.target.value }))
                }
              />
              <Button type="button" onClick={addMetric}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testimonial">Testimonial (Optional)</Label>
              <Textarea
                id="testimonial"
                value={formData.testimonial}
                onChange={(e) => handleChange("testimonial", e.target.value)}
                placeholder="Client testimonial quote..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testimonialAuthor">Author Name</Label>
                <Input
                  id="testimonialAuthor"
                  value={formData.testimonialAuthor}
                  onChange={(e) =>
                    handleChange("testimonialAuthor", e.target.value)
                  }
                  placeholder="e.g., John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testimonialTitle">Author Title</Label>
                <Input
                  id="testimonialTitle"
                  value={formData.testimonialTitle}
                  onChange={(e) =>
                    handleChange("testimonialTitle", e.target.value)
                  }
                  placeholder="e.g., CTO"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Checkbox
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) =>
                  handleChange("published", checked as boolean)
                }
              />
              <Label htmlFor="published" className="cursor-pointer">
                Published
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  handleChange("featured", checked as boolean)
                }
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Featured
              </Label>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {caseStudy ? "Update Case Study" : "Create Case Study"}
        </Button>
      </div>
    </form>
  );
}
