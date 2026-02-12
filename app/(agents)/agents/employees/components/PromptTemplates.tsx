'use client'

import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { FadeIn } from '@/components/animations'
import { cn } from '@/lib/utils'

interface PromptTemplate {
  title: string
  description: string
  prompt: string
  category: string
}

interface PromptTemplatesProps {
  employeeName: string
  employeeMention: string
  templates: PromptTemplate[]
  colorClass?: string
}

export function PromptTemplates({
  employeeName,
  employeeMention,
  templates,
  colorClass = 'text-pink-500',
}: PromptTemplatesProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-h2 font-display font-bold mb-4">
            Prompt <span className="text-gradient-beam">Templates</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Copy-paste these proven prompts to get started with {employeeName}
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6">
          {templates.map((template, index) => (
            <FadeIn key={index} delay={index * 0.05}>
              <Card className="p-6 h-full hover:shadow-lg transition-shadow group">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn('text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full', `${colorClass.replace('text-', 'bg-')}/10 ${colorClass}`)}>
                        {template.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{template.title}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                </div>

                {/* Prompt */}
                <div className="relative">
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm mb-3 border border-border">
                    <code className="text-foreground whitespace-pre-wrap break-words">
                      {template.prompt}
                    </code>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(template.prompt, index)}
                    className={cn(
                      'absolute top-2 right-2 p-2 rounded-md transition-all',
                      'bg-background/80 backdrop-blur-sm border border-border',
                      'hover:bg-background hover:shadow-sm',
                      copiedIndex === index ? 'bg-green-500/10 border-green-500/30' : ''
                    )}
                    aria-label="Copy prompt"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    )}
                  </button>
                </div>

                {/* Usage Tip */}
                <p className="text-xs text-muted-foreground">
                  Open VALIS chat and paste this to delegate to {employeeName}
                </p>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* More Templates CTA */}
        <FadeIn delay={0.3} className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
            <span className="text-sm text-muted-foreground">
              Want more examples?
            </span>
            <a href="/help/ai-employees/prompt-templates" className={cn('text-sm font-medium hover:underline', colorClass)}>
              View full library →
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
