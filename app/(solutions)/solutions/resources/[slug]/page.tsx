import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ResourceType } from "@prisma/client";
import { createMetadata, structuredData } from "@/lib/metadata";
import { ResourceDetailClient } from "./ResourceDetailClient";

interface ResourcePageProps {
  params: Promise<{ slug: string }>;
}

async function getResource(slug: string) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { slug },
    });
    return resource;
  } catch {
    return null;
  }
}

async function getRelatedResources(currentId: string, type: ResourceType, topics: string[]) {
  try {
    const related = await prisma.resource.findMany({
      where: {
        id: { not: currentId },
        published: true,
        OR: [
          { type },
          { topics: { hasSome: topics } },
        ],
      },
      take: 3,
      orderBy: { downloadCount: 'desc' },
    });
    return related;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResource(slug);
  
  if (!resource) {
    return createMetadata({
      title: 'Resource Not Found',
      path: '/solutions/resources',
    });
  }

  return createMetadata({
    title: `${resource.title}`,
    description: resource.description,
    path: `/solutions/resources/${slug}`,
  });
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = await getResource(slug);

  if (!resource || !resource.published) {
    notFound();
  }

  const relatedResources = await getRelatedResources(
    resource.id,
    resource.type,
    resource.topics
  );

  // JSON-LD structured data for resource
  const resourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: resource.title,
    description: resource.description,
    url: `https://pinkbeam.io/solutions/resources/${slug}`,
    datePublished: resource.createdAt.toISOString(),
    dateModified: resource.updatedAt.toISOString(),
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
    ...(resource.featuredImage && {
      image: resource.featuredImage,
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resourceJsonLd) }}
      />
      <ResourceDetailClient
        resource={resource}
        relatedResources={relatedResources}
      />
    </>
  );
}
