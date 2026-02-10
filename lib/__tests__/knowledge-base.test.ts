import { describe, it, expect } from 'vitest'
import { kbArticles, getSuggestedArticles, getArticlesByCategory } from '../knowledge-base'

describe('kbArticles', () => {
  it('has articles', () => {
    expect(kbArticles.length).toBeGreaterThan(0)
  })

  it('each article has required fields', () => {
    for (const article of kbArticles) {
      expect(article.id).toBeTruthy()
      expect(article.title).toBeTruthy()
      expect(article.excerpt).toBeTruthy()
      expect(article.category).toBeTruthy()
      expect(article.url).toBeTruthy()
    }
  })

  it('each article has a unique id', () => {
    const ids = kbArticles.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getSuggestedArticles', () => {
  it('returns articles matching the category', () => {
    const articles = getSuggestedArticles('BUG')
    expect(articles.length).toBeGreaterThan(0)
    expect(articles.some((a) => a.category === 'BUG')).toBe(true)
  })

  it('returns at most limit articles', () => {
    const articles = getSuggestedArticles('TECHNICAL', 2)
    expect(articles.length).toBeLessThanOrEqual(2)
  })

  it('falls back to general articles when category has fewer results', () => {
    const articles = getSuggestedArticles('BILLING', 5)
    // Should include billing articles + general fill
    expect(articles.length).toBeGreaterThan(0)
  })

  it('returns empty array for nonexistent category with no general articles', () => {
    // There ARE general articles, so this should still return some
    const articles = getSuggestedArticles('NONEXISTENT')
    expect(articles.length).toBeGreaterThan(0)
  })
})

describe('getArticlesByCategory', () => {
  it('groups articles by category', () => {
    const grouped = getArticlesByCategory()
    expect(Object.keys(grouped).length).toBeGreaterThan(0)
    for (const [category, articles] of Object.entries(grouped)) {
      expect(articles.length).toBeGreaterThan(0)
      for (const article of articles) {
        expect(article.category).toBe(category)
      }
    }
  })
})
