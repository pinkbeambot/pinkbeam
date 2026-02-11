import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .email('Valid email is required')
  .max(254, 'Email is too long')

const nameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(100, 'Name is too long')

const companySchema = z
  .string()
  .trim()
  .max(120, 'Company name is too long')
  .optional()
  .or(z.literal(''))

const messageSchema = z
  .string()
  .trim()
  .min(10, 'Message must be at least 10 characters')
  .max(2000, 'Message is too long')

const optionalUrlSchema = z
  .string()
  .trim()
  .url('Enter a valid URL (include https://)')
  .max(200, 'URL is too long')
  .optional()
  .or(z.literal(''))

const optionalPhoneSchema = z
  .string()
  .trim()
  .max(30, 'Phone number is too long')
  .optional()
  .or(z.literal(''))

const pageCountSchema = z
  .string()
  .trim()
  .regex(/^\d*$/, 'Page count must be a number')
  .max(5, 'Page count is too long')
  .optional()
  .or(z.literal(''))

const enumField = <T extends readonly [string, ...string[]]>(
  values: T,
  message: string
) =>
  z
    .string()
    .min(1, message)
    .refine((value) => values.includes(value as T[number]), message)

const optionalEnumField = <T extends readonly [string, ...string[]]>(
  values: T,
  message: string
) =>
  z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (value) =>
        value === '' || value === undefined || values.includes(value as T[number]),
      message
    )

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const signUpSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const resetPasswordSchema = z.object({
  email: emailSchema,
})

export const newsletterSchema = z.object({
  email: emailSchema,
})

export const finalCtaSchema = z.object({
  email: emailSchema,
})

export const aboutContactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  company: companySchema,
  department: enumField(['general', 'sales', 'support'], 'Department is required'),
  message: messageSchema,
})

export const pricingContactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  company: companySchema,
  message: messageSchema,
})

const ticketTitleSchema = z
  .string()
  .trim()
  .min(1, 'Subject is required')
  .max(120, 'Subject is too long')

const ticketDescriptionSchema = z
  .string()
  .trim()
  .min(10, 'Please provide more details')
  .max(5000, 'Description is too long')

export const ticketClientSchema = z.object({
  title: ticketTitleSchema,
  description: ticketDescriptionSchema,
  priority: enumField(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], 'Priority is required'),
  category: enumField(
    ['GENERAL', 'BUG', 'FEATURE_REQUEST', 'BILLING', 'TECHNICAL'],
    'Category is required'
  ),
})

export const ticketCreateSchema = ticketClientSchema.extend({
  clientId: z.string().min(1, 'Client ID is required'),
  projectId: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional().default('MEDIUM'),
  category: z
    .enum(['GENERAL', 'BUG', 'FEATURE_REQUEST', 'BILLING', 'TECHNICAL'])
    .optional()
    .default('GENERAL'),
})

const commentBodySchema = z
  .string()
  .trim()
  .min(1, 'Comment is required')
  .max(2000, 'Comment is too long')

export const ticketCommentSchema = z.object({
  body: commentBodySchema,
})

export const ticketCommentCreateSchema = ticketCommentSchema.extend({
  authorId: z.string().min(1, 'Author ID is required'),
  isInternal: z.boolean().optional().default(false),
})

const projectTypes = ['new', 'redesign', 'migration', 'ecommerce', 'other'] as const
const serviceOptions = ['design', 'development', 'seo', 'maintenance'] as const
const cmsOptions = ['none', 'wordpress', 'custom', 'shopify', 'other'] as const
const budgetRanges = ['2k-5k', '5k-10k', '10k-25k', '25k+', 'unsure'] as const
const timelines = ['urgent', '1-3months', '3-6months', 'flexible'] as const
const referralSources = ['google', 'social', 'referral', 'other'] as const

const descriptionSchema = z
  .string()
  .trim()
  .min(10, 'Please provide more project details')
  .max(5000, 'Description is too long')

export const quoteStep1Schema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: optionalPhoneSchema,
  company: companySchema,
  website: optionalUrlSchema,
})

export const quoteStep2Schema = z.object({
  projectType: enumField(projectTypes, 'Project type is required'),
  services: z
    .array(enumField(serviceOptions, 'Invalid service selection'))
    .min(1, 'At least one service is required'),
  pageCount: pageCountSchema,
  needsEcommerce: z.boolean().optional().default(false),
  cmsPreference: optionalEnumField(cmsOptions, 'Select a valid CMS preference'),
  budgetRange: enumField(budgetRanges, 'Budget range is required'),
  timeline: enumField(timelines, 'Timeline is required'),
})

export const quoteStep3Schema = z.object({
  description: descriptionSchema,
  referralSource: optionalEnumField(referralSources, 'Select a valid referral source'),
  agreedToTerms: z
    .boolean()
    .refine((value) => value === true, 'You must agree to the terms'),
  marketingConsent: z.boolean().optional().default(false),
})

export const quoteSchema = quoteStep1Schema
  .merge(quoteStep2Schema)
  .merge(quoteStep3Schema)

export function getErrorMessages(error: z.ZodError): string[] {
  const { formErrors, fieldErrors } = error.flatten()
  const messages = [
    ...formErrors,
    ...Object.values(fieldErrors).flat().filter(Boolean),
  ] as string[]
  return Array.from(new Set(messages))
}

/**
 * Get field errors as a Record<string, string> for form error handling
 * Returns the first error message for each field
 */
export function getFieldErrors(error: z.ZodError): Record<string, string> {
  const { fieldErrors } = error.flatten()
  const errors: Record<string, string> = {}
  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (messages && messages.length > 0) {
      errors[field] = messages[0]
    }
  }
  return errors
}

const industries = ['technology', 'healthcare', 'finance', 'retail', 'education', 'manufacturing', 'real-estate', 'other'] as const
const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'] as const
const serviceTypes = ['design', 'development', 'seo', 'maintenance', 'consulting', 'hosting'] as const
const onboardingBudgetRanges = ['2k-5k', '5k-10k', '10k-25k', '25k-50k', '50k+'] as const
const timelineOptions = ['asap', '1-3-months', '3-6-months', '6-months-plus', 'flexible'] as const

export const onboardingProfileSchema = z.object({
  name: nameSchema,
  phone: optionalPhoneSchema,
  company: companySchema,
  website: optionalUrlSchema,
})

export const onboardingCompanySchema = z.object({
  industry: enumField(industries, 'Industry is required'),
  companySize: enumField(companySizes, 'Company size is required'),
  servicesNeeded: z
    .array(enumField(serviceTypes, 'Invalid service selection'))
    .min(1, 'At least one service is required'),
})

export const onboardingProjectSchema = z.object({
  projectName: z.string().trim().min(1, 'Project name is required').max(100, 'Project name is too long'),
  description: z.string().trim().min(10, 'Please provide a brief description').max(1000, 'Description is too long').optional().or(z.literal('')),
  budgetRange: enumField(onboardingBudgetRanges, 'Budget range is required'),
  timeline: enumField(timelineOptions, 'Timeline is required'),
})

export type OnboardingProfileInput = z.infer<typeof onboardingProfileSchema>
export type OnboardingCompanyInput = z.infer<typeof onboardingCompanySchema>
export type OnboardingProjectInput = z.infer<typeof onboardingProjectSchema>
