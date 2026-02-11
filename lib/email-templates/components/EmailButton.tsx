/**
 * EmailButton - CTA button component for Pink Beam emails
 * 
 * Features:
 * - Primary and secondary variants
 * - Full-width on mobile
 * - Consistent styling with brand colors
 * - Table-based layout for Outlook compatibility
 */

import { COLORS } from './EmailLayout'

export interface EmailButtonProps {
  text: string
  url: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  align?: 'left' | 'center' | 'right'
}

// Button styles
const BUTTON_STYLES = {
  primary: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    borderColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.dark,
    color: COLORS.white,
    borderColor: COLORS.dark,
  },
  outline: {
    backgroundColor: 'transparent',
    color: COLORS.primary,
    borderColor: COLORS.primary,
  },
}

const SIZE_STYLES = {
  sm: { padding: '8px 20px', fontSize: '13px' },
  md: { padding: '12px 32px', fontSize: '14px' },
  lg: { padding: '16px 40px', fontSize: '15px' },
}

/**
 * Generate a CTA button
 */
export function EmailButton(props: EmailButtonProps): string {
  const {
    text,
    url,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    align = 'center',
  } = props

  const style = BUTTON_STYLES[variant]
  const sizeStyle = SIZE_STYLES[size]

  const buttonCell = `<a 
    href="${url}" 
    style="
      display: inline-block;
      background-color: ${style.backgroundColor};
      color: ${style.color};
      padding: ${sizeStyle.padding};
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: ${sizeStyle.fontSize};
      text-align: center;
      border: 2px solid ${style.borderColor};
      mso-padding-alt: 0;
      text-underline-color: ${style.backgroundColor};
    "
    class="button"
  >${text}</a>`

  if (fullWidth) {
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td style="padding: 0;">
          ${buttonCell.replace('display: inline-block', 'display: block; width: 100%')}
        </td>
      </tr>
    </table>`
  }

  const alignStyle = align === 'center' ? 'text-align: center;' : align === 'right' ? 'text-align: right;' : 'text-align: left;'

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 24px 0;">
    <tr>
      <td style="${alignStyle} padding: 0;">
        ${buttonCell}
      </td>
    </tr>
  </table>`
}

/**
 * Generate a button group (multiple buttons side by side)
 */
export function EmailButtonGroup(props: {
  buttons: Array<Omit<EmailButtonProps, 'align'>>
  align?: 'left' | 'center' | 'right'
}): string {
  const { buttons, align = 'center' } = props

  const buttonCells = buttons.map(btn => {
    const style = BUTTON_STYLES[btn.variant || 'primary']
    const sizeStyle = SIZE_STYLES[btn.size || 'md']
    
    return `<td style="padding: 0 8px;">
      <a 
        href="${btn.url}" 
        style="
          display: inline-block;
          background-color: ${style.backgroundColor};
          color: ${style.color};
          padding: ${sizeStyle.padding};
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: ${sizeStyle.fontSize};
          border: 2px solid ${style.borderColor};
        "
      >${btn.text}</a>
    </td>`
  }).join('')

  const alignAttr = align === 'center' ? 'align="center"' : ''

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" ${alignAttr} style="margin: 24px 0;">
    <tr>
      ${buttonCells}
    </tr>
  </table>`
}

/**
 * Generate a link-styled button (text only)
 */
export function EmailLinkButton(props: {
  text: string
  url: string
  align?: 'left' | 'center' | 'right'
}): string {
  const { text, url, align = 'center' } = props

  const alignStyle = align === 'center' ? 'text-align: center;' : align === 'right' ? 'text-align: right;' : 'text-align: left;'

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 16px 0;">
    <tr>
      <td style="${alignStyle} padding: 0;">
        <a 
          href="${url}" 
          style="
            color: ${COLORS.primary};
            text-decoration: underline;
            font-weight: 500;
            font-size: 14px;
          "
        >${text} →</a>
      </td>
    </tr>
  </table>`
}
