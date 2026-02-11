'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowRight, Calendar, Clock, Sparkles, ChevronDown } from 'lucide-react'
import { FadeIn, FadeInOnMount } from '@/components/animations'
import { OptimizedImage } from '@/components/ui/optimized-image'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string | null
  featured: boolean
  readingTime: number | null
  authorName: string
  authorAvatar: string | null
  featuredImage: string | null
  publishedAt: string
  createdAt: string
}

const categories = [
  { value: 'ALL', label: 'All Insights', color: 'amber' },
  { value: 'AI_STRATEGY', label: 'AI Strategy', color: 'amber' },
  { value: 'DIGITAL_TRANSFORMATION', label: 'Digital Transformation', color: 'violet' },
  { value: 'PROCESS_AUTOMATION', label: 'Process Automation', color: 'emerald' },
  { value: 'TECHNOLOGY_ARCHITECTURE', label: 'Architecture', color: 'amber' },
  { value: 'LEADERSHIP', label: 'Leadership', color: 'rose' },
]

function formatCategoryLabel(category: string | null): string {
  if (!category) return 'Insights'
  const found = categories.find(c => c.value === category)
  return found?.label || category.replace(/_/g, ' ')
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function BlogPageClient() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('ALL')

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog?solutions=true')
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

  const featuredPost = posts.find(p => p.featured) || posts[0]
  const regularPosts = posts.filter(p => p.id !== featuredPost?.id)

  const filteredPosts = activeCategory === 'ALL'
    ? regularPosts
    : regularPosts.filter(p => p.category === activeCategory)

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInOnMount className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">
                Thought Leadership
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-foreground tracking-tight">
              Insights for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Digital Leaders
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Strategic perspectives on AI adoption, digital transformation, and building technology that drives business growth.
            </p>
          </FadeInOnMount>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
          <span className="text-sm">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && !loading && (
        <section className="pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <Link href={`/solutions/blog/${featuredPost.slug}`}>
                <Card className="group overflow-hidden bg-card/50 border-amber-500/20 hover:border-amber-500/40 transition-all duration-500">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Featured Image */}
                    <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                      {featuredPost.featuredImage ? (
                        <OptimizedImage
                          src={featuredPost.featuredImage}
                          alt={featuredPost.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-violet-500/20" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-amber-500 text-white border-0">
                        Featured
                      </Badge>
                    </div>

                    {/* Content */}
                    <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                      {featuredPost.category && (
                        <Badge variant="outline" className="w-fit mb-4 border-amber-500/30 text-amber-400">
                          {formatCategoryLabel(featuredPost.category)}
                        </Badge>
                      )}
                      
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 group-hover:text-amber-400 transition-colors">
                        {featuredPost.title}
                      </h2>
                      
                      {featuredPost.excerpt && (
                        <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(featuredPost.publishedAt || featuredPost.createdAt)}
                        </div>
                        {featuredPost.readingTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {featuredPost.readingTime} min read
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {featuredPost.authorAvatar ? (
                          <OptimizedImage
                            src={featuredPost.authorAvatar}
                            alt={featuredPost.authorName}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <span className="text-amber-400 font-medium">
                              {featuredPost.authorName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{featuredPost.authorName}</p>
                          <p className="text-sm text-muted-foreground">Author</p>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 border-y border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="bg-transparent border border-border/50 p-1 flex-wrap h-auto gap-1">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </FadeIn>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading insights...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-2">Failed to load posts</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <FadeIn className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                No articles found in this category.
              </p>
              <Button variant="outline" onClick={() => setActiveCategory('ALL')}>
                View All Insights
              </Button>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <FadeIn key={post.id} delay={index * 0.1} direction="up">
                  <Link href={`/solutions/blog/${post.slug}`}>
                    <Card className="group h-full overflow-hidden bg-card/50 border-border/50 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5">
                      {/* Thumbnail */}
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {post.featuredImage ? (
                          <OptimizedImage
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-violet-500/10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <CardContent className="p-6">
                        {/* Category */}
                        {post.category && (
                          <Badge variant="outline" className="mb-3 text-xs border-amber-500/30 text-amber-400">
                            {formatCategoryLabel(post.category)}
                          </Badge>
                        )}

                        {/* Title */}
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-amber-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.publishedAt || post.createdAt)}
                          </div>
                          {post.readingTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readingTime} min
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 lg:py-24 border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 to-violet-500/10 border border-amber-500/20 p-8 lg:p-12">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 max-w-2xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Get Insights Delivered
                </h2>
                <p className="text-muted-foreground mb-8">
                  Join thousands of leaders who receive our weekly insights on AI strategy and digital transformation.
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 shadow-lg shadow-amber-500/25"
                  asChild
                >
                  <Link href="/contact">
                    Subscribe to Updates
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
