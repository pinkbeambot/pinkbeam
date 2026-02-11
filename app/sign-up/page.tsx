'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { Loader2, ArrowLeft, Sparkles, Zap, Code, Lightbulb } from 'lucide-react'
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
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 lg:p-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-display font-bold text-foreground hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
              Pink Beam
            </span>
          </Link>
        </div>

        {/* Form Container */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 flex items-center justify-center px-4 py-12"
        >
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-display font-bold tracking-tight">
                Create your account
              </h1>
              <p className="text-muted-foreground">
                Start building with AI-powered solutions today.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignUp} className="space-y-6">
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                  {error}
                </div>
              )}
              {message && (
                <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-900/30">
                  {message}
                </div>
              )}

              <div className="space-y-4">
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
                    className={cn(
                      'h-11',
                      fieldErrors.email && 'border-destructive focus-visible:ring-destructive/30'
                    )}
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
                    className={cn(
                      'h-11',
                      fieldErrors.password && 'border-destructive focus-visible:ring-destructive/30'
                    )}
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
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-pink-500 to-violet-500 hover:opacity-90 shadow-lg shadow-pink-500/25"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/sign-in"
                className="text-pink-500 hover:text-pink-400 underline underline-offset-2 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </main>
      </div>

      {/* Right Side - Branded Visual (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gradient-void overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-beam-glow opacity-30" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-pink-400">
                Join the AI Revolution
              </span>
            </div>

            <h2 className="text-4xl font-display font-bold text-white leading-tight">
              Start building<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">
                the future today.
              </span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-md">
              Get instant access to AI employees, custom development tools, and strategic
              consulting—all from one powerful platform.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
              <Zap className="w-4 h-4 text-pink-500" />
              <span className="text-sm text-foreground">AI Employees</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
              <Code className="w-4 h-4 text-violet-500" />
              <span className="text-sm text-foreground">Custom Software</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
              <Lightbulb className="w-4 h-4 text-cyan-500" />
              <span className="text-sm text-foreground">Strategic Consulting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
