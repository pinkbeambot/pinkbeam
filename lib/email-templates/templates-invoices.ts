/**
 * Invoice & Payment Email Templates
 * 
 * Templates for invoice notifications and payment confirmations
 */

import {
  EmailLayout,
  EmailHeader,
  EmailHeaderCompact,
  EmailFooterMinimal,
  EmailButton,
  EmailCard,
  EmailCardList,
  EmailInfoCard,
  COLORS,
} from './components'

import {
  type InvoiceVariables,
  getFirstName,
} from './variables'

// ============================================================================
// Invoice Templates
// ============================================================================

export function invoiceNotificationTemplate(data: InvoiceVariables): { subject: string; html: string; text: string } {
  const firstName = getFirstName(data.clientName)
  const isOverdue = data.status === 'overdue'
  const isDue = data.status === 'due'
  
  const statusInfo: Record<string, { title: string; subtitle: string; emoji: string; color: string }> = {
    due: { title: 'Payment Due', subtitle: `Invoice ${data.invoiceNumber}`, emoji: '📄', color: COLORS.info },
    overdue: { title: 'Payment Overdue', subtitle: `Invoice ${data.invoiceNumber}`, emoji: '⚠️', color: COLORS.error },
    paid: { title: 'Payment Received', subtitle: `Invoice ${data.invoiceNumber}`, emoji: '✅', color: COLORS.success },
    draft: { title: 'Invoice Draft', subtitle: `Invoice ${data.invoiceNumber}`, emoji: '📝', color: COLORS.textMuted },
  }
  
  const status = data.status || 'due'
  const info = statusInfo[status] || statusInfo.due

  const content = `
    ${EmailHeader({ title: info.title, subtitle: info.subtitle })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 24px; margin: 0 0 16px 0;">${info.emoji}</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          ${isOverdue 
            ? `<p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.error};">Your invoice is now overdue. Please make payment as soon as possible to avoid any service interruptions.</p>`
            : `<p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">Here's your invoice summary. You can view the full details and make payment through the link below.</p>`
          }
          ${EmailCardList({
            items: [
              { label: 'Invoice Number', value: data.invoiceNumber, highlight: true },
              { label: 'Amount Due', value: data.amount, highlight: true },
              ...(data.dueDate ? [{ label: isOverdue ? 'Overdue Since' : 'Due Date', value: data.dueDate, highlight: false } as const] : []),
            ],
            variant: 'outlined',
          })}
          ${EmailButton({ text: isOverdue ? 'Pay Now' : 'View Invoice', url: data.invoiceUrl, fullWidth: true })}
          <p style="font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; color: ${COLORS.textMuted};" class="dark-text-muted">
            If you have questions about this invoice, reply to this email and we'll help right away.
          </p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: `${info.title} — Invoice ${data.invoiceNumber}`,
  })

  const text = `${info.title} — Invoice ${data.invoiceNumber}

Hi ${firstName},

${isOverdue 
  ? 'Your invoice is now overdue. Please make payment as soon as possible to avoid any service interruptions.'
  : "Here's your invoice summary. You can view the full details and make payment through the link below."
}

Invoice Number: ${data.invoiceNumber}
Amount Due: ${data.amount}
${data.dueDate ? `${isOverdue ? 'Overdue Since' : 'Due Date'}: ${data.dueDate}\n` : ''}
View/Pay Invoice: ${data.invoiceUrl}

If you have questions about this invoice, reply to this email and we'll help right away.

— The Pink Beam Team`

  return {
    subject: `${info.title} — Invoice ${data.invoiceNumber}`,
    html,
    text,
  }
}

export function invoiceReceiptTemplate(data: InvoiceVariables): { subject: string; html: string; text: string } {
  const firstName = getFirstName(data.clientName)

  const content = `
    ${EmailHeader({ title: 'Payment Received', subtitle: `Thank you, ${firstName}!` })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 28px; margin: 0 0 16px 0;">🎉</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            Thank you for your payment! We've received your payment for invoice <strong style="color: ${COLORS.text};" class="dark-text">${data.invoiceNumber}</strong>.
          </p>
          ${EmailInfoCard({
            type: 'success',
            title: 'Payment Confirmed',
            children: `Invoice ${data.invoiceNumber} has been paid in full.`,
          })}
          ${EmailCardList({
            items: [
              { label: 'Invoice Number', value: data.invoiceNumber },
              { label: 'Amount Paid', value: data.amount, highlight: true },
              { label: 'Payment Date', value: data.paymentDate || new Date().toLocaleDateString() },
            ],
            variant: 'filled',
          })}
          ${EmailButton({ text: 'View Receipt', url: data.invoiceUrl, variant: 'secondary' })}
          <p style="font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; color: ${COLORS.textMuted};" class="dark-text-muted">
            A PDF receipt is attached to this email for your records. If you have any questions, please don't hesitate to reach out.
          </p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: `Payment received — Invoice ${data.invoiceNumber}`,
  })

  const text = `Payment Received

Hi ${firstName},

Thank you for your payment! We've received your payment for invoice ${data.invoiceNumber}.

✅ Payment Confirmed
Invoice ${data.invoiceNumber} has been paid in full.

Invoice Number: ${data.invoiceNumber}
Amount Paid: ${data.amount}
Payment Date: ${data.paymentDate || new Date().toLocaleDateString()}

View Receipt: ${data.invoiceUrl}

A PDF receipt is attached to this email for your records. If you have any questions, please don't hesitate to reach out.

— The Pink Beam Team`

  return {
    subject: `Payment Received — Invoice ${data.invoiceNumber}`,
    html,
    text,
  }
}

export function invoicePaidConfirmationTemplate(data: InvoiceVariables): { subject: string; html: string; text: string } {
  return invoiceReceiptTemplate(data)
}
