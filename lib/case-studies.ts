import { prisma } from "@/lib/prisma";
import type { CaseStudy, CaseStudyFilters } from "./case-studies-types";

// Re-export types and constants from the shared types file (safe for client components)
export type { CaseStudy, CaseStudyMetric, CaseStudyFilters } from "./case-studies-types";
export { INDUSTRIES, SERVICES, ENGAGEMENT_TYPES } from "./case-studies-types";

// Get all published case studies with optional filtering
export async function getCaseStudies(filters?: CaseStudyFilters): Promise<CaseStudy[]> {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      where: { published: true },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    let results = caseStudies as unknown as CaseStudy[];

    // Apply filters
    if (filters?.industry) {
      results = results.filter(s => s.industry === filters.industry);
    }

    if (filters?.service) {
      results = results.filter(s => s.services.includes(filters.service!));
    }

    if (filters?.engagementType) {
      results = results.filter(s => s.engagementType === filters.engagementType);
    }

    if (filters?.featured) {
      results = results.filter(s => s.featured);
    }

    if (filters?.search) {
      const query = filters.search.toLowerCase();
      results = results.filter(s =>
        s.title.toLowerCase().includes(query) ||
        s.clientName.toLowerCase().includes(query) ||
        s.industry.toLowerCase().includes(query)
      );
    }

    return results;
  } catch (error) {
    console.warn("Database unavailable for case studies");
    return [];
  }
}

// Get a single case study by slug
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    const caseStudy = await prisma.caseStudy.findUnique({
      where: { slug, published: true },
    });

    return caseStudy ? (caseStudy as unknown as CaseStudy) : null;
  } catch (error) {
    console.warn("Database unavailable for case study lookup");
    return null;
  }
}

// Get featured case studies
export async function getFeaturedCaseStudies(limit: number = 3): Promise<CaseStudy[]> {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      where: { published: true, featured: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return caseStudies as unknown as CaseStudy[];
  } catch (error) {
    console.warn("Database unavailable for featured case studies");
    return [];
  }
}

// Get related case studies (same industry or services)
export async function getRelatedCaseStudies(
  currentSlug: string,
  industry: string,
  services: string[],
  limit: number = 3
): Promise<CaseStudy[]> {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      where: {
        published: true,
        slug: { not: currentSlug },
        OR: [
          { industry },
          { services: { hasSome: services } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return caseStudies as unknown as CaseStudy[];
  } catch (error) {
    console.warn("Database unavailable for related case studies");
    return [];
  }
}

// Get filter options (unique values from published case studies)
export async function getFilterOptions(): Promise<{
  industries: string[];
  services: string[];
  engagementTypes: string[];
}> {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      where: { published: true },
      select: {
        industry: true,
        services: true,
        engagementType: true,
      },
    });

    const industries = [...new Set(caseStudies.map((cs) => cs.industry))].sort();
    const services = [...new Set(caseStudies.flatMap((cs) => cs.services))].sort();
    const engagementTypes = [...new Set(caseStudies.map((cs) => cs.engagementType))].sort();

    return { industries, services, engagementTypes };
  } catch (error) {
    console.warn("Database unavailable for filter options");
    return { industries: [], services: [], engagementTypes: [] };
  }
}
