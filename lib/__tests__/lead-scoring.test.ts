import { describe, it, expect } from 'vitest'
import { calculateLeadScore } from '@/lib/lead-scoring'

function makeQuote(overrides: Record<string, unknown> = {}) {
  return {
    budgetRange: 'unsure',
    timeline: 'flexible',
    projectType: 'other',
    services: ['design'],
    description: 'Short.',
    ...overrides,
  }
}

describe('calculateLeadScore', () => {
  // ── Hot lead ──────────────────────────────────────────────────────
  it('returns a hot lead for high budget, urgent timeline, ecommerce, many services, long description, company + website', () => {
    const result = calculateLeadScore(
      makeQuote({
        budgetRange: '25k+',
        timeline: 'urgent',
        projectType: 'ecommerce',
        services: ['design', 'dev', 'seo', 'branding'],
        description: 'A'.repeat(201),
        company: 'Acme Inc',
        website: 'https://acme.com',
        needsEcommerce: true,
      }),
    )

    // 30 + 25 + 20 + min(12,10) + 15 + 5 + 5 + 5 = 100 (capped)
    // but 30+25+20+10+15+5+5+5 = 115 -> capped at 100
    expect(result.score).toBe(100)
    expect(result.quality).toBe('hot')
  })

  // ── Cold lead ─────────────────────────────────────────────────────
  it('returns a cold lead for low budget, flexible timeline, minimal details', () => {
    const result = calculateLeadScore(
      makeQuote({
        budgetRange: '2k-5k',
        timeline: 'flexible',
        projectType: 'other',
        services: ['design'],
        description: 'Need a site.',
      }),
    )

    // 6 + 8 + 5 + 3 + 0 = 22
    expect(result.score).toBe(22)
    expect(result.quality).toBe('cold')
  })

  // ── Warm lead ─────────────────────────────────────────────────────
  it('returns a warm lead for mid-range values', () => {
    const result = calculateLeadScore(
      makeQuote({
        budgetRange: '10k-25k',
        timeline: '3-6months',
        projectType: 'new',
        services: ['design', 'dev'],
        description: 'A'.repeat(101),
      }),
    )

    // 20 + 15 + 12 + 6 + 10 = 63
    expect(result.score).toBe(63)
    expect(result.quality).toBe('warm')
  })

  // ── Score capped at 100 ───────────────────────────────────────────
  it('caps the score at 100 even when individual dimensions exceed the cap', () => {
    const result = calculateLeadScore(
      makeQuote({
        budgetRange: '25k+',
        timeline: 'urgent',
        projectType: 'ecommerce',
        services: ['a', 'b', 'c', 'd', 'e', 'f'],
        description: 'A'.repeat(300),
        company: 'BigCorp',
        website: 'https://bigcorp.com',
        needsEcommerce: true,
      }),
    )

    // 30 + 25 + 20 + 10 + 15 + 5 + 5 + 5 = 115 -> capped at 100
    expect(result.score).toBe(100)
  })

  // ── Unknown values score 0 for that dimension ─────────────────────
  it('scores 0 for unrecognized budget, timeline, and project type values', () => {
    const result = calculateLeadScore(
      makeQuote({
        budgetRange: 'banana',
        timeline: 'whenever',
        projectType: 'spaceship',
        services: [],
        description: '',
      }),
    )

    // 0 + 0 + 0 + 0 + 0 = 0
    expect(result.score).toBe(0)
    expect(result.quality).toBe('cold')
  })

  // ── Quality tier boundaries ───────────────────────────────────────
  describe('quality tier boundaries', () => {
    it('returns "warm" for a score of 64', () => {
      // 20 (10k-25k) + 20 (1-3months) + 12 (new) + 6 (2 services) + 5 (>50 desc) + 0 + 0 = 63
      // need 64 => add website (+5) = 68 — too much
      // Instead: 20 + 15 + 12 + 6 + 5 + 5 + 0 = 63 — need +1, but scoring is discrete
      // Let's pick exact: budget 20 + timeline 20 + project 12 + services(1)*3=3 + desc(51-100)=5 + company=5 = 65 — still not 64
      // budget 20 + timeline 15 + project 15 + services(3)=9 + desc(<50)=0 + company 5 = 64
      const result = calculateLeadScore(
        makeQuote({
          budgetRange: '10k-25k',
          timeline: '3-6months',
          projectType: 'redesign',
          services: ['a', 'b', 'c'],
          description: 'short',
          company: 'Test',
        }),
      )

      expect(result.score).toBe(64)
      expect(result.quality).toBe('warm')
    })

    it('returns "hot" for a score of 65', () => {
      // 20 + 15 + 15 + 9 + 0 + 5 + 0 = 64 => need one more point
      // add website (+5) = 69 — too much
      // Try: 20 + 20 + 15 + min(3*1,10)=3 + 0 + 5 + 0 + needsEcommerce(5)=68 — too much
      // 20 + 15 + 15 + 10 + 0 + 5 + 0 = 65 => 4+ services
      const result = calculateLeadScore(
        makeQuote({
          budgetRange: '10k-25k',
          timeline: '3-6months',
          projectType: 'redesign',
          services: ['a', 'b', 'c', 'd'],
          description: 'short',
          company: 'Test',
        }),
      )

      // 20 + 15 + 15 + min(12,10) + 0 + 5 = 65
      expect(result.score).toBe(65)
      expect(result.quality).toBe('hot')
    })

    it('returns "cold" for a score of 39', () => {
      // budget 20 + timeline 8 + project 5 + services(2)=6 + desc(0) = 39
      const result = calculateLeadScore(
        makeQuote({
          budgetRange: '10k-25k',
          timeline: 'flexible',
          projectType: 'other',
          services: ['a', 'b'],
          description: 'tiny',
        }),
      )

      expect(result.score).toBe(39)
      expect(result.quality).toBe('cold')
    })

    it('returns "warm" for a score of 40', () => {
      // budget 20 + timeline 8 + project 5 + services(2)=6 + desc(0) + website(0) + company(0) = 39
      // need 40 => add 1 more => services(3)=9 => 20+8+5+9 = 42 — too much
      // budget 6 + timeline 25 + project 5 + services(1)=3 + desc(0) + company 0 = 39
      // budget 20 + timeline 8 + project 12 + services(0)=0 + desc(0) = 40
      const result = calculateLeadScore(
        makeQuote({
          budgetRange: '10k-25k',
          timeline: 'flexible',
          projectType: 'new',
          services: [],
          description: 'tiny',
        }),
      )

      expect(result.score).toBe(40)
      expect(result.quality).toBe('warm')
    })
  })
})
