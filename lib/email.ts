import {
  adminNotificationTemplate,
  clientAutoResponseTemplate,
  followUpDay1Template,
  followUpDay3Template,
  followUpDay7Template,
  invoiceNotificationTemplate,
  invoiceReceiptTemplate,
  projectStatusUpdateTemplate,
  fileSharedNotificationTemplate,
  meetingReminderTemplate,
  meetingInvitationTemplate,
  passwordResetTemplate,
  accountVerificationTemplate,
  welcomeTemplate,
  onboardingWelcomeTemplate,
  statusUpdateTemplate,
  ticketCreatedTemplate,
  ticketAdminNotificationTemplate,
  ticketStatusUpdateTemplate,
  ticketCommentNotificationTemplate,
} from './email-templates'

import type {
  QuoteVariables,
  TicketVariables,
  UserVariables,
  InvoiceVariables,
  ProjectVariables,
  FileVariables,
  MeetingVariables,
  PasswordResetVariables,
  VerificationVariables,
} from './email-templates'

// ============================================================================
// Types
// ============================================================================

type QuoteRequestData = QuoteVariables

type TicketEmailData = TicketVariables

interface WelcomeEmailData extends UserVariables {
  loginUrl: string
}

type PasswordResetEmailData = PasswordResetVariables

type VerificationEmailData = VerificationVariables

type InvoiceEmailData = InvoiceVariables

type ProjectUpdateData = ProjectVariables

type FileSharedData = FileVariables

type MeetingReminderData = MeetingVariables

interface MeetingInvitationData extends MeetingVariables {
  senderName: string
  acceptUrl?: string
  declineUrl?: string
}

// ============================================================================
// Core Email Functions
// ============================================================================

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text?: string
  tags?: { name: string; value: string }[]
  replyTo?: string
}

