'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
import { ArrowLeft, Plus, Trash2, Loader2, Clock, Check } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Client {
  id: string
  name: string | null
  email: string
  company: string | null
}

interface Project {
  id: string
  title: string
  clientId: string
}

interface TimeEntry {
  id: string
  description: string | null
  duration: number
  startTime: string
  hourlyRate: number
  hours: number
  amount: number
  user: {
    name: string | null
    email: string
  }
  project: {
    id: string
    title: string
  }
  task: {
    id: string
    title: string
  } | null
}

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  timeEntryId?: string
}

export default function NewInvoicePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [selectedClientId, setSelectedClientId] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [taxRate, setTaxRate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [terms, setTerms] = useState('Net 30')
  const [timeEntryDialogOpen, setTimeEntryDialogOpen] = useState(false)
  const [selectedTimeEntries, setSelectedTimeEntries] = useState<string[]>([])

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = taxRate ? subtotal * (parseFloat(taxRate) / 100) : 0
  const total = subtotal + taxAmount

  // Fetch clients on mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/labs/projects')
        const result = await response.json()
        if (result.success) {
          // Extract unique clients from projects
          const clientMap = new Map<string, Client>()
          result.data.forEach((project: { client?: Client }) => {
            if (project.client && !clientMap.has(project.client.id)) {
              clientMap.set(project.client.id, project.client)
            }
          })
          setClients(Array.from(clientMap.values()))
          setProjects(result.data)
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
      }
    }
    fetchClients()
  }, [])

  // Fetch time entries when client changes
  const fetchTimeEntries = useCallback(async () => {
    if (!selectedClientId) {
      setTimeEntries([])
      return
    }

    try {
      const params = new URLSearchParams()
      params.append('clientId', selectedClientId)
      if (selectedProjectId) params.append('projectId', selectedProjectId)

      const response = await fetch(`/api/labs/invoices/new/time-entries?${params.toString()}`)
      const result = await response.json()
      if (result.success) {
        setTimeEntries(result.data)
      }
    } catch (error) {
      console.error('Error fetching time entries:', error)
    }
  }, [selectedClientId, selectedProjectId])

  useEffect(() => {
    fetchTimeEntries()
  }, [fetchTimeEntries])

  // Set default due date (30 days from now)
  useEffect(() => {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    setDueDate(date.toISOString().split('T')[0])
  }, [])

  const handleAddLineItem = () => {
    const newItem: LineItem = {
      id: `temp-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
    setLineItems([...lineItems, newItem])
  }

  const handleUpdateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice
        }
        return updated
      }
      return item
    }))
  }

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id))
  }

  const handleImportTimeEntries = () => {
    const selectedEntries = timeEntries.filter(entry => 
      selectedTimeEntries.includes(entry.id)
    )

    const newLineItems = selectedEntries.map(entry => ({
      id: `temp-${Date.now()}-${entry.id}`,
      description: `${entry.project.title}: ${entry.description || entry.task?.title || 'Time entry'} (${entry.hours} hours)`,
      quantity: entry.hours,
      unitPrice: entry.hourlyRate,
      total: entry.amount,
      timeEntryId: entry.id,
    }))

    setLineItems([...lineItems, ...newLineItems])
    setSelectedTimeEntries([])
    setTimeEntryDialogOpen(false)

    toast({
      title: 'Success',
      description: `${newLineItems.length} time entries imported`,
    })
  }

  const handleToggleTimeEntry = (entryId: string) => {
    setSelectedTimeEntries(prev =>
      prev.includes(entryId)
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    )
  }

  const filteredProjects = projects.filter(p => 
    !selectedClientId || p.clientId === selectedClientId
  )

  const handleSubmit = async (saveAsDraft = true) => {
    if (!selectedClientId) {
      toast({
        title: 'Error',
        description: 'Please select a client',
        variant: 'destructive',
      })
      return
    }

    if (lineItems.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one line item',
        variant: 'destructive',
      })
      return
    }

    // Validate line items
    for (const item of lineItems) {
      if (!item.description || item.quantity <= 0 || item.unitPrice < 0) {
        toast({
          title: 'Error',
          description: 'Please fill in all line item details',
          variant: 'destructive',
        })
        return
      }
    }

    setLoading(true)

    try {
      const timeEntryIds = lineItems
        .filter(item => item.timeEntryId)
        .map(item => item.timeEntryId!)

      const response = await fetch('/api/labs/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClientId,
          projectId: selectedProjectId || null,
          lineItems: lineItems.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            timeEntryId: item.timeEntryId,
          })),
          taxRate: taxRate ? parseFloat(taxRate) : null,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          notes: notes || undefined,
          terms: terms || undefined,
          timeEntryIds,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: saveAsDraft ? 'Invoice saved as draft' : 'Invoice created and sent',
        })
        router.push('/labs/dashboard/invoices')
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create invoice',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create invoice',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/labs/dashboard/invoices">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <PageHeader 
          title="New Invoice"
          description="Create a new invoice for your client"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client & Project */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                    <SelectTrigger id="client">
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

                <div className="space-y-2">
                  <Label htmlFor="project">Project (Optional)</Label>
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No project</SelectItem>
                      {filteredProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terms">Payment Terms</Label>
                  <Input
                    id="terms"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    placeholder="e.g., Net 30"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Line Items</CardTitle>
              <div className="flex gap-2">
                {timeEntries.length > 0 && (
                  <Dialog open={timeEntryDialogOpen} onOpenChange={setTimeEntryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Clock className="w-4 h-4 mr-2" />
                        Import Time ({timeEntries.length})
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Import Time Entries</DialogTitle>
                        <DialogDescription>
                          Select unbilled time entries to add to this invoice
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {timeEntries.length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">
                            No unbilled time entries found for this client
                          </p>
                        ) : (
                          <>
                            <div className="space-y-2">
                              {timeEntries.map((entry) => (
                                <div
                                  key={entry.id}
                                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                                  onClick={() => handleToggleTimeEntry(entry.id)}
                                >
                                  <Checkbox
                                    checked={selectedTimeEntries.includes(entry.id)}
                                    onCheckedChange={() => handleToggleTimeEntry(entry.id)}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm">
                                      {entry.project.title}: {entry.description || entry.task?.title || 'Time entry'}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {entry.user.name || entry.user.email} • {formatDate(entry.startTime)}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium text-sm">{entry.hours} hrs</div>
                                    <div className="text-xs text-muted-foreground">
                                      {formatCurrency(entry.amount)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t">
                              <span className="text-sm text-muted-foreground">
                                {selectedTimeEntries.length} entries selected
                              </span>
                              <Button
                                onClick={handleImportTimeEntries}
                                disabled={selectedTimeEntries.length === 0}
                                className="bg-cyan-600 hover:bg-cyan-700"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Import Selected
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                <Button variant="outline" size="sm" onClick={handleAddLineItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {lineItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No line items yet</p>
                  <p className="text-sm">Add items manually or import from time tracking</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lineItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 items-start">
                      <div className="col-span-5">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleUpdateLineItem(item.id, 'description', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Qty"
                          value={item.quantity || ''}
                          onChange={(e) => handleUpdateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Price"
                          value={item.unitPrice || ''}
                          onChange={(e) => handleUpdateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          readOnly
                          value={item.total.toFixed(2)}
                          className="bg-muted"
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveLineItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes for the client..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {taxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Save as Draft
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                >
                  Save & Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
