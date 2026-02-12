'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Plus, Trash2, Loader2, Save, Eye, Send, GripVertical } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface Client {
  id: string
  name: string | null
  email: string
  company: string | null
}

interface Project {
  id: string
  title: string
}

interface LineItem {
  id?: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Quote {
  id: string
  quoteNumber: string
  title: string
  description: string | null
  status: string
  clientId: string
  projectId: string | null
  lineItems: LineItem[]
  subtotal: number
  taxRate: number | null
  taxAmount: number | null
  total: number
  validUntil: string | null
  notes: string | null
  terms: string | null
  client: Client
  project: Project | null
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-500',
  SENT: 'bg-blue-500',
  VIEWED: 'bg-purple-500',
  ACCEPTED: 'bg-green-500',
  DECLINED: 'bg-red-500',
  EXPIRED: 'bg-orange-500',
}

export default function QuoteBuilderPage() {
  const router = useRouter()
  const params = useParams()
  const quoteId = params.id as string
  const isNew = quoteId === 'new'
  const { toast } = useToast()

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [quote, setQuote] = useState<Partial<Quote>>({
    title: '',
    description: '',
    clientId: '',
    projectId: null,
    lineItems: [],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    validUntil: null,
    notes: '',
    terms: '',
    status: 'DRAFT',
  })

  // Fetch clients and projects on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, projectsRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/labs/projects'),
        ])

        const clientsData = await clientsRes.json()
        const projectsData = await projectsRes.json()

        if (clientsData.success) {
          setClients(clientsData.data || [])
        }
        if (projectsData.success) {
          setProjects(projectsData.data || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  // Fetch existing quote if editing
  useEffect(() => {
    if (isNew) {
      // Check if we're creating from a template
      const templateData = sessionStorage.getItem('newQuoteFromTemplate')
      if (templateData) {
        const template = JSON.parse(templateData)
        const lineItemsWithTotals = template.lineItems.map((item: { description: string; quantity: number; unitPrice: number }) => ({
          ...item,
          total: item.quantity * item.unitPrice,
        }))
        const subtotal = lineItemsWithTotals.reduce((sum: number, item: { total: number }) => sum + item.total, 0)
        const taxRate = template.taxRate || 0
        const taxAmount = subtotal * (taxRate / 100)
        const total = subtotal + taxAmount

        setQuote(prev => ({
          ...prev,
          title: template.title,
          description: template.description,
          lineItems: lineItemsWithTotals,
          taxRate,
          subtotal,
          taxAmount,
          total,
          terms: template.terms,
        }))
        sessionStorage.removeItem('newQuoteFromTemplate')
      }
      setLoading(false)
      return
    }

    const fetchQuote = async () => {
      try {
        const response = await fetch(`/api/labs/quotes/${quoteId}`)
        const result = await response.json()

        if (result.success) {
          setQuote({
            ...result.data,
            validUntil: result.data.validUntil 
              ? new Date(result.data.validUntil).toISOString().split('T')[0]
              : null,
          })
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to fetch quote',
            variant: 'destructive',
          })
          router.push('/portal/admin/labs/quotes')
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch quote',
          variant: 'destructive',
        })
        router.push('/portal/admin/labs/quotes')
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
  }, [quoteId, isNew, router, toast])

  const calculateTotals = useCallback((items: LineItem[], taxRate: number = quote.taxRate || 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const taxAmount = subtotal * (taxRate / 100)
    const total = subtotal + taxAmount
    return { subtotal, taxAmount, total }
  }, [quote.taxRate])

  const addLineItem = () => {
    const newItem: LineItem = {
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
    const newItems = [...(quote.lineItems || []), newItem]
    const totals = calculateTotals(newItems)
    setQuote(prev => ({
      ...prev,
      lineItems: newItems,
      ...totals,
    }))
  }

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...(quote.lineItems || [])]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Recalculate line item total
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice
    }
    
    const totals = calculateTotals(newItems)
    setQuote(prev => ({
      ...prev,
      lineItems: newItems,
      ...totals,
    }))
  }

  const removeLineItem = (index: number) => {
    const newItems = (quote.lineItems || []).filter((_, i) => i !== index)
    const totals = calculateTotals(newItems)
    setQuote(prev => ({
      ...prev,
      lineItems: newItems,
      ...totals,
    }))
  }

  const handleTaxRateChange = (value: string) => {
    const taxRate = parseFloat(value) || 0
    const totals = calculateTotals(quote.lineItems || [], taxRate)
    setQuote(prev => ({
      ...prev,
      taxRate,
      ...totals,
    }))
  }

  const handleSave = async (send = false) => {
    if (!quote.title || !quote.clientId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    if (!quote.lineItems || quote.lineItems.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one line item',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)

    try {
      const url = isNew ? '/api/labs/quotes' : `/api/labs/quotes/${quoteId}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: quote.title,
          description: quote.description,
          clientId: quote.clientId,
          projectId: quote.projectId,
          lineItems: quote.lineItems.map(item => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          taxRate: quote.taxRate,
          validUntil: quote.validUntil,
          notes: quote.notes,
          terms: quote.terms,
        }),
      })

      const result = await response.json()

      if (result.success) {
        if (send) {
          // Send the quote
          const sendResponse = await fetch(`/api/labs/quotes/${result.data.id}/send`, {
            method: 'POST',
          })
          const sendResult = await sendResponse.json()

          if (sendResult.success) {
            toast({
              title: 'Success',
              description: 'Quote created and sent successfully',
            })
            router.push('/portal/admin/labs/quotes')
          } else {
            toast({
              title: 'Warning',
              description: 'Quote saved but failed to send',
              variant: 'destructive',
            })
          }
        } else {
          toast({
            title: 'Success',
            description: isNew ? 'Quote created successfully' : 'Quote updated successfully',
          })
          if (isNew) {
            router.push(`/portal/admin/labs/quotes/${result.data.id}`)
          } else {
            setQuote(prev => ({ ...prev, ...result.data }))
          }
        }
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save quote',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save quote',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/portal/admin/labs/quotes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {isNew ? 'New Quote' : quote.quoteNumber}
            </h1>
            {!isNew && quote.status && (
              <Badge className={`${statusColors[quote.status]} text-white mt-1`}>
                {quote.status}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={isNew ? '#' : `/portal/admin/labs/quotes/${quoteId}/preview`}>
            <Button variant="outline" disabled={isNew}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Save & Send
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quote Details */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Quote Title *</Label>
                <Input
                  id="title"
                  value={quote.title || ''}
                  onChange={(e) => setQuote(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Website Redesign Project"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={quote.description || ''}
                  onChange={(e) => setQuote(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the quote..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Line Items</CardTitle>
              <Button onClick={addLineItem} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {quote.lineItems && quote.lineItems.length > 0 ? (
                <div className="space-y-4">
                  {quote.lineItems.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start p-4 border rounded-lg bg-muted/30">
                      <div className="flex-1 space-y-2">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          placeholder="Item description..."
                          rows={2}
                        />
                      </div>
                      <div className="w-24 space-y-2">
                        <Label className="text-xs">Qty</Label>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <Label className="text-xs">Unit Price</Label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <Label className="text-xs">Total</Label>
                        <div className="h-10 flex items-center font-medium">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mt-6"
                        onClick={() => removeLineItem(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground mb-4">No line items added</p>
                  <Button onClick={addLineItem} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Item
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes & Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Notes & Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  value={quote.notes || ''}
                  onChange={(e) => setQuote(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Internal notes (not visible to client)..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={quote.terms || ''}
                  onChange={(e) => setQuote(prev => ({ ...prev, terms: e.target.value }))}
                  placeholder="Payment terms, delivery conditions, etc..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client & Project */}
          <Card>
            <CardHeader>
              <CardTitle>Client & Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="client">Client *</Label>
                <Select 
                  value={quote.clientId || ''} 
                  onValueChange={(value) => setQuote(prev => ({ ...prev, clientId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name || client.email} {client.company && `(${client.company})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="project">Project (Optional)</Label>
                <Select 
                  value={quote.projectId || ''} 
                  onValueChange={(value) => setQuote(prev => ({ ...prev, projectId: value || null }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Link to project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Quote Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={quote.validUntil || ''}
                  onChange={(e) => setQuote(prev => ({ ...prev, validUntil: e.target.value || null }))}
                />
              </div>
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  value={quote.taxRate || 0}
                  onChange={(e) => handleTaxRateChange(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(quote.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({quote.taxRate || 0}%)</span>
                <span>{formatCurrency(quote.taxAmount || 0)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-cyan-600">{formatCurrency(quote.total || 0)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}