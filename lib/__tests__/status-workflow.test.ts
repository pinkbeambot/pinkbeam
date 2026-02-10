import { describe, it, expect } from 'vitest'

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  NEW: ['CONTACTED', 'DECLINED'],
  CONTACTED: ['QUALIFIED', 'DECLINED'],
  QUALIFIED: ['PROPOSAL', 'DECLINED'],
  PROPOSAL: ['ACCEPTED', 'DECLINED', 'QUALIFIED'],
  ACCEPTED: [],
  DECLINED: ['NEW'],
}

const ALL_STATUSES = Object.keys(ALLOWED_TRANSITIONS)

function canTransition(from: string, to: string): boolean {
  return (ALLOWED_TRANSITIONS[from] ?? []).includes(to)
}

describe('status workflow transitions', () => {
  // ── Each status can only transition to its allowed targets ──────────
  describe('each status can only transition to its allowed targets', () => {
    for (const from of ALL_STATUSES) {
      const allowed = ALLOWED_TRANSITIONS[from]

      for (const to of ALL_STATUSES) {
        if (allowed.includes(to)) {
          it(`allows ${from} -> ${to}`, () => {
            expect(canTransition(from, to)).toBe(true)
          })
        } else if (from !== to) {
          it(`blocks ${from} -> ${to}`, () => {
            expect(canTransition(from, to)).toBe(false)
          })
        }
      }
    }
  })

  // ── NEW cannot go directly to ACCEPTED, QUALIFIED, or PROPOSAL ─────
  describe('NEW cannot skip steps', () => {
    it('cannot transition from NEW to ACCEPTED', () => {
      expect(canTransition('NEW', 'ACCEPTED')).toBe(false)
    })

    it('cannot transition from NEW to QUALIFIED', () => {
      expect(canTransition('NEW', 'QUALIFIED')).toBe(false)
    })

    it('cannot transition from NEW to PROPOSAL', () => {
      expect(canTransition('NEW', 'PROPOSAL')).toBe(false)
    })
  })

  // ── ACCEPTED is terminal ───────────────────────────────────────────
  it('ACCEPTED is a terminal state with no allowed transitions', () => {
    expect(ALLOWED_TRANSITIONS['ACCEPTED']).toEqual([])

    for (const to of ALL_STATUSES) {
      if (to !== 'ACCEPTED') {
        expect(canTransition('ACCEPTED', to)).toBe(false)
      }
    }
  })

  // ── DECLINED can be reopened to NEW ────────────────────────────────
  it('DECLINED can be reopened to NEW', () => {
    expect(canTransition('DECLINED', 'NEW')).toBe(true)
  })

  it('DECLINED can only transition to NEW', () => {
    expect(ALLOWED_TRANSITIONS['DECLINED']).toEqual(['NEW'])
  })

  // ── PROPOSAL can go back to QUALIFIED ──────────────────────────────
  it('PROPOSAL can go back to QUALIFIED', () => {
    expect(canTransition('PROPOSAL', 'QUALIFIED')).toBe(true)
  })

  // ── Full happy path ────────────────────────────────────────────────
  it('supports the full happy path: NEW -> CONTACTED -> QUALIFIED -> PROPOSAL -> ACCEPTED', () => {
    const path = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'ACCEPTED']

    for (let i = 0; i < path.length - 1; i++) {
      expect(canTransition(path[i], path[i + 1])).toBe(true)
    }
  })
})
