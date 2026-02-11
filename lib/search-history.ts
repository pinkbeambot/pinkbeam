// Constants
const RECENT_SEARCHES_KEY = "recent-searches"
const MAX_RECENT_SEARCHES = 10

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (!stored) return []
    
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string")
    }
    return []
  } catch {
    // If parsing fails, clear the corrupted data
    localStorage.removeItem(RECENT_SEARCHES_KEY)
    return []
  }
}

/**
 * Add a search query to recent searches
 * Moves to front if already exists, removes oldest if at limit
 */
export function addRecentSearch(query: string): void {
  if (typeof window === "undefined") return
  if (!query || query.trim().length === 0) return
  
  const trimmedQuery = query.trim()
  const current = getRecentSearches()
  
  // Remove if already exists (to move to front)
  const filtered = current.filter(s => s.toLowerCase() !== trimmedQuery.toLowerCase())
  
  // Add to front
  const updated = [trimmedQuery, ...filtered].slice(0, MAX_RECENT_SEARCHES)
  
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Failed to save recent search:", error)
  }
}

/**
 * Remove a specific search from recent searches
 */
export function removeRecentSearch(query: string): void {
  if (typeof window === "undefined") return
  
  const current = getRecentSearches()
  const updated = current.filter(s => s.toLowerCase() !== query.toLowerCase())
  
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Failed to remove recent search:", error)
  }
}

/**
 * Clear all recent searches
 */
export function clearRecentSearches(): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  } catch (error) {
    console.error("Failed to clear recent searches:", error)
  }
}

/**
 * Check if a search query is in recent searches
 */
export function isRecentSearch(query: string): boolean {
  const searches = getRecentSearches()
  return searches.some(s => s.toLowerCase() === query.trim().toLowerCase())
}
