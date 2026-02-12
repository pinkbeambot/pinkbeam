/**
 * Pink Beam Product Catalog
 *
 * Single source of truth for all products, features, limits, and pricing.
 * Used by purchase flows, dashboard, Stripe config, and service provisioning.
 */

export type ServiceType = 'AGENTS' | 'WEB' | 'LABS' | 'SOLUTIONS'

export type AgentEmployeeType = 'SDR' | 'RESEARCHER' | 'SUPPORT' | 'CONTENT' | 'DESIGNER' | 'VIDEO'

export interface ProductFeatures {
  employees?: number // Number of AI employees (-1 = unlimited)
  interactionsPerMonth?: number // -1 = unlimited
  emailSupport?: boolean
  prioritySupport?: boolean
  dedicatedManager?: boolean
  basicAnalytics?: boolean
  advancedAnalytics?: boolean
  standardIntegrations?: boolean
  allIntegrations?: boolean
  customIntegrations?: boolean
  valisChat?: boolean
  slaGuarantee?: boolean
  customTraining?: boolean
  responseTime?: string // "48hr", "4hr", "1hr"
}

export interface ProductLimits {
  maxEmployees?: number // -1 = unlimited
  maxInteractionsPerMonth?: number // -1 = unlimited
  maxProjects?: number
  storageGB?: number
  apiCallsPerMonth?: number
}

export interface Product {
  id: string
  name: string
  slug: string
  serviceType: ServiceType
  tier: 'STARTER' | 'GROWTH' | 'SCALE' | 'ENTERPRISE' | 'CUSTOM' | 'INDIVIDUAL'
  priceMonthly: number
  priceAnnual: number
  description: string
  features: ProductFeatures
  limits: ProductLimits
  stripePriceIdMonthly?: string // Set after Stripe config
  stripePriceIdAnnual?: string
  popular?: boolean
  displayOrder: number
}

export interface AgentEmployee {
  id: AgentEmployeeType
  name: string
  slug: string
  title: string
  description: string
  capabilities: string[]
  useCases: string[]
  priceMonthly: number
  color: string
  icon: string
}

// ==================== AGENTS PLANS ====================

export const agentsPlans: Product[] = [
  {
    id: 'agents-starter',
    name: 'Agents Starter',
    slug: 'agents-starter',
    serviceType: 'AGENTS',
    tier: 'STARTER',
    priceMonthly: 397,
    priceAnnual: 3970, // ~10 months (2 months free)
    description: 'Perfect for solopreneurs and small teams getting started with AI employees',
    features: {
      employees: 1,
      interactionsPerMonth: 5000,
      emailSupport: true,
      basicAnalytics: true,
      standardIntegrations: true,
      responseTime: '48hr',
    },
    limits: {
      maxEmployees: 1,
      maxInteractionsPerMonth: 5000,
    },
    displayOrder: 1,
  },
  {
    id: 'agents-growth',
    name: 'Agents Growth',
    slug: 'agents-growth',
    serviceType: 'AGENTS',
    tier: 'GROWTH',
    priceMonthly: 997,
    priceAnnual: 9970,
    description: 'For growing teams that need multiple AI employees',
    features: {
      employees: 3,
      interactionsPerMonth: 25000,
      prioritySupport: true,
      advancedAnalytics: true,
      allIntegrations: true,
      valisChat: true,
      responseTime: '4hr',
    },
    limits: {
      maxEmployees: 3,
      maxInteractionsPerMonth: 25000,
    },
    popular: true,
    displayOrder: 2,
  },
  {
    id: 'agents-scale',
    name: 'Agents Scale',
    slug: 'agents-scale',
    serviceType: 'AGENTS',
    tier: 'SCALE',
    priceMonthly: 1497,
    priceAnnual: 14970,
    description: 'For established businesses scaling with AI',
    features: {
      employees: -1, // unlimited
      interactionsPerMonth: -1, // unlimited
      dedicatedManager: true,
      advancedAnalytics: true,
      allIntegrations: true,
      customIntegrations: true,
      valisChat: true,
      slaGuarantee: true,
      customTraining: true,
      responseTime: '1hr',
    },
    limits: {
      maxEmployees: -1,
      maxInteractionsPerMonth: -1,
    },
    displayOrder: 3,
  },
]

// ==================== AGENT EMPLOYEES ====================

