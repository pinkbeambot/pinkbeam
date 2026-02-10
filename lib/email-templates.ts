// Shared email layout wrapper with Pink Beam branding
function layout(body: string, footer?: string): string {
  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
      ${body}
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
        ${footer || ''}
        <p style="color: #999; font-size: 12px; margin-top: 12px;">
          Pink Beam &mdash; Web Design &amp; Development
        </p>
      </div>
    </div>
  `
}

function header(title: string, subtitle?: string): string {
  return `
    <div style="background: linear-gradient(135deg, #FF006E, #FF4D9E); padding: 28px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
      <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 600;">${title}</h1>
      ${subtitle ? `<p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">${subtitle}</p>` : ''}
    </div>
  `
}

function card(content: string): string {
  return `<div style="background: #fafafa; padding: 24px; border-radius: 8px; margin-bottom: 16px;">${content}</div>`
}

function button(text: string, url: string): string {
  return `
    <div style="text-align: center; margin: 24px 0;">
      <a href="${url}" style="display: inline-block; background: #FF006E; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">${text}</a>
    </div>
  `
}

// --- Template functions ---

interface QuoteData {
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

/** E2: Admin notification — new quote received */
export function adminNotificationTemplate(quote: QuoteData): { subject: string; html: string } {
  const qualityBadge = quote.leadQuality
    ? ` <span style="display: inline-block; background: ${quote.leadQuality === 'hot' ? '#ef4444' : quote.leadQuality === 'warm' ? '#f59e0b' : '#6b7280'}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; text-transform: uppercase;">${quote.leadQuality}</span>`
    : ''

  const html = layout(
    header('New Quote Request', quote.leadScore != null ? `Lead Score: ${quote.leadScore}/100` : undefined) +
    card(`
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${quote.fullName}${qualityBadge}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${quote.email}</p>
      ${quote.company ? `<p style="margin: 0 0 8px;"><strong>Company:</strong> ${quote.company}</p>` : ''}
      <p style="margin: 0 0 8px;"><strong>Project Type:</strong> ${quote.projectType}</p>
      <p style="margin: 0 0 8px;"><strong>Services:</strong> ${quote.services.join(', ')}</p>
      <p style="margin: 0 0 8px;"><strong>Budget:</strong> ${quote.budgetRange}</p>
      <p style="margin: 0 0 8px;"><strong>Timeline:</strong> ${quote.timeline}</p>
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
      <p style="margin: 0 0 4px;"><strong>Description:</strong></p>
      <p style="margin: 0; white-space: pre-wrap; color: #444;">${quote.description}</p>
    `),
    `<p style="color: #666; font-size: 12px;">Quote ID: ${quote.id}</p>`
  )

  return {
    subject: `New Quote: ${quote.fullName}${quote.company ? ` — ${quote.company}` : ''}`,
    html,
  }
}

/** E3: Client auto-responder — confirmation to the submitter */
export function clientAutoResponseTemplate(quote: QuoteData): { subject: string; html: string } {
  const firstName = quote.fullName.split(' ')[0]

  const html = layout(
    header('We Got Your Request!', 'Thank you for reaching out to Pink Beam') +
    `<p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      Thanks for your interest in working with us! We've received your project details and our team is reviewing them now.
    </p>` +
    card(`
      <p style="margin: 0 0 8px; font-size: 14px;"><strong>Project:</strong> ${quote.projectType}</p>
      <p style="margin: 0 0 8px; font-size: 14px;"><strong>Services:</strong> ${quote.services.join(', ')}</p>
      <p style="margin: 0 0 8px; font-size: 14px;"><strong>Budget:</strong> ${quote.budgetRange}</p>
      <p style="margin: 0; font-size: 14px;"><strong>Timeline:</strong> ${quote.timeline}</p>
    `) +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      <strong>What happens next?</strong> A team member will review your project within 24 hours
      and reach out to discuss next steps. If your project is urgent, feel free to reply to this email directly.
    </p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      We're excited to learn more about your project!
    </p>` +
    `<p style="font-size: 15px; color: #444;">— The Pink Beam Team</p>`
  )

  return {
    subject: `We received your quote request — Pink Beam`,
    html,
  }
}

