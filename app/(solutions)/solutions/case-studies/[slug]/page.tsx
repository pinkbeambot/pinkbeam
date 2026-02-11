import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata, structuredData } from "@/lib/metadata";
import {
  getCaseStudyBySlug,
  getRelatedCaseStudies,
  CaseStudy,
} from "@/lib/case-studies";
import { CaseStudyDetailClient } from "./CaseStudyDetailClient";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return createMetadata({
      title: "Case Study Not Found",
      path: "/solutions/case-studies",
    });
  }

  const clientName = caseStudy.isAnonymous
    ? `${caseStudy.industry} Company`
    : caseStudy.clientName;

  return createMetadata({
    title: `${caseStudy.title} — ${clientName} Case Study`,
    description: caseStudy.results.slice(0, 160),
    path: `/solutions/case-studies/${caseStudy.slug}`,
  });
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  // Fetch related case studies
  const relatedCaseStudies = await getRelatedCaseStudies(
    caseStudy.slug,
    caseStudy.industry,
    caseStudy.services,
    3
  );

  // JSON-LD structured data for case study
  const caseStudyJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: caseStudy.title,
    description: caseStudy.results,
    url: `https://pinkbeam.io/solutions/case-studies/${caseStudy.slug}`,
    datePublished: caseStudy.createdAt.toISOString(),
    dateModified: caseStudy.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "Pink Beam Solutions",
      url: "https://pinkbeam.io",
    },
    publisher: {
      "@type": "Organization",
      name: "Pink Beam Solutions",
      url: "https://pinkbeam.io",
    },
    about: {
      "@type": "Thing",
      name: caseStudy.industry,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyJsonLd) }}
      />
      <CaseStudyDetailClient
        caseStudy={caseStudy}
        relatedCaseStudies={relatedCaseStudies}
      />
    </>
  );
}
