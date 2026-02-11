'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowRight, Calendar, Clock, Search, X } from 'lucide-react'
import { FadeIn } from '@/components/animations'
import { WebHero } from '../components/WebHero'
import { useContextualSearch } from '@/components/search'
import type { SearchResult } from '@/lib/search'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  publishedAt: string
  createdAt: string
}

export default function BlogPageClient() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { query, results, isSearching, ContextualSearchComponent, clearSearch } = useContextualSearch('blog')

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog')
        if (!response.ok) throw new Error('Failed to fetch posts')
        const data = await response.json()
        setPosts(data.posts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <main className="min-h-screen">
      <WebHero />

      {/* Blog Header */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">Blog</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Insights & Resources
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Tips, guides, and thoughts on web design, development, and digital strategy.
            </p>
            <div className="relative max-w-md mx-auto">
              <ContextualSearchComponent
                placeholder="Search articles..."
                className="w-full"
              />
              {isSearching && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-sm"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 lg:py-32 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-2">Failed to load posts</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          ) : isSearching ? (
            // Search Results
            results.length > 0 ? (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-lg font-semibold mb-6">
                  Search Results ({results.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.map((result, index) => (
                    <FadeIn key={result.id} delay={index * 0.1} direction="up">
                      <article className="group h-full">
                        <Link href={result.url}>
                          <div className="h-full p-6 rounded-2xl border bg-card hover:shadow-lg hover:border-violet-500/30 transition-all duration-300">
                            <h2 className="text-xl font-bold mb-3 group-hover:text-violet-500 transition-colors line-clamp-2">
                              {result.title}
                            </h2>
                            {result.snippet && (
                              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                {result.snippet}
                              </p>
                            )}
                            <div className="flex items-center text-sm font-medium text-violet-500 mt-auto">
                              Read More
                              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      </article>
                    </FadeIn>
                  ))}
                </div>
              </div>
            ) : query ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground">Try a different search term</p>
              </div>
            ) : null
          ) : posts.length === 0 ? (
            <FadeIn className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                No blog posts yet. Check back soon!
              </p>
              <p className="text-sm text-muted-foreground">
                We&apos;re working on creating valuable content for you.
              </p>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {posts.map((post, index) => (
                <FadeIn key={post.id} delay={index * 0.1} direction="up">
                  <article className="group h-full">
                    <Link href={`/web/blog/${post.slug}`}>
                      <div className="h-full p-6 rounded-2xl border bg-card hover:shadow-lg hover:border-violet-500/30 transition-all duration-300">
                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold mb-3 group-hover:text-violet-500 transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Read More */}
                        <div className="flex items-center text-sm font-medium text-violet-500 mt-auto">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </article>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto">
            <Clock className="w-12 h-12 text-violet-500 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Want to stay updated?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Subscribe to get notified when we publish new articles.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-violet-500 to-violet-600" asChild>
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
