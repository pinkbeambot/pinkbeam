/**
 * Email Testing API
 * 
 * Endpoints:
 * - POST /api/test/email/preview — Generate preview HTML for a template
 * - POST /api/test/email/send — Send a test email to the admin
 * - GET /api/test/email/logs — View recent email logs (optional)
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

/**
 * POST /api/test/email/preview
 * Generate preview HTML for a template with test data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, template, testData, action = 'preview' } = body

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
    
    if (category === 'quotes') {
      if (template === 'status-update') {
        result = templateFn(testData, testData.status || 'QUALIFIED')
      } else if (template === 'follow-up-day-1' || template === 'follow-up-day-3' || template === 'follow-up-day-7') {
        result = templateFn(testData)
      } else {
        result = templateFn(testData)
      }
    } else if (category === 'tickets') {
      if (template === 'ticket-status-update') {
        result = templateFn(testData, testData.status || 'IN_PROGRESS')
      } else if (template === 'ticket-comment') {
        result = templateFn(testData, testData.commentBody || 'Test comment', testData.authorName || 'Support Team')
      } else {
        result = templateFn(testData)
      }
    } else {
      result = templateFn(testData)
    }

    // If action is 'send', actually send the email
    if (action === 'send') {
      const apiKey = process.env.RESEND_API_KEY
      const testEmail = process.env.TEST_EMAIL || process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai'
      
      if (!apiKey) {
        return NextResponse.json(
          { success: false, error: 'RESEND_API_KEY not configured' },
          { status: 500 }
        )
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Pink Beam <notifications@pinkbeam.ai>',
          to: testEmail,
          subject: `[TEST] ${result.subject}`,
          html: result.html,
          text: result.text,
          tags: [
            { name: 'type', value: 'test-email' },
            { name: 'template', value: `${category}/${template}` },
          ],
        }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        return NextResponse.json(
          { success: false, error: `Failed to send email: ${errorText}` },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          sent: true,
          to: testEmail,
          subject: result.subject,
        },
      })
    }

    // Return preview data
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
      { success: false, error: 'Failed to generate preview' },
      { status: 500 }
    )
  }
}
