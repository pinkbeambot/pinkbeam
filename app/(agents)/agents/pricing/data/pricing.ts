export interface PricingTier {
  id: string;
  name: string;
  price: number; // monthly price
  annualPrice: number; // monthly price when billed annually
  employees: number;
  description: string;
  features: string[];
  cta: string;
  ctaAction?: () => void;
  popular: boolean;
  badge: string;
}

export interface FeatureComparison {
  feature: string;
  tooltip?: string;
  starter: string | boolean;
  growth: string | boolean;
  scale: string | boolean;
  [key: string]: string | boolean | undefined;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: 397,
    annualPrice: 331, // $3,970/year = $331/mo (2 months free)
    employees: 1,
    description: "Perfect for trying out AI employees",
    features: [
      "Choose any 1 employee",
      "Standard support (24h response)",
      "Email delivery",
      "Basic analytics dashboard",
      "Standard integrations",
      "7-day data retention",
    ],
    cta: "Get Started",
    popular: false,
    badge: "Best for trying out",
  },
  {
    id: "growth",
    name: "Growth",
    price: 997,
    annualPrice: 831, // $9,970/year = $831/mo (2 months free)
    employees: 3,
    description: "Most popular for growing teams",
    features: [
      "Mix and match any 3 employees",
      "Priority support (4h response)",
      "Slack + Email delivery",
      "Advanced analytics & reports",
      "Custom configurations",
      "API access",
      "30-day data retention",
    ],
    cta: "Get Started",
    popular: true,
    badge: "Most Popular",
  },
  {
    id: "scale",
    name: "Scale",
    price: 0,
    annualPrice: 0,
    employees: -1, // Unlimited
    description: "For teams scaling with 5+ employees",
    features: [
      "Unlimited AI employees",
      "Dedicated account manager",
      "Custom integrations",
      "Priority uptime guarantee",
      "Dedicated infrastructure",
      "Advanced security features",
      "Unlimited data retention",
      "Custom AI configuration",
    ],
    cta: "Contact Sales",
    popular: false,
    badge: "For teams 5+",
  },
];

export const featureComparisons: FeatureComparison[] = [
  {
    feature: "Number of Employees",
    starter: "1 employee",
    growth: "3 employees",
    scale: "Unlimited",
    tooltip: "The number of AI employees you can deploy simultaneously",
  },
  {
    feature: "Support Level",
    starter: "Standard (24h)",
    growth: "Priority (4h)",
    scale: "Dedicated Manager",
    tooltip: "Response time for support requests",
  },
  {
    feature: "Delivery Channels",
    starter: "Email only",
    growth: "Slack + Email",
    scale: "All channels + Custom",
    tooltip: "Where your AI employees can send updates and reports",
  },
  {
    feature: "Analytics",
    starter: "Basic",
    growth: "Advanced",
    scale: "Enterprise + Custom",
    tooltip: "Depth of insights and reporting capabilities",
  },
  {
    feature: "Custom Configurations",
    starter: false,
    growth: true,
    scale: true,
    tooltip: "Ability to customize employee behavior and workflows",
  },
  {
    feature: "API Access",
    starter: false,
    growth: true,
    scale: true,
    tooltip: "Programmatic access to manage employees and data",
  },
  {
    feature: "Integrations",
    starter: "50+ standard",
    growth: "100+ premium",
    scale: "All + Custom builds",
    tooltip: "Third-party tools your employees can connect to",
  },
  {
    feature: "Data Retention",
    starter: "7 days",
    growth: "30 days",
    scale: "Unlimited",
    tooltip: "How long conversation history and logs are stored",
  },
  {
    feature: "SLA Guarantee",
    starter: false,
    growth: false,
    scale: "99.9% uptime",
    tooltip: "Service level agreement with uptime guarantees",
  },
  {
    feature: "On-premise Option",
    starter: false,
    growth: false,
    scale: true,
    tooltip: "Deploy AI employees in your own infrastructure",
  },
  {
    feature: "Custom AI Training",
    starter: false,
    growth: false,
    scale: true,
    tooltip: "Train AI models on your proprietary data",
  },
  {
    feature: "Team Collaboration",
    starter: false,
    growth: true,
    scale: true,
    tooltip: "Multiple team members can manage employees",
  },
];

export const addOns: AddOn[] = [
  {
    id: "extra-sources",
    name: "Extra Sources Pack",
    price: 49,
    description: "Add 10 additional data sources to any employee",
  },
  {
    id: "priority-support",
    name: "Priority Support",
    price: 99,
    description: "Upgrade to 1-hour response time on Starter plan",
  },
  {
    id: "custom-training",
    name: "Custom Training Session",
    price: 199,
    description: "1-hour dedicated training with our AI specialists",
  },
];

export const pricingFAQ = [
  {
    question: "Can I change my plan?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at the start of your next billing cycle.",
  },
  {
    question: "What happens if I exceed my employee limit?",
    answer:
      "We'll notify you when you're approaching your limit. You can temporarily pause existing employees to activate new ones, or upgrade to a higher tier for more slots. We never automatically charge overage fees.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 14-day money-back guarantee for all new subscriptions. If you're not satisfied, contact us within 14 days for a full refund. After 14 days, you can cancel anytime but refunds are prorated.",
  },
  {
    question: "Can I pause my subscription?",
    answer:
      "Yes, you can pause your subscription for up to 3 months. During the pause, your employees will be inactive but your configurations and data will be preserved. Resume anytime with one click.",
  },
  {
    question: "What's included in custom integrations?",
    answer:
      "For Scale customers, we'll build custom integrations for tools not in our standard library. This typically takes 1-2 weeks and includes testing, documentation, and 90 days of support for the integration.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! Every new account gets a 7-day free trial with full access to the Growth plan features. No credit card required to start. At the end of the trial, choose the plan that works best for you.",
  },
];
