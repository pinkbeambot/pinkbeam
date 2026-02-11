'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Copy, Edit, Trash2, FileText, Loader2, Search, MoreHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'

interface TemplateLineItem {
  description: string
  quantity: number
  unitPrice: number
}

interface QuoteTemplate {
  id: string
  name: string
  description: string | null
  title: string
  lineItems: TemplateLineItem[]
  taxRate: number | null
  terms: string | null
  category: string
  createdAt: string
}

const defaultTemplates: QuoteTemplate[] = [
  {
    id: 'default-website',
    name: 'Basic Website Package',
    description: 'Standard 5-page business website with responsive design',
    title: 'Website Design & Development',
    category: 'Web Design',
    lineItems: [
      { description: 'Homepage Design & Development', quantity: 1, unitPrice: 1500 },
      { description: 'Additional Pages (4)', quantity: 4, unitPrice: 500 },
      { description: 'Mobile Responsive Design', quantity: 1, unitPrice: 500 },
      { description: 'Contact Form Integration', quantity: 1, unitPrice: 300 },
      { description: 'Basic SEO Setup', quantity: 1, unitPrice: 400 },
    ],
    taxRate: 0,
    terms: '50% deposit required to begin work. Balance due upon completion.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-ecommerce',
    name: 'E-Commerce Package',
    description: 'Full-featured online store with payment processing',
    title: 'E-Commerce Website Development',
    category: 'E-Commerce',
    lineItems: [
      { description: 'Custom Theme Design', quantity: 1, unitPrice: 2500 },
      { description: 'Product Catalog Setup (up to 50 products)', quantity: 1, unitPrice: 1000 },
      { description: 'Payment Gateway Integration', quantity: 1, unitPrice: 800 },
      { description: 'Shopping Cart & Checkout', quantity: 1, unitPrice: 1200 },
      { description: 'User Account System', quantity: 1, unitPrice: 600 },
      { description: 'Order Management Dashboard', quantity: 1, unitPrice: 800 },
    ],
    taxRate: 0,
    terms: '50% deposit required. 25% at midpoint, 25% upon launch.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-consulting',
    name: 'Consulting Package',
    description: 'Hourly consulting and advisory services',
    title: 'Technology Consulting Services',
    category: 'Consulting',
    lineItems: [
      { description: 'Initial Strategy Session (2 hours)', quantity: 2, unitPrice: 200 },
      { description: 'Ongoing Consulting (per hour)', quantity: 10, unitPrice: 175 },
      { description: 'Technical Documentation', quantity: 1, unitPrice: 500 },
    ],
    taxRate: 0,
    terms: 'Billed monthly. Net 15 payment terms.',
    createdAt: new Date().toISOString(),
  },
]

function getInitialTemplates(): QuoteTemplate[] {
  if (typeof window === 'undefined') return defaultTemplates
  const stored = localStorage.getItem('quoteTemplates')
  if (stored) {
    return [...defaultTemplates, ...JSON.parse(stored)]
  }
  return defaultTemplates
}

export default function QuoteTemplatesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [templates, setTemplates] = useState<QuoteTemplate[]>(defaultTemplates)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null)
  const [useTemplateId, setUseTemplateId] = useState<string | null>(null)
  const [clients, setClients] = useState<Array<{ id: string; name: string | null; email: string }>>([])
  const [selectedClientId, setSelectedClientId] = useState('')

  useEffect(() => {
    // Load templates from localStorage on client side
    setTemplates(getInitialTemplates())
    setLoading(false)

    // Fetch clients for the "use template" dialog
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setClients(data.data || [])
        }
      })
  }, [])

  const handleDelete = () => {
    if (!deleteTemplateId) return

    // Only delete custom templates (not defaults)
    if (!deleteTemplateId.startsWith('default-')) {
      const stored = JSON.parse(localStorage.getItem('quoteTemplates') || '[]')
      const updated = stored.filter((t: QuoteTemplate) => t.id !== deleteTemplateId)
      localStorage.setItem('quoteTemplates', JSON.stringify(updated))
    }

    setTemplates(prev => prev.filter(t => t.id !== deleteTemplateId))
    setDeleteTemplateId(null)
    toast({ title: 'Template deleted' })
  }

  const handleUseTemplate = () => {
    if (!useTemplateId || !selectedClientId) return

    const template = templates.find(t => t.id === useTemplateId)
    if (!template) return

    // Create quote from template
    const quoteData = {
      title: template.title,
      description: template.description,
      clientId: selectedClientId,
      lineItems: template.lineItems,
      taxRate: template.taxRate || 0,
      terms: template.terms,
    }

    // Store in sessionStorage for the new quote page to pick up
    sessionStorage.setItem('newQuoteFromTemplate', JSON.stringify(quoteData))
    router.push('/labs/dashboard/quotes/new')
  }

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const calculateTotal = (lineItems: TemplateLineItem[], taxRate: number = 0) => {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const tax = subtotal * (taxRate / 100)
    return subtotal + tax
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Quote Templates"
        description="Create and manage reusable quote templates"
      />

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search templates..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link href="/labs/dashboard/quotes/templates/new">
          <Button className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </Link>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first template to speed up quote creation
          </p>
          <Link href="/labs/dashboard/quotes/templates/new">
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {template.category}
                    </p>
                    <CardTitle className="text-lg mt-1">{template.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setUseTemplateId(template.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Use Template
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/labs/dashboard/quotes/templates/${template.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      {!template.id.startsWith('default-') && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setDeleteTemplateId(template.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description || 'No description'}
                </p>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">{template.lineItems.length} line items</p>
                  <p className="text-xs text-muted-foreground">
                    Estimated: {formatCurrency(calculateTotal(template.lineItems, template.taxRate || 0))}
                  </p>
                </div>

                <Button 
                  onClick={() => setUseTemplateId(template.id)}
                  className="w-full"
                  variant="outline"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTemplateId} onOpenChange={() => setDeleteTemplateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this template. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Use Template Dialog */}
      <AlertDialog open={!!useTemplateId} onOpenChange={() => setUseTemplateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Use Template</AlertDialogTitle>
            <AlertDialogDescription>
              Select a client to create a new quote from this template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="client">Select Client *</Label>
            <select
              id="client"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full mt-2 p-2 border rounded-md"
            >
              <option value="">Choose a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name || client.email}
                </option>
              ))}
            </select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleUseTemplate}
              disabled={!selectedClientId}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              Create Quote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}