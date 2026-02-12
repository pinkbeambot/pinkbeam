'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Download,
  ChevronLeft,
  FileText,
  LayoutTemplate,
  CheckSquare,
  Calculator,
  BarChart3,
  Wrench,
  Lock,
  Unlock,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FadeIn } from '@/components/animations';
import { cn } from '@/lib/utils';
import type { Resource, ResourceType } from '@prisma/client';

interface ResourceWithCount extends Resource {
  _count: {
    downloads: number;
  };
}

interface ResourcesAdminClientProps {
  resources: ResourceWithCount[];
}

const resourceTypeIcons: Record<ResourceType, React.ReactNode> = {
  TEMPLATE: <LayoutTemplate className="w-4 h-4" />,
  FRAMEWORK: <FileText className="w-4 h-4" />,
  CHECKLIST: <CheckSquare className="w-4 h-4" />,
  CALCULATOR: <Calculator className="w-4 h-4" />,
  REPORT: <BarChart3 className="w-4 h-4" />,
  TOOL: <Wrench className="w-4 h-4" />,
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
  TEMPLATE: 'bg-violet-500/10 text-violet-500',
  FRAMEWORK: 'bg-blue-500/10 text-blue-500',
  CHECKLIST: 'bg-green-500/10 text-green-500',
  CALCULATOR: 'bg-amber-500/10 text-amber-500',
  REPORT: 'bg-purple-500/10 text-purple-500',
  TOOL: 'bg-cyan-500/10 text-cyan-500',
};

