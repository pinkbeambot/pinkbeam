export interface KBArticle {
  id: string
  title: string
  excerpt: string
  category: string
  url: string
  helpful?: number
  notHelpful?: number
}

// Static knowledge base articles — can be replaced with DB-backed articles later
export const kbArticles: KBArticle[] = [
  {
    id: 'kb-001',
    title: 'How to Clear Your Browser Cache',
    excerpt: 'If your website changes are not showing up, clearing your browser cache is usually the first step.',
    category: 'TECHNICAL',
    url: '#',
  },
  {
    id: 'kb-002',
    title: 'Understanding Your Invoice',
    excerpt: 'A breakdown of the line items on your Pink Beam invoice and what each charge covers.',
    category: 'BILLING',
    url: '#',
  },
  {
    id: 'kb-003',
    title: 'How to Report a Bug Effectively',
    excerpt: 'Tips for providing the information our team needs to quickly resolve bugs on your website.',
    category: 'BUG',
    url: '#',
  },
  {
    id: 'kb-004',
    title: 'Requesting New Features or Changes',
    excerpt: 'How to submit and track feature requests for your website project.',
    category: 'FEATURE_REQUEST',
    url: '#',
  },
  {
    id: 'kb-005',
    title: 'Website Down? What to Check First',
    excerpt: 'A quick checklist of things to verify before submitting an urgent support ticket.',
    category: 'TECHNICAL',
    url: '#',
  },
  {
    id: 'kb-006',
    title: 'Payment Methods and Billing Cycles',
    excerpt: 'Information about accepted payment methods, billing frequency, and how to update your payment details.',
    category: 'BILLING',
    url: '#',
  },
  {
    id: 'kb-007',
    title: 'How to Update Your Website Content',
    excerpt: 'Guide to requesting text, image, or layout changes through the support system.',
    category: 'GENERAL',
    url: '#',
  },
  {
    id: 'kb-008',
    title: 'SEO Best Practices for Your Website',
    excerpt: 'Key SEO techniques we implement and how you can help improve your search rankings.',
    category: 'TECHNICAL',
    url: '#',
  },
]

/** Get suggested articles based on ticket category */
export function getSuggestedArticles(category: string, limit = 3): KBArticle[] {
  // Primary: match category, then fill with general articles
  const matched = kbArticles.filter((a) => a.category === category)
  const general = kbArticles.filter((a) => a.category === 'GENERAL' && !matched.includes(a))
  return [...matched, ...general].slice(0, limit)
}

/** Get all articles grouped by category */
export function getArticlesByCategory(): Record<string, KBArticle[]> {
  const grouped: Record<string, KBArticle[]> = {}
  for (const article of kbArticles) {
    if (!grouped[article.category]) grouped[article.category] = []
    grouped[article.category].push(article)
  }
  return grouped
}
