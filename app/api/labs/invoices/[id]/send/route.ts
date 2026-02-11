import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendInvoiceNotification } from '@/lib/email'
import { formatCurrency, formatDate } from '@/lib/utils'

// POST /api/labs/invoices/[id]/send - Send invoice to client
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true }
        },
        lineItems: true,
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Update invoice status to SENT and record sent date
    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      }
    })

    // Send email notification
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const invoiceUrl = `${baseUrl}/portal/invoices/${id}`

    await sendInvoiceNotification({
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.client.name || invoice.client.email,
      clientEmail: invoice.client.email,
      amount: formatCurrency(invoice.total),
      status: 'due',
      dueDate: formatDate(invoice.dueDate),
      invoiceUrl,
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Invoice sent successfully',
      data: updatedInvoice 
    })
  } catch (error) {
    console.error('Error sending invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send invoice' },
      { status: 500 }
    )
  }
}
