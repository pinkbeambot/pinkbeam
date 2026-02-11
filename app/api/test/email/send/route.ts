/**
 * Email Send Test API
 * 
 * POST /api/test/email/send
 * Send a test email to the configured admin email
 */

import { NextRequest, NextResponse } from 'next/server'
import * as templates from '@/lib/email-templates'

// Template mapping for lookup
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const templateRegistry: Record<string, Record<string, (...args: any[]) => { subject: string; html: string; text?: string }>> = {
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

    // Generate email content
    let result
    
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

    // Check for Resend API key
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'RESEND_API_KEY not configured',
          note: 'Email not sent - preview mode only'
        },
        { status: 200 }
      )
    }

    // Get test email recipient
    const testEmail = process.env.TEST_EMAIL || process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai'

    // Send test email via Resend
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
        template: `${category}/${template}`,
      },
    })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    )
  }
}