export function ResourcesAdminClient({ resources: initialResources }: ResourcesAdminClientProps) {
  const [resources, setResources] = useState<ResourceWithCount[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceWithCount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    type: 'TEMPLATE' as ResourceType,
    category: '',
    topics: '',
    fileUrl: '',
    fileFormat: 'PDF',
    fileSize: '',
    isGated: true,
    featured: false,
    published: false,
  });

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          topics: formData.topics.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResources([{ ...data.data, _count: { downloads: 0 } }, ...resources]);
        setIsCreateDialogOpen(false);
        resetForm();
      } else {
        alert(data.error || 'Failed to create resource');
      }
    } catch {
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingResource) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/resources/${editingResource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          topics: formData.topics.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResources(resources.map(r => r.id === editingResource.id ? { ...data.data, _count: r._count } : r));
        setEditingResource(null);
        resetForm();
      } else {
        alert(data.error || 'Failed to update resource');
      }
    } catch {
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const response = await fetch(`/api/admin/resources/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setResources(resources.filter(r => r.id !== id));
      } else {
        alert(data.error || 'Failed to delete resource');
      }
    } catch {
      alert('Network error');
    }
  };

  const handleTogglePublish = async (resource: ResourceWithCount) => {
    try {
      const response = await fetch(`/api/admin/resources/${resource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !resource.published }),
      });

      const data = await response.json();
      if (data.success) {
        setResources(resources.map(r => r.id === resource.id ? { ...r, published: !r.published } : r));
      }
    } catch {
      alert('Network error');
    }
  };

  const handleToggleGated = async (resource: ResourceWithCount) => {
    try {
      const response = await fetch(`/api/admin/resources/${resource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isGated: !resource.isGated }),
      });

      const data = await response.json();
      if (data.success) {
        setResources(resources.map(r => r.id === resource.id ? { ...r, isGated: !r.isGated } : r));
      }
    } catch {
      alert('Network error');
    }
  };

  const handleToggleFeatured = async (resource: ResourceWithCount) => {
    try {
      const response = await fetch(`/api/admin/resources/${resource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !resource.featured }),
      });

      const data = await response.json();
      if (data.success) {
        setResources(resources.map(r => r.id === resource.id ? { ...r, featured: !r.featured } : r));
      }
    } catch {
      alert('Network error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      type: 'TEMPLATE',
      category: '',
      topics: '',
      fileUrl: '',
      fileFormat: 'PDF',
      fileSize: '',
      isGated: true,
      featured: false,
      published: false,
    });
  };

  const openEditDialog = (resource: ResourceWithCount) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      slug: resource.slug,
      description: resource.description,
      type: resource.type,
      category: resource.category,
      topics: resource.topics.join(', '),
      fileUrl: resource.fileUrl,
      fileFormat: resource.fileFormat,
      fileSize: resource.fileSize,
      isGated: resource.isGated,
      featured: resource.featured,
      published: resource.published,
    });
  };

  const totalDownloads = resources.reduce((sum, r) => sum + r._count.downloads, 0);
  const publishedCount = resources.filter(r => r.published).length;
  const featuredCount = resources.filter(r => r.featured).length;
  const gatedCount = resources.filter(r => r.isGated).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/portal/admin/web">
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Resources</h1>
              <p className="text-muted-foreground mt-1">
                Manage your resource library content
              </p>
            </div>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Resource</DialogTitle>
              </DialogHeader>
              <ResourceForm 
                formData={formData} 
                setFormData={setFormData} 
                onSubmit={handleCreate}
                isSubmitting={isSubmitting}
                submitLabel="Create Resource"
              />
            </DialogContent>
          </Dialog>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Resources</p>
              <p className="text-3xl font-bold mt-2">{resources.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Published</p>
              <p className="text-3xl font-bold mt-2">{publishedCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Featured</p>
              <p className="text-3xl font-bold mt-2">{featuredCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
              <p className="text-3xl font-bold mt-2">{totalDownloads}</p>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Search */}
      <FadeIn delay={0.15}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>
      </FadeIn>

      {/* Resources Table */}
      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle>All Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Resource</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-center py-3 px-4 font-medium">Downloads</th>
                    <th className="text-center py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map((resource) => (
                    <tr key={resource.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-sm text-muted-foreground">{resource.slug}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={cn(resourceTypeColors[resource.type])}>
                          {resourceTypeIcons[resource.type]}
                          <span className="ml-1">{resourceTypeLabels[resource.type]}</span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {resource.category}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="flex items-center justify-center gap-1">
                          <Download className="w-4 h-4 text-muted-foreground" />
                          {resource._count.downloads}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleTogglePublish(resource)}
                            className={cn(
                              "p-1.5 rounded-lg transition-colors",
                              resource.published ? "text-green-500 hover:bg-green-500/10" : "text-muted-foreground hover:bg-muted"
                            )}
                            title={resource.published ? 'Published' : 'Draft'}
                          >
                            {resource.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleToggleGated(resource)}
                            className={cn(
                              "p-1.5 rounded-lg transition-colors",
                              resource.isGated ? "text-amber-500 hover:bg-amber-500/10" : "text-muted-foreground hover:bg-muted"
                            )}
                            title={resource.isGated ? 'Gated' : 'Open'}
                          >
                            {resource.isGated ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(resource)}
                            className={cn(
                              "p-1.5 rounded-lg transition-colors",
                              resource.featured ? "text-yellow-500 hover:bg-yellow-500/10" : "text-muted-foreground hover:bg-muted"
                            )}
                            title={resource.featured ? 'Featured' : 'Not Featured'}
                          >
                            <Star className={cn("w-4 h-4", resource.featured && "fill-current")} />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog(resource)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(resource.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No resources found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Edit Dialog */}
      <Dialog open={!!editingResource} onOpenChange={() => setEditingResource(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          <ResourceForm 
            formData={formData} 
            setFormData={setFormData} 
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            submitLabel="Save Changes"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ResourceFormProps {
  formData: {
    title: string;
    slug: string;
    description: string;
    type: ResourceType;
    category: string;
    topics: string;
    fileUrl: string;
    fileFormat: string;
    fileSize: string;
    isGated: boolean;
    featured: boolean;
    published: boolean;
  };
  setFormData: (data: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

function ResourceForm({ formData, setFormData, onSubmit, isSubmitting, submitLabel }: ResourceFormProps) {
  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as ResourceType })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TEMPLATE">Template</SelectItem>
              <SelectItem value="FRAMEWORK">Framework</SelectItem>
              <SelectItem value="CHECKLIST">Checklist</SelectItem>
              <SelectItem value="CALCULATOR">Calculator</SelectItem>
              <SelectItem value="REPORT">Report</SelectItem>
              <SelectItem value="TOOL">Tool</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="topics">Topics (comma separated)</Label>
        <Input
          id="topics"
          value={formData.topics}
          onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
          placeholder="AI, Automation, Strategy"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fileUrl">File URL *</Label>
        <Input
          id="fileUrl"
          type="url"
          value={formData.fileUrl}
          onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fileFormat">File Format *</Label>
          <Select
            value={formData.fileFormat}
            onValueChange={(value) => setFormData({ ...formData, fileFormat: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PDF">PDF</SelectItem>
              <SelectItem value="XLSX">XLSX</SelectItem>
              <SelectItem value="DOCX">DOCX</SelectItem>
              <SelectItem value="PPTX">PPTX</SelectItem>
              <SelectItem value="ZIP">ZIP</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fileSize">File Size *</Label>
          <Input
            id="fileSize"
            value={formData.fileSize}
            onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
            placeholder="2.4 MB"
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-6 pt-2">
        <div className="flex items-center gap-2">
          <Switch
            id="isGated"
            checked={formData.isGated}
            onCheckedChange={(checked) => setFormData({ ...formData, isGated: checked })}
          />
          <Label htmlFor="isGated" className="cursor-pointer">Gated (requires email)</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
          />
          <Label htmlFor="featured" className="cursor-pointer">Featured</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
          />
          <Label htmlFor="published" className="cursor-pointer">Published</Label>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
