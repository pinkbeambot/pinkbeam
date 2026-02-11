import { prisma } from './prisma'

export type SearchResultType = 'project' | 'client' | 'ticket' | 'blog'

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  snippet: string
  url: string
  meta?: Record<string, unknown>
}

export interface GlobalSearchResults {
  projects: SearchResult[]
  clients: SearchResult[]
  tickets: SearchResult[]
  blog: SearchResult[]
}

/**
 * Build a search vector from searchable text fields
 */
export function buildSearchVector(...texts: (string | null | undefined)[]): string {
  return texts
    .filter((t): t is string => t !== null && t !== undefined)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Generate a snippet from content that highlights the search query
 */
function generateSnippet(content: string, query: string, maxLength = 150): string {
  const normalizedQuery = query.toLowerCase()
  const normalizedContent = content.toLowerCase()
  const index = normalizedContent.indexOf(normalizedQuery)
  
  if (index === -1) {
    // Query not found directly, return start of content
    return content.length > maxLength 
      ? content.slice(0, maxLength).trim() + '...'
      : content
  }
  
  // Find the start of the snippet (try to start at word boundary)
  let start = Math.max(0, index - 50)
  while (start > 0 && content[start] !== ' ') {
    start--
  }
  start = start > 0 ? start + 1 : 0
  
  // Find the end of the snippet
  let end = Math.min(content.length, start + maxLength)
  while (end < content.length && content[end] !== ' ') {
    end++
  }
  
  let snippet = content.slice(start, end).trim()
  if (start > 0) snippet = '...' + snippet
  if (end < content.length) snippet = snippet + '...'
  
  return snippet
}

/**
 * Search projects using PostgreSQL full-text search
 */
export async function searchProjects(query: string, limit = 5): Promise<SearchResult[]> {
  if (!query.trim()) return []
  
  const results = await prisma.$queryRaw<Array<{
    id: string
    title: string
    description: string | null
    status: string
    client_name: string | null
    rank: number
  }>>`
    SELECT 
      p.id,
      p.title,
      p.description,
      p.status,
      u.name as client_name,
      ts_rank(to_tsvector('english', COALESCE(p.search_vector, '')), plainto_tsquery('english', ${query})) as rank
    FROM "projects" p
    LEFT JOIN "users" u ON p."clientId" = u.id
    WHERE to_tsvector('english', COALESCE(p.search_vector, '')) @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT ${limit}
  `
  
  return results.map(project => ({
    id: project.id,
    type: 'project' as const,
    title: project.title,
    snippet: generateSnippet(
      `${project.description || ''} ${project.client_name || ''}`.trim(),
      query
    ),
    url: `/web/admin/projects/${project.id}`,
    meta: {
      status: project.status,
      client: project.client_name
    }
  }))
}

/**
 * Search clients (users with CLIENT role) using PostgreSQL full-text search
 */
export async function searchClients(query: string, limit = 5): Promise<SearchResult[]> {
  if (!query.trim()) return []
  
  const results = await prisma.$queryRaw<Array<{
    id: string
    name: string | null
    email: string
    company: string | null
    rank: number
  }>>`
    SELECT 
      id,
      name,
      email,
      company,
      ts_rank(to_tsvector('english', COALESCE(search_vector, '')), plainto_tsquery('english', ${query})) as rank
    FROM "users"
    WHERE role = 'CLIENT'
      AND to_tsvector('english', COALESCE(search_vector, '')) @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT ${limit}
  `
  
  return results.map(client => ({
    id: client.id,
    type: 'client' as const,
    title: client.name || client.email,
    snippet: generateSnippet(
      `${client.email} ${client.company || ''}`.trim(),
      query
    ),
    url: `/web/admin/clients/${client.id}`,
    meta: {
      email: client.email,
      company: client.company
    }
  }))
}

/**
 * Search support tickets using PostgreSQL full-text search
 */
export async function searchTickets(query: string, limit = 5): Promise<SearchResult[]> {
  if (!query.trim()) return []
  
  const results = await prisma.$queryRaw<Array<{
    id: string
    title: string
    description: string
    status: string
    priority: string
    client_name: string | null
    rank: number
  }>>`
    SELECT 
      t.id,
      t.title,
      t.description,
      t.status,
      t.priority,
      u.name as client_name,
      ts_rank(to_tsvector('english', COALESCE(t.search_vector, '')), plainto_tsquery('english', ${query})) as rank
    FROM "support_tickets" t
    LEFT JOIN "users" u ON t."clientId" = u.id
    WHERE to_tsvector('english', COALESCE(t.search_vector, '')) @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT ${limit}
  `
  
  return results.map(ticket => ({
    id: ticket.id,
    type: 'ticket' as const,
    title: ticket.title,
    snippet: generateSnippet(ticket.description, query),
    url: `/web/portal/support/${ticket.id}`,
    meta: {
      status: ticket.status,
      priority: ticket.priority,
      client: ticket.client_name
    }
  }))
}

/**
 * Search blog posts using PostgreSQL full-text search
 */
export async function searchBlog(query: string, limit = 5): Promise<SearchResult[]> {
  if (!query.trim()) return []
  
  const results = await prisma.$queryRaw<Array<{
    id: string
    title: string
    excerpt: string | null
    slug: string
    published: boolean
    rank: number
  }>>`
    SELECT 
      id,
      title,
      excerpt,
      slug,
      published,
      ts_rank(to_tsvector('english', COALESCE(search_vector, '')), plainto_tsquery('english', ${query})) as rank
    FROM "blog_posts"
    WHERE published = true
      AND to_tsvector('english', COALESCE(search_vector, '')) @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT ${limit}
  `
  
  return results.map(post => ({
    id: post.id,
    type: 'blog' as const,
    title: post.title,
    snippet: generateSnippet(post.excerpt || '', query),
    url: `/blog/${post.slug}`,
    meta: {
      published: post.published
    }
  }))
}

/**
 * Global search across all entity types
 */
export async function globalSearch(query: string, limitPerType = 5): Promise<GlobalSearchResults> {
  if (!query.trim()) {
    return { projects: [], clients: [], tickets: [], blog: [] }
  }
  
  const [projects, clients, tickets, blog] = await Promise.all([
    searchProjects(query, limitPerType),
    searchClients(query, limitPerType),
    searchTickets(query, limitPerType),
    searchBlog(query, limitPerType)
  ])
  
  return { projects, clients, tickets, blog }
}

/**
 * Get total count of search results across all types
 */
export function getTotalResults(results: GlobalSearchResults): number {
  return results.projects.length + 
         results.clients.length + 
         results.tickets.length + 
         results.blog.length
}