/** E4: Follow-up email — day 1 personal follow-up */
export function followUpDay1Template(quote: QuoteData): { subject: string; html: string } {
  const firstName = quote.fullName.split(' ')[0]

  const html = layout(
    `<p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      I wanted to follow up personally on the quote request you submitted yesterday for your
      <strong>${quote.projectType}</strong> project.
    </p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      I've had a chance to review your requirements and I'd love to schedule a quick call
      to discuss the best approach. Would any of these times work for a 15-minute chat?
    </p>` +
    `<ul style="font-size: 15px; line-height: 1.8; color: #444;">
      <li>Tomorrow morning (10am–12pm)</li>
      <li>Tomorrow afternoon (2pm–4pm)</li>
      <li>Any time that works for you — just reply with your preference</li>
    </ul>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      Looking forward to hearing from you!
    </p>` +
    `<p style="font-size: 15px; color: #444;">Best,<br/>The Pink Beam Team</p>`
  )

  return {
    subject: `Quick follow-up on your project — Pink Beam`,
    html,
  }
}

/** E4: Follow-up email — day 3 value-add content */
export function followUpDay3Template(quote: QuoteData): { subject: string; html: string } {
  const firstName = quote.fullName.split(' ')[0]

  const html = layout(
    `<p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      While your project is being reviewed, I thought you might find these helpful as you evaluate your options:
    </p>` +
    card(`
      <p style="margin: 0 0 12px; font-weight: 600;">Things to consider when choosing a web partner:</p>
      <ol style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #444;">
        <li>Look for a portfolio that matches your industry and style</li>
        <li>Ask about their development process and communication cadence</li>
        <li>Ensure they provide post-launch support and maintenance</li>
        <li>Check if they offer SEO and performance optimization</li>
        <li>Confirm they build with modern, scalable technology</li>
      </ol>
    `) +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      At Pink Beam, we check all these boxes. We'd love to show you how we approach projects like yours.
    </p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      Just reply to this email if you'd like to chat — no pressure at all.
    </p>` +
    `<p style="font-size: 15px; color: #444;">Best,<br/>The Pink Beam Team</p>`
  )

  return {
    subject: `Choosing the right web partner — Pink Beam`,
    html,
  }
}

/** E4: Follow-up email — day 7 final check-in */
export function followUpDay7Template(quote: QuoteData): { subject: string; html: string } {
  const firstName = quote.fullName.split(' ')[0]

  const html = layout(
    `<p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      I wanted to check in one last time about your <strong>${quote.projectType}</strong> project.
      We'd still love the opportunity to work with you${quote.company ? ` and the ${quote.company} team` : ''}.
    </p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      If the timing isn't right, no worries at all — we'll be here whenever you're ready.
      Just reply to this email anytime and we'll pick right up.
    </p>` +
    `<p style="font-size: 15px; color: #444;">All the best,<br/>The Pink Beam Team</p>`
  )

  return {
    subject: `Still interested in your project — Pink Beam`,
    html,
  }
}

// --- Ticket email templates ---

interface TicketData {
  id: string
  title: string
  clientName: string
  clientEmail: string
  status?: string
  priority?: string
  category?: string
}

/** Ticket: New ticket confirmation to client */
export function ticketCreatedTemplate(ticket: TicketData): { subject: string; html: string } {
  const firstName = ticket.clientName.split(' ')[0] || 'there'

  const html = layout(
    header('Support Ticket Created', `Ticket #${ticket.id.slice(0, 8)}`) +
    `<p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      We've received your support ticket and our team will respond as soon as possible.
    </p>` +
    card(`
      <p style="margin: 0 0 8px; font-size: 14px;"><strong>Subject:</strong> ${ticket.title}</p>
      <p style="margin: 0 0 8px; font-size: 14px;"><strong>Priority:</strong> ${ticket.priority || 'Medium'}</p>
      <p style="margin: 0; font-size: 14px;"><strong>Category:</strong> ${ticket.category || 'General'}</p>
    `) +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      You can track your ticket status in the <strong>Client Portal</strong>.
      If you have additional details, reply to this email and they'll be added to your ticket.
    </p>` +
    `<p style="font-size: 15px; color: #444;">— The Pink Beam Support Team</p>`
  )

  return {
    subject: `Ticket received: ${ticket.title} — Pink Beam`,
    html,
  }
}

/** Ticket: Admin notification — new ticket */
export function ticketAdminNotificationTemplate(ticket: TicketData): { subject: string; html: string } {
  const html = layout(
    header('New Support Ticket', `Priority: ${ticket.priority || 'Medium'}`) +
    card(`
      <p style="margin: 0 0 8px;"><strong>Client:</strong> ${ticket.clientName} (${ticket.clientEmail})</p>
      <p style="margin: 0 0 8px;"><strong>Subject:</strong> ${ticket.title}</p>
      <p style="margin: 0 0 8px;"><strong>Category:</strong> ${ticket.category || 'General'}</p>
      <p style="margin: 0;"><strong>Priority:</strong> ${ticket.priority || 'Medium'}</p>
    `),
    `<p style="color: #666; font-size: 12px;">Ticket ID: ${ticket.id}</p>`
  )

  return {
    subject: `New Ticket [${ticket.priority}]: ${ticket.title}`,
    html,
  }
}

/** Ticket: Status update notification to client */
export function ticketStatusUpdateTemplate(ticket: TicketData, newStatus: string): { subject: string; html: string } {
  const firstName = ticket.clientName.split(' ')[0] || 'there'

  const statusMessages: Record<string, { heading: string; body: string }> = {
    IN_PROGRESS: {
      heading: "We're working on it",
      body: "Your support ticket is now being actively worked on. We'll update you as soon as we have more information.",
    },
    WAITING_CLIENT: {
      heading: 'We need your input',
      body: "Our team has a question about your ticket. Please check the ticket in the Client Portal and reply at your earliest convenience.",
    },
    RESOLVED: {
      heading: 'Issue resolved',
      body: "We believe your issue has been resolved. If you're still experiencing problems, please let us know and we'll reopen the ticket.",
    },
    CLOSED: {
      heading: 'Ticket closed',
      body: "Your support ticket has been closed. If you need further assistance, you can open a new ticket at any time.",
    },
  }

  const msg = statusMessages[newStatus]
  if (!msg) return { subject: '', html: '' }

  const html = layout(
    header(msg.heading, `Ticket #${ticket.id.slice(0, 8)}`) +
    `<p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">${msg.body}</p>` +
    card(`
      <p style="margin: 0 0 8px; font-size: 14px;"><strong>Ticket:</strong> ${ticket.title}</p>
      <p style="margin: 0; font-size: 14px;"><strong>Status:</strong> ${newStatus.replace('_', ' ')}</p>
    `) +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      If you have questions, reply to this email or check the Client Portal.
    </p>` +
    `<p style="font-size: 15px; color: #444;">— The Pink Beam Support Team</p>`
  )

  return {
    subject: `${msg.heading} — Ticket #${ticket.id.slice(0, 8)}`,
    html,
  }
}

