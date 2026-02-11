"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList,
  CommandSeparator,
  CommandShortcut
} from "@/components/ui/command"
import { SearchResult, SearchResultType, GlobalSearchResults } from "@/lib/search"
import { getRecentSearches, addRecentSearch, clearRecentSearches } from "@/lib/search-history"
import { 
  Briefcase, 
  User, 
  Ticket, 
  FileText, 
  Clock, 
  X,
  Loader2,
  Search
} from "lucide-react"

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const typeIcons: Record<SearchResultType, React.ReactNode> = {
  project: <Briefcase className="h-4 w-4 text-blue-500" />,
  client: <User className="h-4 w-4 text-green-500" />,
  ticket: <Ticket className="h-4 w-4 text-orange-500" />,
  blog: <FileText className="h-4 w-4 text-purple-500" />
}

const typeLabels: Record<SearchResultType, string> = {
  project: "Project",
  client: "Client", 
  ticket: "Ticket",
  blog: "Blog"
}

function SearchResultItem({ 
  result, 
  onSelect 
}: { 
  result: SearchResult
  onSelect: () => void 
}) {
  return (
    <CommandItem 
      value={`${result.type}-${result.id}`}
      onSelect={onSelect}
      className="flex items-center gap-3 py-3"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
        {typeIcons[result.type]}
      </div>
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{result.title}</span>
          <span className="shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {typeLabels[result.type]}
          </span>
        </div>
        {result.snippet && (
          <p className="text-xs text-muted-foreground truncate">
            {result.snippet}
          </p>
        )}
      </div>
    </CommandItem>
  )
}

function RecentSearchItem({ 
  query, 
  onSelect,
  onRemove
}: { 
  query: string
  onSelect: () => void
  onRemove: (e: React.MouseEvent) => void
}) {
  return (
    <CommandItem 
      value={`recent-${query}`}
      onSelect={onSelect}
      className="group flex items-center gap-3"
    >
      <Clock className="h-4 w-4 text-muted-foreground" />
      <span className="flex-1">{query}</span>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded"
      >
        <X className="h-3 w-3" />
      </button>
    </CommandItem>
  )
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState<GlobalSearchResults | null>(null)
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Load recent searches when opened
  React.useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches())
      setQuery("")
      setResults(null)
      // Focus input after a short delay to ensure dialog is rendered
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  // Handle keyboard shortcut (Cmd+K / Ctrl+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  // Debounced search
  React.useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        if (data.success) {
          setResults(data.results)
        }
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setIsLoading(false)
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (result: SearchResult) => {
    addRecentSearch(query)
    onOpenChange(false)
    router.push(result.url)
  }

  const handleRecentSelect = (searchQuery: string) => {
    setQuery(searchQuery)
  }

  const handleRemoveRecent = (e: React.MouseEvent, searchToRemove: string) => {
    e.stopPropagation()
    const updated = recentSearches.filter(s => s !== searchToRemove)
    localStorage.setItem("recent-searches", JSON.stringify(updated))
    setRecentSearches(updated)
  }

  const handleClearRecent = () => {
    clearRecentSearches()
    setRecentSearches([])
  }

  const allResults = results ? [
    ...results.projects,
    ...results.clients,
    ...results.tickets,
    ...results.blog
  ] : []

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col">
        <div className="flex items-center border-b border-border px-3">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
          ) : (
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, clients, tickets..."
            className="flex h-14 w-full rounded-md bg-transparent py-4 text-base outline-none placeholder:text-muted-foreground"
          />
          <CommandShortcut>Cmd K</CommandShortcut>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {!query && recentSearches.length > 0 && (
            <div className="py-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground">Recent</span>
                <button 
                  onClick={handleClearRecent}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search) => (
                <RecentSearchItem
                  key={search}
                  query={search}
                  onSelect={() => handleRecentSelect(search)}
                  onRemove={(e) => handleRemoveRecent(e, search)}
                />
              ))}
            </div>
          )}

          {query && allResults.length === 0 && !isLoading && (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try different keywords or check spelling
              </p>
            </div>
          )}

          {results && results.projects.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                Projects
              </div>
              {results.projects.map((result) => (
                <SearchResultItem
                  key={result.id}
                  result={result}
                  onSelect={() => handleSelect(result)}
                />
              ))}
            </div>
          )}

          {results && results.clients.length > 0 && (
            <div className="py-2">
              <CommandSeparator />
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                Clients
              </div>
              {results.clients.map((result) => (
                <SearchResultItem
                  key={result.id}
                  result={result}
                  onSelect={() => handleSelect(result)}
                />
              ))}
            </div>
          )}

          {results && results.tickets.length > 0 && (
            <div className="py-2">
              <CommandSeparator />
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                Tickets
              </div>
              {results.tickets.map((result) => (
                <SearchResultItem
                  key={result.id}
                  result={result}
                  onSelect={() => handleSelect(result)}
                />
              ))}
            </div>
          )}

          {results && results.blog.length > 0 && (
            <div className="py-2">
              <CommandSeparator />
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                Blog Posts
              </div>
              {results.blog.map((result) => (
                <SearchResultItem
                  key={result.id}
                  result={result}
                  onSelect={() => handleSelect(result)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <kbd className="rounded border px-1.5 py-0.5 text-[10px]">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border px-1.5 py-0.5 text-[10px]">↵</kbd>
              Select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="rounded border px-1.5 py-0.5 text-[10px]">Esc</kbd>
            Close
          </span>
        </div>
      </div>
    </CommandDialog>
  )
}

// Hook to use global search
export function useGlobalSearch() {
  const [open, setOpen] = React.useState(false)

  return {
    open,
    setOpen,
    GlobalSearchComponent: () => (
      <GlobalSearch open={open} onOpenChange={setOpen} />
    )
  }
}
