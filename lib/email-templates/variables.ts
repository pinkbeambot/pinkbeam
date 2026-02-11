/**
 * Email Template Variables System
 * 
 * Provides:
 * - Type-safe variable definitions for all email templates
 * - Validation functions
 * - Default values
 * - Helper to populate templates
 */

import { z } from 'zod'

// ============================================================================
// Base Variable Schemas
// ============================================================================

export const UserVariablesSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().optional(),
  userId: z.string().optional(),
  company: z.string().optional().nullable(),
})

export const QuoteVariablesSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional().nullable(),
  projectType: z.string(),
  services: z.array(z.string()),
  budgetRange: z.string(),
  timeline: z.string(),
  description: z.string(),
  leadScore: z.number().optional(),
  leadQuality: z.enum(['hot', 'warm', 'cold']).optional().nullable(),
  status: z.string().optional(),
})

export const TicketVariablesSchema = z.object({
  id: z.string(),
  title: z.string(),
  clientName: z.string(),
  clientEmail: z.string().email(),
  status: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  category: z.string().optional(),
  commentBody: z.string().optional(),
  authorName: z.string().optional(),
})

export const InvoiceVariablesSchema = z.object({
  invoiceNumber: z.string(),
  clientName: z.string(),
  clientEmail: z.string().email(),
  amount: z.string(),
  status: z.enum(['paid', 'due', 'overdue', 'draft']).optional(),
  dueDate: z.string().optional(),
  paymentDate: z.string().optional(),
  invoiceUrl: z.string().url(),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    rate: z.string(),
    amount: z.string(),
  })).optional(),
})

export const ProjectVariablesSchema = z.object({
  projectId: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  clientEmail: z.string().email(),
  status: z.enum(['planning', 'in-progress', 'review', 'completed', 'on-hold']),
  progress: z.number().min(0).max(100).optional(),
  dueDate: z.string().optional(),
  milestoneName: z.string().optional(),
  milestoneDescription: z.string().optional(),
  projectUrl: z.string().url().optional(),
})

export const FileVariablesSchema = z.object({
  fileName: z.string(),
  fileSize: z.string(),
  fileType: z.string(),
  uploadedBy: z.string(),
  projectName: z.string().optional(),
  downloadUrl: z.string().url(),
  expiresAt: z.string().optional(),
})

export const MeetingVariablesSchema = z.object({
  meetingTitle: z.string(),
  meetingDate: z.string(),
  meetingTime: z.string(),
  meetingDuration: z.string(),
  meetingType: z.enum(['zoom', 'google-meet', 'in-person', 'phone']),
  joinUrl: z.string().url().optional(),
  location: z.string().optional(),
  agenda: z.string().optional(),
  attendees: z.array(z.object({
    name: z.string(),
    email: z.string().email(),
  })).optional(),
})

export const PasswordResetVariablesSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email(),
  resetUrl: z.string().url(),
  expiresInMinutes: z.number().default(60),
})

export const VerificationVariablesSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  verificationUrl: z.string().url(),
  expiresInMinutes: z.number().default(1440),
  code: z.string().optional(),
})

// ============================================================================
// Template Variable Types
// ============================================================================

export type UserVariables = z.infer<typeof UserVariablesSchema>
export type QuoteVariables = z.infer<typeof QuoteVariablesSchema>
export type TicketVariables = z.infer<typeof TicketVariablesSchema>
export type InvoiceVariables = z.infer<typeof InvoiceVariablesSchema>
export type ProjectVariables = z.infer<typeof ProjectVariablesSchema>
export type FileVariables = z.infer<typeof FileVariablesSchema>
export type MeetingVariables = z.infer<typeof MeetingVariablesSchema>
export type PasswordResetVariables = z.infer<typeof PasswordResetVariablesSchema>
export type VerificationVariables = z.infer<typeof VerificationVariablesSchema>

// ============================================================================
// Validation Functions
// ============================================================================

export function validateUserVariables(data: unknown): UserVariables {
  return UserVariablesSchema.parse(data)
}

export function validateQuoteVariables(data: unknown): QuoteVariables {
  return QuoteVariablesSchema.parse(data)
}

export function validateTicketVariables(data: unknown): TicketVariables {
  return TicketVariablesSchema.parse(data)
}

export function validateInvoiceVariables(data: unknown): InvoiceVariables {
  return InvoiceVariablesSchema.parse(data)
}

export function validateProjectVariables(data: unknown): ProjectVariables {
  return ProjectVariablesSchema.parse(data)
}

export function validateFileVariables(data: unknown): FileVariables {
  return FileVariablesSchema.parse(data)
}

