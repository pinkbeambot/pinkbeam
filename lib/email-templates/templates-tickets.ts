/**
 * Ticket Email Templates
 * 
 * Templates for support ticket notifications
 */

import {
  EmailLayout,
  EmailHeader,
  EmailHeaderCompact,
  EmailFooterMinimal,
  EmailButton,
  EmailCard,
  EmailCardList,
  EmailInfoCard,
  COLORS,
} from './components'

import {
  type TicketVariables,
  getFirstName,
} from './variables'

// ============================================================================
// Ticket Email Templates
// ============================================================================

export function ticketCreatedTemplate(ticket: TicketVariables): { subject: string; html: string; text: string } {
  const firstName = getFirstName(ticket.clientName)

  const content = `
    ${EmailHeader({ title: 'Support Ticket Created', subtitle: `Ticket #${ticket.id.slice(0, 8)}` })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            We've received your support ticket and our team will respond as soon as possible.
          </p>
          ${EmailCardList({
            items: [
              { label: 'Subject', value: ticket.title, highlight: true },
              { label: 'Priority', value: ticket.priority || 'Medium' },
              { label: 'Category', value: ticket.category || 'General' },
            ],
            variant: 'filled',
          })}
          <p style="font-size: 15px; line-height: 1.6; margin: 24px 0 0 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            You can track your ticket status in the <strong style="color: ${COLORS.text};" class="dark-text">Client Portal</strong>. If you have additional details, reply to this email and they'll be added to your ticket.
          </p>
          <p style="font-size: 15px; color: ${COLORS.textLight}; margin: 16px 0 0 0;" class="dark-text-secondary">— The Pink Beam Support Team</p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: `Support ticket #${ticket.id.slice(0, 8)} created`,
  })

  const text = `Support Ticket Created

Hi ${firstName},

We've received your support ticket and our team will respond as soon as possible.

Subject: ${ticket.title}
Priority: ${ticket.priority || 'Medium'}
Category: ${ticket.category || 'General'}

You can track your ticket status in the Client Portal. If you have additional details, reply to this email and they'll be added to your ticket.

— The Pink Beam Support Team`

  return {
    subject: `Ticket received: ${ticket.title} — Pink Beam`,
    html,
    text,
  }
}

