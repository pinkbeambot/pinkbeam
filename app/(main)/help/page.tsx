import { Metadata } from 'next'
import Link from 'next/link'
import {
  Rocket,
  Users,
  CreditCard,
  Plug,
  AlertCircle,
  Briefcase,
  Search,
  ArrowRight,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'
import { helpCategories, getFeaturedArticles } from '@/lib/help/articles'

export const metadata: Metadata = {
  title: 'Help Center — Pink Beam',
  description: 'Get help with Pink Beam AI employees, billing, integrations, and more',
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  Users,
  CreditCard,
  Plug,
  AlertCircle,
  Briefcase,
}

export default function HelpCenterPage() {
  const featuredArticles = getFeaturedArticles()

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pinkbeam.io/" },
          { name: "Help Center", item: "https://pinkbeam.io/help" },
        ]}
      />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-pink-500/10 to-background border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How can we help you?
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Search our knowledge base or browse categories below
            </p>

            {/* Search Bar */}
            <form action="/help/search" className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                placeholder="Search for help articles..."
                className="pl-12 h-14 text-lg"
              />
            </form>

            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
              <span>Popular searches:</span>
              <Link href="/help/search?q=quota" className="text-pink-500 hover:underline">
                quotas
              </Link>
              <span>·</span>
              <Link href="/help/search?q=integration" className="text-pink-500 hover:underline">
                integrations
              </Link>
              <span>·</span>
              <Link href="/help/search?q=billing" className="text-pink-500 hover:underline">
                billing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpCategories.map((category) => {
            const Icon = iconMap[category.icon] || Rocket
            return (
              <Link key={category.slug} href={`/help/${category.slug}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow h-full group">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-pink-500/10 text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{category.title}</h3>
                        <Badge variant="secondary">{category.articleCount}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-1 mt-4 text-sm text-pink-500 group-hover:gap-2 transition-all">
                        Browse articles
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="container mx-auto px-4 py-12 md:py-16 border-t">
          <h2 className="text-2xl font-bold mb-8">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/help/${article.category}/${article.slug}`}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                  <h3 className="font-semibold mb-2 group-hover:text-pink-500 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {article.summary}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{article.readingTime} min read</span>
                    <span>·</span>
                    <span>Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Contact Support CTA */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-pink-500/5 to-background border-pink-500/20">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
            We typically respond within 4 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Contact Support
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </div>
    </div>
    </>
  )
}
