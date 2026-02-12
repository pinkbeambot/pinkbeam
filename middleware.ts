import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Global rate limit: 120 requests per minute
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 120

// Stricter rate limit for sensitive endpoints: 10 requests per minute
const SENSITIVE_RATE_LIMIT_MAX = 10
const SENSITIVE_ENDPOINTS = [
  '/api/user/delete',
  '/api/agents/purchase',
  '/api/quotes',
  '/api/labs/quotes',
]

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()
const sensitiveRateLimitStore = new Map<string, { count: number; resetAt: number }>()
let lastRateLimitCleanup = 0

// Dashboard routes that require authentication
const protectedDashboardRoutes = [
  '/portal',
]

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  const realIp = request.headers.get('x-real-ip') ?? request.headers.get('cf-connecting-ip')
  return realIp ?? 'unknown'
}

function cleanupRateLimitStore(now: number) {
  if (now - lastRateLimitCleanup < RATE_LIMIT_WINDOW_MS) return
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) rateLimitStore.delete(key)
  }
  lastRateLimitCleanup = now
}

function checkRateLimit(ip: string, isSensitive = false) {
  const now = Date.now()
  cleanupRateLimitStore(now)

  const store = isSensitive ? sensitiveRateLimitStore : rateLimitStore
  const max = isSensitive ? SENSITIVE_RATE_LIMIT_MAX : RATE_LIMIT_MAX

  const existing = store.get(ip)
  if (!existing || existing.resetAt <= now) {
    const entry = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS }
    store.set(ip, entry)
    return { allowed: true, remaining: max - 1, resetAt: entry.resetAt }
  }
  existing.count += 1
  store.set(ip, existing)
  return {
    allowed: existing.count <= max,
    remaining: Math.max(0, max - existing.count),
    resetAt: existing.resetAt,
  }
}

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user: supabaseUser } = await updateSession(request)
  const isE2E = process.env.E2E_TEST === 'true'
  const e2eCookie = request.cookies.get('pb-e2e-auth')?.value
  const user = supabaseUser ?? (isE2E && e2eCookie === '1' ? { id: 'e2e-user' } : null)
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')

  // Check if current path is a protected dashboard route
  const isProtectedRoute = protectedDashboardRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Protected routes - redirect to sign-in if not authenticated
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/sign-in', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return Response.redirect(redirectUrl)
  }

  // Auth pages - redirect to dashboard if already authenticated
  if (
    (request.nextUrl.pathname === '/sign-in' || 
     request.nextUrl.pathname === '/sign-up') && 
    user
  ) {
    return Response.redirect(new URL('/portal', request.url))
  }

  // Add user ID to headers for API routes
  if (isApiRoute && user) {
    supabaseResponse.headers.set('x-user-id', user.id)
  }

  // Apply rate limiting to API routes (in all environments except E2E tests)
  if (isApiRoute && !isE2E) {
    const ip = getClientIp(request)

    // Check if this is a sensitive endpoint that needs stricter limits
    const isSensitive = SENSITIVE_ENDPOINTS.some(endpoint =>
      request.nextUrl.pathname.startsWith(endpoint)
    )

    const rateLimit = checkRateLimit(ip, isSensitive)
    const maxLimit = isSensitive ? SENSITIVE_RATE_LIMIT_MAX : RATE_LIMIT_MAX

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: isSensitive
            ? 'Too many requests to sensitive endpoint. Please try again later.'
            : 'Rate limit exceeded. Please try again later.'
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': String(maxLimit),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': Math.ceil(rateLimit.resetAt / 1000).toString(),
          },
        }
      )
    }

    supabaseResponse.headers.set('X-RateLimit-Limit', String(maxLimit))
    supabaseResponse.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining))
    supabaseResponse.headers.set('X-RateLimit-Reset', Math.ceil(rateLimit.resetAt / 1000).toString())
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
