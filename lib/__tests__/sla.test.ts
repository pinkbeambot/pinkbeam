import { describe, it, expect } from 'vitest'
import { calculateSlaDeadline, isSlaBreached } from '../sla'

describe('calculateSlaDeadline', () => {
  it('calculates URGENT deadline as 4 hours from now', () => {
    const now = new Date('2026-02-10T12:00:00Z')
    const deadline = calculateSlaDeadline('URGENT', now)
    expect(deadline.getTime()).toBe(new Date('2026-02-10T16:00:00Z').getTime())
  })

  it('calculates HIGH deadline as 24 hours', () => {
    const now = new Date('2026-02-10T12:00:00Z')
    const deadline = calculateSlaDeadline('HIGH', now)
    expect(deadline.getTime()).toBe(new Date('2026-02-11T12:00:00Z').getTime())
  })

  it('calculates MEDIUM deadline as 72 hours', () => {
    const now = new Date('2026-02-10T12:00:00Z')
    const deadline = calculateSlaDeadline('MEDIUM', now)
    expect(deadline.getTime()).toBe(new Date('2026-02-13T12:00:00Z').getTime())
  })

  it('calculates LOW deadline as 168 hours (1 week)', () => {
    const now = new Date('2026-02-10T12:00:00Z')
    const deadline = calculateSlaDeadline('LOW', now)
    expect(deadline.getTime()).toBe(new Date('2026-02-17T12:00:00Z').getTime())
  })

  it('defaults to MEDIUM for unknown priority', () => {
    const now = new Date('2026-02-10T12:00:00Z')
    const deadline = calculateSlaDeadline('UNKNOWN', now)
    expect(deadline.getTime()).toBe(new Date('2026-02-13T12:00:00Z').getTime())
  })

  it('uses current time when no from date provided', () => {
    const before = Date.now()
    const deadline = calculateSlaDeadline('URGENT')
    const after = Date.now()
    const deadlineMs = deadline.getTime()
    // Should be ~4 hours from now
    expect(deadlineMs).toBeGreaterThanOrEqual(before + 4 * 60 * 60 * 1000)
    expect(deadlineMs).toBeLessThanOrEqual(after + 4 * 60 * 60 * 1000)
  })
})

describe('isSlaBreached', () => {
  it('returns true when deadline is in the past', () => {
    const past = new Date(Date.now() - 1000)
    expect(isSlaBreached(past)).toBe(true)
  })

  it('returns false when deadline is in the future', () => {
    const future = new Date(Date.now() + 60000)
    expect(isSlaBreached(future)).toBe(false)
  })

  it('returns false when deadline is null', () => {
    expect(isSlaBreached(null)).toBe(false)
  })
})
