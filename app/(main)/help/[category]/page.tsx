import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { helpCategories, getArticlesByCategory } from '@/lib/help/articles'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = helpCategories.find((c) => c.slug === categorySlug)

  if (!category) {
    return {
      title: 'Category Not Found — Pink Beam Help',
    }
  }

  return {
    title: `${category.title} — Pink Beam Help Center`,
    description: category.description,
  }
}

export async function generateStaticParams() {
  return helpCategories.map((category) => ({
    category: category.slug,
  }))
}

export default async function HelpCategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params
  const category = helpCategories.find((c) => c.slug === categorySlug)

  if (!category) {
    notFound()
  }

  const articles = getArticlesByCategory(categorySlug)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Breadcrumb */}
        <Link
          href="/help"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Help Center
        </Link>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{category.title}</h1>
          <p className="text-lg text-muted-foreground">{category.description}</p>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {articles.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No articles in this category yet. Check back soon!
              </p>
            </Card>
          ) : (
            articles.map((article) => (
              <Link
                key={article.slug}
                href={`/help/${categorySlug}/${article.slug}`}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-pink-500 transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-muted-foreground mb-3">{article.summary}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{article.readingTime} min read</span>
                        </div>
                        <span>·</span>
                        <span>
                          Updated {new Date(article.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {article.featured && (
                      <Badge variant="secondary" className="shrink-0">
                        Popular
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
