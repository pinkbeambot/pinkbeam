import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all tables with simple query
    const tablesResult = await prisma.$queryRaw`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `
    
    const tables = (tablesResult as any[]).map(t => t.tablename)

    // Get row counts for our tables
    const counts: Record<string, number> = {}
    
    try { counts.users = await prisma.user.count() } catch {}
    try { counts.projects = await prisma.project.count() } catch {}
    try { counts.quotes = await prisma.quote.count() } catch {}
    try { counts.invoices = await prisma.invoice.count() } catch {}
    try { counts.supportTickets = await prisma.supportTicket.count() } catch {}
    try { counts.blogPosts = await prisma.blogPost.count() } catch {}
    try { counts.activityLogs = await prisma.activityLog.count() } catch {}

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      tables,
      rowCounts: counts,
      message: 'Database audit complete'
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to audit database',
      details: (error as Error).message
    }, { status: 500 })
  }
}
