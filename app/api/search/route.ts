import { NextRequest, NextResponse } from 'next/server'
import { globalSearch, GlobalSearchResults } from '@/lib/search'

export const dynamic = 'force-dynamic'

export interface SearchApiResponse {
  success: boolean
  results: GlobalSearchResults
  query: string
  total: number
  error?: string
}

/**
 * GET /api/search?q=query&type=optional_filter
 * 
 * Search across all entities (projects, clients, tickets, blog posts)
 * Query parameters:
 * - q: The search query (required)
 * - type: Optional filter - 'project', 'client', 'ticket', 'blog'
 * - limit: Maximum results per type (default: 5)
 */
export async function GET(request: NextRequest): Promise<NextResponse<SearchApiResponse>> {
  let query = ''
  
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    query = searchParams.get('q') || ''
    const type = searchParams.get('type')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 5

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          results: { projects: [], clients: [], tickets: [], blog: [] },
          query: '',
          total: 0,
          error: 'Query parameter "q" is required'
        },
        { status: 400 }
      )
    }

    // Perform global search
    const results = await globalSearch(query, limit)

    // Filter by type if specified
    let filteredResults = results
    if (type) {
      const empty = { projects: [], clients: [], tickets: [], blog: [] }
      switch (type.toLowerCase()) {
        case 'project':
        case 'projects':
          filteredResults = { ...empty, projects: results.projects }
          break
        case 'client':
        case 'clients':
          filteredResults = { ...empty, clients: results.clients }
          break
        case 'ticket':
        case 'tickets':
          filteredResults = { ...empty, tickets: results.tickets }
          break
        case 'blog':
          filteredResults = { ...empty, blog: results.blog }
          break
        default:
          // Invalid type filter, return all results
          filteredResults = results
      }
    }

    const total = Object.values(filteredResults).reduce(
      (sum, arr) => sum + arr.length, 
      0
    )

    return NextResponse.json({
      success: true,
      results: filteredResults,
      query: query.trim(),
      total
    })

  } catch (error) {
    console.error('Search API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        results: { projects: [], clients: [], tickets: [], blog: [] },
        query,
        total: 0,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}
