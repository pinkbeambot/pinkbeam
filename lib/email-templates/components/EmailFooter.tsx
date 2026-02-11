/**
 * EmailFooter - Footer component for Pink Beam emails
 * 
 * Features:
 * - Social media links
 * - Company address
 * - Unsubscribe link
 * - Legal text
 */

import { COLORS } from './EmailLayout'

export interface EmailFooterProps {
  companyName?: string
  companyAddress?: string
  showSocialLinks?: boolean
  socialLinks?: Array<{ platform: string; url: string; icon?: string }>
  unsubscribeUrl?: string
  legalText?: string
  showContactInfo?: boolean
  contactEmail?: string
  contactPhone?: string
}

// SVG icons as data URIs for email compatibility
const SOCIAL_ICONS: Record<string, string> = {
  twitter: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`,
  linkedin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  instagram: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  github: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
}

/**
 * Generate email footer with social links and legal text
 */
export function EmailFooter(props: EmailFooterProps): string {
  const {
    companyName = 'Pink Beam',
    companyAddress = '123 Design Street, San Francisco, CA 94102',
    showSocialLinks = true,
    socialLinks = [
      { platform: 'twitter', url: 'https://twitter.com/pinkbeam' },
      { platform: 'linkedin', url: 'https://linkedin.com/company/pinkbeam' },
      { platform: 'instagram', url: 'https://instagram.com/pinkbeam' },
    ],
    unsubscribeUrl,
    legalText = `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`,
    showContactInfo = true,
    contactEmail = 'hello@pinkbeam.ai',
    contactPhone,
  } = props

  const socialHtml = showSocialLinks && socialLinks.length > 0
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin-bottom: 16px;">
        <tr>
          ${socialLinks.map(link => `
            <td style="padding: 0 8px;">
              <a href="${link.url}" style="display: block; width: 36px; height: 36px; background-color: ${COLORS.card}; border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none; color: ${COLORS.textMuted};" class="dark-card">
                ${SOCIAL_ICONS[link.platform] || '●'}
              </a>
            </td>
          `).join('')}
        </tr>
      </table>`
    : ''

  const contactHtml = showContactInfo
    ? `<p style="margin: 0 0 8px 0; font-size: 13px; color: ${COLORS.textMuted};" class="dark-text-muted">
        <a href="mailto:${contactEmail}" style="color: ${COLORS.primary}; text-decoration: none;">${contactEmail}</a>
        ${contactPhone ? ` · <a href="tel:${contactPhone}" style="color: ${COLORS.primary}; text-decoration: none;">${contactPhone}</a>` : ''}
      </p>`
    : ''

  const addressHtml = companyAddress
    ? `<p style="margin: 0; font-size: 11px; color: ${COLORS.textSubtle}; line-height: 1.5;" class="dark-text-muted">
        ${companyAddress}
      </p>`
    : ''

  const unsubscribeHtml = unsubscribeUrl
    ? `<p style="margin: 12px 0 0 0; font-size: 11px; color: ${COLORS.textSubtle};" class="dark-text-muted">
        <a href="${unsubscribeUrl}" style="color: ${COLORS.textMuted}; text-decoration: underline;">Unsubscribe</a> · 
        <a href="${unsubscribeUrl.replace('unsubscribe', 'preferences')}" style="color: ${COLORS.textMuted}; text-decoration: underline;">Email Preferences</a>
      </p>`
    : ''

  const legalHtml = legalText
    ? `<p style="margin: 16px 0 0 0; font-size: 11px; color: ${COLORS.textSubtle}; line-height: 1.5;" class="dark-text-muted">
        ${legalText}
      </p>`
    : ''

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td style="padding: 32px 28px; text-align: center; border-top: 1px solid ${COLORS.border};" class="dark-border">
        ${socialHtml}
        ${contactHtml}
        ${addressHtml}
        ${unsubscribeHtml}
        ${legalHtml}
      </td>
    </tr>
  </table>`
}

/**
 * Generate a minimal footer for transactional emails
 */
export function EmailFooterMinimal(props?: { companyName?: string }): string {
  const companyName = props?.companyName ?? 'Pink Beam'
  
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td style="padding: 24px 28px; text-align: center; border-top: 1px solid ${COLORS.border};" class="dark-border">
        <p style="margin: 0; font-size: 12px; color: ${COLORS.textSubtle};" class="dark-text-muted">
          ${companyName} — Web Design & Development
        </p>
        <p style="margin: 8px 0 0 0; font-size: 11px; color: ${COLORS.textSubtle};" class="dark-text-muted">
          © ${new Date().getFullYear()} ${companyName}. All rights reserved.
        </p>
      </td>
    </tr>
  </table>`
}
