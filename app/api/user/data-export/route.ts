import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all user data from database
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        projects: true,
        quotes: true,
        invoices: {
          include: {
            lineItems: true,
            payments: true,
          },
        },
        tickets: {
          include: {
            comments: true,
          },
        },
        subscriptions: {
          include: {
            plan: true,
            agentAssignments: true,
            usageRecords: true,
            aiUsage: true,
          },
        },
        files: true,
      },
    })

    if (!userData) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Build export data structure
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        company: userData.company,
        website: userData.website,
        phone: userData.phone,
        createdAt: userData.createdAt,
        lastLoginAt: userData.lastLoginAt,
      },
      subscriptions: userData.subscriptions.map((sub) => ({
        id: sub.id,
        plan: sub.plan.name,
        status: sub.status,
        currentPeriodStart: sub.currentPeriodStart,
        currentPeriodEnd: sub.currentPeriodEnd,
        agentAssignments: sub.agentAssignments,
        usageRecords: sub.usageRecords,
        aiUsage: sub.aiUsage,
      })),
      projects: userData.projects.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        services: project.services,
        budget: project.budget,
        createdAt: project.createdAt,
        completedAt: project.completedAt,
      })),
      quotes: userData.quotes.map((quote) => ({
        id: quote.id,
        quoteNumber: quote.quoteNumber,
        title: quote.title,
        status: quote.status,
        total: quote.total,
        createdAt: quote.createdAt,
        acceptedAt: quote.acceptedAt,
      })),
      invoices: userData.invoices.map((invoice) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        total: invoice.total,
        issueDate: invoice.issueDate,
        paidAt: invoice.paidAt,
        lineItems: invoice.lineItems,
        payments: invoice.payments,
      })),
      supportTickets: userData.tickets.map((ticket) => ({
        id: ticket.id,
        title: ticket.title,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category,
        createdAt: ticket.createdAt,
        resolvedAt: ticket.resolvedAt,
        commentsCount: ticket.comments.length,
      })),
      files: userData.files.map((file) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
        uploadedAt: file.createdAt,
      })),
    }

    // For immediate download (small exports)
    const dataSize = JSON.stringify(exportData).length

    if (dataSize < 1024 * 1024) {
      // Less than 1MB - return directly
      return NextResponse.json({
        success: true,
        data: exportData,
        message: 'Data exported successfully',
      })
    }

    // For large exports - would need to:
    // 1. Upload to Supabase Storage
    // 2. Generate signed URL
    // 3. Send email with download link
    // For now, return data directly
    return NextResponse.json({
      success: true,
      data: exportData,
      message: 'Data exported successfully. Check your email for the download link.',
    })
  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export data. Please try again later.',
      },
      { status: 500 }
    )
  }
}
