import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  // Protected routes - redirect to sign-in if not authenticated
  // Agents dashboard
  if (request.nextUrl.pathname.startsWith('/agents/dashboard') && !user) {
    return Response.redirect(new URL('/sign-in', request.url))
  }
  
  // Future service dashboards (when built)
  // if (request.nextUrl.pathname.startsWith('/web/dashboard') && !user) {
  //   return Response.redirect(new URL('/sign-in', request.url))
  // }
  // if (request.nextUrl.pathname.startsWith('/labs/dashboard') && !user) {
  //   return Response.redirect(new URL('/sign-in', request.url))
  // }
  // if (request.nextUrl.pathname.startsWith('/solutions/dashboard') && !user) {
  //   return Response.redirect(new URL('/sign-in', request.url))
  // }

  // Auth pages - redirect to dashboard if already authenticated
  // Default to agents dashboard for now
  if (
    (request.nextUrl.pathname === '/sign-in' || 
     request.nextUrl.pathname === '/sign-up') && 
    user
  ) {
    return Response.redirect(new URL('/agents/dashboard', request.url))
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
