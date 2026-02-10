interface QuoteData {
  budgetRange: string
  timeline: string
  projectType: string
  services: string[]
  description: string
  website?: string | null
  company?: string | null
  needsEcommerce?: boolean
}

export function calculateLeadScore(quote: QuoteData): { score: number; quality: string } {
  let score = 0

  // Budget (max 30 points)
  const budgetScores: Record<string, number> = {
    '25k+': 30,
    '10k-25k': 20,
    '5k-10k': 12,
    '2k-5k': 6,
    'unsure': 3,
  }
  score += budgetScores[quote.budgetRange] ?? 0

  // Timeline urgency (max 25 points)
  const timelineScores: Record<string, number> = {
    'urgent': 25,
    '1-3months': 20,
    '3-6months': 15,
    'flexible': 8,
  }
  score += timelineScores[quote.timeline] ?? 0

  // Project type (max 20 points)
  const projectScores: Record<string, number> = {
    'ecommerce': 20,
    'redesign': 15,
    'migration': 15,
    'new': 12,
    'other': 5,
  }
  score += projectScores[quote.projectType] ?? 0

  // Number of services (max 10 points) — more services = larger engagement
  score += Math.min(quote.services.length * 3, 10)

  // Description quality (max 15 points)
  const len = quote.description.length
  if (len > 200) score += 15
  else if (len > 100) score += 10
  else if (len > 50) score += 5

  // Company signals (max 10 points)
  if (quote.website) score += 5
  if (quote.company) score += 5

  // E-commerce flag bonus (max 5 points)
  if (quote.needsEcommerce) score += 5

  const finalScore = Math.min(score, 100)

  // Quality tier
  let quality: string
  if (finalScore >= 65) quality = 'hot'
  else if (finalScore >= 40) quality = 'warm'
  else quality = 'cold'

  return { score: finalScore, quality }
}
