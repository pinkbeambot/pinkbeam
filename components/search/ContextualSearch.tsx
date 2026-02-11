"use client"

import * as React from "react"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SearchResult, SearchResultType } from "@/lib/search"

export interface ContextualSearchProps {
  type: SearchResultType | "all"
  placeholder?: string
  onResults?: (results: SearchResult[]) => void
  onSearch?: (query: string) => void
  debounceMs?: number
  className?: string
  autoFocus?: boolean
}

export function ContextualSearch({
  type,
  placeholder = "Search...",
  onResults,
  onSearch,
  debounceMs = 200,
  className,
  autoFocus = false
}: ContextualSearchProps) {
  const [query, setQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState<SearchResult[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  // Debounced search
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([])
      onResults?.([])
      onSearch?.("")
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          q: query,
          type: type === "all" ? "" : type,
          limit: "20"
        })
        const response = await fetch(`/api/search?${params}`)
        const data = await response.json()
        
        if (data.success) {
          // Flatten results based on type
          let searchResults: SearchResult[] = []
          if (type === "all" || type === "project") {
            searchResults = [...searchResults, ...data.results.projects]
          }
          if (type === "all" || type === "client") {
            searchResults = [...searchResults, ...data.results.clients]
          }
          if (type === "all" || type === "ticket") {
            searchResults = [...searchResults, ...data.results.tickets]
          }
          if (type === "all" || type === "blog") {
            searchResults = [...searchResults, ...data.results.blog]
          }
          
          setResults(searchResults)
          onResults?.(searchResults)
        }
      } catch (error) {
        console.error("Search failed:", error)
        setResults([])
        onResults?.([])
      } finally {
        setIsLoading(false)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, type, debounceMs, onResults])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearch?.(newQuery)
  }

  const handleClear = () => {
    setQuery("")
    setResults([])
    onResults?.([])
    onSearch?.("")
    inputRef.current?.focus()
  }

  return (
    <div className={className}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : query ? (
            <button
              onClick={handleClear}
              className="p-0.5 hover:bg-muted rounded-sm transition-colors"
              type="button"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

// Hook for using contextual search with state management
export function useContextualSearch(type: SearchResultType | "all") {
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [query, setQuery] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)

  const handleResults = React.useCallback((newResults: SearchResult[]) => {
    setResults(newResults)
    setIsSearching(newResults.length > 0)
  }, [])

  const handleSearch = React.useCallback((newQuery: string) => {
    setQuery(newQuery)
    if (!newQuery) {
      setResults([])
      setIsSearching(false)
    }
  }, [])

  const clearSearch = React.useCallback(() => {
    setQuery("")
    setResults([])
    setIsSearching(false)
  }, [])

  return {
    query,
    results,
    isSearching,
    handleResults,
    handleSearch,
    clearSearch,
    ContextualSearchComponent: (props: Omit<ContextualSearchProps, "type" | "onResults" | "onSearch">) => (
      <ContextualSearch
        type={type}
        onResults={handleResults}
        onSearch={handleSearch}
        {...props}
      />
    )
  }
}
