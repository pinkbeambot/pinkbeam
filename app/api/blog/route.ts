import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const solutions = searchParams.get('solutions') === 'true'
    const limit = parseInt(searchParams.get('limit') || '100')
    const exclude = searchParams.get('exclude')
    const category = searchParams.get('category')

    const where: Prisma.BlogPostWhereInput = { 
      published: true,
      service: solutions ? 'SOLUTIONS' : 'WEB',
    }

    // Filter by category
    if (category && category !== 'ALL') {
      where.category = category as Prisma.EnumBlogCategoryFilter
    }

    // Exclude specific post
    if (exclude) {
      where.id = { not: exclude }
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' }
      ],
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        featured: true,
        readingTime: true,
        authorName: true,
        authorAvatar: true,
        featuredImage: true,
        publishedAt: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}