export function validateMeetingVariables(data: unknown): MeetingVariables {
  return MeetingVariablesSchema.parse(data)
}

export function validatePasswordResetVariables(data: unknown): PasswordResetVariables {
  return PasswordResetVariablesSchema.parse(data)
}

export function validateVerificationVariables(data: unknown): VerificationVariables {
  return VerificationVariablesSchema.parse(data)
}

// Safe validation (returns null on error)
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULT_VARIABLES = {
  user: {
    fullName: 'John Doe',
    email: 'john@example.com',
    firstName: 'John',
    company: 'Acme Corp',
  } as UserVariables,
  
  quote: {
    id: 'quote-123',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    company: 'TechStart Inc',
    projectType: 'Website Redesign',
    services: ['Design', 'Development', 'SEO'],
    budgetRange: '$10,000 - $25,000',
    timeline: '2-3 months',
    description: 'Looking to redesign our company website with modern aesthetics and improved performance.',
    leadScore: 85,
    leadQuality: 'hot' as const,
    status: 'NEW',
  } as QuoteVariables,
  
  ticket: {
    id: 'ticket-456',
    title: 'Website not loading on mobile',
    clientName: 'Bob Johnson',
    clientEmail: 'bob@example.com',
    status: 'OPEN',
    priority: 'HIGH',
    category: 'Bug Report',
    commentBody: 'We\'ve identified the issue and are working on a fix.',
    authorName: 'Support Team',
  } as TicketVariables,
  
  invoice: {
    invoiceNumber: 'INV-2026-001',
    clientName: 'Alice Williams',
    clientEmail: 'alice@example.com',
    amount: '$5,500.00',
    status: 'due' as const,
    dueDate: '2026-03-15',
    invoiceUrl: 'https://pinkbeam.ai/invoices/INV-2026-001',
  } as InvoiceVariables,
  
  project: {
    projectId: 'proj-789',
    projectName: 'E-commerce Platform',
    clientName: 'Charlie Brown',
    clientEmail: 'charlie@example.com',
    status: 'in-progress' as const,
    progress: 65,
    dueDate: '2026-04-01',
    milestoneName: 'Design Review',
    milestoneDescription: 'Initial design mockups ready for review',
    projectUrl: 'https://pinkbeam.ai/projects/proj-789',
  } as ProjectVariables,
  
  file: {
    fileName: 'brand-assets-v2.zip',
    fileSize: '15.4 MB',
    fileType: 'application/zip',
    uploadedBy: 'Design Team',
    projectName: 'Brand Refresh',
    downloadUrl: 'https://pinkbeam.ai/files/download/abc123',
    expiresAt: '2026-03-01',
  } as FileVariables,
  
  meeting: {
    meetingTitle: 'Project Kickoff',
    meetingDate: 'Monday, February 15, 2026',
    meetingTime: '10:00 AM PST',
    meetingDuration: '30 minutes',
    meetingType: 'zoom' as const,
    joinUrl: 'https://zoom.us/j/1234567890',
    agenda: 'Discuss project goals, timeline, and next steps',
    attendees: [
      { name: 'Client Name', email: 'client@example.com' },
      { name: 'Project Manager', email: 'pm@pinkbeam.ai' },
    ],
  } as MeetingVariables,
  
  passwordReset: {
    fullName: 'John Doe',
    email: 'john@example.com',
    resetUrl: 'https://pinkbeam.ai/reset-password?token=abc123',
    expiresInMinutes: 60,
  } as PasswordResetVariables,
  
  verification: {
    fullName: 'John Doe',
    email: 'john@example.com',
    verificationUrl: 'https://pinkbeam.ai/verify?token=xyz789',
    expiresInMinutes: 1440,
    code: '123456',
  } as VerificationVariables,
} as const

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extract first name from full name
 */
export function getFirstName(fullName: string): string {
  return fullName.split(' ')[0] || fullName
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'long'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  if (format === 'relative') {
    const now = new Date()
    const diff = d.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    if (days < 0) return `${Math.abs(days)} days ago`
    return `In ${days} days`
  }
  
  return d.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

/**
 * Populate template variables with defaults
 */
export function populateTemplateVariables<T extends Record<string, unknown>>(
  data: Partial<T>,
  defaults: T
): T {
  return { ...defaults, ...data } as T
}

/**
 * Get test data for a template type
 */
export function getTestData<T extends keyof typeof DEFAULT_VARIABLES>(
  type: T,
  overrides?: Partial<(typeof DEFAULT_VARIABLES)[T]>
): (typeof DEFAULT_VARIABLES)[T] {
  return {
    ...DEFAULT_VARIABLES[type],
    ...overrides,
  }
}
