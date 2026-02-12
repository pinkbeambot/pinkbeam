import type { Metadata } from "next";
import { createMetadata, serviceMetadata } from "@/lib/metadata";
import { LabsResourcesPageClient } from "./LabsResourcesPageClient";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = createMetadata({
  ...serviceMetadata.labs,
  title: "Labs Resources — Templates, Guides & Tools — Pink Beam Labs",
  description: "Download free resources for software development. Templates, checklists, and guides for MVP development, technical architecture, and code quality.",
  path: "/labs/resources",
});

async function getResources() {
  try {
    // Get resources related to development/engineering
    const resources = await prisma.resource.findMany({
      where: { 
        published: true,
        OR: [
          { category: { contains: "Development" } },
          { category: { contains: "Engineering" } },
          { category: { contains: "Architecture" } },
          { topics: { hasSome: ["MVP", "Development", "Code", "Architecture", "API"] } },
        ],
      },
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],
    });
    return resources;
  } catch {
    return [];
  }
}

export default async function LabsResourcesPage() {
  const resources = await getResources();

  return <LabsResourcesPageClient initialResources={resources} />;
}
