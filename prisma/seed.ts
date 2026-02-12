import { PrismaClient, UserRole, ProjectStatus, ServiceType, PlanServiceType, PlanTier } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Seed subscription plans
  console.log('Seeding subscription plans...')

  // AGENTS Plans
  const agentsStarter = await prisma.plan.upsert({
    where: { slug: 'agents-starter' },
    update: {},
    create: {
      name: 'Agents Starter',
      slug: 'agents-starter',
      serviceType: PlanServiceType.AGENTS,
      tier: PlanTier.STARTER,
      priceMonthly: 397.00,
      priceAnnual: 3970.00,
      features: {
        employees: 1,
        interactions: 500,
        emailSupport: true,
        slackIntegration: false,
      },
      limits: {
        maxEmployees: 1,
        maxInteractionsPerMonth: 500,
      },
      displayOrder: 1,
      description: 'Perfect for solopreneurs and small teams getting started with AI employees',
      active: true,
    },
  })

  const agentsGrowth = await prisma.plan.upsert({
    where: { slug: 'agents-growth' },
    update: {},
    create: {
      name: 'Agents Growth',
      slug: 'agents-growth',
      serviceType: PlanServiceType.AGENTS,
      tier: PlanTier.GROWTH,
      priceMonthly: 997.00,
      priceAnnual: 9970.00,
      features: {
        employees: 3,
        interactions: 2000,
        emailSupport: true,
        slackIntegration: true,
        prioritySupport: false,
      },
      limits: {
        maxEmployees: 3,
        maxInteractionsPerMonth: 2000,
      },
      displayOrder: 2,
      description: 'For growing teams that need multiple AI employees',
      active: true,
    },
  })

  const agentsScale = await prisma.plan.upsert({
    where: { slug: 'agents-scale' },
    update: {},
    create: {
      name: 'Agents Scale',
      slug: 'agents-scale',
      serviceType: PlanServiceType.AGENTS,
      tier: PlanTier.SCALE,
      priceMonthly: 1497.00,
      priceAnnual: 14970.00,
      features: {
        employees: -1, // unlimited
        interactions: 10000,
        emailSupport: true,
        slackIntegration: true,
        prioritySupport: true,
        dedicatedManager: false,
      },
      limits: {
        maxEmployees: -1, // unlimited
        maxInteractionsPerMonth: 10000,
      },
      displayOrder: 3,
      description: 'For established businesses scaling with AI',
      active: true,
    },
  })

  console.log('Created Agents plans:', [agentsStarter.name, agentsGrowth.name, agentsScale.name])

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pinkbeam.io' },
    update: {},
    create: {
      email: 'admin@pinkbeam.io',
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  })
  console.log('Created admin:', admin.email)

  // Create VALIS admin user
  const valis = await prisma.user.upsert({
    where: { email: 'valis@pinkbeam.ai' },
    update: {},
    create: {
      email: 'valis@pinkbeam.ai',
      name: 'VALIS',
      role: UserRole.ADMIN,
    },
  })
  console.log('Created VALIS admin:', valis.email)

  // Create test client
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      name: 'Test Client',
      role: UserRole.CLIENT,
      company: 'Test Company',
      phone: '(555) 123-4567',
    },
  })
  console.log('Created client:', client.email)

  // Create test project
  const project = await prisma.project.upsert({
    where: { id: 'test-project-1' },
    update: {},
    create: {
      id: 'test-project-1',
      title: 'Test Website Project',
      description: 'A test project for development',
      status: ProjectStatus.IN_PROGRESS,
      clientId: client.id,
      services: [ServiceType.DESIGN, ServiceType.DEVELOPMENT],
    },
  })
  console.log('Created project:', project.title)

  // Create test blog post
  const blogPost = await prisma.blogPost.upsert({
    where: { slug_service: { slug: 'welcome-to-pink-beam', service: 'WEB' } },
    update: {},
    create: {
      title: 'Welcome to Pink Beam',
      slug: 'welcome-to-pink-beam',
      service: 'WEB',
      excerpt: 'We help businesses grow with beautiful websites and AI-powered solutions.',
      content: 'Welcome to Pink Beam! We are excited to help you build something amazing.',
      published: true,
      publishedAt: new Date(),
    },
  })
  console.log('Created blog post:', blogPost.title)

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
