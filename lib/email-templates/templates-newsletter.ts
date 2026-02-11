/**
 * Newsletter Email Template
 * 
 * Template for marketing newsletters
 */

import {
  EmailLayout,
  EmailHeader,
  EmailFooterMinimal,
  EmailButton,
  EmailCard,
  COLORS,
} from './components'

export interface NewsletterData {
  title: string
  intro: string
  items: Array<{ title: string; description: string; url?: string }>
  ctaText?: string
  ctaUrl?: string
}

export function newsletterTemplate(data: NewsletterData): { subject: string; html: string; text: string } {
  const items = data.items
    .map((item) => {
      const title = item.url
        ? `<a href="${item.url}" style="color: ${COLORS.primary}; text-decoration: none; font-weight: 600;">${item.title}</a>`
        : `<span style="font-weight: 600; color: ${COLORS.text};" class="dark-text">${item.title}</span>`
      return `
        <div style="margin-bottom: 16px;">
          ${title}
          <p style="margin: 6px 0 0; color: ${COLORS.textLight}; font-size: 14px; line-height: 1.6;" class="dark-text-secondary">${item.description}</p>
        </div>
      `
    })
    .join('')

  const ctaSection = data.ctaUrl && data.ctaText
    ? EmailButton({ text: data.ctaText, url: data.ctaUrl, fullWidth: true })
    : ''

  const content = `
    ${EmailHeader({ title: data.title, subtitle: 'Pink Beam Newsletter' })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">${data.intro}</p>
          ${EmailCard({
            children: items,
            variant: 'filled',
          })}
          ${ctaSection}
          <p style="font-size: 13px; line-height: 1.6; margin: 24px 0 0 0; color: ${COLORS.textMuted};" class="dark-text-muted">
            You&apos;re receiving this email because you opted in for Pink Beam updates.
          </p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: data.title,
  })

  const textItems = data.items
    .map(item => `${item.title}${item.url ? ` - ${item.url}` : ''}\n${item.description}`)
    .join('\n\n')

  const text = `${data.title} — Pink Beam Newsletter

${data.intro}

${textItems}

${data.ctaUrl && data.ctaText ? `${data.ctaText}: ${data.ctaUrl}\n` : ''}You're receiving this email because you opted in for Pink Beam updates.`

  return {
    subject: `${data.title} — Pink Beam`,
    html,
    text,
  }
}
