import { describe, it, expect } from 'vitest'
import {
  adminNotificationTemplate,
  clientAutoResponseTemplate,
  followUpDay1Template,
  followUpDay3Template,
  followUpDay7Template,
  invoiceReceiptTemplate,
  newsletterTemplate,
  passwordResetTemplate,
  statusUpdateTemplate,
  welcomeTemplate,
} from '@/lib/email-templates'

const baseQuote = {
  id: 'quote-123',
  fullName: 'Jane Doe',
  email: 'jane@example.com',
  company: 'Acme Inc',
  projectType: 'ecommerce',
  services: ['design', 'development', 'seo'],
  budgetRange: '10k-25k',
  timeline: '1-3months',
  description: 'We need a full ecommerce storefront with custom checkout.',
  leadScore: 82,
  leadQuality: 'hot',
}

describe('adminNotificationTemplate', () => {
  it('returns a subject with the client name and company', () => {
    const { subject } = adminNotificationTemplate(baseQuote)

    expect(subject).toContain('Jane Doe')
    expect(subject).toContain('Acme Inc')
  })

  it('generates HTML containing all quote fields', () => {
    const { html } = adminNotificationTemplate(baseQuote)

    expect(html).toContain('Jane Doe')
    expect(html).toContain('jane@example.com')
    expect(html).toContain('Acme Inc')
    expect(html).toContain('ecommerce')
    expect(html).toContain('design')
    expect(html).toContain('development')
    expect(html).toContain('seo')
    expect(html).toContain('10k-25k')
    expect(html).toContain('1-3months')
    expect(html).toContain('full ecommerce storefront')
    expect(html).toContain('quote-123')
    expect(html).toContain('82')
  })
})

describe('clientAutoResponseTemplate', () => {
  it('uses the first name in the greeting', () => {
    const { html } = clientAutoResponseTemplate(baseQuote)

    expect(html).toContain('Hi Jane')
    // Should use first name only, not full name in the greeting
    expect(html).not.toContain('Hi Jane Doe')
  })

  it('includes "Pink Beam" in the subject', () => {
    const { subject } = clientAutoResponseTemplate(baseQuote)

    expect(subject).toContain('Pink Beam')
  })
})

describe('followUpDay1Template', () => {
  it('references the project type in the body', () => {
    const { html } = followUpDay1Template(baseQuote)

    expect(html).toContain('ecommerce')
  })
})

describe('followUpDay3Template', () => {
  it('contains tips / advice content', () => {
    const { html } = followUpDay3Template(baseQuote)

    expect(html).toContain('portfolio')
    expect(html).toContain('development process')
    expect(html).toContain('post-launch support')
    expect(html).toContain('SEO')
    expect(html).toContain('scalable technology')
  })
})

describe('followUpDay7Template', () => {
  it('mentions the company when provided', () => {
    const { html } = followUpDay7Template(baseQuote)

    expect(html).toContain('Acme Inc')
  })

  it('does not mention a company when company is null', () => {
    const { html } = followUpDay7Template({ ...baseQuote, company: null })

    expect(html).not.toContain('Acme Inc')
    // Should still contain the project type
    expect(html).toContain('ecommerce')
  })
})

describe('statusUpdateTemplate', () => {
  it('returns empty subject and html for an unknown status', () => {
    const result = statusUpdateTemplate(baseQuote, 'NONEXISTENT')

    expect(result.subject).toBe('')
    expect(result.html).toBe('')
  })

  const knownStatuses = ['CONTACTED', 'QUALIFIED', 'PROPOSAL', 'ACCEPTED', 'DECLINED'] as const

  for (const status of knownStatuses) {
    it(`returns content for the ${status} status`, () => {
      const result = statusUpdateTemplate(baseQuote, status)

      expect(result.subject).toBeTruthy()
      expect(result.subject.length).toBeGreaterThan(0)
      expect(result.html).toBeTruthy()
      expect(result.html.length).toBeGreaterThan(0)
      // All status emails should reference Pink Beam
      expect(result.subject).toContain('Pink Beam')
      // All status emails should greet the user
      expect(result.html).toContain('Hi Jane')
    })
  }
})

describe('welcomeTemplate', () => {
  it('greets the user and includes the login url', () => {
    const { subject, html } = welcomeTemplate({
      fullName: 'Jane Doe',
      loginUrl: 'https://pinkbeam.io/dashboard',
    })

    expect(subject).toContain('Welcome')
    expect(html).toContain('Hi Jane')
    expect(html).toContain('https://pinkbeam.io/dashboard')
  })
})

describe('passwordResetTemplate', () => {
  it('includes the reset link and expiry info when provided', () => {
    const { subject, html } = passwordResetTemplate({
      fullName: 'Jane Doe',
      resetUrl: 'https://pinkbeam.io/reset?token=abc',
      expiresInMinutes: 30,
    })

    expect(subject).toContain('Reset')
    expect(html).toContain('reset?token=abc')
    expect(html).toContain('30 minutes')
  })
})

describe('invoiceReceiptTemplate', () => {
  it('renders invoice details and status', () => {
    const { subject, html } = invoiceReceiptTemplate({
      invoiceNumber: 'INV-1001',
      clientName: 'Jane Doe',
      amount: '$1,200.00',
      status: 'due',
      dueDate: 'March 1, 2026',
      invoiceUrl: 'https://pinkbeam.io/invoices/INV-1001',
    })

    expect(subject).toContain('INV-1001')
    expect(html).toContain('$1,200.00')
    expect(html).toContain('March 1, 2026')
  })
})

describe('newsletterTemplate', () => {
  it('includes newsletter content and CTA when provided', () => {
    const { subject, html } = newsletterTemplate({
      title: 'February Updates',
      intro: 'Here is what is new at Pink Beam.',
      items: [
        {
          title: 'New onboarding flow',
          description: 'A faster start for new clients.',
          url: 'https://pinkbeam.io/blog/onboarding',
        },
      ],
      ctaText: 'Read the full update',
      ctaUrl: 'https://pinkbeam.io/blog',
    })

    expect(subject).toContain('February Updates')
    expect(html).toContain('New onboarding flow')
    expect(html).toContain('Read the full update')
  })
})
