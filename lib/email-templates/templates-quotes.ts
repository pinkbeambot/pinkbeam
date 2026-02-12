/**
 * Pink Beam Email Templates
 * 
 * A comprehensive collection of email templates using the component system.
 * All templates include:
 * - Consistent Pink Beam branding
 * - Mobile-responsive design
 * - Dark mode support
 * - Plain text alternatives
 * - Type-safe variables
 */

import {
  EmailLayout,
  EmailHeader,
  EmailHeaderCompact,
  EmailFooter,
  EmailFooterMinimal,
  EmailButton,
  EmailButtonGroup,
  EmailCard,
  EmailCardList,
  EmailInfoCard,
  EmailCardWithIcon,
  EmailDivider,
  EmailSpacer,
  COLORS,
} from './components'

import {
  type QuoteVariables,
  type TicketVariables,
  type UserVariables,
  type InvoiceVariables,
  type ProjectVariables,
  type FileVariables,
  type MeetingVariables,
  type PasswordResetVariables,
  type VerificationVariables,
  getFirstName,
  formatDate,
} from './variables'

// ============================================================================
// Quote Email Templates
// ============================================================================

export function adminNotificationTemplate(quote: QuoteVariables): { subject: string; html: string; text: string } {
  const qualityBadge = quote.leadQuality
    ? ` <span style="display: inline-block; background: ${quote.leadQuality === 'hot' ? COLORS.error : quote.leadQuality === 'warm' ? COLORS.warning : '#6b7280'}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; text-transform: uppercase;">${quote.leadQuality}</span>`
    : ''

  const content = `
    ${EmailHeader({ 
      title: 'New Quote Request', 
      subtitle: quote.leadScore != null ? `Lead Score: ${quote.leadScore}/100` : undefined 
    })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          ${EmailCardList({
            items: [
              { label: 'Name', value: quote.fullName + qualityBadge, highlight: true },
              { label: 'Email', value: quote.email },
              ...(quote.company ? [{ label: 'Company', value: quote.company, highlight: false } as const] : []),
              { label: 'Project Type', value: quote.projectType },
              { label: 'Services', value: quote.services.join(', ') },
              { label: 'Budget', value: quote.budgetRange },
              { label: 'Timeline', value: quote.timeline },
            ],
            variant: 'filled',
          })}
          ${EmailCard({
            children: `<p style="margin: 0 0 8px 0; font-weight: 600; color: ${COLORS.text};">Description:</p><p style="margin: 0; white-space: pre-wrap; color: ${COLORS.textLight};">${quote.description}</p>`,
            variant: 'outlined',
          })}
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: `New quote request from ${quote.fullName}`,
  })

  const text = `New Quote Request

Name: ${quote.fullName}${quote.leadQuality ? ` [${quote.leadQuality.toUpperCase()}]` : ''}
Email: ${quote.email}
${quote.company ? `Company: ${quote.company}\n` : ''}Project Type: ${quote.projectType}
Services: ${quote.services.join(', ')}
Budget: ${quote.budgetRange}
Timeline: ${quote.timeline}

Description:
${quote.description}

Quote ID: ${quote.id}`

  return {
    subject: `New Quote: ${quote.fullName}${quote.company ? ` — ${quote.company}` : ''}`,
    html,
    text,
  }
}

export function clientAutoResponseTemplate(quote: QuoteVariables): { subject: string; html: string; text: string } {
  const firstName = getFirstName(quote.fullName)

  const content = `
    ${EmailHeader({ title: 'We Got Your Request!', subtitle: 'Thank you for reaching out to Pink Beam' })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            Thanks for your interest in working with us! We've received your project details and our team is reviewing them now.
          </p>
          ${EmailCardList({
            items: [
              { label: 'Project', value: quote.projectType },
              { label: 'Services', value: quote.services.join(', ') },
              { label: 'Budget', value: quote.budgetRange },
              { label: 'Timeline', value: quote.timeline },
            ],
            variant: 'filled',
          })}
          <p style="font-size: 15px; line-height: 1.6; margin: 24px 0 16px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            <strong style="color: ${COLORS.text};" class="dark-text">What happens next?</strong> A team member will review your project within 24 hours and reach out to discuss next steps. If your project is urgent, feel free to reply to this email directly.
          </p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            We're excited to learn more about your project!
          </p>
          <p style="font-size: 15px; color: ${COLORS.textLight}; margin: 0;" class="dark-text-secondary">— The Pink Beam Team</p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: `Thanks for your quote request, ${firstName}!`,
  })

  const text = `Hi ${firstName},

Thanks for your interest in working with us! We've received your project details and our team is reviewing them now.

Project: ${quote.projectType}
Services: ${quote.services.join(', ')}
Budget: ${quote.budgetRange}
Timeline: ${quote.timeline}

What happens next? A team member will review your project within 24 hours and reach out to discuss next steps. If your project is urgent, feel free to reply to this email directly.

We're excited to learn more about your project!

— The Pink Beam Team`

  return {
    subject: `We received your quote request — Pink Beam`,
    html,
    text,
  }
}

