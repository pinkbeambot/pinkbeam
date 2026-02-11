/**
 * User Authentication Email Templates
 * 
 * Templates for welcome, password reset, and account verification
 */

import {
  EmailLayout,
  EmailHeader,
  EmailHeaderCompact,
  EmailFooter,
  EmailFooterMinimal,
  EmailButton,
  EmailCard,
  EmailInfoCard,
  EmailDivider,
  COLORS,
} from './components'

import {
  type UserVariables,
  type PasswordResetVariables,
  type VerificationVariables,
  getFirstName,
} from './variables'

// ============================================================================
// Welcome Email Templates
// ============================================================================

export function welcomeTemplate(data: UserVariables & { loginUrl: string }): { subject: string; html: string; text: string } {
  const firstName = getFirstName(data.fullName)

  const content = `
    ${EmailHeader({ title: 'Welcome to Pink Beam!', subtitle: 'Your account is ready to go' })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 20px; margin: 0 0 16px 0;">👋</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            We're excited to have you here! Your Pink Beam account is ready, and you can start exploring services or jump straight into your dashboard.
          </p>
          ${EmailCard({
            children: `<p style="margin: 0 0 12px 0; font-weight: 600; color: ${COLORS.primary};">What you can do:</p><ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: ${COLORS.textLight};"><li>Request a quote for your project</li><li>Track project progress</li><li>Submit support tickets</li><li>Access your client portal</li></ul>`,
            variant: 'filled',
          })}
          ${EmailButton({ text: 'Go to your dashboard', url: data.loginUrl, fullWidth: true })}
          <p style="font-size: 15px; line-height: 1.6; margin: 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            If you have any questions, just reply to this email — we're happy to help.
          </p>
          <p style="font-size: 15px; color: ${COLORS.textLight}; margin: 16px 0 0 0;" class="dark-text-secondary">— The Pink Beam Team</p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: `Welcome to Pink Beam, ${firstName}!`,
  })

  const text = `Welcome to Pink Beam!

Hi ${firstName},

We're excited to have you here! Your Pink Beam account is ready, and you can start exploring services or jump straight into your dashboard.

What you can do:
- Request a quote for your project
- Track project progress
- Submit support tickets
- Access your client portal

Go to your dashboard: ${data.loginUrl}

If you have any questions, just reply to this email — we're happy to help.

— The Pink Beam Team`

  return {
    subject: 'Welcome to Pink Beam!',
    html,
    text,
  }
}

export function onboardingWelcomeTemplate(data: UserVariables & { portalUrl: string }): { subject: string; html: string; text: string } {
  const firstName = getFirstName(data.fullName)

  const content = `
    ${EmailHeader({ title: 'Welcome to Pink Beam!', subtitle: 'Your client portal is ready' })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 20px; margin: 0 0 16px 0;">🎉</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            Welcome to the Pink Beam family! We're excited to work with you and help bring your project to life.
          </p>
          ${EmailCard({
            children: `<p style="margin: 0 0 12px 0; font-weight: 600; color: ${COLORS.primary};">What you can do in your portal:</p><ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: ${COLORS.textLight};"><li>Track project progress in real-time</li><li>View and pay invoices</li><li>Upload files and share documents</li><li>Submit support tickets anytime</li><li>Communicate directly with your team</li></ul>`,
            variant: 'filled',
          })}
          ${EmailButton({ text: 'Go to Your Portal', url: data.portalUrl, fullWidth: true })}
          <p style="font-size: 15px; line-height: 1.6; margin: 24px 0 0 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            <strong style="color: ${COLORS.text};" class="dark-text">Next step:</strong> Complete your onboarding to help us understand your needs better.
          </p>
          <p style="font-size: 15px; color: ${COLORS.textLight}; margin: 16px 0 0 0;" class="dark-text-secondary">We're here to help you succeed!</p>
          <p style="font-size: 15px; color: ${COLORS.textLight}; margin: 16px 0 0 0;" class="dark-text-secondary">— The Pink Beam Team</p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: `Welcome to Pink Beam, ${firstName}! Your portal is ready.`,
  })

  const text = `Welcome to Pink Beam!

Hi ${firstName},

Welcome to the Pink Beam family! We're excited to work with you and help bring your project to life.

What you can do in your portal:
- Track project progress in real-time
- View and pay invoices
- Upload files and share documents
- Submit support tickets anytime
- Communicate directly with your team

Go to Your Portal: ${data.portalUrl}

Next step: Complete your onboarding to help us understand your needs better.

We're here to help you succeed!
— The Pink Beam Team`

  return {
    subject: 'Welcome to Pink Beam! Your portal is ready',
    html,
    text,
  }
}

