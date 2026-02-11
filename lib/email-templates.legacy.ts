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

interface WelcomeData {
  fullName: string
  loginUrl: string
}

interface PasswordResetData {
  fullName?: string
  resetUrl: string
  expiresInMinutes?: number
}

interface InvoiceReceiptData {
  invoiceNumber: string
  clientName: string
  amount: string
  status?: 'paid' | 'due' | 'overdue'
  dueDate?: string
  paymentDate?: string
  invoiceUrl: string
}

interface NewsletterData {
  title: string
  intro: string
  items: Array<{ title: string; description: string; url?: string }>
  ctaText?: string
  ctaUrl?: string
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

/** Welcome email template */
export function welcomeTemplate(data: WelcomeData): { subject: string; html: string } {
  const firstName = data.fullName.split(' ')[0]

  const html = layout(
    header('Welcome to Pink Beam', 'Your account is ready to go') +
    `<p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      We're excited to have you here. Your Pink Beam account is ready, and you can start exploring services
      or jump straight into your dashboard.
    </p>` +
    button('Go to your dashboard', data.loginUrl) +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      If you have any questions, just reply to this email — we're happy to help.
    </p>` +
    `<p style="font-size: 15px; color: #444;">— The Pink Beam Team</p>`
  )

  return {
    subject: 'Welcome to Pink Beam',
    html,
  }
}

/** Password reset template */
export function passwordResetTemplate(data: PasswordResetData): { subject: string; html: string } {
  const firstName = data.fullName ? data.fullName.split(' ')[0] : 'there'
  const expiryNote = data.expiresInMinutes
    ? `<p style="font-size: 14px; color: #666; margin: 16px 0 0;">This link expires in ${data.expiresInMinutes} minutes.</p>`
    : ''

  const html = layout(
    header('Reset your password') +
    `<p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      We received a request to reset your Pink Beam password. Use the button below to set a new password.
      If you didn't request this, you can safely ignore this email.
    </p>` +
    button('Reset password', data.resetUrl) +
    expiryNote +
    `<p style="font-size: 14px; line-height: 1.6; color: #666; margin-top: 16px;">
      Having trouble? Copy and paste this link into your browser:<br/>
      <span style="word-break: break-all;">${data.resetUrl}</span>
    </p>`
  )

  return {
    subject: 'Reset your Pink Beam password',
    html,
  }
}

/** Invoice / receipt template */
export function invoiceReceiptTemplate(data: InvoiceReceiptData): { subject: string; html: string } {
  const status = data.status || 'due'
  const statusLabel =
    status === 'paid'
      ? 'Payment received'
      : status === 'overdue'
        ? 'Payment overdue'
        : 'Payment due'

  const html = layout(
    header('Invoice update', statusLabel) +
    `<p style="font-size: 16px; line-height: 1.6;">Hi ${data.clientName.split(' ')[0]},</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      Here's the latest update on invoice <strong>${data.invoiceNumber}</strong>.
    </p>` +
    card(`
      <p style="margin: 0 0 8px; font-size: 14px;"><strong>Invoice:</strong> ${data.invoiceNumber}</p>
      <p style="margin: 0 0 8px; font-size: 14px;"><strong>Amount:</strong> ${data.amount}</p>
      ${data.dueDate ? `<p style="margin: 0 0 8px; font-size: 14px;"><strong>Due date:</strong> ${data.dueDate}</p>` : ''}
      ${data.paymentDate ? `<p style="margin: 0; font-size: 14px;"><strong>Payment date:</strong> ${data.paymentDate}</p>` : ''}
    `) +
    button(status === 'paid' ? 'View receipt' : 'View invoice', data.invoiceUrl) +
    `<p style="font-size: 14px; line-height: 1.6; color: #666;">
      If you have questions about this invoice, reply to this email and we&apos;ll help right away.
    </p>`
  )

  return {
    subject: `Invoice ${data.invoiceNumber} — ${statusLabel}`,
    html,
  }
}

/** Newsletter template */
export function newsletterTemplate(data: NewsletterData): { subject: string; html: string } {
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

  const ctaSection = data.ctaUrl && data.ctaText ? button(data.ctaText, data.ctaUrl) : ''

  const html = layout(
    header(data.title, 'Pink Beam Newsletter') +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">${data.intro}</p>` +
    card(items) +
    ctaSection +
    `<p style="font-size: 13px; line-height: 1.6; color: #666;">
      You&apos;re receiving this email because you opted in for Pink Beam updates.
    </p>`
  )

  return {
    subject: `${data.title} — Pink Beam`,
    html,
  }
}

// --- Onboarding Email Templates ---

interface OnboardingWelcomeData {
  fullName: string
  portalUrl: string
}

interface OnboardingGettingStartedData {
  fullName: string
  portalUrl: string
  projectName?: string
}

interface OnboardingFeatureHighlightData {
  fullName: string
  portalUrl: string
  featureName: string
  featureDescription: string
}

interface OnboardingTipsData {
  fullName: string
  portalUrl: string
}

/** Onboarding: Welcome email (immediate on signup) */
export function onboardingWelcomeTemplate(data: OnboardingWelcomeData): { subject: string; html: string } {
  const firstName = data.fullName.split(' ')[0]

  const html = layout(
    header('Welcome to Pink Beam!', 'Your client portal is ready') +
    `<p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      Welcome to the Pink Beam family! We&apos;re excited to work with you and help bring your project to life.
    </p>` +
    card(`
      <p style="margin: 0 0 12px; font-weight: 600;">What you can do in your portal:</p>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #444;">
        <li>Track project progress in real-time</li>
        <li>View and pay invoices</li>
        <li>Upload files and share documents</li>
        <li>Submit support tickets anytime</li>
        <li>Communicate directly with your team</li>
      </ul>
    `) +
    button('Go to Your Portal', data.portalUrl) +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      <strong>Next step:</strong> Complete your onboarding to help us understand your needs better.
    </p>` +
    `<p style="font-size: 15px; color: #444;">We&apos;re here to help you succeed!</p>` +
    `<p style="font-size: 15px; color: #444;">— The Pink Beam Team</p>`
  )

  return {
    subject: 'Welcome to Pink Beam! Your portal is ready',
    html,
  }
}

/** Onboarding: Day 1 - Getting started guide */
export function onboardingDay1Template(data: OnboardingGettingStartedData): { subject: string; html: string } {
  const firstName = data.fullName.split(' ')[0]

  const html = layout(
    header('Getting Started Guide', 'Everything you need to know') +
    `<p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      Now that you&apos;re set up, here&apos;s a quick guide to help you get the most out of your client portal.
    </p>` +
    card(`
      <p style="margin: 0 0 16px; font-weight: 600; color: #FF006E;">📊 Your Dashboard</p>
      <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #444;">
        Your dashboard gives you a bird&apos;s-eye view of everything: active projects, invoices, and recent activity. 
        Bookmark your portal for quick access!
      </p>
      
      <p style="margin: 0 0 16px; font-weight: 600; color: #FF006E;">📁 Projects</p>
      <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #444;">
        ${data.projectName 
          ? `Your project "${data.projectName}" is now being reviewed. You'll see updates here as we progress.` 
          : 'Track all your projects in one place. View milestones, leave comments, and upload files directly to each project.'}
      </p>
      
      <p style="margin: 0 0 16px; font-weight: 600; color: #FF006E;">💬 Support</p>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #444;">
        Have a question? Submit a support ticket anytime. We typically respond within 24 hours during business days.
      </p>
    `) +
    button('Explore Your Portal', data.portalUrl) +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      Need help? Just reply to this email — we&apos;re always happy to assist.
    </p>` +
    `<p style="font-size: 15px; color: #444;">Best,<br/>The Pink Beam Team</p>`
  )

  return {
    subject: 'Your Pink Beam getting started guide',
    html,
  }
}

/** Onboarding: Day 3 - Feature highlight */
export function onboardingDay3Template(data: OnboardingFeatureHighlightData): { subject: string; html: string } {
  const firstName = data.fullName.split(' ')[0]

  const html = layout(
    header(`Feature Spotlight: ${data.featureName}`) +
    `<p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      We wanted to highlight one of our most popular features that clients love.
    </p>` +
    card(`
      <p style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #FF006E;">${data.featureName}</p>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #444;">
        ${data.featureDescription}
      </p>
    `) +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      Give it a try next time you&apos;re in the portal. We think you&apos;ll find it super useful!
    </p>` +
    button('Try It Now', data.portalUrl) +
    `<p style="font-size: 15px; color: #444;">Best,<br/>The Pink Beam Team</p>`
  )

  return {
    subject: `Quick tip: ${data.featureName}`,
    html,
  }
}

/** Onboarding: Day 7 - Tips & best practices */
export function onboardingDay7Template(data: OnboardingTipsData): { subject: string; html: string } {
  const firstName = data.fullName.split(' ')[0]

  const html = layout(
    header('Tips for Success', 'Best practices from our team') +
    `<p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      You&apos;ve been with us for a week now! Here are some tips to make your project journey smooth and successful.
    </p>` +
    card(`
      <p style="margin: 0 0 16px; font-weight: 600;">💡 Best Practices</p>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #444;">
        <li><strong>Regular check-ins:</strong> Visit your portal weekly for updates</li>
        <li><strong>Clear communication:</strong> Use project comments for specific feedback</li>
        <li><strong>Timely feedback:</strong> Respond to review requests within 48 hours when possible</li>
        <li><strong>File organization:</strong> Name files clearly and upload to the right project</li>
        <li><strong>Ask questions:</strong> No question is too small — we&apos;re here to help</li>
      </ul>
    `) +
    card(`
      <p style="margin: 0 0 12px; font-weight: 600;">📞 Need to Talk?</p>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #444;">
        Sometimes a quick call is better than a long email. Reply to this email if you&apos;d like to schedule 
        a check-in call with your project manager.
      </p>
    `) +
    button('View Your Portal', data.portalUrl) +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      Thanks for choosing Pink Beam. We&apos;re excited to build something amazing together!
    </p>` +
    `<p style="font-size: 15px; color: #444;">Cheers,<br/>The Pink Beam Team</p>`
  )

  return {
    subject: 'Tips for a successful project journey',
    html,
  }
}


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

// --- Demo email templates ---

interface DemoWelcomeData {
  email: string
  employeeType: string
  competitors: string[]
  viewBriefUrl: string
}

/** Send welcome email to demo users with their brief */
export function demoWelcomeTemplate(data: DemoWelcomeData): { subject: string; html: string } {
  const employeeTitles: Record<string, string> = {
    researcher: "AI Researcher",
    analyst: "AI Analyst",
    strategist: "AI Strategist",
  }
  const employeeTitle = employeeTitles[data.employeeType] || "AI Employee"

  const html = layout(
    header('Your AI Employee Brief is Ready!', `Generated by ${employeeTitle}`) +
    `<p style="font-size: 16px; line-height: 1.6;">Hi there,</p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      Thanks for trying out Pink Beam's AI employees! Your personalized intelligence brief 
      is ready, featuring insights on ${data.competitors.join(", ")}.
    </p>` +
    card(`
      <p style="margin: 0 0 12px; font-size: 14px; color: #666;"><strong>Your Demo Brief Includes:</strong></p>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #444;">
        <li>Executive Summary with strategic insights</li>
        <li>Competitor intelligence & market analysis</li>
        <li>Industry trends affecting your space</li>
        <li>Actionable strategic opportunities</li>
        <li>Curated reading recommendations</li>
      </ul>
    `) +
    button('View Your Brief', data.viewBriefUrl) +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      <strong>Want briefs like this every week?</strong> Hire your own AI employee 
      starting at just $397/month and get personalized intelligence delivered to your inbox.
    </p>` +
    `<p style="font-size: 15px; line-height: 1.6; color: #444;">
      Questions? Just reply to this email — we're always happy to help.
    </p>` +
    `<p style="font-size: 15px; color: #444;">— The Pink Beam Team</p>`,
    `<p style="color: #999; font-size: 12px;">
      You received this because you requested a demo brief on pinkbeam.io.
      <a href="${data.viewBriefUrl}" style="color: #FF006E;">View your brief again</a>
    </p>`
  )

  return {
    subject: `Your AI Employee Demo Brief is Ready! — Pink Beam`,
    html,
  }
}