export function statusUpdateTemplate(
  quote: QuoteVariables,
  newStatus: string
): { subject: string; html: string; text: string } {
  const firstName = getFirstName(quote.fullName)

  const statusMessages: Record<string, { heading: string; body: string; emoji: string }> = {
    CONTACTED: {
      heading: "We're reviewing your project",
      body: "Our team has reviewed your request and we'll be reaching out shortly to discuss your project in more detail.",
      emoji: '👋',
    },
    QUALIFIED: {
      heading: 'Great news — your project is a fit!',
      body: "After reviewing your requirements, we believe Pink Beam is a great match for your project. We'll be preparing a detailed proposal for you.",
      emoji: '🎉',
    },
    PROPOSAL: {
      heading: 'Your proposal is ready',
      body: "We've put together a proposal for your project. A team member will be sharing the details with you shortly.",
      emoji: '📋',
    },
    ACCEPTED: {
      heading: 'Welcome aboard!',
      body: "We're thrilled to get started on your project! A team member will be in touch with onboarding details and next steps.",
      emoji: '🚀',
    },
    DECLINED: {
      heading: 'Thank you for considering us',
      body: "We understand this might not be the right fit at this time. If anything changes in the future, we'd love to hear from you.",
      emoji: '🙏',
    },
  }

  const msg = statusMessages[newStatus]
  if (!msg) return { subject: '', html: '', text: '' }

  const content = `
    ${EmailHeader({ title: msg.heading })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 20px; margin: 0 0 16px 0;">${msg.emoji}</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">${msg.body}</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            If you have any questions, just reply to this email — we're always happy to help.
          </p>
          <p style="font-size: 15px; color: ${COLORS.textLight}; margin: 16px 0 0 0;" class="dark-text-secondary">— The Pink Beam Team</p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({
    children: content,
    previewText: msg.heading,
  })

  const text = `${msg.heading}

Hi ${firstName},

${msg.body}

If you have any questions, just reply to this email — we're always happy to help.

— The Pink Beam Team`

  return {
    subject: `${msg.heading} — Pink Beam`,
    html,
    text,
  }
}

/** Admin notification when quote is ACCEPTED - triggers project onboarding */
export function quoteAcceptedAdminTemplate(quote: QuoteVariables): { subject: string; html: string; text: string } {
  const content = `
    ${EmailHeader({ title: '🎉 Quote Accepted!', subtitle: 'Time to onboard the client' })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.text};" class="dark-text">
            Great news! <strong>${quote.fullName}</strong> has been marked as ACCEPTED. Time to start the onboarding process.
          </p>
          ${EmailCardList({
            items: [
              { label: 'Client', value: quote.fullName, highlight: true },
              { label: 'Email', value: quote.email },
              ...(quote.company ? [{ label: 'Company', value: quote.company, highlight: false } as const] : []),
              { label: 'Project Type', value: quote.projectType },
              { label: 'Budget', value: quote.budgetRange },
              { label: 'Timeline', value: quote.timeline },
            ],
            variant: 'filled',
          })}
          ${EmailCard({
            children: `
              <p style="margin: 0 0 12px 0; font-weight: 600; color: ${COLORS.primary};">Next Steps:</p>
              <ol style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: ${COLORS.textLight};">
                <li>Create project in dashboard</li>
                <li>Set up client portal access</li>
                <li>Schedule kickoff call</li>
                <li>Send contract & onboarding docs</li>
                <li>Assign project team</li>
              </ol>
            `,
            variant: 'outlined',
          })}
          <p style="font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            <strong>Services:</strong> ${quote.services.join(', ')}
          </p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({
    children: content,
    previewText: `Quote accepted: ${quote.fullName}`,
  })

  const text = `🎉 Quote Accepted!

Great news! ${quote.fullName} has been marked as ACCEPTED. Time to start the onboarding process.

Client: ${quote.fullName}
Email: ${quote.email}
${quote.company ? `Company: ${quote.company}\n` : ''}Project Type: ${quote.projectType}
Budget: ${quote.budgetRange}
Timeline: ${quote.timeline}
Services: ${quote.services.join(', ')}

Next Steps:
1. Create project in dashboard
2. Set up client portal access
3. Schedule kickoff call
4. Send contract & onboarding docs
5. Assign project team

Quote ID: ${quote.id}`

  return {
    subject: `🎉 Quote Accepted: ${quote.fullName}${quote.company ? ` — ${quote.company}` : ''}`,
    html,
    text,
  }
}

