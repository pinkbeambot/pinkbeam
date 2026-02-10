import { PrismaClient, UserRole, ProjectStatus, ServiceType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

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
    where: { slug: 'welcome-to-pink-beam' },
    update: {},
    create: {
      title: 'Welcome to Pink Beam',
      slug: 'welcome-to-pink-beam',
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