export const agentEmployees: AgentEmployee[] = [
  {
    id: 'SDR',
    name: 'Mike',
    slug: 'sdr',
    title: 'Sales Development Rep',
    description: 'AI-powered lead generation and outbound sales specialist',
    capabilities: [
      'Lead prospecting and qualification',
      'Outbound email sequences',
      'LinkedIn outreach automation',
      'CRM data entry and updates',
      'Lead scoring and prioritization',
      'Follow-up sequence management',
      'Meeting scheduling coordination',
    ],
    useCases: [
      'Generate 50-100 qualified leads per week',
      'Automate cold email campaigns',
      'Keep CRM updated in real-time',
      'Schedule demos and discovery calls',
      'Track lead engagement and scoring',
    ],
    priceMonthly: 497,
    color: '#FF006E',
    icon: 'UserPlus',
  },
  {
    id: 'RESEARCHER',
    name: 'Sarah',
    slug: 'researcher',
    title: 'Research Analyst',
    description: 'Deep research and competitive intelligence specialist',
    capabilities: [
      'Market research and analysis',
      'Competitor intelligence gathering',
      'Industry trend monitoring',
      'Report generation and synthesis',
      'Data collection and organization',
      'SWOT analysis creation',
      'Executive summary writing',
    ],
    useCases: [
      'Weekly competitive analysis reports',
      'Market sizing and TAM research',
      'Customer persona development',
      'Product feature benchmarking',
      'Industry news monitoring',
    ],
    priceMonthly: 397,
    color: '#8B5CF6',
    icon: 'Search',
  },
  {
    id: 'SUPPORT',
    name: 'Alex',
    slug: 'support',
    title: 'Customer Support Agent',
    description: '24/7 customer support and ticket management',
    capabilities: [
      'Ticket triage and categorization',
      'FAQ and knowledge base responses',
      'Escalation routing',
      'Customer satisfaction tracking',
      'Multi-channel support (email, chat, Slack)',
      'Response time monitoring',
      'Support metrics reporting',
    ],
    useCases: [
      'Handle 80% of tier-1 support tickets',
      'Instant FAQ responses 24/7',
      'Route complex issues to team',
      'Track CSAT and response times',
      'Manage support inbox',
    ],
    priceMonthly: 497,
    color: '#06B6D4',
    icon: 'Headphones',
  },
  {
    id: 'CONTENT',
    name: 'Casey',
    slug: 'content',
    title: 'Content Creator',
    description: 'AI content writer for blogs, social, and marketing',
    capabilities: [
      'Blog post writing',
      'Social media content creation',
      'Email copywriting',
      'Content calendar management',
      'SEO optimization',
      'Multi-platform adaptation',
      'Brand voice consistency',
    ],
    useCases: [
      'Publish 4-8 blog posts per month',
      'Daily social media posts',
      'Weekly email newsletters',
      'Product launch announcements',
      'SEO-optimized content',
    ],
    priceMonthly: 397,
    color: '#F59E0B',
    icon: 'PenTool',
  },
  {
    id: 'DESIGNER',
    name: 'LUMEN',
    slug: 'designer',
    title: 'AI Design Assistant',
    description: 'Visual design and brand asset creation',
    capabilities: [
      'Social media graphics',
      'Presentation templates',
      'Brand asset variations',
      'Design system guidance',
      'Color palette suggestions',
      'Typography recommendations',
      'Layout mockups',
    ],
    useCases: [
      'Daily social media graphics',
      'Pitch deck design',
      'Marketing collateral',
      'Brand style guides',
      'Ad creative variations',
    ],
    priceMonthly: 347,
    color: '#EC4899',
    icon: 'Palette',
  },
  {
    id: 'VIDEO',
    name: 'FLUX',
    slug: 'video',
    title: 'Video Production Assistant',
    description: 'Video scripting and production planning',
    capabilities: [
      'Video script writing',
      'Storyboard creation',
      'Shot list development',
      'Editing guidance',
      'Thumbnail design concepts',
      'B-roll suggestions',
      'Hook and CTA optimization',
    ],
    useCases: [
      'Weekly video scripts',
      'YouTube content planning',
      'Product demo storyboards',
      'Video ad concepts',
      'Social video adaptations',
    ],
    priceMonthly: 447,
    color: '#10B981',
    icon: 'Video',
  },
]

// ==================== WEB SERVICE DEFINITIONS ====================

