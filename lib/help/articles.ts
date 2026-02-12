/**
 * Help Center Article Data
 * Central source of truth for all help documentation
 */

export interface HelpArticle {
  slug: string
  category: string
  title: string
  summary: string
  content: string
  lastUpdated: string
  readingTime: number // minutes
  relatedArticles?: string[] // slugs
  featured?: boolean
}

export interface HelpCategory {
  slug: string
  title: string
  description: string
  icon: string
  articleCount: number
}

export const helpCategories: HelpCategory[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'Everything you need to know to get up and running with Pink Beam',
    icon: 'Rocket',
    articleCount: 4,
  },
  {
    slug: 'ai-employees',
    title: 'AI Employees',
    description: 'Learn how to work effectively with each AI employee',
    icon: 'Users',
    articleCount: 6,
  },
  {
    slug: 'billing',
    title: 'Billing & Account',
    description: 'Manage your subscription, billing, and account settings',
    icon: 'CreditCard',
    articleCount: 4,
  },
  {
    slug: 'integrations',
    title: 'Integrations',
    description: 'Connect your tools and services to Pink Beam',
    icon: 'Plug',
    articleCount: 3,
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and how to resolve them',
    icon: 'AlertCircle',
    articleCount: 4,
  },
  {
    slug: 'services',
    title: 'Web, Labs & Solutions',
    description: 'Project tracking and communication for service clients',
    icon: 'Briefcase',
    articleCount: 3,
  },
]

