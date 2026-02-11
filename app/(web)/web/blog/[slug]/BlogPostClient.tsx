'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import { FadeIn } from '@/components/animations'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  metaTitle: string | null
  metaDesc: string | null
  publishedAt: string
  createdAt: string
}

export default function BlogPostClient({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null)
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
        const response = await fetch(`/api/blog/${slug}`)
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading post...</p>
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
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              {error || "The blog post you're looking for doesn't exist."}
            </p>
            <Button asChild>
              <Link href="/web/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </FadeIn>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 lg:py-32 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              {/* Back Link */}
              <Link
                href="/web/blog"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-violet-500 transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Pink Beam Team
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {Math.ceil(post.content.split(' ').length / 200)} min read
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <article className="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-violet">
              {/* Simple text rendering - in production use a markdown renderer */}
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {post.content}
              </div>
            </article>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-20 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Need help with your project?
            </h2>
            <p className="text-muted-foreground mb-6">
              Let&apos;s discuss how we can help you achieve your goals.
            </p>
            <Button className="bg-gradient-to-r from-violet-500 to-violet-600" asChild>
              <Link href="/contact">
                Get in Touch
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
