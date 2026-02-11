import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createMetadata, structuredData } from "@/lib/metadata";
import BlogPostClient from "./BlogPostClient";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true, service: 'SOLUTIONS' },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        metaTitle: true,
        metaDesc: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            title: true,
            avatar: true,
          },
        },
      },
    });
    return post;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return createMetadata({
      title: "Article Not Found",
      path: "/solutions/blog",
    });
  }

  const title = post.metaTitle || post.title;
  const description = post.metaDesc || post.excerpt || post.content.slice(0, 160);

  return createMetadata({
    title: `${title} | Pink Beam Solutions`,
    description: description || "Strategic insights on AI adoption and digital transformation.",
    path: `/solutions/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // JSON-LD structured data for blog post
  const blogPostJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.content.slice(0, 160),
    url: `https://pinkbeam.io/solutions/blog/${slug}`,
    datePublished: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: post.author?.name || "Pink Beam Solutions",
      url: "https://pinkbeam.io",
    },
    publisher: {
      "@type": "Organization",
      name: "Pink Beam Solutions",
      url: "https://pinkbeam.io",
      logo: {
        "@type": "ImageObject",
        url: "https://pinkbeam.io/logo.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }}
      />
      <BlogPostClient params={params} />
    </>
  );
}
