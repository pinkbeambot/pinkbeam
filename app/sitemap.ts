import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Fetch dynamic content
  const [
    webBlogPosts,
    resources,
  ] = await Promise.all([
    // Web blog posts
    prisma.blogPost.findMany({
      where: { published: true, service: 'WEB' },
      select: { slug: true, updatedAt: true },
    }),
    // Resources
    prisma.resource.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  // Core pages
  const routes: MetadataRoute.Sitemap = [
    // Homepage
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    // Agents Service
    {
      url: `${baseUrl}/agents`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agents/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // AI Employees
    {
      url: `${baseUrl}/agents/employees/researcher`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/agents/employees/sales`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/agents/employees/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/agents/employees/content`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/agents/employees/designer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/agents/employees/video`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/agents/employees/sdr`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Web Service
    {
      url: `${baseUrl}/web`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/web/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/web/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // Labs Service
    {
      url: `${baseUrl}/labs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Labs Services
    {
      url: `${baseUrl}/labs/services/web-applications`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/labs/services/mobile-applications`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/labs/services/ai-ml`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/labs/services/api-integrations`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/labs/services/legacy-modernization`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Labs Pricing
    {
      url: `${baseUrl}/labs/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Solutions Service
    {
      url: `${baseUrl}/solutions`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solutions/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Resources
    {
      url: `${baseUrl}/solutions/resources/ai-readiness-score`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/solutions/resources/automation-roi-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Legal pages
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    // Contact & About
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Help Center
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Add web blog posts
  webBlogPosts.forEach(post => {
    routes.push({
      url: `${baseUrl}/web/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  });

  // Add resources
  resources.forEach(resource => {
    routes.push({
      url: `${baseUrl}/solutions/resources/${resource.slug}`,
      lastModified: resource.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  });

  return routes;
}
