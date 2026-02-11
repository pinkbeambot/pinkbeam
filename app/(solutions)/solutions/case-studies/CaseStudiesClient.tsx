"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  ArrowRight,
  Building2,
  TrendingUp,
  Briefcase,
  X,
  ChevronDown,
} from "lucide-react";
import type { CaseStudy, CaseStudyMetric } from "@/lib/case-studies";

interface CaseStudiesClientProps {
  caseStudies: CaseStudy[];
  filterOptions: {
    industries: string[];
    services: string[];
    engagementTypes: string[];
  };
}

export function CaseStudiesClient({
  caseStudies,
  filterOptions,
}: CaseStudiesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("all");
  const [selectedEngagement, setSelectedEngagement] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter((study) => {
      const matchesSearch =
        searchQuery === "" ||
        study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.services.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesIndustry =
        selectedIndustry === "all" || study.industry === selectedIndustry;

      const matchesService =
        selectedService === "all" || study.services.includes(selectedService);

      const matchesEngagement =
        selectedEngagement === "all" ||
        study.engagementType === selectedEngagement;

      return (
        matchesSearch && matchesIndustry && matchesService && matchesEngagement
      );
    });
  }, [caseStudies, searchQuery, selectedIndustry, selectedService, selectedEngagement]);

  const hasActiveFilters =
    selectedIndustry !== "all" ||
    selectedService !== "all" ||
    selectedEngagement !== "all" ||
    searchQuery !== "";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedIndustry("all");
    setSelectedService("all");
    setSelectedEngagement("all");
  };

  const activeFiltersCount = [
    selectedIndustry !== "all",
    selectedService !== "all",
    selectedEngagement !== "all",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
              Case Studies
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Proven Results for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Real Businesses
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore how we&apos;ve helped organizations transform their operations,
              accelerate growth, and achieve measurable outcomes.
            </p>
          </FadeIn>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
          <span className="text-sm">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 border-y border-[#2A2A3C]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search case studies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#1A1A24] border-[#2A2A3C] text-white placeholder:text-muted-foreground"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-white" />
                  </button>
                )}
              </div>

              {/* Filter Toggle (Mobile) */}
              <Button
                variant="outline"
                className="lg:hidden border-[#2A2A3C]"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {/* Filters */}
              <div
                className={`flex flex-col lg:flex-row gap-3 w-full lg:w-auto ${
                  showFilters ? "block" : "hidden lg:flex"
                }`}
              >
                <Select
                  value={selectedIndustry}
                  onValueChange={setSelectedIndustry}
                >
                  <SelectTrigger className="w-full lg:w-44 bg-[#1A1A24] border-[#2A2A3C]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {filterOptions.industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedService}
                  onValueChange={setSelectedService}
                >
                  <SelectTrigger className="w-full lg:w-44 bg-[#1A1A24] border-[#2A2A3C]">
                    <SelectValue placeholder="Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    {filterOptions.services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedEngagement}
                  onValueChange={setSelectedEngagement}
                >
                  <SelectTrigger className="w-full lg:w-44 bg-[#1A1A24] border-[#2A2A3C]">
                    <SelectValue placeholder="Engagement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {filterOptions.engagementTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-white"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Results Count */}
      <section className="py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCaseStudies.length} case study
            {filteredCaseStudies.length !== 1 ? "ies" : "y"}
            {hasActiveFilters && " with applied filters"}
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCaseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCaseStudies.map((study, index) => (
                <FadeIn key={study.id} delay={index * 0.1}>
                  <CaseStudyCard caseStudy={study} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <FadeIn>
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#1A1A24] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No case studies found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-[#2A2A3C]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center p-8 rounded-2xl bg-gradient-to-b from-[#1A1A24] to-[#0F0F17] border border-amber-500/20">
              <h3 className="text-2xl font-display font-bold text-white mb-2">
                Ready for Similar Results?
              </h3>
              <p className="text-muted-foreground mb-6">
                Let&apos;s discuss how we can help your business achieve
                transformative outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90"
                  asChild
                >
                  <Link href="/contact">
                    Start Your Transformation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-amber-500/30 hover:bg-amber-500/10"
                  asChild
                >
                  <Link href="/solutions">Explore Services</Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  const displayName = caseStudy.isAnonymous
    ? `${caseStudy.industry} Company`
    : caseStudy.clientName;

  const primaryMetric = caseStudy.metrics[0];

  return (
    <Link href={`/solutions/case-studies/${caseStudy.slug}`}>
      <div className="h-full p-6 rounded-2xl bg-[#1A1A24] border border-[#2A2A3C] hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 flex flex-col group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{displayName}</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                {caseStudy.industry}
              </Badge>
            </div>
          </div>
          {caseStudy.featured && (
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
              Featured
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors">
          {caseStudy.title}
        </h3>

        {/* Metrics Preview */}
        {primaryMetric && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-muted-foreground">
                {primaryMetric.label}
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-amber-400">
              {primaryMetric.value}
            </p>
          </div>
        )}

        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-4">
          {caseStudy.services.slice(0, 3).map((service) => (
            <span
              key={service}
              className="text-xs px-2 py-1 rounded bg-[#2A2A3C] text-muted-foreground"
            >
              {service}
            </span>
          ))}
          {caseStudy.services.length > 3 && (
            <span className="text-xs px-2 py-1 rounded bg-[#2A2A3C] text-muted-foreground">
              +{caseStudy.services.length - 3}
            </span>
          )}
        </div>

        {/* Engagement Type */}
        <div className="mt-auto pt-4 border-t border-[#2A2A3C] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4" />
            {caseStudy.engagementType}
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}
