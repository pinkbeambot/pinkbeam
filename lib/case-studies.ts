import { prisma } from "@/lib/prisma";
import { mockCaseStudies, mockFilterOptions } from "./case-studies-mock";

export interface CaseStudyMetric {
  label: string;
  value: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  industry: string;
  isAnonymous: boolean;
  challenge: string;
  solution: string;
  results: string;
  metrics: CaseStudyMetric[];
  services: string[];
  engagementType: string;
  testimonial: string | null;
  testimonialAuthor: string | null;
  testimonialTitle: string | null;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseStudyFilters {
  industry?: string;
  service?: string;
  engagementType?: string;
  search?: string;
  featured?: boolean;
}

const INDUSTRIES = [
  "Healthcare",
  "Fintech",
  "Retail",
  "SaaS",
  "Manufacturing",
  "Education",
  "Real Estate",
  "Logistics",
  "Media",
  "Other",
];

const SERVICES = [
  "AI Strategy",
  "Digital Transformation",
  "Process Automation",
  "Growth Strategy",
  "Technology Assessment",
  "Fractional CTO",
  "Data Analytics",
  "Cloud Migration",
];

const ENGAGEMENT_TYPES = [
  "Workshop",
  "Assessment",
  "Project",
  "Retainer",
  "Advisory",
];

export { INDUSTRIES, SERVICES, ENGAGEMENT_TYPES };

// Get all published case studies with optional filtering
export async function getCaseStudies(filters?: CaseStudyFilters): Promise<CaseStudy[]> {
  try {
    // Try to fetch from database first
    const caseStudies = await prisma.caseStudy.findMany({
      where: { published: true },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    
    let results = caseStudies as CaseStudy[];
    
    // If no data in database, use mock data
    if (results.length === 0) {
      results = mockCaseStudies.filter(s => s.published);
    }
    
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
    console.warn("Database unavailable, using mock data");
    // Return filtered mock data
    let results = mockCaseStudies.filter(s => s.published);
    
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
  }
}

// Get a single case study by slug
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    const caseStudy = await prisma.caseStudy.findUnique({
      where: { slug, published: true },
    });
    
    if (caseStudy) {
      return caseStudy as CaseStudy;
    }
    
    // Fallback to mock data
    return mockCaseStudies.find(s => s.slug === slug && s.published) || null;
  } catch (error) {
    console.warn("Database unavailable, using mock data");
    return mockCaseStudies.find(s => s.slug === slug && s.published) || null;
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
    
    if (caseStudies.length > 0) {
      return caseStudies as CaseStudy[];
    }
    
    // Fallback to mock data
    return mockCaseStudies
      .filter(s => s.published && s.featured)
      .slice(0, limit);
  } catch (error) {
    console.warn("Database unavailable, using mock data");
    return mockCaseStudies
      .filter(s => s.published && s.featured)
      .slice(0, limit);
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
    
    if (caseStudies.length > 0) {
      return caseStudies as CaseStudy[];
    }
    
    // Fallback to mock data
    return mockCaseStudies
      .filter(s => 
        s.published && 
        s.slug !== currentSlug &&
        (s.industry === industry || s.services.some(svc => services.includes(svc)))
      )
      .slice(0, limit);
  } catch (error) {
    console.warn("Database unavailable, using mock data");
    return mockCaseStudies
      .filter(s => 
        s.published && 
        s.slug !== currentSlug &&
        (s.industry === industry || s.services.some(svc => services.includes(svc)))
      )
      .slice(0, limit);
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
    
    if (caseStudies.length > 0) {
      const industries = [...new Set(caseStudies.map((cs) => cs.industry))].sort();
      const services = [...new Set(caseStudies.flatMap((cs) => cs.services))].sort();
      const engagementTypes = [...new Set(caseStudies.map((cs) => cs.engagementType))].sort();
      
      return { industries, services, engagementTypes };
    }
    
    // Fallback to mock data
    return mockFilterOptions;
  } catch (error) {
    console.warn("Database unavailable, using mock filter options");
    return mockFilterOptions;
  }
}
