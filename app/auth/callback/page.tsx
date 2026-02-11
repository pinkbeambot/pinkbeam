'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()
      
      // Check for auth code in URL
      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get('code')
      const next = searchParams.get('next') ?? '/agents/dashboard'

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          setError(error.message)
        } else {
          router.push(next)
          router.refresh()
        }
      } else {
        // No code in URL, check if already logged in
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          router.push('/agents/dashboard')
        } else {
          setError('No authentication code found')
        }
      }
    }

    handleCallback()
  }, [router])

  if (error) {
    return (
      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4"
      >
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h1 className="text-xl font-bold mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/sign-in">
            <Button>Try Again</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4"
    >
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-xl font-bold">Completing sign in...</h1>
        <p className="text-muted-foreground mt-2">Please wait while we verify your account.</p>
      </div>
    </main>
  )
}
