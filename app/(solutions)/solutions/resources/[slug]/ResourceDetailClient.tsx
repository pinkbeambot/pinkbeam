'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  LayoutTemplate, 
  CheckSquare, 
  Calculator, 
  BarChart3, 
  Wrench,
  Check,
  Share2,
  Star,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FadeIn } from '@/components/animations';
import { DownloadGate } from '@/components/resources/DownloadGate';
import { cn } from '@/lib/utils';
import type { Resource, ResourceType } from '@prisma/client';

interface ResourceDetailClientProps {
  resource: Resource;
  relatedResources: Resource[];
}

const resourceTypeIcons: Record<ResourceType, React.ReactNode> = {
  TEMPLATE: <LayoutTemplate className="w-6 h-6" />,
  FRAMEWORK: <FileText className="w-6 h-6" />,
  CHECKLIST: <CheckSquare className="w-6 h-6" />,
  CALCULATOR: <Calculator className="w-6 h-6" />,
  REPORT: <BarChart3 className="w-6 h-6" />,
  TOOL: <Wrench className="w-6 h-6" />,
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

// Mock data for "what's included" - in production this would come from the database
const getIncludedItems = (type: ResourceType): string[] => {
  const items: Record<ResourceType, string[]> = {
    TEMPLATE: [
      'Ready-to-use document template',
      'Customization instructions',
      'Example filled version',
      'Best practices guide',
    ],
    FRAMEWORK: [
      'Complete framework structure',
      'Implementation guide',
      'Assessment criteria',
      'Case study examples',
    ],
    CHECKLIST: [
      'Comprehensive checklist items',
      'Priority scoring system',
      'Progress tracking sheet',
      'Action item templates',
    ],
    CALCULATOR: [
      'Interactive spreadsheet',
      'Input instructions',
      'Visual output charts',
      'Scenario comparison tools',
    ],
    REPORT: [
      'Industry research data',
      'Trend analysis',
      'Benchmark comparisons',
      'Strategic recommendations',
    ],
    TOOL: [
      'Working tool/application',
      'User guide documentation',
      'Setup instructions',
      'Support resources',
    ],
  };
  return items[type] || [];
};

export function ResourceDetailClient({ resource, relatedResources }: ResourceDetailClientProps) {
  const [showDownloadGate, setShowDownloadGate] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadClick = () => {
    if (resource.isGated) {
      setShowDownloadGate(true);
    } else {
      // Direct download for ungated resources
      window.open(resource.fileUrl, '_blank');
    }
  };

  const handleDownloadSuccess = () => {
    setDownloaded(true);
    setShowDownloadGate(false);
    // Open the file in a new tab
    window.open(resource.fileUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b border-border/50">
        <div className="container py-4">
          <Link 
            href="/solutions/resources"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div className="flex-1">
                  {/* Type & Meta */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge 
                      variant="outline" 
                      className={cn("flex items-center gap-1.5", resourceTypeColors[resource.type])}
                    >
                      {resourceTypeIcons[resource.type]}
                      {resourceTypeLabels[resource.type]}
                    </Badge>
                    {resource.featured && (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                    {resource.title}
                  </h1>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {resource.downloadCount} downloads
                    </span>
                    <span>•</span>
                    <span>{resource.fileFormat}</span>
                    <span>•</span>
                    <span>{resource.fileSize}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex-shrink-0">
                  {downloaded ? (
                    <Button size="lg" variant="outline" className="gap-2" disabled>
                      <Check className="w-5 h-5" />
                      Downloaded
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      className="gap-2 bg-amber-500 hover:bg-amber-600"
                      onClick={handleDownloadClick}
                    >
                      <Download className="w-5 h-5" />
                      {resource.isGated ? 'Get Free Access' : 'Download Now'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {resource.description}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <Separator />

      {/* Content Section */}
      <section className="py-12 lg:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <FadeIn delay={0.1}>
                  {/* What's Included */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6">What's Included</h2>
                    <ul className="space-y-3">
                      {getIncludedItems(resource.type).map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-amber-500" />
                          </div>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Topics */}
                  {resource.topics.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Topics Covered</h3>
                      <div className="flex flex-wrap gap-2">
                        {resource.topics.map((topic) => (
                          <Badge key={topic} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Category</h3>
                    <p className="text-muted-foreground">{resource.category}</p>
                  </div>
                </FadeIn>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                <FadeIn delay={0.2}>
                  {/* Download Card */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Download This Resource</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Format</span>
                          <span className="font-medium">{resource.fileFormat}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Size</span>
                          <span className="font-medium">{resource.fileSize}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Downloads</span>
                          <span className="font-medium">{resource.downloadCount}</span>
                        </div>
                        <Separator />
                        {downloaded ? (
                          <Button className="w-full" variant="outline" disabled>
                            <Check className="w-4 h-4 mr-2" />
                            Downloaded
                          </Button>
                        ) : (
                          <Button 
                            className="w-full bg-amber-500 hover:bg-amber-600"
                            onClick={handleDownloadClick}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {resource.isGated ? 'Get Free Access' : 'Download Now'}
                          </Button>
                        )}
                        {resource.isGated && (
                          <p className="text-xs text-muted-foreground text-center">
                            Free download — just enter your email
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Share Card */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Share This Resource</h3>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: resource.title,
                              text: resource.description,
                              url: window.location.href,
                            });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                          }
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Resource
                      </Button>
                    </CardContent>
                  </Card>
                </FadeIn>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      {relatedResources.length > 0 && (
        <section className="py-12 lg:py-20 bg-muted/30">
          <div className="container">
            <FadeIn>
              <h2 className="text-2xl font-bold mb-8">Related Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedResources.map((related) => (
                  <Card key={related.id} className="group overflow-hidden hover:shadow-lg transition-all">
                    <CardContent className="p-0">
                      <Link href={`/solutions/resources/${related.slug}`}>
                        <div className="p-6">
                          <Badge 
                            variant="outline" 
                            className={cn("mb-4", resourceTypeColors[related.type])}
                          >
                            {resourceTypeLabels[related.type]}
                          </Badge>
                          <h3 className="font-semibold mb-2 group-hover:text-amber-500 transition-colors">
                            {related.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {related.description}
                          </p>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Download Gate Modal */}
      {showDownloadGate && (
        <DownloadGate
          resourceId={resource.id}
          resourceTitle={resource.title}
          onClose={() => setShowDownloadGate(false)}
          onSuccess={handleDownloadSuccess}
        />
      )}
    </div>
  );
}
