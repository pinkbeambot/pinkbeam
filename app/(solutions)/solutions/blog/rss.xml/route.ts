import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { siteConfig } from '@/lib/metadata'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { 
        published: true,
        service: 'SOLUTIONS'
      },
      orderBy: { publishedAt: 'desc' },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        authorName: true,
        publishedAt: true,
        createdAt: true,
      },
    })

    const baseUrl = `${siteConfig.url}/solutions/blog`
    
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Pink Beam Solutions Insights</title>
    <link>${baseUrl}</link>
    <description>Strategic perspectives on AI adoption, digital transformation, and building technology that drives business growth.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/solutions/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteConfig.url}/logo.png</url>
      <title>Pink Beam Solutions Insights</title>
      <link>${baseUrl}</link>
    </image>
    ${posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
      <author>${escapeXml(post.authorName)}</author>
      <category>${escapeXml(post.category?.replace(/_/g, ' ') || 'Insights')}</category>
      <description>${escapeXml(post.excerpt || '')}</description>
    </item>
    `).join('')}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return NextResponse.json(
      { error: 'Failed to generate RSS feed' },
      { status: 500 }
    )
  }
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '"': return '&quot;'
      case "'": return '&apos;'
      default: return c
    }
  })
}
