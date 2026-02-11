/**
 * EmailDivider - Section divider component for Pink Beam emails
 * 
 * Features:
 * - Horizontal lines
 * - Spacing utilities
 * - Optional text in the middle
 */

import { COLORS } from './EmailLayout'

export interface EmailDividerProps {
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  thickness?: number
  width?: 'full' | 'partial'
  text?: string
}

const SPACING_STYLES = {
  sm: { top: '16px', bottom: '16px' },
  md: { top: '24px', bottom: '24px' },
  lg: { top: '32px', bottom: '32px' },
  xl: { top: '48px', bottom: '48px' },
}

/**
 * Generate a horizontal divider
 */
export function EmailDivider(props: EmailDividerProps = {}): string {
  const {
    spacing = 'md',
    color = COLORS.border,
    thickness = 1,
    width = 'full',
  } = props

  const spacingStyle = SPACING_STYLES[spacing]
  const widthStyle = width === 'full' ? '100%' : '60%'

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td style="padding-top: ${spacingStyle.top}; padding-bottom: ${spacingStyle.bottom};">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${widthStyle}" align="center">
          <tr>
            <td style="border-top: ${thickness}px solid ${color}; font-size: 0; line-height: 0;" class="dark-border">
              &nbsp;
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
}

/**
 * Generate a divider with text in the center
 */
export function EmailDividerWithText(props: {
  text: string
  spacing?: 'sm' | 'md' | 'lg'
}): string {
  const { text, spacing = 'md' } = props
  const spacingStyle = SPACING_STYLES[spacing]

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td style="padding-top: ${spacingStyle.top}; padding-bottom: ${spacingStyle.bottom};">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td width="40%" style="border-top: 1px solid ${COLORS.border}; font-size: 0; line-height: 0;" class="dark-border">
              &nbsp;
            </td>
            <td width="20%" style="text-align: center; vertical-align: middle;">
              <span style="font-size: 12px; color: ${COLORS.textMuted}; text-transform: uppercase; letter-spacing: 1px;" class="dark-text-muted">
                ${text}
              </span>
            </td>
            <td width="40%" style="border-top: 1px solid ${COLORS.border}; font-size: 0; line-height: 0;" class="dark-border">
              &nbsp;
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
}

/**
 * Generate vertical spacing (invisible spacer)
 */
export function EmailSpacer(props: { size?: 'sm' | 'md' | 'lg' | 'xl' } = {}): string {
  const { size = 'md' } = props
  const spacingStyle = SPACING_STYLES[size]

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td style="padding-top: ${spacingStyle.top};"></td>
    </tr>
  </table>`
}

/**
 * Generate a decorative divider with gradient
 */
export function EmailGradientDivider(props: { spacing?: 'sm' | 'md' | 'lg' } = {}): string {
  const { spacing = 'md' } = props
  const spacingStyle = SPACING_STYLES[spacing]

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td style="padding-top: ${spacingStyle.top}; padding-bottom: ${spacingStyle.bottom};">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td height="2" style="background: linear-gradient(90deg, transparent, ${COLORS.primary}, transparent); font-size: 0; line-height: 0;">
              &nbsp;
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
}

/**
 * Generate a dotted divider
 */
export function EmailDottedDivider(props: { spacing?: 'sm' | 'md' | 'lg' } = {}): string {
  const { spacing = 'md' } = props
  const spacingStyle = SPACING_STYLES[spacing]

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td style="padding-top: ${spacingStyle.top}; padding-bottom: ${spacingStyle.bottom}; text-align: center;">
        <span style="color: ${COLORS.textSubtle}; letter-spacing: 4px;">• • •</span>
      </td>
    </tr>
  </table>`
}
