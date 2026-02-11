import type { Metadata } from "next";
import { createMetadata, serviceMetadata } from "@/lib/metadata";
import { ResourcesPageClient } from "./ResourcesPageClient";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = createMetadata({
  ...serviceMetadata.solutions,
  title: "Free Resources — Templates, Frameworks & Tools | Pink Beam Solutions",
  description: "Download free resources to accelerate your transformation. Templates, frameworks, checklists, and tools for AI strategy, digital transformation, and process automation.",
  path: "/solutions/resources",
});

async function getResources() {
  try {
    const resources = await prisma.resource.findMany({
      where: { published: true },
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

export default async function ResourcesPage() {
  const resources = await getResources();

  return <ResourcesPageClient initialResources={resources} />;
}
