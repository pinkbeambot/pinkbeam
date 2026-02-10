export interface TicketTemplate {
  id: string
  label: string
  title: string
  description: string
  category: string
  priority: string
}

export const ticketTemplates: TicketTemplate[] = [
  {
    id: 'website-bug',
    label: 'Website Bug',
    title: 'Bug: [page/feature name]',
    description: 'What happened:\n\nExpected behavior:\n\nSteps to reproduce:\n1. \n2. \n3. \n\nBrowser/device:',
    category: 'BUG',
    priority: 'HIGH',
  },
  {
    id: 'content-update',
    label: 'Content Update',
    title: 'Content update request',
    description: 'Page(s) to update:\n\nCurrent content:\n\nNew content:\n\nDeadline (if any):',
    category: 'GENERAL',
    priority: 'MEDIUM',
  },
  {
    id: 'feature-request',
    label: 'Feature Request',
    title: 'Feature request: [brief description]',
    description: 'What feature would you like?\n\nWhy is this important?\n\nAny examples or references?',
    category: 'FEATURE_REQUEST',
    priority: 'MEDIUM',
  },
  {
    id: 'billing-question',
    label: 'Billing Question',
    title: 'Billing inquiry',
    description: 'Invoice/payment reference (if applicable):\n\nQuestion or concern:',
    category: 'BILLING',
    priority: 'MEDIUM',
  },
  {
    id: 'site-down',
    label: 'Site Down / Urgent',
    title: 'URGENT: Site is down or not working',
    description: 'URL affected:\n\nError message (if any):\n\nWhen did the issue start?\n\nScreenshots or additional context:',
    category: 'TECHNICAL',
    priority: 'URGENT',
  },
  {
    id: 'seo-help',
    label: 'SEO / Performance',
    title: 'SEO or performance question',
    description: 'What page(s) are you concerned about?\n\nWhat issue are you noticing (slow load, poor rankings, etc.)?\n\nAny specific keywords or goals?',
    category: 'TECHNICAL',
    priority: 'LOW',
  },
]
