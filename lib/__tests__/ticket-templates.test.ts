import { describe, it, expect } from 'vitest'
import { ticketTemplates } from '../ticket-templates'

describe('ticketTemplates', () => {
  it('has at least 5 templates', () => {
    expect(ticketTemplates.length).toBeGreaterThanOrEqual(5)
  })

  it('each template has required fields', () => {
    for (const tpl of ticketTemplates) {
      expect(tpl.id).toBeTruthy()
      expect(tpl.label).toBeTruthy()
      expect(tpl.title).toBeTruthy()
      expect(tpl.description).toBeTruthy()
      expect(tpl.category).toBeTruthy()
      expect(tpl.priority).toBeTruthy()
    }
  })

  it('each template has a unique id', () => {
    const ids = ticketTemplates.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('categories are valid', () => {
    const validCategories = ['GENERAL', 'BUG', 'FEATURE_REQUEST', 'BILLING', 'TECHNICAL']
    for (const tpl of ticketTemplates) {
      expect(validCategories).toContain(tpl.category)
    }
  })

  it('priorities are valid', () => {
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
    for (const tpl of ticketTemplates) {
      expect(validPriorities).toContain(tpl.priority)
    }
  })

  it('includes a bug report template', () => {
    const bug = ticketTemplates.find((t) => t.category === 'BUG')
    expect(bug).toBeTruthy()
  })

  it('includes an urgent template', () => {
    const urgent = ticketTemplates.find((t) => t.priority === 'URGENT')
    expect(urgent).toBeTruthy()
  })
})
