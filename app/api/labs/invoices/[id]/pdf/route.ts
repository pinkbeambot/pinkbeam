import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'

// GET /api/labs/invoices/[id]/pdf - Generate PDF invoice
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true, phone: true }
        },
        project: {
          select: { id: true, title: true }
        },
        lineItems: {
          orderBy: { id: 'asc' }
        },
        payments: {
          orderBy: { paidAt: 'desc' }
        },
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Generate HTML for PDF
    const html = generateInvoiceHTML(invoice)

    // For now, return HTML. In production, you'd use Puppeteer or Playwright to convert to PDF
    // Return HTML with headers suggesting it should be treated as a download
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="Invoice-${invoice.invoiceNumber}.html"`,
      },
    })
  } catch (error) {
    console.error('Error generating invoice PDF:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate invoice PDF' },
      { status: 500 }
    )
  }
}

function generateInvoiceHTML(invoice: any): string {
  const companyInfo = {
    name: 'Pink Beam',
    address: '123 Innovation Drive, Tech City, TC 12345',
    email: 'billing@pinkbeam.ai',
    phone: '(555) 123-4567',
    website: 'www.pinkbeam.ai',
  }

  const clientAddress = [
    invoice.client.company,
    invoice.client.name,
    invoice.client.email,
    invoice.client.phone,
  ].filter(Boolean).join('<br>')

  const lineItemsHtml = invoice.lineItems.map((item: any, index: number) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">${index + 1}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">${item.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">${formatCurrency(item.total)}</td>
    </tr>
  `).join('')

  const paymentsHtml = invoice.payments?.length > 0 ? `
    <div style="margin-top: 30px;">
      <h3 style="font-size: 16px; margin-bottom: 12px; color: #333;">Payment History</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Date</th>
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Method</th>
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Reference</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.payments.map((payment: any) => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${formatDate(payment.paidAt)}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${payment.method}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${payment.reference || '-'}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: right;">${formatCurrency(payment.amount)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : ''

  const statusBadge = {
    DRAFT: { bg: '#9e9e9e', color: '#fff' },
    SENT: { bg: '#2196f3', color: '#fff' },
    VIEWED: { bg: '#9c27b0', color: '#fff' },
    PARTIAL: { bg: '#ff9800', color: '#fff' },
    PAID: { bg: '#4caf50', color: '#fff' },
    OVERDUE: { bg: '#f44336', color: '#fff' },
    CANCELLED: { bg: '#757575', color: '#fff' },
  }[invoice.status] || { bg: '#9e9e9e', color: '#fff' }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #fff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #FF006E;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #FF006E;
    }
    .invoice-title {
      font-size: 32px;
      font-weight: 300;
      color: #333;
      margin: 0;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: ${statusBadge.bg};
      color: ${statusBadge.color};
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .info-block h3 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      margin-bottom: 8px;
    }
    .info-block p {
      margin: 0;
      font-size: 14px;
      line-height: 1.8;
    }
    .details-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 40px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .detail-item h4 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      margin: 0 0 4px 0;
    }
    .detail-item p {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background: #f5f5f5;
      padding: 12px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #666;
      border-bottom: 2px solid #ddd;
    }
    .totals {
      margin-left: auto;
      width: 300px;
      margin-top: 20px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .totals-row.total {
      font-size: 18px;
      font-weight: bold;
      border-top: 2px solid #333;
      border-bottom: none;
      padding-top: 12px;
      margin-top: 8px;
    }
    .notes {
      margin-top: 40px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .notes h3 {
      font-size: 14px;
      margin-bottom: 8px;
    }
    .notes p {
      margin: 0;
      font-size: 13px;
      color: #666;
    }
    .terms {
      margin-top: 20px;
      font-size: 12px;
      color: #666;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Pink Beam</div>
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">
        ${companyInfo.address}<br>
        ${companyInfo.email} | ${companyInfo.phone}
      </p>
    </div>
    <div style="text-align: right;">
      <h1 class="invoice-title">INVOICE</h1>
      <span class="status-badge">${invoice.status}</span>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-block">
      <h3>Bill To</h3>
      <p>${clientAddress}</p>
    </div>
    <div class="info-block">
      <h3>Project</h3>
      <p>${invoice.project?.title || 'No project associated'}</p>
    </div>
  </div>

  <div class="details-grid">
    <div class="detail-item">
      <h4>Invoice Number</h4>
      <p>${invoice.invoiceNumber}</p>
    </div>
    <div class="detail-item">
      <h4>Issue Date</h4>
      <p>${formatDate(invoice.issueDate)}</p>
    </div>
    <div class="detail-item">
      <h4>Due Date</h4>
      <p>${formatDate(invoice.dueDate)}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50px;">#</th>
        <th>Description</th>
        <th style="width: 100px; text-align: center;">Qty</th>
        <th style="width: 120px; text-align: right;">Unit Price</th>
        <th style="width: 120px; text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${lineItemsHtml}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal</span>
      <span>${formatCurrency(invoice.subtotal)}</span>
    </div>
    ${invoice.taxAmount ? `
    <div class="totals-row">
      <span>Tax (${invoice.taxRate}%)</span>
      <span>${formatCurrency(invoice.taxAmount)}</span>
    </div>
    ` : ''}
    <div class="totals-row total">
      <span>Total</span>
      <span>${formatCurrency(invoice.total)}</span>
    </div>
    ${invoice.amountPaid > 0 ? `
    <div class="totals-row">
      <span>Amount Paid</span>
      <span>${formatCurrency(invoice.amountPaid)}</span>
    </div>
    <div class="totals-row total" style="color: ${invoice.amountDue > 0 ? '#f44336' : '#4caf50'};">
      <span>Amount Due</span>
      <span>${formatCurrency(invoice.amountDue)}</span>
    </div>
    ` : ''}
  </div>

  ${paymentsHtml}

  ${invoice.notes ? `
  <div class="notes">
    <h3>Notes</h3>
    <p>${invoice.notes}</p>
  </div>
  ` : ''}

  <div class="terms">
    <strong>Payment Terms:</strong> ${invoice.terms}
  </div>

  <div class="footer">
    <p>Thank you for your business!</p>
    <p style="margin-top: 8px;">${companyInfo.website}</p>
  </div>
</body>
</html>`
}
