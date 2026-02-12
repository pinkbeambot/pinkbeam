/**
 * Type-safe API Route Handlers
 *
 * Provides proper typing for Next.js 15 App Router API routes
 */

import type { NextRequest } from 'next/server'

// ============================================================================
// Route Handler Types
// ============================================================================

/**
 * Route context with typed params
 * Used for dynamic route segments like [id], [slug], etc.
 */
export interface RouteContext<TParams = Record<string, string>> {
  params: Promise<TParams>
}

/**
 * Typed route handler for routes without params
 */
export type RouteHandler = (request: NextRequest) => Promise<Response> | Response

/**
 * Typed route handler for routes with params (e.g., [id])
 */
export type RouteHandlerWithParams<TParams = Record<string, string>> = (
  request: NextRequest,
  context: RouteContext<TParams>
) => Promise<Response> | Response

// ============================================================================
// Common Route Param Types
// ============================================================================

/** Route with [id] param */
export type IdParams = { id: string }

/** Route with [slug] param */
export type SlugParams = { slug: string }

/** Route with multiple params */
export type MultiParams<T extends Record<string, string>> = T

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  success: false
  error: string
  details?: unknown
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Extract search params from NextRequest
 */
export type SearchParams = {
  get(name: string): string | null
  getAll(name: string): string[]
  has(name: string): boolean
}

/**
 * Prisma where clause type helper
 * Prevents using 'any' for where clauses
 */
export type WhereClause<T> = Partial<T> | Record<string, unknown>

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if response is an error
 */
export function isApiError(response: ApiResponse): response is ApiErrorResponse {
  return !response.success && 'error' in response
}

/**
 * Type guard to check if response has data
 */
export function hasData<T>(response: ApiResponse<T>): response is Required<ApiResponse<T>> {
  return response.success && 'data' in response
}
