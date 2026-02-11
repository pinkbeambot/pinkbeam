#!/usr/bin/env tsx
/**
 * Index Existing Data for Search
 * 
 * This script populates the search_vector columns for all existing records
 * in the database. Run this once after setting up the search infrastructure.
 * 
 * Usage: npx tsx scripts/index-search.ts
 */

import { prisma } from '../lib/prisma'

async function indexProjects() {
  console.log('Indexing projects...')
  
  const projects = await prisma.project.findMany({
    include: {
      client: {
        select: {
          name: true
        }
      }
    }
  })
  
  let count = 0
  for (const project of projects) {
    const searchVector = [
      project.title,
      project.description,
      project.client?.name
    ].filter(Boolean).join(' ')
    
    await prisma.$executeRaw`
      UPDATE "projects" 
      SET "search_vector" = ${searchVector}
      WHERE id = ${project.id}
    `
    count++
  }
  
  console.log(`✓ Indexed ${count} projects`)
}

async function indexClients() {
  console.log('Indexing clients (users)...')
  
  const clients = await prisma.user.findMany({
    where: {
      role: 'CLIENT'
    }
  })
  
  let count = 0
  for (const client of clients) {
    const searchVector = [
      client.name,
      client.email,
      client.company,
      client.phone,
      client.industry
    ].filter(Boolean).join(' ')
    
    await prisma.$executeRaw`
      UPDATE "users" 
      SET "search_vector" = ${searchVector}
      WHERE id = ${client.id}
    `
    count++
  }
  
  console.log(`✓ Indexed ${count} clients`)
}

async function indexTickets() {
  console.log('Indexing support tickets...')
  
  const tickets = await prisma.supportTicket.findMany()
  
  let count = 0
  for (const ticket of tickets) {
    const searchVector = [
      ticket.title,
      ticket.description
    ].filter(Boolean).join(' ')
    
    await prisma.$executeRaw`
      UPDATE "support_tickets" 
      SET "search_vector" = ${searchVector}
      WHERE id = ${ticket.id}
    `
    count++
  }
  
  console.log(`✓ Indexed ${count} tickets`)
}

async function indexBlogPosts() {
  console.log('Indexing blog posts...')
  
  const posts = await prisma.blogPost.findMany()
  
  let count = 0
  for (const post of posts) {
    const searchVector = [
      post.title,
      post.excerpt,
      post.content,
      post.metaTitle,
      post.metaDesc
    ].filter(Boolean).join(' ')
    
    await prisma.$executeRaw`
      UPDATE "blog_posts" 
      SET "search_vector" = ${searchVector}
      WHERE id = ${post.id}
    `
    count++
  }
  
  console.log(`✓ Indexed ${count} blog posts`)
}

async function main() {
  console.log('🚀 Starting search index build...\n')
  
  try {
    await indexProjects()
    await indexClients()
    await indexTickets()
    await indexBlogPosts()
    
    console.log('\n✅ Search index build complete!')
    console.log('\nNext steps:')
    console.log('  - Run: npm run db:migrate')
    console.log('  - The triggers will auto-update search vectors on future changes')
    
  } catch (error) {
    console.error('\n❌ Error building search index:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