export const webServices = {
  projects: {
    landingPage: {
      name: 'Landing Page',
      priceRange: { min: 1997, max: 4500 },
      timeline: '1-2 weeks',
      deliverables: [
        'Custom design in Figma',
        'Responsive development',
        'Mobile optimization',
        'Performance optimization',
        'Basic SEO setup',
        'Contact form integration',
      ],
    },
    starterWebsite: {
      name: 'Starter Website',
      priceRange: { min: 3997, max: 6997 },
      pages: '5-10 pages',
      timeline: '2-4 weeks',
      deliverables: [
        'All Landing Page features',
        'Multiple page templates',
        'Navigation structure',
        'Content management system',
        'Analytics integration',
        'Form handling',
      ],
    },
    businessWebsite: {
      name: 'Business Website',
      priceRange: { min: 7997, max: 14997 },
      pages: '10-25 pages',
      timeline: '4-8 weeks',
      deliverables: [
        'All Starter features',
        'Advanced animations',
        'Blog/news section',
        'Team/portfolio pages',
        'Advanced SEO',
        'Multi-language (optional)',
      ],
    },
    ecommerce: {
      name: 'E-commerce Store',
      priceRange: { min: 12997, max: 24997 },
      timeline: '6-12 weeks',
      deliverables: [
        'Product catalog',
        'Shopping cart',
        'Checkout flow',
        'Payment gateway (Stripe)',
        'Inventory management',
        'Order tracking',
        'Customer accounts',
      ],
    },
  },
  maintenance: {
    essential: {
      name: 'Essential',
      price: 79,
      features: [
        'Monthly updates',
        'Security patches',
        'Uptime monitoring',
        'Basic support (48hr response)',
        'Monthly backup',
      ],
    },
    growth: {
      name: 'Growth',
      price: 197,
      features: [
        'All Essential features',
        'Priority support (4hr response)',
        'Weekly backups',
        'Content updates (2hr/mo)',
        'Performance monitoring',
        'Monthly analytics report',
      ],
    },
    scale: {
      name: 'Scale',
      price: 397,
      features: [
        'All Growth features',
        'Dedicated support (1hr response)',
        'Daily backups',
        'Content updates (5hr/mo)',
        'Advanced optimization',
        'Custom feature development',
      ],
    },
  },
}

// ==================== LABS SERVICE DEFINITIONS ====================

export const labsServices = {
  phaseBased: {
    discovery: { priceRange: { min: 4997, max: 8997 }, duration: '1-2 weeks' },
    mvp: { priceRange: { min: 19997, max: 44997 }, duration: '6-12 weeks' },
    production: { priceRange: { min: 59997, max: 124997 }, duration: '12-24 weeks' },
  },
  timeAndMaterials: {
    seniorEngineer: { hourlyRate: { min: 125, max: 175 } },
    fullTeam: { monthlyRate: { min: 19997, max: 29997 } },
  },
  retainers: {
    dedicatedDev: { monthlyRate: { min: 6997, max: 9997 } },
    coreTeam: { monthlyRate: { min: 12997, max: 19997 } },
    fullTeam: { monthlyRate: { min: 24997, max: 44997 } },
  },
}

// ==================== SOLUTIONS SERVICE DEFINITIONS ====================

export const solutionsServices = {
  workshops: {
    priceRange: { min: 1997, max: 7997 },
    duration: 'Half-day to 2 days',
    deliverables: [
      'Pre-workshop assessment',
      'Facilitated sessions',
      'Strategy playbook',
      'Action plan with priorities',
      'Follow-up session',
    ],
  },
  assessments: {
    priceRange: { min: 7997, max: 19997 },
    duration: '2-4 weeks',
    deliverables: [
      'Current state analysis',
      'Technology audit',
      'Competitive benchmarking',
      'Detailed recommendations',
      'Roadmap with phases',
      'Executive presentation',
    ],
  },
  retainers: {
    priceRange: { min: 3997, max: 14997 },
    billing: 'Monthly',
    includes: [
      'Strategic advisory hours',
      'Technology guidance',
      'Vendor evaluation',
      'Team coaching',
      'Monthly check-ins',
      'Ad-hoc support',
    ],
  },
  projects: {
    priceRange: { min: 24997, max: 497000 },
    duration: 'Varies by scope',
    deliverables: [
      'SOW with clear milestones',
      'Dedicated project team',
      'Regular status updates',
      'Documentation',
      'Implementation support',
      'Post-launch optimization',
    ],
  },
}

// ==================== HELPER FUNCTIONS ====================

export function getProductById(productId: string): Product | undefined {
  return agentsPlans.find((p) => p.id === productId)
}

export function getProductBySlug(slug: string): Product | undefined {
  return agentsPlans.find((p) => p.slug === slug)
}

export function getEmployeeById(employeeId: AgentEmployeeType): AgentEmployee | undefined {
  return agentEmployees.find((e) => e.id === employeeId)
}

export function getEmployeeBySlug(slug: string): AgentEmployee | undefined {
  return agentEmployees.find((e) => e.slug === slug)
}

export function formatPrice(cents: number): string {
  return `$${(cents).toLocaleString()}`
}

export function formatPriceRange(min: number, max: number): string {
  return `$${min.toLocaleString()} - $${max.toLocaleString()}`
}
