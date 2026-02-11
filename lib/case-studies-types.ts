// Shared types for case studies - safe to import in client components

export const INDUSTRIES = [
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

export const SERVICES = [
  "AI Strategy",
  "Digital Transformation",
  "Process Automation",
  "Growth Strategy",
  "Technology Assessment",
  "Fractional CTO",
  "Data Analytics",
  "Cloud Migration",
];

export const ENGAGEMENT_TYPES = [
  "Workshop",
  "Assessment",
  "Project",
  "Retainer",
  "Advisory",
];

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