/** Admin notification when quote is DECLINED - for tracking and follow-up */
export function quoteDeclinedAdminTemplate(quote: QuoteVariables): { subject: string; html: string; text: string } {
  const content = `
    ${EmailHeaderCompact({ title: 'Quote Declined' })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 0 28px 28px 28px;">
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.text};" class="dark-text">
            The quote for <strong>${quote.fullName}</strong> has been marked as DECLINED.
          </p>
          ${EmailCardList({
            items: [
              { label: 'Client', value: quote.fullName },
              { label: 'Email', value: quote.email },
              ...(quote.company ? [{ label: 'Company', value: quote.company, highlight: false } as const] : []),
              { label: 'Project Type', value: quote.projectType },
              { label: 'Budget', value: quote.budgetRange },
            ],
            variant: 'outlined',
          })}
          <p style="font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            Consider following up in 3-6 months to see if their needs have changed, or add them to the newsletter list.
          </p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({
    children: content,
    previewText: `Quote declined: ${quote.fullName}`,
  })

  const text = `Quote Declined

The quote for ${quote.fullName} has been marked as DECLINED.

Client: ${quote.fullName}
Email: ${quote.email}
${quote.company ? `Company: ${quote.company}\n` : ''}Project Type: ${quote.projectType}
Budget: ${quote.budgetRange}

Consider following up in 3-6 months to see if their needs have changed, or add them to the newsletter list.

Quote ID: ${quote.id}`

  return {
    subject: `Quote Declined: ${quote.fullName}${quote.company ? ` — ${quote.company}` : ''}`,
    html,
    text,
  }
}

export function followUpDay1Template(quote: QuoteVariables): { subject: string; html: string; text: string } {
  const firstName = getFirstName(quote.fullName)

  const content = `
    ${EmailHeaderCompact({ title: 'Quick follow-up' })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 0 28px 28px 28px;">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            I wanted to follow up personally on the quote request you submitted yesterday for your <strong style="color: ${COLORS.text};" class="dark-text">${quote.projectType}</strong> project.
          </p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            I've had a chance to review your requirements and I'd love to schedule a quick call to discuss the best approach. Would any of these times work for a 15-minute chat?
          </p>
          ${EmailCard({
            children: `<ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: ${COLORS.textLight};"><li>Tomorrow morning (10am–12pm)</li><li>Tomorrow afternoon (2pm–4pm)</li><li>Any time that works for you — just reply with your preference</li></ul>`,
            variant: 'filled',
          })}
          <p style="font-size: 15px; line-height: 1.6; margin: 16px 0 0 0; color: ${COLORS.textLight};" class="dark-text-secondary">Looking forward to hearing from you!</p>
          <p style="font-size: 15px; color: ${COLORS.textLight}; margin: 16px 0 0 0;" class="dark-text-secondary">Best,<br/>The Pink Beam Team</p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ children: content, previewText: `Follow-up on your ${quote.projectType} project` })
  
  const text = `Hi ${firstName},

I wanted to follow up personally on the quote request you submitted yesterday for your ${quote.projectType} project.

I've had a chance to review your requirements and I'd love to schedule a quick call to discuss the best approach. Would any of these times work for a 15-minute chat?

- Tomorrow morning (10am–12pm)
- Tomorrow afternoon (2pm–4pm)
- Any time that works for you — just reply with your preference

Looking forward to hearing from you!

Best,
The Pink Beam Team`

  return {
    subject: `Quick follow-up on your project — Pink Beam`,
    html,
    text,
  }
}

