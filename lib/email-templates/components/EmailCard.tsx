/**
 * EmailCard - Content card component for Pink Beam emails
 * 
 * Features:
 * - Rounded corners
 * - Optional border and shadow
 * - Multiple variants (default, outlined, filled)
 * - Header and footer support
 */

import { COLORS } from './EmailLayout'

export interface EmailCardProps {
  children: string
  variant?: 'default' | 'outlined' | 'filled' | 'gradient'
  padding?: 'sm' | 'md' | 'lg'
  header?: string
  footer?: string
  className?: string
}

// Card style variants
const CARD_STYLES: Record<string, { backgroundColor?: string; background?: string; border: string }> = {
  default: {
    backgroundColor: COLORS.card,
    border: 'none',
  },
  outlined: {
    backgroundColor: COLORS.white,
    border: `1px solid ${COLORS.border}`,
  },
  filled: {
    backgroundColor: COLORS.card,
    border: 'none',
  },
  gradient: {
    background: `linear-gradient(135deg, ${COLORS.card}, #ffffff)`,
    border: `1px solid ${COLORS.border}`,
  },
}

const PADDING_STYLES = {
  sm: '16px',
  md: '24px',
  lg: '32px',
}

/**
 * Generate a content card
 */
export function EmailCard(props: EmailCardProps): string {
  const {
    children,
    variant = 'default',
    padding = 'md',
    header,
    footer,
    className = '',
  } = props

  const style = CARD_STYLES[variant]
  const paddingSize = PADDING_STYLES[padding]

  const headerHtml = header
    ? `<tr>
        <td style="padding: ${paddingSize} ${paddingSize} 0 ${paddingSize};">
          ${header}
        </td>
      </tr>`
    : ''

  const footerHtml = footer
    ? `<tr>
        <td style="padding: 0 ${paddingSize} ${paddingSize} ${paddingSize};">
          ${footer}
        </td>
      </tr>`
    : ''

  const borderStyle = style.border !== 'none' ? style.border : 'none'
  const bgStyle = variant === 'gradient' 
    ? `background: ${CARD_STYLES.gradient.background};` 
    : `background-color: ${style.backgroundColor || COLORS.card};`

  return `<table 
    role="presentation" 
    cellpadding="0" 
    cellspacing="0" 
    border="0" 
    width="100%" 
    style="
      ${bgStyle}
      border-radius: 8px;
      ${borderStyle !== 'none' ? `border: ${borderStyle};` : ''}
      margin: 0 0 16px 0;
    "
    class="dark-card ${className}"
  >
    ${headerHtml}
    <tr>
      <td style="padding: ${header ? '16px' : paddingSize} ${paddingSize} ${footer ? '16px' : paddingSize} ${paddingSize};">
        ${children}
      </td>
    </tr>
    ${footerHtml}
  </table>`
}

/**
 * Generate a card with an icon header
 */
export function EmailCardWithIcon(props: {
  children: string
  icon: string
  title: string
  iconColor?: string
  variant?: 'default' | 'outlined' | 'filled'
}): string {
  const { children, icon, title, iconColor = COLORS.primary, variant = 'default' } = props

  const header = `<table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="width: 40px; height: 40px; background-color: ${iconColor}20; border-radius: 8px; text-align: center; vertical-align: middle;">
        <span style="font-size: 20px;">${icon}</span>
      </td>
      <td style="padding-left: 12px;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: ${COLORS.text};" class="dark-text">${title}</h3>
      </td>
    </tr>
  </table>`

  return EmailCard({ children, variant, header })
}

/**
 * Generate an info card with colored left border
 */
export function EmailInfoCard(props: {
  children: string
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
}): string {
  const { children, type = 'info', title } = props

  const typeColors = {
    info: COLORS.info,
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
  }

  const typeIcons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  }

  const color = typeColors[type]
  const icon = typeIcons[type]

  const titleHtml = title
    ? `<p style="margin: 0 0 8px 0; font-weight: 600; color: ${color};">${icon} ${title}</p>`
    : ''

  return `<table 
    role="presentation" 
    cellpadding="0" 
    cellspacing="0" 
    border="0" 
    width="100%" 
    style="
      background-color: ${COLORS.card};
      border-left: 4px solid ${color};
      border-radius: 0 8px 8px 0;
      margin: 0 0 16px 0;
    "
    class="dark-card"
  >
    <tr>
      <td style="padding: 16px 20px;">
        ${titleHtml}
        <div style="color: ${COLORS.textLight}; font-size: 14px; line-height: 1.6;" class="dark-text-secondary">
          ${children}
        </div>
      </td>
    </tr>
  </table>`
}

/**
 * Generate a list of items in a card format
 */
export function EmailCardList(props: {
  items: Array<{ label: string; value: string; highlight?: boolean }>
  variant?: 'default' | 'outlined' | 'filled'
}): string {
  const { items, variant = 'default' } = props

  const style = CARD_STYLES[variant]

  const rows = items.map((item, index) => `
    <tr>
      <td style="
        padding: 12px 0;
        border-bottom: ${index < items.length - 1 ? `1px solid ${COLORS.border}` : 'none'};
      " class="dark-border">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="font-size: 14px; color: ${COLORS.textMuted};" class="dark-text-muted">
              ${item.label}
            </td>
            <td style="text-align: right; font-size: 14px; font-weight: ${item.highlight ? '600' : '400'}; color: ${item.highlight ? COLORS.text : COLORS.textLight};" class="dark-text dark-text-secondary">
              ${item.value}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('')

  return `<table 
    role="presentation" 
    cellpadding="0" 
    cellspacing="0" 
    border="0" 
    width="100%" 
    style="
      background-color: ${style.backgroundColor};
      ${style.border !== 'none' ? `border: ${style.border};` : ''}
      border-radius: 8px;
      margin: 0 0 16px 0;
    "
    class="dark-card"
  >
    <tr>
      <td style="padding: 16px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${rows}
        </table>
      </td>
    </tr>
  </table>`
}
