'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog'
import { 
  PenTool, 
  FileText, 
  Plus, 
  Search, 
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { FadeIn } from '@/components/animations'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string | null
  service: string
  featured: boolean
  published: boolean
  publishedAt: string | null
  readingTime: number | null
  authorName: string
  createdAt: string
  updatedAt: string
}

const categories = [
  { value: 'AI_STRATEGY', label: 'AI Strategy' },
  { value: 'DIGITAL_TRANSFORMATION', label: 'Digital Transformation' },
  { value: 'PROCESS_AUTOMATION', label: 'Process Automation' },
  { value: 'TECHNOLOGY_ARCHITECTURE', label: 'Technology Architecture' },
  { value: 'LEADERSHIP', label: 'Leadership' },
  { value: 'CASE_STUDY', label: 'Case Study' },
  { value: 'INDUSTRY_INSIGHTS', label: 'Industry Insights' },
]

const services = [
  { value: 'WEB', label: 'Web Services', path: '/web/blog' },
  { value: 'SOLUTIONS', label: 'Solutions', path: '/solutions/blog' },
]

function formatCategoryLabel(category: string | null): string {
  if (!category) return 'Uncategorized'
  const found = categories.find(c => c.value === category)
  return found?.label || category.replace(/_/g, ' ')
}

export default function ContentPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('solutions')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    service: 'SOLUTIONS',
    featured: false,
    published: false,
    metaTitle: '',
    metaDesc: '',
    authorName: 'Pink Beam Team',
    authorTitle: '',
    tags: '',
    featuredImage: '',
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const response = await fetch('/api/admin/blog')
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data.posts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesService = activeTab === 'all' || post.service === activeTab.toUpperCase()
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.slug.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesService && matchesSearch
  })

  const webPosts = filteredPosts.filter(p => p.service === 'WEB')
  const solutionsPosts = filteredPosts.filter(p => p.service === 'SOLUTIONS')

  function handleEditClick(post: BlogPost) {
    setSelectedPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: '', // Would need to fetch full content
      category: post.category || '',
      service: post.service,
      featured: post.featured,
      published: post.published,
      metaTitle: '',
      metaDesc: '',
      authorName: post.authorName,
      authorTitle: '',
      tags: '',
      featuredImage: '',
    })
    
    // Fetch full post content
    fetch(`/api/admin/blog/${post.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.post) {
          setFormData(prev => ({
            ...prev,
            content: data.post.content,
            metaTitle: data.post.metaTitle || '',
            metaDesc: data.post.metaDesc || '',
            authorTitle: data.post.authorTitle || '',
            tags: data.post.tags?.join(', ') || '',
            featuredImage: data.post.featuredImage || '',
          }))
        }
      })
    
    setIsEditDialogOpen(true)
  }

  function handleCreateClick() {
    setSelectedPost(null)
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      service: activeTab === 'all' ? 'SOLUTIONS' : activeTab.toUpperCase(),
      featured: false,
      published: false,
      metaTitle: '',
      metaDesc: '',
      authorName: 'Pink Beam Team',
      authorTitle: '',
      tags: '',
      featuredImage: '',
    })
    setIsEditDialogOpen(true)
  }

  async function handleSave() {
    setIsSaving(true)
    try {
      const url = selectedPost 
        ? `/api/admin/blog/${selectedPost.id}` 
        : '/api/admin/blog'
      
      const method = selectedPost ? 'PATCH' : 'POST'
      
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save post')
      }

      await fetchPosts()
      setIsEditDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!selectedPost) return
    
    try {
      const response = await fetch(`/api/admin/blog/${selectedPost.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete post')

      await fetchPosts()
      setIsDeleteDialogOpen(false)
      setSelectedPost(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60)
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Content</h1>
            <p className="text-muted-foreground mt-1">Manage blog posts and content</p>
          </div>
          <Button onClick={handleCreateClick}>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </FadeIn>

      {/* Search */}
      <FadeIn delay={0.05}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.1}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="web">Web Services</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <PostList 
              posts={filteredPosts} 
              loading={loading}
              onEdit={handleEditClick}
              onDelete={(post) => {
                setSelectedPost(post)
                setIsDeleteDialogOpen(true)
              }}
            />
          </TabsContent>

          <TabsContent value="web" className="mt-6">
            <PostList 
              posts={webPosts} 
              loading={loading}
              onEdit={handleEditClick}
              onDelete={(post) => {
                setSelectedPost(post)
                setIsDeleteDialogOpen(true)
              }}
            />
          </TabsContent>

          <TabsContent value="solutions" className="mt-6">
            <PostList 
              posts={solutionsPosts} 
              loading={loading}
              onEdit={handleEditClick}
              onDelete={(post) => {
                setSelectedPost(post)
                setIsDeleteDialogOpen(true)
              }}
            />
          </TabsContent>
        </Tabs>
      </FadeIn>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            <DialogDescription>
              {selectedPost ? 'Update your blog post details.' : 'Create a new blog post.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Basic Information
              </h3>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value
                      setFormData(prev => ({
                        ...prev,
                        title,
                        slug: prev.slug || generateSlug(title),
                        metaTitle: prev.metaTitle || title,
                      }))
                    }}
                    placeholder="Post title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-friendly-slug"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service">Service</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief summary of the post"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content (Markdown)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="# Your post content in markdown..."
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Author Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Author Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="authorName">Author Name</Label>
                  <Input
                    id="authorName"
                    value={formData.authorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authorTitle">Author Title</Label>
                  <Input
                    id="authorTitle"
                    value={formData.authorTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, authorTitle: e.target.value }))}
                    placeholder="e.g. CEO, Lead Consultant"
                  />
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="space-y-4">
              <h3 className="font-semibold">SEO Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    placeholder="SEO title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDesc">Meta Description</Label>
                  <Textarea
                    id="metaDesc"
                    value={formData.metaDesc}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDesc: e.target.value }))}
                    placeholder="SEO description"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="AI, Strategy, Digital Transformation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold">Settings</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  />
                  <Label htmlFor="published" className="cursor-pointer">
                    {formData.published ? 'Published' : 'Draft'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Featured Post
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm mb-4">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {selectedPost ? 'Save Changes' : 'Create Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedPost?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PostList({ 
  posts, 
  loading, 
  onEdit, 
  onDelete 
}: { 
  posts: BlogPost[]
  loading: boolean
  onEdit: (post: BlogPost) => void
  onDelete: (post: BlogPost) => void
}) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Loading posts...</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No posts yet</h3>
          <p className="text-muted-foreground text-sm">Create your first blog post to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <motion.div
          key={post.id}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card className="group hover:border-violet-500/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Status Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    post.published 
                      ? 'bg-emerald-500/10' 
                      : 'bg-amber-500/10'
                  }`}>
                    {post.published ? (
                      <Eye className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-amber-500" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium truncate">{post.title}</h3>
                      {post.featured && (
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                      <span className="capitalize">{post.service.toLowerCase()}</span>
                      <span>•</span>
                      <span>{formatCategoryLabel(post.category)}</span>
                      <span>•</span>
                      <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
                      {post.readingTime && (
                        <>
                          <span>•</span>
                          <span>{post.readingTime} min read</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    asChild
                  >
                    <Link 
                      href={`/${post.service.toLowerCase()}/blog/${post.slug}`}
                      target="_blank"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(post)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(post)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
