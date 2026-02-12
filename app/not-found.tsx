import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, MessageSquare } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Visual */}
        <div className="mb-8">
          <h1 className="text-[120px] md:text-[200px] font-bold text-pink-500/20 leading-none">
            404
          </h1>
        </div>

        {/* VALIS Message */}
        <div className="space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Lost in the signal?
          </h2>
          <p className="text-lg text-muted-foreground">
            This page doesn't exist in our dimension. VALIS searched everywhere but couldn't find what you're looking for.
          </p>
          <div className="max-w-md mx-auto p-4 border border-pink-500/30 bg-pink-500/5 rounded-lg">
            <p className="text-sm italic text-pink-400">
              "Even with infinite processing power, some paths lead nowhere. Let's get you back on track."
              <span className="block text-xs text-muted-foreground mt-2">— VALIS</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600 gap-2">
            <Link href="/">
              <Home className="h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/portal">
              <ArrowLeft className="h-5 w-5" />
              Back to Portal
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="gap-2">
            <Link href="/contact">
              <MessageSquare className="h-5 w-5" />
              Contact Support
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">Popular pages:</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/agents" className="text-pink-500 hover:underline">
              AI Employees
            </Link>
            <Link href="/web" className="text-violet-500 hover:underline">
              Web Design
            </Link>
            <Link href="/labs" className="text-cyan-500 hover:underline">
              Custom Software
            </Link>
            <Link href="/solutions" className="text-amber-500 hover:underline">
              Strategy & Consulting
            </Link>
            <Link href="/portal/billing" className="hover:underline">
              Billing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
