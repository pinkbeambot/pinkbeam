'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Twitter, 
  Linkedin, 
  Share2,
  Sparkles,
  Mail
} from 'lucide-react'
import { FadeIn } from '@/components/animations'
import { OptimizedImage } from '@/components/ui/optimized-image'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  category: string | null
  featured: boolean
  readingTime: number | null
  authorName: string
  authorTitle: string | null
  authorAvatar: string | null
  featuredImage: string | null
  tags: string[]
  metaTitle: string | null
  metaDesc: string | null
  publishedAt: string
  createdAt: string
}

interface Heading {
  id: string
  text: string
  level: number
}

function formatCategoryLabel(category: string | null): string {
  if (!category) return 'Insights'
  return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = []
  const lines = content.split('\n')
  
  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      const id = `heading-${index}`
      headings.push({ id, text, level })
    }
  })
  
  return headings
}

function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let inList = false
  let listItems: string[] = []

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 my-4 text-muted-foreground">
          {listItems.map((item, i) => (
            <li key={i}>{item.replace(/^[-*]\s*/, '')}</li>
          ))}
        </ul>
      )
      listItems = []
      inList = false
    }
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim()

    // Headings
    if (trimmed.startsWith('# ')) {
      flushList()
      elements.push(
        <h1 key={index} id={`heading-${index}`} className="text-3xl sm:text-4xl font-bold text-white mt-12 mb-6">
          {trimmed.replace(/^#\s*/, '')}
        </h1>
      )
      return
    }

    if (trimmed.startsWith('## ')) {
      flushList()
      elements.push(
        <h2 key={index} id={`heading-${index}`} className="text-2xl sm:text-3xl font-bold text-white mt-10 mb-5">
          {trimmed.replace(/^##\s*/, '')}
        </h2>
      )
      return
    }

    if (trimmed.startsWith('### ')) {
      flushList()
      elements.push(
        <h3 key={index} id={`heading-${index}`} className="text-xl sm:text-2xl font-semibold text-white mt-8 mb-4">
          {trimmed.replace(/^###\s*/, '')}
        </h3>
      )
      return
    }

    // List items
    if (trimmed.match(/^[-*]\s/)) {
      inList = true
      listItems.push(trimmed)
      return
    }

    // Empty line ends list
    if (trimmed === '' && inList) {
      flushList()
      return
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList()
      elements.push(
        <blockquote key={index} className="border-l-4 border-amber-500 pl-6 my-6 italic text-muted-foreground">
          {trimmed.replace(/^>\s*/, '')}
        </blockquote>
      )
      return
    }

    // Regular paragraph
    if (trimmed !== '') {
      flushList()
      elements.push(
        <p key={index} className="text-muted-foreground leading-relaxed my-4">
          {trimmed}
        </p>
      )
    }
  })

  flushList()
  return elements
}

function ShareButtons({ title, url }: { title: string; url: string }) {
  const shareUrl = encodeURIComponent(url)
  const shareTitle = encodeURIComponent(title)

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">Share:</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full hover:bg-amber-500/10 hover:text-amber-400"
        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`, '_blank')}
      >
        <Twitter className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full hover:bg-amber-500/10 hover:text-amber-400"
        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank')}
      >
        <Linkedin className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full hover:bg-amber-500/10 hover:text-amber-400"
        onClick={() => {
          navigator.clipboard.writeText(url)
          // Could add toast here
        }}
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  )
}

export default function BlogPostClient({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    async function getSlug() {
      const { slug } = await params
      setSlug(slug)
    }
    getSlug()
  }, [params])

  useEffect(() => {
    if (!slug) return

    async function fetchPost() {
      try {
        const response = await fetch(`/api/blog/${slug}?solutions=true`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Blog post not found')
          } else {
            throw new Error('Failed to fetch post')
          }
          return
        }
        const data = await response.json()
        setPost(data.post)
        
        // Fetch related posts
        const relatedResponse = await fetch(`/api/blog?solutions=true&limit=3&exclude=${data.post.id}`)
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json()
          setRelatedPosts(relatedData.posts.slice(0, 3))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <FadeIn className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              {error || "The article you're looking for doesn't exist."}
            </p>
            <Button asChild className="bg-amber-500 hover:bg-amber-600">
              <Link href="/solutions/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Insights
              </Link>
            </Button>
          </FadeIn>
        </div>
      </main>
    )
  }

  const headings = extractHeadings(post.content)
  const articleUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              {/* Back Link */}
              <Link
                href="/solutions/blog"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-amber-400 transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Insights
              </Link>

              {/* Category */}
              {post.category && (
                <Badge className="mb-6 bg-amber-500/10 text-amber-400 border-amber-500/30">
                  {formatCategoryLabel(post.category)}
                </Badge>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-muted-foreground mb-8">
                  {post.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                {/* Author */}
                <div className="flex items-center gap-3">
                  {post.authorAvatar ? (
                    <OptimizedImage
                      src={post.authorAvatar}
                      alt={post.authorName}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <span className="text-amber-400 font-medium text-lg">
                        {post.authorName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-white">{post.authorName}</p>
                    {post.authorTitle && (
                      <p className="text-sm text-muted-foreground">{post.authorTitle}</p>
                    )}
                  </div>
                </div>

                <Separator orientation="vertical" className="h-8 hidden sm:block" />

                {/* Date & Reading Time */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </div>
                  {post.readingTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {post.readingTime} min read
                    </div>
                  )}
                </div>
              </div>

              {/* Share */}
              <ShareButtons title={post.title} url={articleUrl} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="relative aspect-[21/9] max-w-5xl mx-auto rounded-2xl overflow-hidden">
                <OptimizedImage
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/50 to-transparent" />
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12 max-w-6xl mx-auto">
            {/* Main Content */}
            <FadeIn>
              <article className="prose prose-lg prose-invert max-w-none">
                {/* Table of Contents - Mobile */}
                {headings.length > 0 && (
                  <div className="lg:hidden mb-8 p-6 rounded-xl bg-card/50 border border-border/50">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Table of Contents
                    </h3>
                    <nav className="space-y-2">
                      {headings.map((heading) => (
                        <a
                          key={heading.id}
                          href={`#${heading.id}`}
                          className="block text-sm text-muted-foreground hover:text-amber-400 transition-colors"
                          style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
                        >
                          {heading.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Article Body */}
                <div className="text-muted-foreground">
                  {renderContent(post.content)}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-border/50">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-border/50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </FadeIn>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                {/* Table of Contents */}
                {headings.length > 0 && (
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-6">
                      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Table of Contents
                      </h3>
                      <nav className="space-y-2">
                        {headings.map((heading) => (
                          <a
                            key={heading.id}
                            href={`#${heading.id}`}
                            className="block text-sm text-muted-foreground hover:text-amber-400 transition-colors"
                            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                          >
                            {heading.text}
                          </a>
                        ))}
                      </nav>
                    </CardContent>
                  </Card>
                )}

                {/* Newsletter Mini-CTA */}
                <Card className="bg-gradient-to-br from-amber-500/10 to-violet-500/10 border-amber-500/20">
                  <CardContent className="p-6">
                    <Mail className="w-8 h-8 text-amber-400 mb-4" />
                    <h3 className="font-semibold text-white mb-2">Stay Updated</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get the latest insights on AI and digital transformation.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-amber-500/30 hover:bg-amber-500/10"
                      asChild
                    >
                      <Link href="/contact">
                        Subscribe
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 lg:py-24 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-8">Related Insights</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/solutions/blog/${relatedPost.slug}`}>
                      <Card className="group h-full bg-card/50 border-border/50 hover:border-amber-500/30 transition-all">
                        <CardContent className="p-6">
                          {relatedPost.category && (
                            <Badge variant="outline" className="mb-3 text-xs border-amber-500/30 text-amber-400">
                              {formatCategoryLabel(relatedPost.category)}
                            </Badge>
                          )}
                          <h3 className="font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(relatedPost.publishedAt || relatedPost.createdAt)}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 lg:py-24 border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 to-violet-500/10 border border-amber-500/20 p-8 lg:p-12 max-w-4xl mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Enjoyed this article?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  Subscribe to get weekly insights on AI strategy, digital transformation, and technology leadership.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                    asChild
                  >
                    <Link href="/contact">
                      Get in Touch
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-amber-500/30 hover:bg-amber-500/10"
                    asChild
                  >
                    <Link href="/solutions/blog">
                      More Insights
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
