import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Dashboard routes that require authentication
const protectedDashboardRoutes = [
  '/agents/dashboard',
  '/web/dashboard',
  '/labs/dashboard',
  '/solutions/dashboard',
  '/dashboard/platform',
]

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  // Check if current path is a protected dashboard route
  const isProtectedRoute = protectedDashboardRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Protected routes - redirect to sign-in if not authenticated
  if (isProtectedRoute && !user) {
    return Response.redirect(new URL('/sign-in', request.url))
  }

  // Auth pages - redirect to dashboard if already authenticated
  if (
    (request.nextUrl.pathname === '/sign-in' || 
     request.nextUrl.pathname === '/sign-up') && 
    user
  ) {
    return Response.redirect(new URL('/dashboard', request.url))
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
