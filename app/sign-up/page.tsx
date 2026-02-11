'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFieldErrors, signUpSchema } from '@/lib/validation'
import { useAnalyticsSafe } from '@/components/analytics'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const { trackFormSubmission } = useAnalyticsSafe()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setFieldErrors({})
    setLoading(true)

    const supabase = createClient()

    const validation = signUpSchema.safeParse({ email, password })
    if (!validation.success) {
      setFieldErrors(getFieldErrors(validation.error))
      setLoading(false)
      if (trackFormSubmission) {
        trackFormSubmission('sign_up', false, { reason: 'validation_error' })
      }
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: validation.data.email,
      password: validation.data.password,
      options: {
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    })

    if (error) {
      console.error('Sign up error:', error)
      setError(error.message)
      setLoading(false)
      if (trackFormSubmission) {
        trackFormSubmission('sign_up', false, { reason: error.message })
      }
    } else if (data.session) {
      // Email confirmation is disabled, user is immediately logged in
      console.log('Sign up successful, session:', data.session)
      if (trackFormSubmission) {
        trackFormSubmission('sign_up', true, { immediate_login: true })
      }
      router.push('/agents/dashboard')
      router.refresh()
    } else {
      console.log('Sign up successful, no session (email confirmation enabled?)', data)
      if (trackFormSubmission) {
        trackFormSubmission('sign_up', true, { email_confirmation_required: true })
      }
      setMessage('Check your email for the confirmation link!')
      setLoading(false)
    }
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <CardDescription>
            Enter your email and password to get started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
            {message && (
              <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                {message}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => {
                      const next = { ...prev }
                      delete next.email
                      return next
                    })
                  }
                }}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                className={cn(fieldErrors.email && 'border-destructive focus-visible:ring-destructive/30')}
                required
              />
              {fieldErrors.email && (
                <p id="email-error" className="text-xs text-destructive">
                  {fieldErrors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => {
                      const next = { ...prev }
                      delete next.password
                      return next
                    })
                  }
                }}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                className={cn(fieldErrors.password && 'border-destructive focus-visible:ring-destructive/30')}
                required
                minLength={6}
              />
              {fieldErrors.password && (
                <p id="password-error" className="text-xs text-destructive">
                  {fieldErrors.password}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-primary underline underline-offset-2 hover:opacity-80">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
