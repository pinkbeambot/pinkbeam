'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFieldErrors, resetPasswordSchema } from '@/lib/validation'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setLoading(true)

    const supabase = createClient()

    const validation = resetPasswordSchema.safeParse({ email })
    if (!validation.success) {
      setFieldErrors(getFieldErrors(validation.error))
      setLoading(false)
      return
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(validation.data.email, {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?next=/portal`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    
    setLoading(false)
  }

  if (success) {
    return (
      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12"
      >
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-muted-foreground mb-6">
              We&apos;ve sent you a password reset link. Click the link in the email to reset your password.
            </p>
            <Link href="/sign-in">
              <Button variant="outline" className="w-full">
                Back to sign in
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <h1 className="text-2xl font-bold">Reset password</h1>
          <CardDescription>
            Enter your email address and we&apos;ll send you a reset link
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send reset link'
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Remember your password?{' '}
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
