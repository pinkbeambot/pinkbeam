import { NextResponse } from 'next/server'

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    checks: {
      database: 'unknown' as string,
    },
  }

  // Test database connection if DATABASE_URL is set
  if (process.env.DATABASE_URL) {
    try {
      // Dynamic import to avoid build issues
      const { prisma } = await import('@/lib/prisma')
      await prisma.$queryRaw`SELECT 1`
      checks.checks.database = 'connected'
    } catch (error: unknown) {
      checks.checks.database = 'disconnected'
      checks.status = 'unhealthy'
      const message = error instanceof Error ? error.message : String(error)
      console.error('Database health check failed:', message)
    }
  } else {
    checks.checks.database = 'not_configured'
  }

  const statusCode = checks.status === 'healthy' ? 200 : 503

  return NextResponse.json(checks, { status: statusCode })
}
