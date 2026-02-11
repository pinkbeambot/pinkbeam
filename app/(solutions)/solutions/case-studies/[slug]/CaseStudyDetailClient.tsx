"use client";

import Link from "next/link";
import { FadeIn } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Target,
  Lightbulb,
  TrendingUp,
  Quote,
  Share2,
  Linkedin,
  Twitter,
  Link as LinkIcon,
  Clock,
  Users,
  CheckCircle2,
} from "lucide-react";
import type { CaseStudy, CaseStudyMetric } from "@/lib/case-studies";

interface CaseStudyDetailClientProps {
  caseStudy: CaseStudy;
  relatedCaseStudies: CaseStudy[];
}

export function CaseStudyDetailClient({
  caseStudy,
  relatedCaseStudies,
}: CaseStudyDetailClientProps) {
  const displayName = caseStudy.isAnonymous
    ? `${caseStudy.industry} Company`
    : caseStudy.clientName;

  const handleShare = async (platform: "linkedin" | "twitter" | "copy") => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/solutions/case-studies/${caseStudy.slug}`;
    const text = `Case Study: ${caseStudy.title}`;

    switch (platform) {
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "copy":
        await navigator.clipboard.writeText(url);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FadeIn>
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/solutions/case-studies">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Case Studies
            </Link>
          </Button>
        </FadeIn>
      </div>

      {/* Hero */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              {/* Industry & Featured Badge */}
              <div className="flex items-center gap-3 mb-6">
                <Badge
                  variant="secondary"
                  className="bg-amber-500/10 text-amber-400"
                >
                  {caseStudy.industry}
                </Badge>
                {caseStudy.featured && (
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                    Featured Case Study
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
                {caseStudy.title}
              </h1>

              {/* Client Info */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-white">{displayName}</p>
                  <p className="text-muted-foreground">
                    {caseStudy.engagementType} Engagement
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Key Metrics Bar */}
            <FadeIn delay={0.1}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#1A1A24] border border-[#2A2A3C]">
                {caseStudy.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className={`text-center ${
                      index < caseStudy.metrics.length - 1
                        ? "lg:border-r lg:border-[#2A2A3C]"
                        : ""
                    }`}
                  >
                    <p className="text-3xl lg:text-4xl font-display font-bold text-amber-400 mb-1">
                      {metric.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_280px] gap-12">
              {/* Left Column - Content */}
              <div className="space-y-12">
                {/* Challenge Section */}
                <FadeIn>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold text-white mb-4">
                        The Challenge
                      </h2>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                          {caseStudy.challenge}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                {/* Solution Section */}
                <FadeIn>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold text-white mb-4">
                        Our Solution
                      </h2>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                          {caseStudy.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                {/* Results Section */}
                <FadeIn>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold text-white mb-4">
                        The Results
                      </h2>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                          {caseStudy.results}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                {/* Testimonial */}
                {caseStudy.testimonial && (
                  <FadeIn>
                    <Card className="bg-gradient-to-br from-amber-500/5 to-amber-600/5 border-amber-500/20">
                      <CardContent className="p-8">
                        <Quote className="w-10 h-10 text-amber-400 mb-4" />
                        <blockquote className="text-xl text-white leading-relaxed mb-6">
                          &ldquo;{caseStudy.testimonial}&rdquo;
                        </blockquote>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-amber-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {caseStudy.testimonialAuthor}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {caseStudy.testimonialTitle}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                )}

                {/* Share */}
                <FadeIn>
                  <div className="flex items-center gap-4 pt-8 border-t border-[#2A2A3C]">
                    <span className="text-sm text-muted-foreground">
                      Share this case study:
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleShare("linkedin")}
                        className="border-[#2A2A3C] hover:border-amber-500/30 hover:bg-amber-500/10"
                      >
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleShare("twitter")}
                        className="border-[#2A2A3C] hover:border-amber-500/30 hover:bg-amber-500/10"
                      >
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleShare("copy")}
                        className="border-[#2A2A3C] hover:border-amber-500/30 hover:bg-amber-500/10"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Services */}
                <FadeIn delay={0.2}>
                  <Card className="bg-[#1A1A24] border-[#2A2A3C]">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        Services Provided
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {caseStudy.services.map((service) => (
                          <Badge
                            key={service}
                            variant="secondary"
                            className="bg-[#2A2A3C] text-muted-foreground"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>

                {/* Engagement Details */}
                <FadeIn delay={0.3}>
                  <Card className="bg-[#1A1A24] border-[#2A2A3C]">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        Engagement Details
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type</span>
                          <span className="text-white">
                            {caseStudy.engagementType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Industry</span>
                          <span className="text-white">
                            {caseStudy.industry}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>

                {/* CTA */}
                <FadeIn delay={0.4}>
                  <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-white mb-2">
                        Want Similar Results?
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Let&apos;s discuss how we can help your business achieve
                        transformative outcomes.
                      </p>
                      <Button
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90"
                        asChild
                      >
                        <Link href="/contact">
                          Start Your Project
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Case Studies */}
      {relatedCaseStudies.length > 0 && (
        <section className="py-16 border-t border-[#2A2A3C]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="text-2xl font-display font-bold text-white mb-8 text-center">
                Related Case Studies
              </h2>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedCaseStudies.map((study, index) => (
                <FadeIn key={study.id} delay={index * 0.1}>
                  <RelatedCaseStudyCard caseStudy={study} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function RelatedCaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  const displayName = caseStudy.isAnonymous
    ? `${caseStudy.industry} Company`
    : caseStudy.clientName;

  const primaryMetric = caseStudy.metrics[0];

  return (
    <Link href={`/solutions/case-studies/${caseStudy.slug}`}>
      <div className="h-full p-5 rounded-xl bg-[#1A1A24] border border-[#2A2A3C] hover:border-amber-500/30 transition-all duration-300 group">
        <Badge variant="secondary" className="mb-3 text-xs">
          {caseStudy.industry}
        </Badge>
        <h3 className="font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
          {caseStudy.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{displayName}</p>
        {primaryMetric && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-medium">
              {primaryMetric.value}
            </span>
            <span className="text-muted-foreground">
              {primaryMetric.label}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
