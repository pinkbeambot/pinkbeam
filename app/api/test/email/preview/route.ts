/**
 * Email Preview API
 * 
 * POST /api/test/email/preview
 * Generate preview HTML for a template with test data
 */

import { NextRequest, NextResponse } from 'next/server'
import * as templates from '@/lib/email-templates'

// Type for email template functions
// Template functions have different parameter signatures per template
// Using any[] for params is intentional as we handle heterogeneous function types
type EmailTemplateResult = { subject: string; html: string; text?: string }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EmailTemplateFunction = (...args: any[]) => EmailTemplateResult

// Template mapping for lookup
const templateRegistry: Record<string, Record<string, EmailTemplateFunction>> = {
  quotes: {
    'admin-notification': templates.adminNotificationTemplate,
    'client-auto-response': templates.clientAutoResponseTemplate,
    'status-update': templates.statusUpdateTemplate,
    'follow-up-day-1': templates.followUpDay1Template,
    'follow-up-day-3': templates.followUpDay3Template,
    'follow-up-day-7': templates.followUpDay7Template,
  },
  tickets: {
    'ticket-created': templates.ticketCreatedTemplate,
    'ticket-admin-notification': templates.ticketAdminNotificationTemplate,
    'ticket-status-update': templates.ticketStatusUpdateTemplate,
    'ticket-comment': templates.ticketCommentNotificationTemplate,
  },
  auth: {
    welcome: templates.welcomeTemplate,
    'onboarding-welcome': templates.onboardingWelcomeTemplate,
    'password-reset': templates.passwordResetTemplate,
    'account-verification': templates.accountVerificationTemplate,
  },
  invoices: {
    'invoice-notification': templates.invoiceNotificationTemplate,
    'invoice-receipt': templates.invoiceReceiptTemplate,
  },
  projects: {
    'project-status-update': templates.projectStatusUpdateTemplate,
    'file-shared': templates.fileSharedNotificationTemplate,
  },
  meetings: {
    'meeting-reminder': templates.meetingReminderTemplate,
    'meeting-invitation': templates.meetingInvitationTemplate,
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, template, testData = {} } = body

    // Validate required fields
    if (!category || !template) {
      return NextResponse.json(
        { success: false, error: 'Category and template are required' },
        { status: 400 }
      )
    }

    // Get template function
    const templateFn = templateRegistry[category]?.[template]
    if (!templateFn) {
      return NextResponse.json(
        { success: false, error: `Template not found: ${category}/${template}` },
        { status: 404 }
      )
    }

    // Generate preview with test data
    let result
    
    // Handle templates that need additional parameters
    if (category === 'quotes' && template === 'status-update') {
      result = templateFn(testData, testData.status || 'QUALIFIED')
    } else if (category === 'tickets' && template === 'ticket-status-update') {
      result = templateFn(testData, testData.status || 'IN_PROGRESS')
    } else if (category === 'tickets' && template === 'ticket-comment') {
      result = templateFn(
        testData, 
        testData.commentBody || 'Test comment', 
        testData.authorName || 'Support Team'
      )
    } else {
      result = templateFn(testData)
    }

    return NextResponse.json({
      success: true,
      data: {
        subject: result.subject,
        html: result.html,
        text: result.text,
      },
    })
  } catch (error) {
    console.error('Email preview error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate preview' },
      { status: 500 }
    )
  }
}