export function followUpDay3Template(quote: QuoteVariables): { subject: string; html: string; text: string } {
  const firstName = getFirstName(quote.fullName)

  const content = `
    ${EmailHeaderCompact({ title: 'Choosing the right web partner' })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 0 28px 28px 28px;">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            While your project is being reviewed, I thought you might find these helpful as you evaluate your options:
          </p>
          ${EmailCard({
            children: `<p style="margin: 0 0 12px 0; font-weight: 600; color: ${COLORS.primary};">Things to consider when choosing a web partner:</p><ol style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: ${COLORS.textLight};"><li>Look for a portfolio that matches your industry and style</li><li>Ask about their development process and communication cadence</li><li>Ensure they provide post-launch support and maintenance</li><li>Check if they offer SEO and performance optimization</li><li>Confirm they build with modern, scalable technology</li></ol>`,
            variant: 'filled',
          })}
          <p style="font-size: 15px; line-height: 1.6; margin: 24px 0 16px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            At Pink Beam, we check all these boxes. We'd love to show you how we approach projects like yours.
          </p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            Just reply to this email if you'd like to chat — no pressure at all.
          </p>
          <p style="font-size: 15px; color: ${COLORS.textLight}; margin: 16px 0 0 0;" class="dark-text-secondary">Best,<br/>The Pink Beam Team</p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ children: content, previewText: 'Tips for choosing the right web partner' })

  const text = `Hi ${firstName},

While your project is being reviewed, I thought you might find these helpful as you evaluate your options:

Things to consider when choosing a web partner:
1. Look for a portfolio that matches your industry and style
2. Ask about their development process and communication cadence
3. Ensure they provide post-launch support and maintenance
4. Check if they offer SEO and performance optimization
5. Confirm they build with modern, scalable technology

At Pink Beam, we check all these boxes. We'd love to show you how we approach projects like yours.

Just reply to this email if you'd like to chat — no pressure at all.

Best,
The Pink Beam Team`

  return {
    subject: `Choosing the right web partner — Pink Beam`,
    html,
    text,
  }
}

