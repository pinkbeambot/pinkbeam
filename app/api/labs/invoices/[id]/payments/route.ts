import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { sendInvoiceReceipt } from '@/lib/email'
import { formatCurrency, formatDate } from '@/lib/utils'

// GET /api/labs/invoices/[id]/payments - Get payments for an invoice
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const payments = await prisma.payment.findMany({
      where: { invoiceId: id },
      orderBy: { paidAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: payments })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// POST /api/labs/invoices/[id]/payments - Record a payment
const createPaymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  method: z.enum(['cash', 'check', 'transfer', 'credit_card', 'other']),
  reference: z.string().optional(),
  notes: z.string().optional(),
  paidAt: z.string().datetime().optional(),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = createPaymentSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        },
        payments: true,
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Calculate new totals
    const paymentAmount = result.data.amount
    const currentPaid = invoice.amountPaid.toNumber()
    const newPaid = currentPaid + paymentAmount
    const total = invoice.total.toNumber()
    const newDue = Math.max(0, total - newPaid)

    // Determine new status
    let newStatus = invoice.status
    if (newDue <= 0) {
      newStatus = 'PAID'
    } else if (newPaid > 0) {
      newStatus = 'PARTIAL'
    }

    // Get current user (in production, this would come from auth session)
    const recordedById = invoice.clientId // Temporary - should be the actual logged-in user

    const { payment, updatedInvoice } = await prisma.$transaction(async (tx) => {
      // Create payment
      const payment = await tx.payment.create({
        data: {
          invoiceId: id,
          amount: new Prisma.Decimal(paymentAmount),
          method: result.data.method,
          reference: result.data.reference || null,
          notes: result.data.notes || null,
          paidAt: result.data.paidAt ? new Date(result.data.paidAt) : new Date(),
          recordedById,
        }
      })

      // Update invoice
      const updatedInvoice = await tx.invoice.update({
        where: { id },
        data: {
          amountPaid: new Prisma.Decimal(newPaid),
          amountDue: new Prisma.Decimal(newDue),
          status: newStatus,
          paidAt: newDue <= 0 ? new Date() : invoice.paidAt,
        },
        include: {
          client: {
            select: { id: true, name: true, email: true }
          },
          payments: {
            orderBy: { paidAt: 'desc' }
          },
        }
      })

      return { payment, updatedInvoice }
    })

    // Send receipt email if invoice is now paid
    if (newStatus === 'PAID') {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const invoiceUrl = `${baseUrl}/portal/invoices/${id}`

      try {
        await sendInvoiceReceipt({
          invoiceNumber: invoice.invoiceNumber,
          clientName: invoice.client.name || invoice.client.email,
          clientEmail: invoice.client.email,
          amount: formatCurrency(invoice.total.toNumber()),
          status: 'paid',
          paymentDate: formatDate(new Date()),
          invoiceUrl,
        })
      } catch (emailError) {
        // Log email failure but don't fail the request
        console.error('[email-error] Invoice receipt failed:', {
          invoiceId: id,
          invoiceNumber: invoice.invoiceNumber,
          recipient: invoice.client.email,
          error: emailError instanceof Error ? emailError.message : String(emailError),
          timestamp: new Date().toISOString(),
        })

        // Create activity log for email failure
        await prisma.activityLog.create({
          data: {
            action: 'email_failed',
            entityType: 'Invoice',
            entityId: id,
            userId: invoice.clientId,
            metadata: {
              emailType: 'invoice_receipt',
              recipient: invoice.client.email,
              error: emailError instanceof Error ? emailError.message : String(emailError),
            },
          },
        }).catch((logErr) => console.error('[activitylog] Failed to log email error:', logErr))
      }
    }

    return NextResponse.json({
      success: true,
      data: { payment, invoice: updatedInvoice }
    }, { status: 201 })
  } catch (error) {
    console.error('Error recording payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record payment' },
      { status: 500 }
    )
  }
}
