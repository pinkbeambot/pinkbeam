'use client'

import { type LucideIcon, ChevronDown } from 'lucide-react'
import { FadeIn } from '@/components/animations'
import { cn } from '@/lib/utils'

interface CompactHeroProps {
  icon: LucideIcon
  title: string
  highlightText?: string
  subtitle: string
  accentColor?: string
  showScrollIndicator?: boolean
  children?: React.ReactNode
}

/**
 * Compact Hero Component
 *
 * Used for sub-pages (pricing, services, employees, etc.)
 * Takes 35% of viewport height to show content above the fold
 *
 * @param icon - Lucide icon component
 * @param title - Main heading text (split by highlightText)
 * @param highlightText - Text to highlight with gradient (optional)
 * @param subtitle - Supporting text below heading
 * @param accentColor - Tailwind color for icon bg (default: pink-500)
 * @param showScrollIndicator - Show animated scroll indicator (default: false)
 * @param children - Additional content in hero (toggles, buttons, etc.)
 */
export function CompactHero({
  icon: Icon,
  title,
  highlightText,
  subtitle,
  accentColor = 'pink-500',
  showScrollIndicator = false,
  children,
}: CompactHeroProps) {
  // Extract color name from Tailwind class
  const colorName = accentColor.split('-')[0]

  return (
    <section className="relative h-[35vh] min-h-[400px] max-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-void">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-beam-glow opacity-20 pointer-events-none" />
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'w-[400px] h-[400px] md:w-[600px] md:h-[600px]',
          `bg-${colorName}-500/10 rounded-full blur-3xl pointer-events-none`
        )}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <FadeIn className="text-center max-w-3xl mx-auto">
          {/* Icon */}
          <div className={cn(
            'inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6',
            `bg-${colorName}-500/10`
          )}>
            <Icon className={cn('w-7 h-7', `text-${colorName}-500`)} />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-white tracking-tight">
            {highlightText ? (
              <>
                {title.split(highlightText)[0]}
                <span className="text-gradient-beam">{highlightText}</span>
                {title.split(highlightText)[1]}
              </>
            ) : (
              title
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>

          {/* Optional children (toggles, buttons, etc.) */}
          {children && <div className="mt-6">{children}</div>}
        </FadeIn>
      </div>

      {/* Optional Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ChevronDown className={cn('w-5 h-5 animate-bounce', `text-${colorName}-500`)} />
        </div>
      )}
    </section>
  )
}
