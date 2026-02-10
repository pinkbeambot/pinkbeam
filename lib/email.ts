import {
  adminNotificationTemplate,
  clientAutoResponseTemplate,
  followUpDay1Template,
  followUpDay3Template,
  followUpDay7Template,
  statusUpdateTemplate,
  ticketCreatedTemplate,
  ticketAdminNotificationTemplate,
  ticketStatusUpdateTemplate,
  ticketCommentNotificationTemplate,
} from './email-templates'

interface QuoteRequestData {
  id: string
  fullName: string
  email: string
  company?: string | null
  projectType: string
  services: string[]
  budgetRange: string
  timeline: string
  description: string
  leadScore?: number
  leadQuality?: string | null
}

async function sendEmail(params: {
  to: string | string[]
  subject: string
  html: string
  tags?: { name: string; value: string }[]
  replyTo?: string
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log('[email] RESEND_API_KEY not configured — skipping')
    return false
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Pink Beam <notifications@pinkbeam.ai>',
      to: Array.isArray(params.to) ? params.to : [params.to],
      subject: params.subject,
      html: params.html,
      reply_to: params.replyTo,
      tags: params.tags,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resend API error (${res.status}): ${text}`)
  }

  return true
}

/** E2: Send admin notification when a new quote is submitted */
export async function sendQuoteNotification(quote: QuoteRequestData) {
  const notifyEmail = process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai'
  const { subject, html } = adminNotificationTemplate(quote)

  await sendEmail({
    to: notifyEmail,
    subject,
    html,
    tags: [
      { name: 'type', value: 'admin-notification' },
      { name: 'quote_id', value: quote.id },
    ],
  })
}

/** E3: Send auto-response to the client who submitted */
export async function sendClientAutoResponse(quote: QuoteRequestData) {
  const { subject, html } = clientAutoResponseTemplate(quote)

  await sendEmail({
    to: quote.email,
    subject,
    html,
    replyTo: process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai',
    tags: [
      { name: 'type', value: 'auto-response' },
      { name: 'quote_id', value: quote.id },
    ],
  })
}

/** E4: Send follow-up email based on stage (1, 2, or 3) */
export async function sendFollowUpEmail(quote: QuoteRequestData, stage: number) {
  const templateFn =
    stage === 1
      ? followUpDay1Template
      : stage === 2
        ? followUpDay3Template
        : followUpDay7Template

  const { subject, html } = templateFn(quote)
  if (!subject) return

  await sendEmail({
    to: quote.email,
    subject,
    html,
    replyTo: process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai',
    tags: [
      { name: 'type', value: `follow-up-${stage}` },
      { name: 'quote_id', value: quote.id },
    ],
  })
}

// --- Ticket email functions ---

interface TicketEmailData {
  id: string
  title: string
  clientName: string
  clientEmail: string
  status?: string
  priority?: string
  category?: string
}

/** Send ticket creation confirmation to client */
export async function sendTicketCreatedEmail(ticket: TicketEmailData) {
  const { subject, html } = ticketCreatedTemplate(ticket)
  await sendEmail({
    to: ticket.clientEmail,
    subject,
    html,
    tags: [
      { name: 'type', value: 'ticket-created' },
      { name: 'ticket_id', value: ticket.id },
    ],
  })
}

/** Send admin notification for new ticket */
export async function sendTicketAdminNotification(ticket: TicketEmailData) {
  const notifyEmail = process.env.SUPPORT_NOTIFY_EMAIL || process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai'
  const { subject, html } = ticketAdminNotificationTemplate(ticket)
  await sendEmail({
    to: notifyEmail,
    subject,
    html,
    tags: [
      { name: 'type', value: 'ticket-admin-notification' },
      { name: 'ticket_id', value: ticket.id },
    ],
  })
}

/** Send ticket status update to client */
export async function sendTicketStatusUpdateEmail(ticket: TicketEmailData, newStatus: string) {
  const notifiableStatuses = ['IN_PROGRESS', 'WAITING_CLIENT', 'RESOLVED', 'CLOSED']
  if (!notifiableStatuses.includes(newStatus)) return
  const { subject, html } = ticketStatusUpdateTemplate(ticket, newStatus)
  if (!subject) return
  await sendEmail({
    to: ticket.clientEmail,
    subject,
    html,
    tags: [
      { name: 'type', value: 'ticket-status-update' },
      { name: 'ticket_id', value: ticket.id },
      { name: 'status', value: newStatus },
    ],
  })
}

/** Send comment notification to client (only for non-internal comments by non-clients) */
export async function sendTicketCommentEmail(ticket: TicketEmailData, commentBody: string, authorName: string) {
  const { subject, html } = ticketCommentNotificationTemplate(ticket, commentBody, authorName)
  await sendEmail({
    to: ticket.clientEmail,
    subject,
    html,
    tags: [
      { name: 'type', value: 'ticket-comment' },
      { name: 'ticket_id', value: ticket.id },
    ],
  })
}

/** E5: Send status update email to the client */
export async function sendStatusUpdateEmail(
  quote: QuoteRequestData,
  newStatus: string,
) {
  // Only send for meaningful status changes the client should know about
  const notifiableStatuses = ['CONTACTED', 'QUALIFIED', 'PROPOSAL', 'ACCEPTED', 'DECLINED']
  if (!notifiableStatuses.includes(newStatus)) return

  const { subject, html } = statusUpdateTemplate(quote, newStatus)
  if (!subject) return

  await sendEmail({
    to: quote.email,
    subject,
    html,
    replyTo: process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai',
    tags: [
      { name: 'type', value: 'status-update' },
      { name: 'quote_id', value: quote.id },
      { name: 'status', value: newStatus },
    ],
  })
}