// ============================================================================
// Password Reset Templates
// ============================================================================

export function passwordResetTemplate(data: PasswordResetVariables): { subject: string; html: string; text: string } {
  const firstName = data.fullName ? getFirstName(data.fullName) : 'there'
  const expiryNote = data.expiresInMinutes
    ? `<p style="font-size: 14px; color: ${COLORS.textMuted}; margin: 16px 0 0 0; text-align: center;" class="dark-text-muted">This link expires in ${data.expiresInMinutes} minutes.</p>`
    : ''

  const content = `
    ${EmailHeaderCompact({ title: 'Reset your password' })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 0 28px 28px 28px;">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            We received a request to reset your Pink Beam password. Use the button below to set a new password. If you didn't request this, you can safely ignore this email.
          </p>
          ${EmailButton({ text: 'Reset password', url: data.resetUrl, fullWidth: true })}
          ${expiryNote}
          ${EmailInfoCard({
            type: 'info',
            children: `Having trouble? Copy and paste this link into your browser:<br/><span style="word-break: break-all; font-size: 12px;">${data.resetUrl}</span>`,
          })}
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: 'Reset your Pink Beam password',
  })

  const text = `Reset your password

Hi ${firstName},

We received a request to reset your Pink Beam password. Use the link below to set a new password:

${data.resetUrl}

${data.expiresInMinutes ? `This link expires in ${data.expiresInMinutes} minutes.\n` : ''}If you didn't request this, you can safely ignore this email.

— The Pink Beam Team`

  return {
    subject: 'Reset your Pink Beam password',
    html,
    text,
  }
}

// ============================================================================
// Account Verification Templates
// ============================================================================

export function accountVerificationTemplate(data: VerificationVariables): { subject: string; html: string; text: string } {
  const firstName = getFirstName(data.fullName)
  const expiryNote = data.expiresInMinutes
    ? `<p style="font-size: 14px; color: ${COLORS.textMuted}; margin: 16px 0 0 0; text-align: center;" class="dark-text-muted">This link expires in ${Math.round(data.expiresInMinutes / 60)} hours.</p>`
    : ''

  const codeSection = data.code
    ? `${EmailCard({
        children: `<p style="margin: 0 0 8px 0; font-size: 14px; color: ${COLORS.textMuted}; text-align: center;" class="dark-text-muted">Or enter this verification code:</p><p style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 8px; text-align: center; color: ${COLORS.text}; font-family: monospace;" class="dark-text">${data.code}</p>`,
        variant: 'filled',
      })}`
    : ''

  const content = `
    ${EmailHeader({ title: 'Verify your email', subtitle: 'One step closer to getting started' })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 20px; margin: 0 0 16px 0;">✉️</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            Thanks for signing up! Please verify your email address to complete your registration and access your Pink Beam account.
          </p>
          ${EmailButton({ text: 'Verify email address', url: data.verificationUrl, fullWidth: true })}
          ${expiryNote}
          ${codeSection}
          <p style="font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; color: ${COLORS.textMuted};" class="dark-text-muted">
            If you didn't create an account with Pink Beam, you can safely ignore this email.
          </p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: 'Verify your email to complete registration',
  })

  const text = `Verify your email

Hi ${firstName},

Thanks for signing up! Please verify your email address to complete your registration:

${data.verificationUrl}

${data.expiresInMinutes ? `This link expires in ${Math.round(data.expiresInMinutes / 60)} hours.\n` : ''}${data.code ? `Or enter this verification code: ${data.code}\n` : ''}If you didn't create an account with Pink Beam, you can safely ignore this email.

— The Pink Beam Team`

  return {
    subject: 'Please verify your email address',
    html,
    text,
  }
}