export function followUpDay7Template(quote: QuoteVariables): { subject: string; html: string; text: string } {
  const firstName = getFirstName(quote.fullName)

  const content = `
    ${EmailHeaderCompact({ title: 'Still interested?' })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 0 28px 28px 28px;">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            I wanted to check in one last time about your <strong style="color: ${COLORS.text};" class="dark-text">${quote.projectType}</strong> project. We'd still love the opportunity to work with you${quote.company ? ` and the ${quote.company} team` : ''}.
          </p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            If the timing isn't right, no worries at all — we'll be here whenever you're ready. Just reply to this email anytime and we'll pick right up.
          </p>
          <p style="font-size: 15px; color: ${COLORS.textLight}; margin: 0;" class="dark-text-secondary">All the best,<br/>The Pink Beam Team</p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ children: content, previewText: `Checking in on your ${quote.projectType} project` })

  const text = `Hi ${firstName},

I wanted to check in one last time about your ${quote.projectType} project. We'd still love the opportunity to work with you${quote.company ? ` and the ${quote.company} team` : ''}.

If the timing isn't right, no worries at all — we'll be here whenever you're ready. Just reply to this email anytime and we'll pick right up.

All the best,
The Pink Beam Team`

  return {
    subject: `Still interested in your project — Pink Beam`,
    html,
    text,
  }
}

// ============================================================================
// Onboarding Email Templates
// ============================================================================

interface OnboardingGettingStartedData {
  fullName: string
  email: string
  portalUrl: string
  projectName?: string
}

interface OnboardingFeatureHighlightData {
  fullName: string
  email: string
  portalUrl: string
  featureName: string
  featureDescription: string
}

interface OnboardingTipsData {
  fullName: string
  email: string
  portalUrl: string
}

/** Onboarding: Day 1 - Getting started guide */
export function onboardingDay1Template(data: OnboardingGettingStartedData): { subject: string; html: string; text: string } {
  const firstName = getFirstName(data.fullName)

  const content = `
    ${EmailHeader({ title: 'Getting Started Guide', subtitle: 'Everything you need to know' })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            Now that you're set up, here's a quick guide to help you get the most out of your client portal.
          </p>
          ${EmailCard({
            children: `
              <p style="margin: 0 0 16px 0; font-weight: 600; color: ${COLORS.primary};">📊 Your Dashboard</p>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: ${COLORS.textLight};" class="dark-text-secondary">
                Your dashboard gives you a bird's-eye view of everything: active projects, invoices, and recent activity. Bookmark your portal for quick access!
              </p>
              <p style="margin: 0 0 16px 0; font-weight: 600; color: ${COLORS.primary};">📁 Projects</p>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: ${COLORS.textLight};" class="dark-text-secondary">
                ${data.projectName 
                  ? `Your project "${data.projectName}" is now being reviewed. You'll see updates here as we progress.` 
                  : 'Track all your projects in one place. View milestones, leave comments, and upload files directly to each project.'}
              </p>
              <p style="margin: 0 0 16px 0; font-weight: 600; color: ${COLORS.primary};">💬 Support</p>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: ${COLORS.textLight};" class="dark-text-secondary">
                Have a question? Submit a support ticket anytime. We typically respond within 24 hours during business days.
              </p>
            `,
            variant: 'filled',
          })}
          ${EmailButton({ text: 'Explore Your Portal', url: data.portalUrl, fullWidth: true })}
          <p style="font-size: 15px; line-height: 1.6; margin: 24px 0 0 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            Need help? Just reply to this email — we're always happy to assist.
          </p>
          <p style="font-size: 15px; color: ${COLORS.textLight}; margin: 16px 0 0 0;" class="dark-text-secondary">Best,<br/>The Pink Beam Team</p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ children: content, previewText: 'Your Pink Beam getting started guide' })

  const text = `Getting Started Guide

Hi ${firstName},

Now that you're set up, here's a quick guide to help you get the most out of your client portal.

📊 Your Dashboard
Your dashboard gives you a bird's-eye view of everything: active projects, invoices, and recent activity. Bookmark your portal for quick access!

📁 Projects
${data.projectName 
  ? `Your project "${data.projectName}" is now being reviewed. You'll see updates here as we progress.` 
  : 'Track all your projects in one place. View milestones, leave comments, and upload files directly to each project.'}

💬 Support
Have a question? Submit a support ticket anytime. We typically respond within 24 hours during business days.

Explore Your Portal: ${data.portalUrl}

Need help? Just reply to this email — we're always happy to assist.

Best,
The Pink Beam Team`

  return {
    subject: 'Your Pink Beam getting started guide',
    html,
    text,
  }
}

/** Onboarding: Day 3 - Feature highlight */
export function onboardingDay3Template(data: OnboardingFeatureHighlightData): { subject: string; html: string; text: string } {
  const firstName = getFirstName(data.fullName)

  const content = `
    ${EmailHeader({ title: `Feature Spotlight: ${data.featureName}` })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            We wanted to highlight one of our most popular features that clients love.
          </p>
          ${EmailCard({
            children: `
              <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: ${COLORS.primary};">${data.featureName}</p>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: ${COLORS.textLight};" class="dark-text-secondary">${data.featureDescription}</p>
            `,
            variant: 'filled',
          })}
          <p style="font-size: 15px; line-height: 1.6; margin: 24px 0 16px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            Give it a try next time you're in the portal. We think you'll find it super useful!
          </p>
          ${EmailButton({ text: 'Try It Now', url: data.portalUrl })}
          <p style="font-size: 15px; color: ${COLORS.textLight}; margin: 16px 0 0 0;" class="dark-text-secondary">Best,<br/>The Pink Beam Team</p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ children: content, previewText: `Quick tip: ${data.featureName}` })

  const text = `Feature Spotlight: ${data.featureName}

Hi ${firstName},

We wanted to highlight one of our most popular features that clients love.

${data.featureName}
${data.featureDescription}

Give it a try next time you're in the portal. We think you'll find it super useful!

Try It Now: ${data.portalUrl}

Best,
The Pink Beam Team`

  return {
    subject: `Quick tip: ${data.featureName}`,
    html,
    text,
  }
}

/** Onboarding: Day 7 - Tips & best practices */
export function onboardingDay7Template(data: OnboardingTipsData): { subject: string; html: string; text: string } {
  const firstName = getFirstName(data.fullName)

  const content = `
    ${EmailHeader({ title: 'Tips for Success', subtitle: 'Best practices from our team' })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            You've been with us for a week now! Here are some tips to make your project journey smooth and successful.
          </p>
          ${EmailCard({
            children: `
              <p style="margin: 0 0 12px 0; font-weight: 600; color: ${COLORS.text};" class="dark-text">💡 Best Practices</p>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: ${COLORS.textLight};" class="dark-text-secondary">
                <li><strong>Regular check-ins:</strong> Visit your portal weekly for updates</li>
                <li><strong>Clear communication:</strong> Use project comments for specific feedback</li>
                <li><strong>Timely feedback:</strong> Respond to review requests within 48 hours when possible</li>
                <li><strong>File organization:</strong> Name files clearly and upload to the right project</li>
                <li><strong>Ask questions:</strong> No question is too small — we're here to help</li>
              </ul>
            `,
            variant: 'filled',
          })}
          ${EmailCard({
            children: `
              <p style="margin: 0 0 8px 0; font-weight: 600; color: ${COLORS.text};" class="dark-text">📞 Need to Talk?</p>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: ${COLORS.textLight};" class="dark-text-secondary">
                Sometimes a quick call is better than a long email. Reply to this email if you'd like to schedule a check-in call with your project manager.
              </p>
            `,
            variant: 'outlined',
          })}
          ${EmailButton({ text: 'View Your Portal', url: data.portalUrl })}
          <p style="font-size: 15px; line-height: 1.6; margin: 24px 0 0 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            Thanks for choosing Pink Beam. We're excited to build something amazing together!
          </p>
          <p style="font-size: 15px; color: ${COLORS.textLight}; margin: 16px 0 0 0;" class="dark-text-secondary">Cheers,<br/>The Pink Beam Team</p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ children: content, previewText: 'Tips for a successful project journey' })

  const text = `Tips for Success

Hi ${firstName},

You've been with us for a week now! Here are some tips to make your project journey smooth and successful.

💡 Best Practices
- Regular check-ins: Visit your portal weekly for updates
- Clear communication: Use project comments for specific feedback
- Timely feedback: Respond to review requests within 48 hours when possible
- File organization: Name files clearly and upload to the right project
- Ask questions: No question is too small — we're here to help

📞 Need to Talk?
Sometimes a quick call is better than a long email. Reply to this email if you'd like to schedule a check-in call with your project manager.

View Your Portal: ${data.portalUrl}

Thanks for choosing Pink Beam. We're excited to build something amazing together!

Cheers,
The Pink Beam Team`

  return {
    subject: 'Tips for a successful project journey',
    html,
    text,
  }
}