export function ticketAdminNotificationTemplate(ticket: TicketVariables): { subject: string; html: string; text: string } {
  const priorityColors: Record<string, string> = {
    LOW: '#6b7280',
    MEDIUM: '#3b82f6',
    HIGH: '#f59e0b',
    URGENT: '#ef4444',
  }

  const priorityColor = priorityColors[ticket.priority || 'MEDIUM']

  const content = `
    ${EmailHeader({ 
      title: 'New Support Ticket', 
      subtitle: `Priority: ${ticket.priority || 'Medium'}` 
    })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          ${EmailCardList({
            items: [
              { label: 'Client', value: `${ticket.clientName} (${ticket.clientEmail})`, highlight: true },
              { label: 'Subject', value: ticket.title, highlight: true },
              { label: 'Category', value: ticket.category || 'General' },
              { label: 'Priority', value: `<span style="color: ${priorityColor}; font-weight: 600;">${ticket.priority || 'Medium'}</span>` },
            ],
            variant: 'outlined',
          })}
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 0 28px 28px 28px; text-align: center;">
          <p style="color: ${COLORS.textMuted}; font-size: 12px; margin: 0;">Ticket ID: ${ticket.id}</p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: `New ticket from ${ticket.clientName}: ${ticket.title}`,
  })

  const text = `New Support Ticket

Priority: ${ticket.priority || 'Medium'}
Client: ${ticket.clientName} (${ticket.clientEmail})
Subject: ${ticket.title}
Category: ${ticket.category || 'General'}

Ticket ID: ${ticket.id}`

  return {
    subject: `New Ticket [${ticket.priority || 'MEDIUM'}]: ${ticket.title}`,
    html,
    text,
  }
}

export function ticketStatusUpdateTemplate(
  ticket: TicketVariables, 
  newStatus: string
): { subject: string; html: string; text: string } {
  const firstName = getFirstName(ticket.clientName)

  const statusMessages: Record<string, { heading: string; body: string; emoji: string; color: string }> = {
    IN_PROGRESS: {
      heading: "We're working on it",
      body: "Your support ticket is now being actively worked on. We'll update you as soon as we have more information.",
      emoji: '🔧',
      color: COLORS.info,
    },
    WAITING_CLIENT: {
      heading: 'We need your input',
      body: "Our team has a question about your ticket. Please check the ticket in the Client Portal and reply at your earliest convenience.",
      emoji: '❓',
      color: COLORS.warning,
    },
    RESOLVED: {
      heading: 'Issue resolved',
      body: "We believe your issue has been resolved. If you're still experiencing problems, please let us know and we'll reopen the ticket.",
      emoji: '✅',
      color: COLORS.success,
    },
    CLOSED: {
      heading: 'Ticket closed',
      body: "Your support ticket has been closed. If you need further assistance, you can open a new ticket at any time.",
      emoji: '📝',
      color: COLORS.textMuted,
    },
  }

  const msg = statusMessages[newStatus]
  if (!msg) return { subject: '', html: '', text: '' }

  const content = `
    ${EmailHeader({ title: msg.heading, subtitle: `Ticket #${ticket.id.slice(0, 8)}` })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 28px; margin: 0 0 16px 0;">${msg.emoji}</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">${msg.body}</p>
          ${EmailCardList({
            items: [
              { label: 'Ticket', value: ticket.title, highlight: true },
              { label: 'Status', value: `<span style="color: ${msg.color}; font-weight: 600;">${newStatus.replace('_', ' ')}</span>` },
            ],
            variant: 'filled',
          })}
          <p style="font-size: 15px; line-height: 1.6; margin: 24px 0 0 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            If you have questions, reply to this email or check the Client Portal.
          </p>
          <p style="font-size: 15px; color: ${COLORS.textLight}; margin: 16px 0 0 0;" class="dark-text-secondary">— The Pink Beam Support Team</p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: `${msg.heading} — Ticket #${ticket.id.slice(0, 8)}`,
  })

  const text = `${msg.heading} — Ticket #${ticket.id.slice(0, 8)}

Hi ${firstName},

${msg.body}

Ticket: ${ticket.title}
Status: ${newStatus.replace('_', ' ')}

If you have questions, reply to this email or check the Client Portal.

— The Pink Beam Support Team`

  return {
    subject: `${msg.heading} — Ticket #${ticket.id.slice(0, 8)}`,
    html,
    text,
  }
}

export function ticketCommentNotificationTemplate(
  ticket: TicketVariables,
  commentBody: string,
  authorName: string
): { subject: string; html: string; text: string } {
  const firstName = getFirstName(ticket.clientName)

  const content = `
    ${EmailHeader({ title: 'New Reply on Your Ticket', subtitle: `Ticket #${ticket.id.slice(0, 8)}` })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            <strong style="color: ${COLORS.text};" class="dark-text">${authorName}</strong> has replied to your support ticket:
          </p>
          ${EmailCard({
            children: `<p style="margin: 0 0 8px 0; font-weight: 600; color: ${COLORS.text};" class="dark-text">${ticket.title}</p><p style="margin: 0; font-size: 14px; white-space: pre-wrap; color: ${COLORS.textLight};" class="dark-text-secondary">${commentBody}</p>`,
            variant: 'filled',
          })}
          <p style="font-size: 15px; line-height: 1.6; margin: 24px 0 0 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            Reply to this email or visit the Client Portal to continue the conversation.
          </p>
          <p style="font-size: 15px; color: ${COLORS.textLight}; margin: 16px 0 0 0;" class="dark-text-secondary">— The Pink Beam Support Team</p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: `New reply on: ${ticket.title}`,
  })

  const text = `New Reply on Your Ticket

Hi ${firstName},

${authorName} has replied to your support ticket:

${ticket.title}

${commentBody}

Reply to this email or visit the Client Portal to continue the conversation.

— The Pink Beam Support Team`

  return {
    subject: `Reply on: ${ticket.title} — Pink Beam`,
    html,
    text,
  }
}
