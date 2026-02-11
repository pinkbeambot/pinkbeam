/**
 * EmailLayout - Base HTML layout for all Pink Beam emails
 * 
 * Features:
 * - Mobile-responsive (600px max width)
 * - Dark mode support (@media prefers-color-scheme)
 * - Inline styles for maximum email client compatibility
 * - System fonts (Arial, Helvetica, sans-serif)
 * - Pink Beam branding colors
 */

// Brand colors
export const COLORS = {
  primary: '#FF006E',
  primaryLight: '#FF4D9E',
  dark: '#0A0A0F',
  darkSurface: '#1A1A24',
  text: '#1a1a1a',
  textLight: '#444444',
  textMuted: '#666666',
  textSubtle: '#999999',
  border: '#e5e5e5',
  borderDark: '#333333',
  white: '#ffffff',
  card: '#fafafa',
  cardDark: '#242430',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const

// Common inline styles
export const STYLES = {
  body: {
    margin: 0,
    padding: 0,
    width: '100%',
    backgroundColor: COLORS.white,
    fontFamily: 'Arial, Helvetica, sans-serif',
    WebkitFontSmoothing: 'antialiased',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: COLORS.white,
  },
  content: {
    padding: '20px',
    color: COLORS.text,
  },
  heading1: {
    fontSize: '22px',
    fontWeight: 600,
    margin: '0 0 8px 0',
    color: COLORS.white,
  },
  heading2: {
    fontSize: '18px',
    fontWeight: 600,
    margin: '0 0 12px 0',
    color: COLORS.text,
  },
  heading3: {
    fontSize: '16px',
    fontWeight: 600,
    margin: '0 0 8px 0',
    color: COLORS.text,
  },
  paragraph: {
    fontSize: '15px',
    lineHeight: 1.6,
    margin: '0 0 16px 0',
    color: COLORS.textLight,
  },
  textSmall: {
    fontSize: '14px',
    lineHeight: 1.6,
  },
  textMuted: {
    fontSize: '13px',
    color: COLORS.textMuted,
  },
} as const

export interface EmailLayoutProps {
  children: string
  previewText?: string
  footer?: string
  unsubscribeUrl?: string
  companyAddress?: string
}

/**
 * Generate the full HTML email layout
 */
export function EmailLayout(props: EmailLayoutProps): string {
  const { children, previewText, footer, unsubscribeUrl, companyAddress } = props

  const preview = previewText 
    ? `<div style="display: none; max-height: 0; overflow: hidden;">${previewText}</div>`
    : ''

  const footerContent = footer || ''
  const unsubscribe = unsubscribeUrl 
    ? `<p style="margin: 0;"><a href="${unsubscribeUrl}" style="color: ${COLORS.textSubtle}; text-decoration: underline;">Unsubscribe</a></p>`
    : ''
  const address = companyAddress 
    ? `<p style="margin: 8px 0 0 0; color: ${COLORS.textSubtle}; font-size: 11px;">${companyAddress}</p>`
    : ''

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Pink Beam</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 16px !important; }
      .header { padding: 24px 16px !important; }
      .button { width: 100% !important; display: block !important; text-align: center !important; }
    }
    @media (prefers-color-scheme: dark) {
      .dark-body { background-color: ${COLORS.dark} !important; }
      .dark-container { background-color: ${COLORS.darkSurface} !important; }
      .dark-text { color: ${COLORS.white} !important; }
      .dark-text-secondary { color: #cccccc !important; }
      .dark-text-muted { color: #999999 !important; }
      .dark-border { border-color: ${COLORS.borderDark} !important; }
      .dark-card { background-color: ${COLORS.cardDark} !important; }
    }
  </style>
</head>
<body class="dark-body" style="margin: 0; padding: 0; width: 100%; background-color: ${COLORS.white}; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased;">
  ${preview}
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container dark-container" style="max-width: 600px; width: 100%; background-color: ${COLORS.white}; border-radius: 12px; overflow: hidden;">
          <tr>
            <td class="content dark-container" style="padding: 0;">
              ${children}
            </td>
          </tr>
          <tr>
            <td style="padding: 24px; text-align: center; border-top: 1px solid ${COLORS.border};" class="dark-border">
              ${footerContent}
              <p style="color: ${COLORS.textSubtle}; font-size: 12px; margin: 12px 0 0 0;" class="dark-text-muted">
                Pink Beam — Web Design & Development
              </p>
              ${unsubscribe}
              ${address}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/**
 * Generate a simple layout without full HTML wrapper (for composition)
 */
export function EmailContent(props: { children: string }): string {
  return props.children
}
