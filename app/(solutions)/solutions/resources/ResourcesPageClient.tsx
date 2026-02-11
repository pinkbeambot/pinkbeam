'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  LayoutTemplate, 
  CheckSquare, 
  Calculator, 
  BarChart3, 
  Wrench,
  Star,
  Clock,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, FadeInOnMount } from '@/components/animations';
import { cn } from '@/lib/utils';
import type { Resource, ResourceType } from '@prisma/client';

interface ResourcesPageClientProps {
  initialResources: Resource[];
}

const resourceTypeIcons: Record<ResourceType, React.ReactNode> = {
  TEMPLATE: <LayoutTemplate className="w-5 h-5" />,
  FRAMEWORK: <FileText className="w-5 h-5" />,
  CHECKLIST: <CheckSquare className="w-5 h-5" />,
  CALCULATOR: <Calculator className="w-5 h-5" />,
  REPORT: <BarChart3 className="w-5 h-5" />,
  TOOL: <Wrench className="w-5 h-5" />,
};

const resourceTypeLabels: Record<ResourceType, string> = {
  TEMPLATE: 'Template',
  FRAMEWORK: 'Framework',
  CHECKLIST: 'Checklist',
  CALCULATOR: 'Calculator',
  REPORT: 'Report',
  TOOL: 'Tool',
};

const resourceTypeColors: Record<ResourceType, string> = {
  TEMPLATE: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  FRAMEWORK: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  CHECKLIST: 'bg-green-500/10 text-green-500 border-green-500/20',
  CALCULATOR: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  REPORT: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  TOOL: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
};

export function ResourcesPageClient({ initialResources }: ResourcesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Extract unique categories and topics
  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialResources.forEach(r => cats.add(r.category));
    return Array.from(cats).sort();
  }, [initialResources]);

  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    initialResources.forEach(r => r.topics.forEach(t => topics.add(t)));
    return Array.from(topics).sort();
  }, [initialResources]);

  // Filter resources
  const filteredResources = useMemo(() => {
    return initialResources.filter(resource => {
      const matchesSearch = !searchQuery || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(resource.type);
      const matchesCategory = !selectedCategory || resource.category === selectedCategory;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [initialResources, searchQuery, selectedTypes, selectedCategory]);

  const featuredResources = useMemo(() => 
    filteredResources.filter(r => r.featured),
    [filteredResources]
  );

  const recentResources = useMemo(() => 
    filteredResources.slice(0, 6),
    [filteredResources]
  );

  const toggleType = (type: ResourceType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        <div className="container relative">
          <FadeInOnMount>
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 px-3 py-1 border-amber-500/30 text-amber-500">
                Resource Library
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Free Resources to Accelerate Your Transformation
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Download practical templates, frameworks, and tools to help you implement AI, 
                automate processes, and drive digital transformation in your organization.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-full border-border/50 bg-background/50 backdrop-blur-sm"
                />
              </div>
            </div>
          </FadeInOnMount>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
          <span className="text-sm">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-20">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <FadeIn delay={0.1}>
                <div className="sticky top-24 space-y-8">
                  {/* Type Filter */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Resource Type
                    </h3>
                    <div className="space-y-2">
                      {(Object.keys(resourceTypeLabels) as ResourceType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => toggleType(type)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                            selectedTypes.includes(type)
                              ? "bg-amber-500/10 text-amber-600"
                              : "hover:bg-muted"
                          )}
                        >
                          <span className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            resourceTypeColors[type].split(' ')[0]
                          )}>
                            {resourceTypeIcons[type]}
                          </span>
                          <span className="flex-1 text-left">{resourceTypeLabels[type]}</span>
                          {selectedTypes.includes(type) && (
                            <CheckSquare className="w-4 h-4 text-amber-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  {categories.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4">Category</h3>
                      <div className="space-y-1">
                        <button
                          onClick={() => setSelectedCategory('')}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                            !selectedCategory ? "bg-amber-500/10 text-amber-600" : "hover:bg-muted"
                          )}
                        >
                          All Categories
                        </button>
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                              selectedCategory === category ? "bg-amber-500/10 text-amber-600" : "hover:bg-muted"
                            )}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Topics */}
                  {allTopics.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4">Popular Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {allTopics.slice(0, 10).map((topic) => (
                          <button
                            key={topic}
                            onClick={() => setSearchQuery(topic)}
                            className="px-2 py-1 text-xs rounded-full bg-muted hover:bg-amber-500/10 hover:text-amber-600 transition-colors"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </FadeIn>
            </aside>

            {/* Resource Grid */}
            <main className="flex-1">
              {/* Featured Resources */}
              {featuredResources.length > 0 && !searchQuery && !selectedTypes.length && !selectedCategory && (
                <FadeIn delay={0.1}>
                  <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                      <Star className="w-5 h-5 text-amber-500" />
                      <h2 className="text-2xl font-bold">Featured Resources</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {featuredResources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} featured />
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* All Resources */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {searchQuery || selectedTypes.length || selectedCategory
                      ? `Results (${filteredResources.length})`
                      : 'All Resources'}
                  </h2>
                  {(searchQuery || selectedTypes.length || selectedCategory) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedTypes([]);
                        setSelectedCategory('');
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>

                {filteredResources.length === 0 ? (
                  <div className="text-center py-16">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No resources found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredResources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                )}
              </div>

              {/* Recently Added */}
              {!searchQuery && !selectedTypes.length && !selectedCategory && recentResources.length > 0 && (
                <FadeIn delay={0.2}>
                  <div className="mt-16">
                    <div className="flex items-center gap-2 mb-6">
                      <Clock className="w-5 h-5 text-amber-500" />
                      <h2 className="text-2xl font-bold">Recently Added</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recentResources.slice(0, 3).map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

interface ResourceCardProps {
  resource: Resource;
  featured?: boolean;
}

function ResourceCard({ resource, featured }: ResourceCardProps) {
  return (
    <Card className={cn(
      "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      featured && "border-amber-500/20"
    )}>
      <CardContent className="p-0">
        <Link href={`/solutions/resources/${resource.slug}`}>
          <div className="p-6">
            {/* Type Badge */}
            <div className="flex items-center justify-between mb-4">
              <Badge 
                variant="outline" 
                className={cn("flex items-center gap-1.5", resourceTypeColors[resource.type])}
              >
                {resourceTypeIcons[resource.type]}
                {resourceTypeLabels[resource.type]}
              </Badge>
              {featured && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-semibold mb-2 group-hover:text-amber-500 transition-colors line-clamp-2">
              {resource.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {resource.description}
            </p>

            {/* Topics */}
            {resource.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.topics.slice(0, 3).map((topic) => (
                  <span 
                    key={topic} 
                    className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                  >
                    {topic}
                  </span>
                ))}
                {resource.topics.length > 3 && (
                  <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                    +{resource.topics.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{resource.fileFormat}</span>
                <span>•</span>
                <span>{resource.fileSize}</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
                <Download className="w-4 h-4" />
                <span>{resource.downloadCount}</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
