import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { helpArticles, getArticleBySlug } from '@/lib/help/articles'
import ReactMarkdown from 'react-markdown'

interface ArticlePageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article Not Found — Pink Beam Help',
    }
  }

  return {
    title: `${article.title} — Pink Beam Help Center`,
    description: article.summary,
  }
}

export async function generateStaticParams() {
  return helpArticles.map((article) => ({
    category: article.category,
    slug: article.slug,
  }))
}

export default async function HelpArticlePage({ params }: ArticlePageProps) {
  const { category, slug } = await params
  const article = getArticleBySlug(slug)

  if (!article || article.category !== category) {
    notFound()
  }

  const relatedArticles = article.relatedArticles
    ? helpArticles.filter((a) => article.relatedArticles?.includes(a.slug))
    : []

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/help" className="hover:text-foreground">
              Help Center
            </Link>
            <span>/</span>
            <Link href={`/help/${category}`} className="hover:text-foreground capitalize">
              {category.replace(/-/g, ' ')}
            </Link>
            <span>/</span>
            <span className="text-foreground">{article.title}</span>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} min read</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>
              </div>
              {article.featured && (
                <>
                  <span>·</span>
                  <Badge variant="secondary">Popular</Badge>
                </>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none mb-12">
            <div className="bg-muted/30 border-l-4 border-pink-500 p-4 mb-6 rounded-r">
              <p className="text-sm font-medium mb-0">{article.summary}</p>
            </div>
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>
                ),
                p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ul className="list-decimal pl-6 mb-4 space-y-2">{children}</ul>,
                li: ({ children }) => <li className="leading-7">{children}</li>,
                a: ({ href, children }) => (
                  <Link href={href || '#'} className="text-pink-500 hover:underline">
                    {children}
                  </Link>
                ),
                code: ({ children }) => (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold mb-4">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/help/${related.category}/${related.slug}`}
                  >
                    <Card className="p-4 hover:shadow-lg transition-shadow h-full">
                      <h3 className="font-semibold mb-2 hover:text-pink-500 transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{related.summary}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Support CTA */}
          <div className="mt-12 border-t pt-8">
            <Card className="p-6 bg-muted/30">
              <h3 className="font-semibold mb-2">Still need help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If this article didn't answer your question, our support team is here to help.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors text-sm"
              >
                Contact Support
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
