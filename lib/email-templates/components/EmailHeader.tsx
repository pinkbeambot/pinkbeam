/**
 * EmailHeader - Header component for Pink Beam emails
 * 
 * Features:
 * - Logo display
 * - Optional navigation links
 * - Gradient background with branding
 */

import { COLORS } from './EmailLayout'

export interface EmailHeaderProps {
  title?: string
  subtitle?: string
  showLogo?: boolean
  logoUrl?: string
  logoText?: string
  navigation?: Array<{ label: string; url: string }>
}

/**
 * Generate email header with gradient background
 */
export function EmailHeader(props: EmailHeaderProps): string {
  const { 
    title, 
    subtitle, 
    showLogo = true, 
    logoUrl,
    logoText = 'Pink Beam',
    navigation 
  } = props

  const logoHtml = showLogo
    ? `<div style="margin-bottom: ${title ? '16px' : '0'};">
        ${logoUrl 
          ? `<img src="${logoUrl}" alt="${logoText}" width="120" style="display: block; max-width: 120px;">`
          : `<table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width: 40px; height: 40px; background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight}); border-radius: 8px; text-align: center; vertical-align: middle;">
                  <span style="color: ${COLORS.white}; font-weight: bold; font-size: 18px;">P</span>
                </td>
                <td style="padding-left: 12px;">
                  <span style="font-size: 20px; font-weight: 600; color: ${COLORS.white};">${logoText}</span>
                </td>
              </tr>
            </table>`
        }
      </div>`
    : ''

  const titleHtml = title 
    ? `<h1 style="margin: 0; font-size: 22px; font-weight: 600; color: ${COLORS.white}; line-height: 1.3;">${title}</h1>`
    : ''

  const subtitleHtml = subtitle 
    ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.9); line-height: 1.4;">${subtitle}</p>`
    : ''

  const navHtml = navigation && navigation.length > 0
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
        <tr>
          ${navigation.map(item => `
            <td style="padding: 0 12px;">
              <a href="${item.url}" style="color: rgba(255,255,255,0.9); text-decoration: none; font-size: 13px;">${item.label}</a>
            </td>
          `).join('')}
        </tr>
      </table>`
    : ''

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td class="header" style="background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight}); padding: 32px 28px; text-align: center;">
        ${logoHtml}
        ${titleHtml}
        ${subtitleHtml}
        ${navHtml}
      </td>
    </tr>
  </table>`
}

/**
 * Generate a compact header for transactional emails
 */
export function EmailHeaderCompact(props: { title: string }): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td style="padding: 24px 28px; text-align: center; border-bottom: 1px solid ${COLORS.border};">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
          <tr>
            <td style="width: 32px; height: 32px; background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight}); border-radius: 6px; text-align: center; vertical-align: middle;">
              <span style="color: ${COLORS.white}; font-weight: bold; font-size: 16px;">P</span>
            </td>
            <td style="padding-left: 10px;">
              <span style="font-size: 18px; font-weight: 600; color: ${COLORS.text};">Pink Beam</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 28px 0 28px;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: ${COLORS.text};" class="dark-text">${props.title}</h1>
      </td>
    </tr>
  </table>`
}
