import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const samplePosts = [
  {
    title: 'Why Your Website Needs to Load in Under 2 Seconds',
    slug: 'website-speed-importance',
    excerpt: 'Website speed directly impacts conversions, SEO rankings, and user experience. Learn why performance matters and how to improve it.',
    content: `In today's fast-paced digital world, website speed is no longer a luxury—it's a necessity. Studies show that 53% of mobile users abandon sites that take longer than 3 seconds to load.

The Business Impact of Speed

Every second counts when it comes to website performance:

- 1 second delay = 7% reduction in conversions
- 3 second delay = 40% of visitors leave
- Site speed is a confirmed Google ranking factor

How to Measure Your Speed

Use these free tools to check your current performance:
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

Quick Wins for Better Performance

1. Optimize images (compress, use WebP format)
2. Enable browser caching
3. Minimize HTTP requests
4. Use a CDN for static assets
5. Implement lazy loading for images

The Pink Beam Approach

When we build websites, performance is baked into every step:
- Image optimization pipelines
- Code splitting and lazy loading
- Edge deployment for global speed
- Continuous performance monitoring

Ready for a faster website? Let's talk about your project.`,
    published: true,
  },
  {
    title: 'SEO in 2025: What Actually Works',
    slug: 'seo-2025-guide',
    excerpt: 'Search engine optimization keeps evolving. Cut through the noise with these proven strategies that work right now.',
    content: `SEO has changed dramatically over the past few years. What worked in 2020 doesn't work today. Here's what's actually moving the needle in 2025.

Content Quality Over Quantity

Gone are the days of keyword-stuffed articles. Today, Google prioritizes:
- Comprehensive, helpful content
- Expert authorship and authority
- Real user engagement signals
- Fresh, updated information

Technical SEO Fundamentals

Don't ignore the basics:
- Mobile-first indexing is standard
- Core Web Vitals affect rankings
- Schema markup enhances visibility
- HTTPS is non-negotiable

The Rise of AI in Search

With AI overviews appearing in search results:
- Focus on unique insights AI can't generate
- Build topical authority
- Create content that earns citations
- Prioritize user intent over keywords

Local SEO Still Matters

For location-based businesses:
- Google Business Profile optimization
- Local citation consistency
- Review generation strategies
- Local content creation

Want to improve your search rankings? We can help.`,
    published: true,
  },
  {
    title: 'Building Trust Through Design',
    slug: 'trust-through-design',
    excerpt: 'Your website design directly impacts how trustworthy visitors perceive your business. Here are the key principles.',
    content: `First impressions matter. Studies show users form opinions about websites in just 50 milliseconds—before they even read a word.

Visual Trust Signals

Professional design builds confidence:
- Consistent branding throughout
- High-quality images and graphics
- Clear typography and readability
- Thoughtful use of white space

Transparency Builds Trust

Be open about who you are:
- Clear contact information
- Team photos and bios
- Physical address (if applicable)
- Social proof and testimonials

Security Indicators

Users need to feel safe:
- HTTPS encryption
- Trust badges for e-commerce
- Clear privacy policies
- Secure payment indicators

Functionality Matters

Broken sites destroy trust:
- Fast loading times
- Working links and forms
- Mobile responsiveness
- Accessibility compliance

The Pink Beam Difference

We design with trust in mind:
- Research-driven design decisions
- User testing for credibility
- Conversion-focused layouts
- Ongoing optimization

Let's build a website that earns trust.`,
    published: true,
  },
]

export async function POST() {
  try {
    const created = []
    const skipped = []

    for (const post of samplePosts) {
      const existing = await prisma.blogPost.findUnique({
        where: { slug: post.slug },
      })

      if (!existing) {
        await prisma.blogPost.create({
          data: {
            ...post,
            publishedAt: new Date(),
          },
        })
        created.push(post.title)
      } else {
        skipped.push(post.title)
      }
    }

    return NextResponse.json({
      message: 'Blog seeding complete',
      created,
      skipped,
    })
  } catch (error) {
    console.error('Error seeding blog:', error)
    return NextResponse.json(
      { error: 'Failed to seed blog posts' },
      { status: 500 }
    )
  }
}
