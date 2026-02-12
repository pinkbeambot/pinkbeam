import { prisma } from "@/lib/prisma";
import { CaseStudiesAdminClient } from "./CaseStudiesAdminClient";
import type { CaseStudy, CaseStudyMetric } from "@/lib/case-studies-types";

export const metadata = {
  title: "Case Studies — Admin",
};

export default async function CaseStudiesAdminPage() {
  const rawCaseStudies = await prisma.caseStudy.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Transform Prisma data to match CaseStudy type
  const caseStudies: CaseStudy[] = rawCaseStudies.map((cs) => ({
    id: cs.id,
    slug: cs.slug,
    title: cs.title,
    clientName: cs.clientName,
    industry: cs.industry,
    isAnonymous: cs.isAnonymous,
    challenge: cs.challenge,
    solution: cs.solution,
    results: cs.results,
    metrics: (cs.metrics as unknown as CaseStudyMetric[]) || [],
    services: cs.services,
    engagementType: cs.engagementType,
    testimonial: cs.testimonial,
    testimonialAuthor: cs.testimonialAuthor,
    testimonialTitle: cs.testimonialTitle,
    published: cs.published,
    featured: cs.featured,
    createdAt: cs.createdAt,
    updatedAt: cs.updatedAt,
  }));

  return <CaseStudiesAdminClient caseStudies={caseStudies} />;
}
