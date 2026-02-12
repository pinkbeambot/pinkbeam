'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home, MessageSquare } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console (and eventually to monitoring service)
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-2xl">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="mx-auto h-24 w-24 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
        </div>

        {/* VALIS Message */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Something went wrong
          </h1>
          <p className="text-lg text-muted-foreground">
            VALIS encountered an unexpected error while processing your request. Don't worry, we're working on it.
          </p>
          <div className="max-w-md mx-auto p-4 border border-pink-500/30 bg-pink-500/5 rounded-lg">
            <p className="text-sm italic text-pink-400">
              "Even the most advanced systems hit unexpected conditions. Let me help you recover."
              <span className="block text-xs text-muted-foreground mt-2">— VALIS</span>
            </p>
          </div>
        </div>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left bg-muted p-4 rounded-lg mb-8 max-w-lg mx-auto">
            <summary className="cursor-pointer font-medium mb-2 text-sm">
              Error details (development only)
            </summary>
            <div className="text-xs space-y-2">
              <p className="font-mono text-red-500">{error.message}</p>
              {error.digest && (
                <p className="text-muted-foreground">Error ID: {error.digest}</p>
              )}
              {error.stack && (
                <pre className="text-xs overflow-auto max-h-40 text-muted-foreground">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={reset}
            size="lg"
            className="bg-pink-500 hover:bg-pink-600 gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/">
              <Home className="h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="gap-2">
            <Link href="/contact">
              <MessageSquare className="h-5 w-5" />
              Contact Support
            </Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            If this error persists, please{' '}
            <Link href="/contact" className="text-pink-500 hover:underline">
              contact our support team
            </Link>
            {error.digest && ` with error ID: ${error.digest}`}
          </p>
        </div>
      </div>
    </div>
  )
}
