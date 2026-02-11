/**
 * Pink Beam Email Templates System
 * 
 * A comprehensive email template library with:
 * - Reusable components for consistent branding
 * - Type-safe variable definitions
 * - Mobile-responsive, dark mode compatible designs
 * - Plain text alternatives for all templates
 * 
 * @example
 * import { sendWelcomeEmail } from '@/lib/email-templates'
 * 
 * await sendWelcomeEmail({
 *   fullName: 'John Doe',
 *   email: 'john@example.com',
 *   loginUrl: 'https://pinkbeam.ai/login'
 * })
 */

// Re-export components
export * from './components'

// Re-export variables and types
export * from './variables'

// Re-export template functions
export * from './templates-quotes'
export * from './templates-tickets'
export * from './templates-auth'
export * from './templates-invoices'
export * from './templates-project'
export * from './templates-newsletter'

// Legacy compatibility - maintain exports from the old email-templates.ts
export {
  adminNotificationTemplate,
  clientAutoResponseTemplate,
  statusUpdateTemplate,
  followUpDay1Template,
  followUpDay3Template,
  followUpDay7Template,
} from './templates-quotes'

export {
  ticketCreatedTemplate,
  ticketAdminNotificationTemplate,
  ticketStatusUpdateTemplate,
  ticketCommentNotificationTemplate,
} from './templates-tickets'

export {
  welcomeTemplate,
  onboardingWelcomeTemplate,
  passwordResetTemplate,
  accountVerificationTemplate,
} from './templates-auth'

export {
  invoiceNotificationTemplate,
  invoiceReceiptTemplate,
  invoicePaidConfirmationTemplate,
} from './templates-invoices'

export {
  projectStatusUpdateTemplate,
  fileSharedNotificationTemplate,
  meetingReminderTemplate,
  meetingInvitationTemplate,
} from './templates-project'
