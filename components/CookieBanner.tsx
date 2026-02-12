'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const COOKIE_NAME = 'pb-cookie-consent'

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already set their preference
    const consent = localStorage.getItem(COOKIE_NAME)
    if (!consent) {
      // Delay showing banner slightly for better UX
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_NAME, 'all')
    setShowBanner(false)
    // Enable analytics here if needed
    if (typeof window !== 'undefined' && (window as any).plausible) {
      ;(window as any).plausible('cookieConsent', { props: { consent: 'all' } })
    }
  }

  const handleEssentialOnly = () => {
    localStorage.setItem(COOKIE_NAME, 'essential')
    setShowBanner(false)
    // Disable analytics
    if (typeof window !== 'undefined' && (window as any).plausible) {
      ;(window as any).plausible('cookieConsent', { props: { consent: 'essential' } })
    }
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background/95 backdrop-blur-sm border-t shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">We value your privacy</h3>
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your experience, analyze site traffic, and provide essential
              functionality. You can choose which cookies to accept.{' '}
              <Link href="/cookies" className="underline hover:text-foreground">
                Learn more
              </Link>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={handleEssentialOnly}
              className="w-full sm:w-auto"
            >
              Essential Only
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="w-full sm:w-auto"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
