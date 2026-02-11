import { createClient } from '@/lib/supabase/server'

export interface SessionUser {
  id: string
  email?: string
  name?: string
  role?: string
}

export interface Session {
  user: SessionUser | null
}

export async function getServerSession(): Promise<Session | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return { user: null }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        role: user.user_metadata?.role || 'CLIENT',
      }
    }
  } catch (error) {
    console.error('Error getting server session:', error)
    return { user: null }
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getServerSession()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session.user
}