/** Ticket: New comment notification to client */
export function ticketCommentNotificationTemplate(ticket: TicketData, commentBody: string, authorName: string): { subject: string; html: string } {
  const firstName = ticket.clientName.split(' ')[0] || 'there'

  const html = layout(
    header('New Reply on Your Ticket', `Ticket #${ticket.id.slice(0, 8)}`) +
    `<p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      ${authorName} has replied to your support ticket:
    </p>` +
    card(`
      <p style="margin: 0 0 8px; font-size: 14px;"><strong>${ticket.title}</strong></p>
      <p style="margin: 0; font-size: 14px; white-space: pre-wrap; color: #444;">${commentBody}</p>
    `) +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      Reply to this email or visit the Client Portal to continue the conversation.
    </p>` +
    `<p style="font-size: 15px; color: #444;">— The Pink Beam Support Team</p>`
  )

  return {
    subject: `Reply on: ${ticket.title} — Pink Beam`,
    html,
  }
}

/** E5: Status update — notify client their quote status changed */
export function statusUpdateTemplate(
  quote: QuoteData,
  newStatus: string,
): { subject: string; html: string } {
  const firstName = quote.fullName.split(' ')[0]

  const statusMessages: Record<string, { heading: string; body: string }> = {
    CONTACTED: {
      heading: "We're reviewing your project",
      body: "Our team has reviewed your request and we'll be reaching out shortly to discuss your project in more detail.",
    },
    QUALIFIED: {
      heading: 'Great news — your project is a fit!',
      body: "After reviewing your requirements, we believe Pink Beam is a great match for your project. We'll be preparing a detailed proposal for you.",
    },
    PROPOSAL: {
      heading: 'Your proposal is ready',
      body: "We've put together a proposal for your project. A team member will be sharing the details with you shortly.",
    },
    ACCEPTED: {
      heading: 'Welcome aboard!',
      body: "We're thrilled to get started on your project! A team member will be in touch with onboarding details and next steps.",
    },
    DECLINED: {
      heading: 'Thank you for considering us',
      body: "We understand this might not be the right fit at this time. If anything changes in the future, we'd love to hear from you.",
    },
  }

  const msg = statusMessages[newStatus]
  if (!msg) return { subject: '', html: '' }

  const html = layout(
    header(msg.heading) +
    `<p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">${msg.body}</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      If you have any questions, just reply to this email — we're always happy to help.
    </p>` +
    `<p style="font-size: 15px; color: #444;">— The Pink Beam Team</p>`
  )

  return {
    subject: `${msg.heading} — Pink Beam`,
    html,
  }
}