async function sendEmail(params: SendEmailParams): Promise<boolean> {
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
      text: params.text,
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

// ============================================================================
// Quote Email Functions
// ============================================================================

/** Send admin notification when a new quote is submitted */
export async function sendQuoteNotification(quote: QuoteRequestData) {
  const notifyEmail = process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai'
  const { subject, html, text } = adminNotificationTemplate(quote)

  await sendEmail({
    to: notifyEmail,
    subject,
    html,
    text,
    tags: [
      { name: 'type', value: 'admin-notification' },
      { name: 'quote_id', value: quote.id },
    ],
  })
}

/** Send auto-response to the client who submitted */
export async function sendClientAutoResponse(quote: QuoteRequestData) {
  const { subject, html, text } = clientAutoResponseTemplate(quote)

  await sendEmail({
    to: quote.email,
    subject,
    html,
    text,
    replyTo: process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai',
    tags: [
      { name: 'type', value: 'auto-response' },
      { name: 'quote_id', value: quote.id },
    ],
  })
}

/** Send follow-up email based on stage (1, 2, or 3) */
export async function sendFollowUpEmail(quote: QuoteRequestData, stage: number) {
  const templateFn =
    stage === 1
      ? followUpDay1Template
      : stage === 2
        ? followUpDay3Template
        : followUpDay7Template

  const { subject, html, text } = templateFn(quote)
  if (!subject) return

  await sendEmail({
    to: quote.email,
    subject,
    html,
    text,
    replyTo: process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai',
    tags: [
      { name: 'type', value: `follow-up-${stage}` },
      { name: 'quote_id', value: quote.id },
    ],
  })
}

/** Send status update email to the client */
export async function sendStatusUpdateEmail(
  quote: QuoteRequestData,
  newStatus: string,
) {
  // Only send for meaningful status changes the client should know about
  const notifiableStatuses = ['CONTACTED', 'QUALIFIED', 'PROPOSAL', 'ACCEPTED', 'DECLINED']
  if (!notifiableStatuses.includes(newStatus)) return

  const { subject, html, text } = statusUpdateTemplate(quote, newStatus)
  if (!subject) return

  await sendEmail({
    to: quote.email,
    subject,
    html,
    text,
    replyTo: process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai',
    tags: [
      { name: 'type', value: 'status-update' },
      { name: 'quote_id', value: quote.id },
      { name: 'status', value: newStatus },
    ],
  })
}

// ============================================================================
// Ticket Email Functions
// ============================================================================

/** Send ticket creation confirmation to client */
export async function sendTicketCreatedEmail(ticket: TicketEmailData) {
  const { subject, html, text } = ticketCreatedTemplate(ticket)
  await sendEmail({
    to: ticket.clientEmail,
    subject,
    html,
    text,
    tags: [
      { name: 'type', value: 'ticket-created' },
      { name: 'ticket_id', value: ticket.id },
    ],
  })
}

/** Send admin notification for new ticket */
export async function sendTicketAdminNotification(ticket: TicketEmailData) {
  const notifyEmail = process.env.SUPPORT_NOTIFY_EMAIL || process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai'
  const { subject, html, text } = ticketAdminNotificationTemplate(ticket)
  await sendEmail({
    to: notifyEmail,
    subject,
    html,
    text,
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
  const { subject, html, text } = ticketStatusUpdateTemplate(ticket, newStatus)
  if (!subject) return
  await sendEmail({
    to: ticket.clientEmail,
    subject,
    html,
    text,
    tags: [
      { name: 'type', value: 'ticket-status-update' },
      { name: 'ticket_id', value: ticket.id },
      { name: 'status', value: newStatus },
    ],
  })
}

/** Send comment notification to client (only for non-internal comments by non-clients) */
export async function sendTicketCommentEmail(ticket: TicketEmailData, commentBody: string, authorName: string) {
  const { subject, html, text } = ticketCommentNotificationTemplate(ticket, commentBody, authorName)
  await sendEmail({
    to: ticket.clientEmail,
    subject,
    html,
    text,
    tags: [
      { name: 'type', value: 'ticket-comment' },
      { name: 'ticket_id', value: ticket.id },
    ],
  })
}

// ============================================================================
// User/Auth Email Functions
// ============================================================================

/** Send welcome email to new user */
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const { subject, html, text } = welcomeTemplate({
    fullName: data.fullName,
    email: data.email,
    loginUrl: data.loginUrl,
  })

  await sendEmail({
    to: data.email,
    subject,
    html,
    text,
    tags: [{ name: 'type', value: 'welcome' }],
  })
}

/** Send password reset email */
export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  const { subject, html, text } = passwordResetTemplate({
    fullName: data.fullName,
    email: data.email,
    resetUrl: data.resetUrl,
    expiresInMinutes: data.expiresInMinutes,
  })

  await sendEmail({
    to: data.email,
    subject,
    html,
    text,
    tags: [{ name: 'type', value: 'password-reset' }],
  })
}

/** Send account verification email */
export async function sendVerificationEmail(data: VerificationEmailData) {
  const { subject, html, text } = accountVerificationTemplate({
    fullName: data.fullName,
    email: data.email,
    verificationUrl: data.verificationUrl,
    expiresInMinutes: data.expiresInMinutes,
    code: data.code,
  })

  await sendEmail({
    to: data.email,
    subject,
    html,
    text,
    tags: [{ name: 'type', value: 'verification' }],
  })
}

// ============================================================================
// Invoice Email Functions
// ============================================================================

/** Send invoice notification email */
export async function sendInvoiceNotification(data: InvoiceEmailData) {
  const { subject, html, text } = invoiceNotificationTemplate({
    invoiceNumber: data.invoiceNumber,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    amount: data.amount,
    status: data.status,
    dueDate: data.dueDate,
    invoiceUrl: data.invoiceUrl,
  })

  await sendEmail({
    to: data.clientEmail,
    subject,
    html,
    text,
    tags: [
      { name: 'type', value: data.status === 'paid' ? 'receipt' : 'invoice' },
      { name: 'invoice', value: data.invoiceNumber },
    ],
  })
}

/** Send invoice receipt/paid confirmation email */
export async function sendInvoiceReceipt(data: InvoiceEmailData) {
  const { subject, html, text } = invoiceReceiptTemplate({
    invoiceNumber: data.invoiceNumber,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    amount: data.amount,
    status: 'paid',
    paymentDate: data.paymentDate,
    invoiceUrl: data.invoiceUrl,
  })

  await sendEmail({
    to: data.clientEmail,
    subject,
    html,
    text,
    tags: [
      { name: 'type', value: 'receipt' },
      { name: 'invoice', value: data.invoiceNumber },
    ],
  })
}

// ============================================================================
// Project Email Functions
// ============================================================================

/** Send project status update email */
export async function sendProjectStatusUpdate(data: ProjectUpdateData) {
  const { subject, html, text } = projectStatusUpdateTemplate(data)

  await sendEmail({
    to: data.clientEmail,
    subject,
    html,
    text,
    tags: [
      { name: 'type', value: 'project-update' },
      { name: 'project_id', value: data.projectId },
      { name: 'status', value: data.status },
    ],
  })
}

// ============================================================================
// File Sharing Email Functions
// ============================================================================

/** Send file shared notification email */
export async function sendFileSharedNotification(data: FileSharedData) {
  const { subject, html, text } = fileSharedNotificationTemplate(data)

  await sendEmail({
    to: data.downloadUrl.split('?to=')[1] || '', // Extract recipient from URL if needed
    subject,
    html,
    text,
    tags: [
      { name: 'type', value: 'file-shared' },
    ],
  })
}

// ============================================================================
// Meeting Email Functions
// ============================================================================

/** Send meeting reminder email */
export async function sendMeetingReminder(data: MeetingReminderData) {
  const { subject, html, text } = meetingReminderTemplate(data)

  // Send to all attendees
  const recipients = data.attendees?.map(a => a.email) || []
  
  for (const recipient of recipients) {
    await sendEmail({
      to: recipient,
      subject,
      html,
      text,
      tags: [
        { name: 'type', value: 'meeting-reminder' },
      ],
    })
  }
}

/** Send meeting invitation email */
export async function sendMeetingInvitation(data: MeetingInvitationData) {
  const { subject, html, text } = meetingInvitationTemplate(data)

  // Send to all attendees
  const recipients = data.attendees?.map(a => a.email) || []
  
  for (const recipient of recipients) {
    await sendEmail({
      to: recipient,
      subject,
      html,
      text,
      tags: [
        { name: 'type', value: 'meeting-invitation' },
      ],
    })
  }
}

// ============================================================================
// Newsletter & Marketing (Legacy compatibility)
// ============================================================================

interface NewsletterEmailData {
  to: string | string[]
  title: string
  intro: string
  items: Array<{ title: string; description: string; url?: string }>
  ctaText?: string
  ctaUrl?: string
}

/** Send newsletter email (basic template) */
export async function sendNewsletterEmail(data: NewsletterEmailData) {
  const items = data.items
    .map((item) => {
      const title = item.url
        ? `<a href="${item.url}" style="color: #FF006E; text-decoration: none; font-weight: 600;">${item.title}</a>`
        : `<span style="font-weight: 600;">${item.title}</span>`
      return `
        <div style="margin-bottom: 16px;">
          ${title}
          <p style="margin: 6px 0 0; color: #444; font-size: 14px; line-height: 1.6;">${item.description}</p>
        </div>
      `
    })
    .join('')

  const ctaSection = data.ctaUrl && data.ctaText
    ? `<div style="text-align: center; margin: 24px 0;">
        <a href="${data.ctaUrl}" style="display: inline-block; background: #FF006E; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">${data.ctaText}</a>
      </div>`
    : ''

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
              <tr>
                <td style="background: linear-gradient(135deg, #FF006E, #FF4D9E); padding: 28px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 600;">${data.title}</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Pink Beam Newsletter</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 28px;">
                  <p style="font-size: 15px; line-height: 1.6; color: #444; margin: 0 0 24px 0;">${data.intro}</p>
                  <div style="background: #fafafa; padding: 24px; border-radius: 8px;">
                    ${items}
                  </div>
                  ${ctaSection}
                  <p style="font-size: 13px; line-height: 1.6; color: #666; margin: 24px 0 0 0;">
                    You're receiving this email because you opted in for Pink Beam updates.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px; text-align: center; border-top: 1px solid #e5e5e5;">
                  <p style="color: #999; font-size: 12px; margin: 0;">Pink Beam — Web Design & Development</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  await sendEmail({
    to: data.to,
    subject: `${data.title} — Pink Beam`,
    html,
    tags: [{ name: 'type', value: 'newsletter' }],
  })
}

// ============================================================================
// Onboarding Email Functions (Legacy)
// ============================================================================

interface OnboardingEmailData {
  fullName: string
  email: string
  portalUrl: string
  projectName?: string
  featureName?: string
  featureDescription?: string
}

/** Send welcome email to new portal user (immediate) */
export async function sendOnboardingWelcomeEmail(data: OnboardingEmailData) {
  const { subject, html, text } = onboardingWelcomeTemplate({
    fullName: data.fullName,
    email: data.email,
    portalUrl: data.portalUrl,
  })

  await sendEmail({
    to: data.email,
    subject,
    html,
    text,
    tags: [
      { name: 'type', value: 'onboarding-welcome' },
      { name: 'sequence', value: 'onboarding' },
    ],
  })
}

/** Send Day 1: Getting started guide */
export async function sendOnboardingDay1Email(
  data: OnboardingEmailData & { projectName?: string }
) {
  // Import the template inline to avoid circular dependency
  const { onboardingDay1Template } = await import('./email-templates/templates-quotes')
  const { subject, html, text } = onboardingDay1Template({
    fullName: data.fullName,
    email: data.email,
    portalUrl: data.portalUrl,
    projectName: data.projectName,
  })

  await sendEmail({
    to: data.email,
    subject,
    html,
    text,
    tags: [
      { name: 'type', value: 'onboarding-day1' },
      { name: 'sequence', value: 'onboarding' },
    ],
  })
}

/** Send Day 3: Feature highlight */
export async function sendOnboardingDay3Email(
  data: OnboardingEmailData & { featureName: string; featureDescription: string }
) {
  const { onboardingDay3Template } = await import('./email-templates/templates-quotes')
  const { subject, html, text } = onboardingDay3Template({
    fullName: data.fullName,
    email: data.email,
    portalUrl: data.portalUrl,
    featureName: data.featureName,
    featureDescription: data.featureDescription,
  })

  await sendEmail({
    to: data.email,
    subject,
    html,
    text,
    tags: [
      { name: 'type', value: 'onboarding-day3' },
      { name: 'sequence', value: 'onboarding' },
    ],
  })
}

/** Send Day 7: Tips & best practices */
export async function sendOnboardingDay7Email(data: OnboardingEmailData) {
  const { onboardingDay7Template } = await import('./email-templates/templates-quotes')
  const { subject, html, text } = onboardingDay7Template({
    fullName: data.fullName,
    email: data.email,
    portalUrl: data.portalUrl,
  })

  await sendEmail({
    to: data.email,
    subject,
    html,
    text,
    tags: [
      { name: 'type', value: 'onboarding-day7' },
      { name: 'sequence', value: 'onboarding' },
    ],
  })
}

// ============================================================================
// Demo Email Functions
// ============================================================================

interface DemoWelcomeEmailData {
  email: string;
  employeeType: string;
  competitors: string[];
  viewBriefUrl: string;
}

/** Send demo welcome email with brief link */
export async function sendDemoWelcomeEmail(data: DemoWelcomeEmailData) {
  const subject = 'Your Competitive Intelligence Brief is Ready';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Your Brief is Ready</h1>
      <p>Thank you for trying our AI-powered competitive intelligence.</p>
      <p>We've analyzed <strong>${data.competitors.join(', ')}</strong> using our <strong>${data.employeeType}</strong> agent.</p>
      <a href="${data.viewBriefUrl}" style="display: inline-block; padding: 12px 24px; background: #FF006E; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">View Your Brief</a>
      <p style="color: #666; font-size: 14px;">This is a demo of our AI employee capabilities. For full access, <a href="https://pinkbeam.io/agents/pricing">upgrade your plan</a>.</p>
    </div>
  `;
  const text = `Your Brief is Ready\n\nThank you for trying our AI-powered competitive intelligence.\n\nWe've analyzed ${data.competitors.join(', ')} using our ${data.employeeType} agent.\n\nView your brief: ${data.viewBriefUrl}\n\nThis is a demo of our AI employee capabilities. For full access, visit https://pinkbeam.io/agents/pricing`;

  await sendEmail({
    to: data.email,
    subject,
    html,
    text,
    tags: [
      { name: 'type', value: 'demo-welcome' },
      { name: 'source', value: 'demo' },
    ],
  });
}

// ============================================================================
// Resource Download Email Functions
// ============================================================================

interface ResourceDownloadEmailData {
  email: string;
  name: string;
  resourceTitle: string;
  resourceType: string;
  downloadUrl: string;
  fileFormat: string;
}

/** Send resource download email with access link */
export async function sendResourceDownloadEmail(data: ResourceDownloadEmailData) {
  const subject = `Your Download: ${data.resourceTitle}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Resource Download</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
              <tr>
                <td style="background: linear-gradient(135deg, #06b6d4, #0891b2); padding: 28px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 600;">Your Download is Ready</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Pink Beam Solutions Resource Library</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 28px;">
                  <p style="font-size: 15px; line-height: 1.6; color: #444; margin: 0 0 20px 0;">
                    Hi ${data.name},
                  </p>
                  <p style="font-size: 15px; line-height: 1.6; color: #444; margin: 0 0 24px 0;">
                    Thank you for downloading <strong>${data.resourceTitle}</strong>. Your resource is ready and waiting for you.
                  </p>
                  
                  <div style="background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                    <h2 style="margin: 0 0 12px 0; font-size: 16px; color: #0e7490;">${data.resourceTitle}</h2>
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Type: ${data.resourceType}</p>
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #666;">Format: ${data.fileFormat}</p>
                    <a href="${data.downloadUrl}" style="display: inline-block; background: #06b6d4; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Download Now</a>
                  </div>
                  
                  <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 0 0 16px 0;">
                    If the button doesn't work, copy and paste this link into your browser:
                  </p>
                  <p style="font-size: 13px; line-height: 1.6; color: #06b6d4; word-break: break-all; margin: 0 0 24px 0;">
                    ${data.downloadUrl}
                  </p>
                  
                  <p style="font-size: 14px; line-height: 1.6; color: #444; margin: 0 0 8px 0;">
                    <strong>Need help implementing this?</strong>
                  </p>
                  <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 0 0 16px 0;">
                    Our team is here to help you put these insights into action. Reply to this email or 
                    <a href="https://pinkbeam.io/solutions/contact" style="color: #06b6d4; text-decoration: none;">schedule a consultation</a>.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px; text-align: center; border-top: 1px solid #e5e5e5;">
                  <p style="color: #999; font-size: 12px; margin: 0 0 8px 0;">Pink Beam Solutions — AI Strategy & Digital Transformation</p>
                  <p style="color: #ccc; font-size: 11px; margin: 0;">
                    You're receiving this because you downloaded a resource from our library.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  
  const text = `Your Download is Ready\n\nHi ${data.name},\n\nThank you for downloading ${data.resourceTitle}. Your resource is ready and waiting for you.\n\nResource: ${data.resourceTitle}\nType: ${data.resourceType}\nFormat: ${data.fileFormat}\n\nDownload: ${data.downloadUrl}\n\nNeed help implementing this? Our team is here to help you put these insights into action. Reply to this email or visit https://pinkbeam.io/solutions/contact to schedule a consultation.\n\nPink Beam Solutions — AI Strategy & Digital Transformation`;

  await sendEmail({
    to: data.email,
    subject,
    html,
    text,
    tags: [
      { name: 'type', value: 'resource-download' },
      { name: 'resource', value: data.resourceTitle },
    ],
  });
}
