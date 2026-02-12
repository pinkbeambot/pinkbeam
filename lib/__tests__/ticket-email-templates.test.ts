import { describe, it, expect } from 'vitest'
import {
  ticketCreatedTemplate,
  ticketAdminNotificationTemplate,
  ticketStatusUpdateTemplate,
  ticketCommentNotificationTemplate,
} from '../email-templates'

const sampleTicket = {
  id: 'test-ticket-123',
  title: 'Homepage not loading',
  clientName: 'Jane Smith',
  clientEmail: 'jane@example.com',
  status: 'OPEN',
  priority: 'HIGH' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
  category: 'BUG',
}

describe('ticketCreatedTemplate', () => {
  it('returns subject and html', () => {
    const { subject, html } = ticketCreatedTemplate(sampleTicket)
    expect(subject).toContain('Ticket received')
    expect(subject).toContain('Homepage not loading')
    expect(html).toContain('Jane')
    expect(html).toContain('Homepage not loading')
    expect(html).toContain('HIGH')
    expect(html).toContain('BUG')
  })

  it('includes ticket ID reference', () => {
    const { html } = ticketCreatedTemplate(sampleTicket)
    expect(html).toContain('test-tic')
  })
})

describe('ticketAdminNotificationTemplate', () => {
  it('returns subject with priority', () => {
    const { subject, html } = ticketAdminNotificationTemplate(sampleTicket)
    expect(subject).toContain('HIGH')
    expect(subject).toContain('Homepage not loading')
    expect(html).toContain('Jane Smith')
    expect(html).toContain('jane@example.com')
  })
})

describe('ticketStatusUpdateTemplate', () => {
  it('generates IN_PROGRESS template', () => {
    const { subject, html } = ticketStatusUpdateTemplate(sampleTicket, 'IN_PROGRESS')
    expect(subject).toContain('working on it')
    expect(html).toContain('Jane')
    expect(html).toContain('actively worked on')
  })

  it('generates WAITING_CLIENT template', () => {
    const { subject, html } = ticketStatusUpdateTemplate(sampleTicket, 'WAITING_CLIENT')
    expect(subject).toContain('need your input')
    expect(html).toContain('question about your ticket')
  })

  it('generates RESOLVED template', () => {
    const { subject, html } = ticketStatusUpdateTemplate(sampleTicket, 'RESOLVED')
    expect(subject).toContain('resolved')
    expect(html).toContain('resolved')
  })

  it('generates CLOSED template', () => {
    const { subject, html } = ticketStatusUpdateTemplate(sampleTicket, 'CLOSED')
    expect(subject).toContain('closed')
    expect(html).toContain('closed')
  })

  it('returns empty for OPEN status (no notification needed)', () => {
    const { subject, html } = ticketStatusUpdateTemplate(sampleTicket, 'OPEN')
    expect(subject).toBe('')
    expect(html).toBe('')
  })
})

describe('ticketCommentNotificationTemplate', () => {
  it('includes author name and comment body', () => {
    const { subject, html } = ticketCommentNotificationTemplate(
      sampleTicket,
      'I found the issue. It should be fixed now.',
      'Support Agent'
    )
    expect(subject).toContain('Reply on')
    expect(subject).toContain('Homepage not loading')
    expect(html).toContain('Support Agent')
    expect(html).toContain('I found the issue')
    expect(html).toContain('Jane')
  })
})
