import { describe, it, expect } from 'vitest'

// Mirror the ALLOWED_TRANSITIONS from the API
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  OPEN: ['IN_PROGRESS', 'CLOSED'],
  IN_PROGRESS: ['WAITING_CLIENT', 'RESOLVED', 'OPEN'],
  WAITING_CLIENT: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
  RESOLVED: ['CLOSED', 'OPEN'],
  CLOSED: ['OPEN'],
}

const ALL_STATUSES = ['OPEN', 'IN_PROGRESS', 'WAITING_CLIENT', 'RESOLVED', 'CLOSED']

function isValidTransition(from: string, to: string): boolean {
  return (ALLOWED_TRANSITIONS[from] ?? []).includes(to)
}

describe('Ticket Status Transitions', () => {
  describe('OPEN transitions', () => {
    it('can go to IN_PROGRESS', () => expect(isValidTransition('OPEN', 'IN_PROGRESS')).toBe(true))
    it('can go to CLOSED', () => expect(isValidTransition('OPEN', 'CLOSED')).toBe(true))
    it('cannot go to WAITING_CLIENT', () => expect(isValidTransition('OPEN', 'WAITING_CLIENT')).toBe(false))
    it('cannot go to RESOLVED', () => expect(isValidTransition('OPEN', 'RESOLVED')).toBe(false))
    it('cannot stay OPEN', () => expect(isValidTransition('OPEN', 'OPEN')).toBe(false))
  })

  describe('IN_PROGRESS transitions', () => {
    it('can go to WAITING_CLIENT', () => expect(isValidTransition('IN_PROGRESS', 'WAITING_CLIENT')).toBe(true))
    it('can go to RESOLVED', () => expect(isValidTransition('IN_PROGRESS', 'RESOLVED')).toBe(true))
    it('can go back to OPEN', () => expect(isValidTransition('IN_PROGRESS', 'OPEN')).toBe(true))
    it('cannot go directly to CLOSED', () => expect(isValidTransition('IN_PROGRESS', 'CLOSED')).toBe(false))
  })

  describe('WAITING_CLIENT transitions', () => {
    it('can go to IN_PROGRESS', () => expect(isValidTransition('WAITING_CLIENT', 'IN_PROGRESS')).toBe(true))
    it('can go to RESOLVED', () => expect(isValidTransition('WAITING_CLIENT', 'RESOLVED')).toBe(true))
    it('can go to CLOSED', () => expect(isValidTransition('WAITING_CLIENT', 'CLOSED')).toBe(true))
    it('cannot go to OPEN', () => expect(isValidTransition('WAITING_CLIENT', 'OPEN')).toBe(false))
  })

  describe('RESOLVED transitions', () => {
    it('can go to CLOSED', () => expect(isValidTransition('RESOLVED', 'CLOSED')).toBe(true))
    it('can reopen to OPEN', () => expect(isValidTransition('RESOLVED', 'OPEN')).toBe(true))
    it('cannot go to IN_PROGRESS', () => expect(isValidTransition('RESOLVED', 'IN_PROGRESS')).toBe(false))
    it('cannot go to WAITING_CLIENT', () => expect(isValidTransition('RESOLVED', 'WAITING_CLIENT')).toBe(false))
  })

  describe('CLOSED transitions', () => {
    it('can reopen to OPEN', () => expect(isValidTransition('CLOSED', 'OPEN')).toBe(true))
    it('cannot go to IN_PROGRESS', () => expect(isValidTransition('CLOSED', 'IN_PROGRESS')).toBe(false))
    it('cannot go to WAITING_CLIENT', () => expect(isValidTransition('CLOSED', 'WAITING_CLIENT')).toBe(false))
    it('cannot go to RESOLVED', () => expect(isValidTransition('CLOSED', 'RESOLVED')).toBe(false))
  })

  describe('Full transition matrix', () => {
    const expectedTransitions: Record<string, Record<string, boolean>> = {
      OPEN: { OPEN: false, IN_PROGRESS: true, WAITING_CLIENT: false, RESOLVED: false, CLOSED: true },
      IN_PROGRESS: { OPEN: true, IN_PROGRESS: false, WAITING_CLIENT: true, RESOLVED: true, CLOSED: false },
      WAITING_CLIENT: { OPEN: false, IN_PROGRESS: true, WAITING_CLIENT: false, RESOLVED: true, CLOSED: true },
      RESOLVED: { OPEN: true, IN_PROGRESS: false, WAITING_CLIENT: false, RESOLVED: false, CLOSED: true },
      CLOSED: { OPEN: true, IN_PROGRESS: false, WAITING_CLIENT: false, RESOLVED: false, CLOSED: false },
    }

    for (const from of ALL_STATUSES) {
      for (const to of ALL_STATUSES) {
        const expected = expectedTransitions[from][to]
        it(`${from} → ${to} should be ${expected ? 'allowed' : 'rejected'}`, () => {
          expect(isValidTransition(from, to)).toBe(expected)
        })
      }
    }
  })

  describe('Happy path workflows', () => {
    it('standard resolution: OPEN → IN_PROGRESS → RESOLVED → CLOSED', () => {
      expect(isValidTransition('OPEN', 'IN_PROGRESS')).toBe(true)
      expect(isValidTransition('IN_PROGRESS', 'RESOLVED')).toBe(true)
      expect(isValidTransition('RESOLVED', 'CLOSED')).toBe(true)
    })

    it('waiting for client: OPEN → IN_PROGRESS → WAITING_CLIENT → IN_PROGRESS → RESOLVED', () => {
      expect(isValidTransition('OPEN', 'IN_PROGRESS')).toBe(true)
      expect(isValidTransition('IN_PROGRESS', 'WAITING_CLIENT')).toBe(true)
      expect(isValidTransition('WAITING_CLIENT', 'IN_PROGRESS')).toBe(true)
      expect(isValidTransition('IN_PROGRESS', 'RESOLVED')).toBe(true)
    })

    it('quick close: OPEN → CLOSED', () => {
      expect(isValidTransition('OPEN', 'CLOSED')).toBe(true)
    })

    it('reopen: CLOSED → OPEN → IN_PROGRESS', () => {
      expect(isValidTransition('CLOSED', 'OPEN')).toBe(true)
      expect(isValidTransition('OPEN', 'IN_PROGRESS')).toBe(true)
    })
  })
})