export const helpArticles: HelpArticle[] = [
  // Getting Started
  {
    slug: 'welcome-to-pink-beam',
    category: 'getting-started',
    title: 'Welcome to Pink Beam',
    summary: 'An overview of Pink Beam and what you can accomplish with AI employees',
    lastUpdated: '2026-02-11',
    readingTime: 3,
    featured: true,
    content: `# Welcome to Pink Beam

Pink Beam is your Living Intelligence Factory — a platform that provides AI employees to handle real work for your business.

## What are AI Employees?

Unlike simple chatbots or tools, our AI employees are specialized agents that can:
- Work autonomously on tasks you delegate
- Learn from your feedback and preferences
- Integrate with your existing tools (email, calendar, CRM)
- Deliver consistent, high-quality results

## Meet Your Team

**Mike (SDR)** - Prospecting and lead generation
**Sarah (Researcher)** - Market research and competitive analysis
**Alex (Support)** - Customer support and ticket handling
**Casey (Content)** - Content creation and social media
**LUMEN (Designer)** - Design briefs and creative direction
**FLUX (Video)** - Video planning and production

## Getting Started

1. Choose your first AI employee based on your biggest need
2. Connect your integrations (Gmail, Calendar, Slack, etc.)
3. Delegate your first task using VALIS chat with @mentions
4. Review the results and provide feedback
5. Watch your AI employee improve over time

## Next Steps

- [Choosing Your First AI Employee](/help/getting-started/choosing-first-employee)
- [Connecting Integrations](/help/integrations/connecting-gmail)
- [Delegating Your First Task](/help/getting-started/first-task-delegation)
`,
    relatedArticles: ['choosing-first-employee', 'first-task-delegation', 'understanding-valis'],
  },
  {
    slug: 'choosing-first-employee',
    category: 'getting-started',
    title: 'Choosing Your First AI Employee',
    summary: 'How to pick the right AI employee for your business needs',
    lastUpdated: '2026-02-11',
    readingTime: 4,
    content: `# Choosing Your First AI Employee

Not sure which AI employee to hire first? Here's how to decide based on your biggest pain point.

## Quick Decision Guide

**Choose Mike (SDR) if you need:**
- More qualified leads in your pipeline
- Outbound prospecting at scale
- Lead research and enrichment
- Follow-up email sequences

**Choose Sarah (Researcher) if you need:**
- Competitive intelligence
- Market research and sizing
- Industry trend analysis
- Deep-dive research reports

**Choose Alex (Support) if you need:**
- 24/7 customer support coverage
- Faster ticket response times
- Knowledge base management
- Support email handling

**Choose Casey (Content) if you need:**
- Consistent blog post publishing
- Social media content creation
- Email newsletter writing
- SEO content at scale

**Choose LUMEN (Designer) if you need:**
- Design briefs for projects
- Brand guideline creation
- Social media graphics planning
- Design system documentation

**Choose FLUX (Video) if you need:**
- Video script writing
- Storyboard creation
- Shot list planning
- Video series planning

## Most Popular First Hires

1. **Mike (SDR)** - 40% of customers start here
2. **Alex (Support)** - 25% of customers
3. **Casey (Content)** - 20% of customers
4. **Sarah (Researcher)** - 10% of customers
5. **LUMEN/FLUX** - 5% of customers

## Can't Decide?

Start with a **Growth plan** (3 employees) and get Mike + Alex + Casey — the most versatile combination for growing businesses.

## Related Articles

- [Mike SDR Best Practices](/help/ai-employees/mike-sdr)
- [Understanding Usage Quotas](/help/billing/understanding-quotas)
`,
    relatedArticles: ['mike-sdr', 'understanding-quotas', 'first-task-delegation'],
  },
  {
    slug: 'first-task-delegation',
    category: 'getting-started',
    title: 'Delegating Your First Task',
    summary: 'Step-by-step guide to delegating work to your AI employees',
    lastUpdated: '2026-02-11',
    readingTime: 5,
    featured: true,
    content: `# Delegating Your First Task

Learn how to effectively delegate tasks to your AI employees using VALIS chat.

## How Task Delegation Works

1. Open VALIS chat (purple chat button in bottom-right)
2. Use @mention to specify which employee should handle the task
3. Describe what you need in natural language
4. VALIS routes the task to the appropriate employee
5. Receive results in your dashboard and via email

## Example Delegations

**For Mike (SDR):**
\`\`\`
@mike Find 20 SaaS companies in healthcare with 50-200 employees
that recently raised Series A funding. Include contact info for
their Head of Sales or VP of Marketing.
\`\`\`

**For Sarah (Researcher):**
\`\`\`
@sarah Research the top 5 competitors to Stripe in payment processing.
Compare their pricing, key features, target market, and recent news.
Create a comparison table.
\`\`\`

**For Alex (Support):**
\`\`\`
@alex Review the support tickets from this week and draft responses
for the top 5 most common questions. Make the tone friendly and helpful.
\`\`\`

**For Casey (Content):**
\`\`\`
@casey Write a 800-word blog post about "10 ways AI is transforming
customer service" optimized for SEO. Include examples and actionable tips.
\`\`\`

## Writing Effective Prompts

**Be Specific:**
❌ "Find some leads"
✅ "Find 20 leads in [industry] with [criteria]"

**Include Context:**
❌ "Write a blog post"
✅ "Write an 800-word blog post about [topic] in a professional tone for B2B SaaS founders"

**Set Deadlines:**
"I need this by end of day Friday"

**Provide Examples:**
"Similar to how we did [previous task]"

## What Happens Next?

1. Task is queued (you'll see a confirmation)
2. Employee processes the task (5 min - 2 hours depending on complexity)
3. You receive a notification when complete
4. Review results in the employee's dashboard
5. Provide feedback to improve future tasks

## Related Articles

- [Prompt Template Library](/help/ai-employees/prompt-templates)
- [Understanding Task Queues](/help/troubleshooting/task-queue)
`,
    relatedArticles: ['prompt-templates', 'understanding-valis', 'task-queue'],
  },
  {
    slug: 'understanding-valis',
    category: 'getting-started',
    title: 'Understanding VALIS',
    summary: 'What VALIS is and how it orchestrates your AI employees',
    lastUpdated: '2026-02-11',
    readingTime: 3,
    content: `# Understanding VALIS

VALIS (Vast Active Living Intelligence System) is the orchestration layer that manages all your AI employees.

## What is VALIS?

Think of VALIS as your AI office manager. While each AI employee has specialized skills, VALIS:
- Routes tasks to the right employee
- Manages task queues and priorities
- Coordinates multi-employee workflows
- Learns your preferences over time
- Provides intelligent suggestions

## How to Interact with VALIS

**Chat Interface:**
Click the purple chat button to open VALIS chat. Use @mentions to delegate tasks:
- @mike for sales tasks
- @sarah for research
- @alex for support
- @casey for content
- @lumen for design
- @flux for video

**Dashboard:**
VALIS provides insights across all your employees:
- Usage metrics and quotas
- Task completion rates
- Upcoming deadlines
- Suggested optimizations

## VALIS Intelligence

VALIS learns from:
- Your delegation patterns
- Feedback you provide
- Task success rates
- Time-of-day preferences
- Integration usage

Over time, VALIS gets better at:
- Routing tasks automatically
- Suggesting employee combinations
- Predicting task completion times
- Recommending process improvements

## Multi-Employee Workflows

VALIS can coordinate complex workflows:

\`\`\`
@valis I need a lead gen campaign:
1. @mike find 50 leads in fintech
2. @sarah research each company
3. @casey write personalized outreach emails
\`\`\`

VALIS will:
1. Break this into sequential tasks
2. Route each to the appropriate employee
3. Pass outputs between employees
4. Notify you when the full workflow completes

## Related Articles

- [Delegating Your First Task](/help/getting-started/first-task-delegation)
- [Multi-Employee Workflows](/help/ai-employees/workflows)
`,
  },

  // AI Employees - Prompt Templates
  {
    slug: 'prompt-templates',
    category: 'ai-employees',
    title: 'Prompt Template Library',
    summary: 'Copy-paste prompts for all 6 AI employees to get started quickly',
    lastUpdated: '2026-02-11',
    readingTime: 8,
    featured: true,
    content: `# Prompt Template Library

Master the art of delegating to your AI employees with these proven prompt templates. Copy, customize, and use them in VALIS chat.

## Mike (SDR) — Sales Development

### Lead Generation

**Find Qualified Leads**
\`\`\`
@mike Find 30 companies in [industry] with [criteria]. Include:
- Company name and website
- Employee count and revenue (if available)
- Contact info for [decision-maker title]
- Brief company description
- Why they match our ICP
\`\`\`

**Trigger Event Research**
\`\`\`
@mike Find 20 companies that recently [raised funding/hired VP Sales/launched new product] in the past 3 months. Focus on [industry] with [employee range]. Get contact info for their [role].
\`\`\`

### Outreach Campaigns

**Create Email Sequence**
\`\`\`
@mike Create a 5-email outreach sequence for [product/service] targeting [persona]. Make it personalized, value-focused, and include clear CTAs. Spacing: Day 0, 3, 7, 14, 21.
\`\`\`

**Personalized Cold Email**
\`\`\`
@mike Draft a cold outreach email to [Name] at [Company]. They recently [trigger event]. Our product helps with [value prop]. Keep it under 100 words, professional tone.
\`\`\`

### Research

**Competitor Customer Analysis**
\`\`\`
@mike Research current customers of [competitor] and identify which ones might be good fits for our product. Explain why they might be open to switching.
\`\`\`

**Account Research**
\`\`\`
@mike Deep dive on [Company Name]. I need: recent news, tech stack, key decision makers, potential pain points, best outreach angle.
\`\`\`

## Sarah (Researcher) — Market Research

### Competitive Intelligence

**Competitor Analysis**
\`\`\`
@sarah Research the top 5 competitors to [Company] in [market]. Compare their pricing, key features, target market, and recent news. Create a comparison table.
\`\`\`

**Market Landscape**
\`\`\`
@sarah Map out the competitive landscape for [product category]. Who are the leaders, emerging players, and niches? Include market size estimates and trends.
\`\`\`

### Trend Research

**Industry Trends**
\`\`\`
@sarah Research the top 3 trends shaping [industry] in 2026. For each trend, explain what's driving it, key players, and implications for [our business].
\`\`\`

**Technology Analysis**
\`\`\`
@sarah Analyze the state of [technology/tool] in 2026. How mature is it? Who are the leading vendors? What are the use cases? What's the ROI?
\`\`\`

### Customer Research

**ICP Research**
\`\`\`
@sarah Research companies that fit this profile: [criteria]. Find 10 examples with details on their size, tech stack, pain points, and buying triggers.
\`\`\`

**Persona Development**
\`\`\`
@sarah Create a detailed persona for [role] at [company type]. Include: responsibilities, pain points, goals, tools they use, decision-making criteria.
\`\`\`

## Alex (Support) — Customer Support

### Ticket Responses

**Draft Support Response**
\`\`\`
@alex Customer asked: "[question]". Draft a helpful response that [explains/troubleshoots/provides steps]. Friendly, professional tone. Include relevant docs links.
\`\`\`

**Batch Ticket Handling**
\`\`\`
@alex Review the support tickets from this week and draft responses for the top 5 most common questions. Make the tone friendly and helpful.
\`\`\`

### Knowledge Base

**Create Help Article**
\`\`\`
@alex Write a help article titled "[Title]" that explains how to [task]. Include: overview, step-by-step instructions, screenshots placeholders, troubleshooting tips, related articles.
\`\`\`

**Update FAQ**
\`\`\`
@alex Review our current FAQs and suggest 10 new questions based on recent support tickets. Draft answers for each in our brand voice.
\`\`\`

### Customer Education

**Onboarding Email**
\`\`\`
@alex Write a welcome email for new customers. Cover: getting started steps, key features, resources, support contact. Keep it under 200 words, friendly tone.
\`\`\`

**Feature Announcement**
\`\`\`
@alex Draft an email announcing [new feature]. Explain: what it is, why it matters, how to use it, where to learn more. Excited but professional tone.
\`\`\`

## Casey (Content) — Content Creation

### Blog Posts

**How-To Guide**
\`\`\`
@casey Write an 800-word blog post titled "[Title]" that teaches readers how to [topic]. Include actionable tips, examples, and a clear conclusion. Optimize for SEO.
\`\`\`

**Industry Analysis**
\`\`\`
@casey Write a 1,200-word thought leadership post about "[trend/topic]" in [industry]. Professional tone for B2B audience. Include data points and expert perspectives.
\`\`\`

### Social Media

**LinkedIn Post**
\`\`\`
@casey Write a LinkedIn post about [topic]. Hook in first line, 3-4 key insights, call-to-action at end. Professional but conversational. 150-200 words.
\`\`\`

**Twitter Thread**
\`\`\`
@casey Create a 5-tweet thread explaining [concept]. Each tweet under 280 characters. Start with a hook, build to payoff, end with CTA.
\`\`\`

### Email Marketing

**Newsletter**
\`\`\`
@casey Write this week's newsletter. Include: 1 main article about [topic], 2 quick tips, 1 product update, 1 call-to-action. Keep total under 500 words.
\`\`\`

**Nurture Sequence**
\`\`\`
@casey Create a 3-email nurture sequence for leads who downloaded [resource]. Goal: educate about [problem] and soft-pitch [solution]. Spacing: Day 1, 4, 7.
\`\`\`

## LUMEN (Designer) — Design Briefs

### Brand Guidelines

**Create Design Brief**
\`\`\`
@lumen Create a design brief for our [project type]. Include: objectives, target audience, style references, mood board ideas, color palette suggestions, typography recommendations.
\`\`\`

**Brand Style Guide**
\`\`\`
@lumen Develop a brand style guide for [Company]. Cover: logo usage, color palette, typography, imagery style, tone of voice, examples of correct/incorrect usage.
\`\`\`

### Social Media Graphics

**Instagram Post Series**
\`\`\`
@lumen Plan a 5-post Instagram carousel about "[topic]". For each slide: headline, key point, visual concept. Modern, minimalist style.
\`\`\`

**LinkedIn Banner**
\`\`\`
@lumen Design a LinkedIn company banner that showcases [message]. Dimensions 1584x396. Include: headline, subheadline, visual elements, brand colors.
\`\`\`

### Marketing Materials

**Landing Page Design**
\`\`\`
@lumen Create a design brief for a landing page promoting [product/service]. Include: hero section concept, key sections, CTA placement, imagery style, conversion elements.
\`\`\`

**Email Template**
\`\`\`
@lumen Design an email template for [campaign type]. Include: header design, content layout, CTA buttons, footer elements. Mobile-responsive, on-brand.
\`\`\`

## FLUX (Video) — Video Production

### Video Scripts

**Explainer Video**
\`\`\`
@flux Write a 60-second explainer video script about [product/feature]. Include: hook, problem, solution, CTA. Conversational tone. Note visual suggestions.
\`\`\`

**Tutorial Video**
\`\`\`
@flux Create a tutorial video script for "[How to do X]". 3-5 minutes. Step-by-step structure. Include: intro, main steps, tips, outro. Mark screen recording moments.
\`\`\`

### Production Planning

**Storyboard**
\`\`\`
@flux Create a storyboard for [video concept]. 8-10 scenes. For each: description, visual, audio/voiceover, duration. Total runtime: [X] minutes.
\`\`\`

**Shot List**
\`\`\`
@flux Build a shot list for [video type] featuring [subject]. Include: scene descriptions, camera angles, lighting notes, props needed, estimated time per shot.
\`\`\`

### Video Series

**Content Series Plan**
\`\`\`
@flux Plan a 5-video YouTube series about [topic]. For each video: title, description, key points, hook, CTA, SEO keywords. Target audience: [persona].
\`\`\`

**Social Video Series**
\`\`\`
@flux Create a 4-week social video series for [platform]. Each week: theme, script outline, visual concept, captions, hashtags. Short-form, vertical format.
\`\`\`

## Tips for Better Prompts

**Be Specific:**
❌ "Find some leads"
✅ "Find 20 leads in fintech with 50-200 employees that raised Series A in the past 6 months"

**Include Context:**
❌ "Write a blog post"
✅ "Write an 800-word blog post about [topic] in a professional tone for B2B SaaS founders"

**Set Expectations:**
- Specify word counts, timeframes, formats
- Provide examples if you have them
- Define your target audience
- State the desired outcome

**Use Constraints:**
- "Keep it under 200 words"
- "Professional but conversational tone"
- "Include 3-5 actionable tips"
- "Optimize for SEO"

**Iterate:**
Your first prompt might not be perfect. Review the output and provide feedback:
- "Make it more concise"
- "Add more data points"
- "Change tone to be more casual"

## Related Articles

- [Delegating Your First Task](/help/getting-started/first-task-delegation)
- [Understanding VALIS](/help/getting-started/understanding-valis)
- [Mike SDR Best Practices](/help/ai-employees/mike-sdr)
`,
  },

  // AI Employees - Mike (SDR)
  {
    slug: 'mike-sdr',
    category: 'ai-employees',
    title: 'Mike (SDR) — Best Practices',
    summary: 'How to get the most out of Mike for lead generation and prospecting',
    lastUpdated: '2026-02-11',
    readingTime: 5,
    featured: true,
    content: `# Mike (SDR) — Best Practices

Mike specializes in sales development: prospecting, lead research, and outbound campaigns.

## What Mike Does Best

**Lead Generation:**
- Finding qualified prospects matching your ICP
- Enriching lead data (email, phone, LinkedIn)
- Building targeted prospect lists
- Lead scoring and prioritization

**Outbound Campaigns:**
- Drafting personalized outreach emails
- Creating email sequences
- Follow-up scheduling
- A/B test email variations

**Sales Research:**
- Company background research
- Decision-maker identification
- Competitor customer analysis
- Trigger event monitoring

## Mike Prompt Templates

**Basic Lead Generation:**
\`\`\`
@mike Find 30 companies in [industry] with [criteria]. Include:
- Company name and website
- Employee count and revenue (if available)
- Contact info for [decision-maker title]
- Brief company description
- Why they match our ICP
\`\`\`

**Email Sequence Creation:**
\`\`\`
@mike Create a 5-email outreach sequence for [product/service]
targeting [persona]. Make it personalized, value-focused, and
include clear CTAs. Spacing: Day 0, 3, 7, 14, 21.
\`\`\`

**Competitive Intelligence:**
\`\`\`
@mike Research current customers of [competitor] and identify
which ones might be good fits for our product. Explain why they
might be open to switching.
\`\`\`

## Tips for Working with Mike

1. **Define your ICP clearly** - The more specific your criteria, the better the leads
2. **Provide email examples** - Share successful emails so Mike matches your voice
3. **Set lead volume expectations** - Mike can handle 20-100 leads per request
4. **Use CRM integration** - Connect your CRM so Mike can push leads directly

## Common Use Cases

- Building outbound prospect lists
- Enriching existing lead data
- Drafting cold outreach emails
- Researching accounts before calls
- Identifying upsell opportunities in your customer base

## Limitations

Mike cannot:
- Send emails directly (you review and approve)
- Make phone calls
- Access your CRM without integration
- Guarantee contact information accuracy

## Related Articles

- [Connecting Your CRM](/help/integrations/crm)
- [Lead Scoring with Mike](/help/ai-employees/lead-scoring)
`,
  },

  // Billing
  {
    slug: 'understanding-quotas',
    category: 'billing',
    title: 'Understanding Usage Quotas',
    summary: 'How usage quotas work and what to do when you hit limits',
    lastUpdated: '2026-02-11',
    readingTime: 4,
    content: `# Understanding Usage Quotas

Each Pink Beam plan includes interaction quotas to ensure fair usage and manage costs.

## What Counts as an Interaction?

An "interaction" is any task you delegate to an AI employee. Examples:

**Single Interactions:**
- "Find 20 leads in fintech" = 1 interaction
- "Write a blog post about AI" = 1 interaction
- "Draft a response to this support ticket" = 1 interaction

**Multiple Interactions:**
- Delegating 50 separate support tickets = 50 interactions
- Sending 100 leads for individual enrichment = 100 interactions

## Plan Quotas

**Starter Plan** - $397/mo
- 5,000 interactions/month
- ~160 interactions/day
- Good for: 1 employee working consistently

**Growth Plan** - $997/mo
- 25,000 interactions/month
- ~830 interactions/day
- Good for: 3 employees working actively

**Scale Plan** - Custom
- Unlimited interactions
- Enterprise-grade limits
- Good for: Heavy usage, multiple employees

## Checking Your Usage

View your current usage:
1. Dashboard → Settings → Usage
2. Progress bar shows % of quota used
3. Resets on your billing date each month

## What Happens When You Hit Your Quota?

1. You'll receive an email at 80% usage
2. At 90%, you'll see a dashboard warning
3. At 100%, new tasks are queued until next billing cycle
4. OR you can upgrade your plan immediately

## Managing Your Quota

**Batch Tasks:**
Instead of 50 separate "find 1 lead" tasks, do "find 50 leads" = 1 interaction

**Prioritize:**
Focus quota on high-value tasks first

**Upgrade:**
If consistently hitting limits, upgrade to Growth or Scale

**Monitor:**
Check usage weekly to avoid surprises

## Quota Doesn't Roll Over

Unused quota expires at the end of each billing cycle. There's no "banking" unused interactions.

## Related Articles

- [Upgrading Your Plan](/help/billing/upgrading)
- [Billing and Invoices](/help/billing/invoices)
`,
  },

  // Troubleshooting
  {
    slug: 'employee-not-responding',
    category: 'troubleshooting',
    title: 'Why Isn\'t My Employee Responding?',
    summary: 'Common reasons for delayed or missing responses and how to fix them',
    lastUpdated: '2026-02-11',
    readingTime: 3,
    content: `# Why Isn't My Employee Responding?

If your AI employee hasn't responded to a task, here are the most common causes and solutions.

## Check Task Queue

**Problem:** Task is still queued, not processed yet
**Solution:** Check the employee's dashboard for queue position. Complex tasks can take 30-120 minutes.

**Expected Processing Times:**
- Simple tasks (1-2 leads, short email): 5-15 minutes
- Medium tasks (research report, 20 leads): 30-60 minutes
- Complex tasks (large dataset, multi-step): 1-2 hours

## Verify Usage Quota

**Problem:** You've hit your monthly quota
**Solution:**
1. Go to Settings → Usage
2. Check if you're at 100% quota
3. Either wait for next billing cycle or upgrade plan

## Check Integration Status

**Problem:** Required integration is disconnected
**Solution:**
1. Go to Settings → Integrations
2. Look for red "Disconnected" badges
3. Reconnect the integration
4. Re-submit the task

## Review Task Requirements

**Problem:** Task was unclear or impossible
**Solution:** VALIS will notify you if a task can't be completed. Check for:
- Notification in VALIS chat
- Email about task failure
- Clarify and re-submit

## System Status

**Problem:** Platform maintenance or outage
**Solution:** Check status.pinkbeam.io for current system status

## Still Not Working?

If none of the above resolves the issue:

1. Copy the original task text
2. Click "Contact Support" in help widget
3. Include:
   - Employee name
   - Task description
   - Time submitted
   - Screenshot if relevant

Our team typically responds within 4 hours.

## Related Articles

- [Understanding Task Queues](/help/troubleshooting/task-queue)
- [Understanding Usage Quotas](/help/billing/understanding-quotas)
`,
  },
]

// Helper functions
export function getArticleBySlug(slug: string): HelpArticle | undefined {
  return helpArticles.find((article) => article.slug === slug)
}

export function getArticlesByCategory(category: string): HelpArticle[] {
  return helpArticles.filter((article) => article.category === category)
}

export function getFeaturedArticles(): HelpArticle[] {
  return helpArticles.filter((article) => article.featured)
}

export function searchArticles(query: string): HelpArticle[] {
  const lowerQuery = query.toLowerCase()
  return helpArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.summary.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery)
  )
}
