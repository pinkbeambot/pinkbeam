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
import { ArrowLeft, Plus, Trash2, Loader2, Clock, Check, Send, Download } from 'lucide-react'
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

interface Payment {
  id: string
  amount: number
  method: string
  reference: string | null
  notes: string | null
  paidAt: string
}

interface Invoice {
  id: string
  invoiceNumber: string
  status: string
  subtotal: number
  taxRate: number | null
  taxAmount: number | null
  total: number
  amountPaid: number
  amountDue: number
  issueDate: string
  dueDate: string
  sentAt: string | null
  paidAt: string | null
  notes: string | null
  terms: string
  clientId: string
  projectId: string | null
  client: {
    id: string
    name: string | null
    email: string
    company: string | null
  }
  project: {
    id: string
    title: string
  } | null
  lineItems: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    timeEntryId: string | null
  }>
  payments: Payment[]
}

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  timeEntryId?: string
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-500',
  SENT: 'bg-blue-500',
  VIEWED: 'bg-purple-500',
  PARTIAL: 'bg-orange-500',
  PAID: 'bg-green-500',
  OVERDUE: 'bg-red-500',
  CANCELLED: 'bg-gray-400',
}

export default function EditInvoicePage() {
  const router = useRouter()
  const params = useParams()
  const invoiceId = params.id as string
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
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

  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const [invoiceRes, projectsRes] = await Promise.all([
          fetch(`/api/labs/invoices/${invoiceId}`),
          fetch('/api/labs/projects'),
        ])

        const invoiceResult = await invoiceRes.json()
        const projectsResult = await projectsRes.json()

        if (invoiceResult.success && projectsResult.success) {
          const inv = invoiceResult.data
          setInvoice(inv)
          setSelectedClientId(inv.clientId)
          setSelectedProjectId(inv.projectId || '')
          setLineItems(inv.lineItems.map((item: { id: string; description: string; quantity: number; unitPrice: number; total: number; timeEntryId: string | null }) => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
            timeEntryId: item.timeEntryId || undefined,
          })))
          setTaxRate(inv.taxRate?.toString() || '')
          setDueDate(inv.dueDate.split('T')[0])
          setNotes(inv.notes || '')
          setTerms(inv.terms)
          setProjects(projectsResult.data)

          // Extract unique clients
          const clientMap = new Map<string, Client>()
          projectsResult.data.forEach((project: { client?: Client }) => {
            if (project.client && !clientMap.has(project.client.id)) {
              clientMap.set(project.client.id, project.client)
            }
          })
          setClients(Array.from(clientMap.values()))
        } else {
          toast({
            title: 'Error',
            description: 'Failed to load invoice',
            variant: 'destructive',
          })
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load invoice',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInvoice()
  }, [invoiceId, toast])

  // Fetch time entries
  const fetchTimeEntries = useCallback(async () => {
    if (!selectedClientId) {
      setTimeEntries([])
      return
    }

    try {
      const response = await fetch(`/api/labs/invoices/${invoiceId}/time-entries`)
      const result = await response.json()
      if (result.success) {
        setTimeEntries(result.data)
      }
    } catch (error) {
      console.error('Error fetching time entries:', error)
    }
  }, [invoiceId, selectedClientId])

  useEffect(() => {
    fetchTimeEntries()
  }, [fetchTimeEntries])

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

  const handleSave = async () => {
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

    setSaving(true)

    try {
      const response = await fetch(`/api/labs/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClientId,
          projectId: selectedProjectId || null,
          lineItems: lineItems.map(item => ({
            id: item.id.startsWith('temp-') ? undefined : item.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            timeEntryId: item.timeEntryId,
          })),
          taxRate: taxRate ? parseFloat(taxRate) : null,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          notes: notes || null,
          terms: terms || null,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Invoice updated successfully',
        })
        router.push('/labs/dashboard/invoices')
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update invoice',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update invoice',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSend = async () => {
    try {
      const response = await fetch(`/api/labs/invoices/${invoiceId}/send`, {
        method: 'POST',
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Invoice sent to client',
        })
        setInvoice(prev => prev ? { ...prev, status: 'SENT' } : null)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to send invoice',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invoice',
        variant: 'destructive',
      })
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/labs/invoices/${invoiceId}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Invoice-${invoice?.invoiceNumber}.html`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download invoice',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Invoice not found</h3>
        <Link href="/labs/dashboard/invoices">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Invoices
          </Button>
        </Link>
      </div>
    )
  }

  const canEdit = invoice.status === 'DRAFT'
  const isOverdue = new Date(invoice.dueDate) < new Date() && 
                    ['SENT', 'VIEWED', 'PARTIAL'].includes(invoice.status)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/labs/dashboard/invoices">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <PageHeader 
            title={`Invoice ${invoice.invoiceNumber}`}
            description="Edit invoice details"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${statusColors[invoice.status]} text-white`}>
            {invoice.status}
          </Badge>
          {isOverdue && (
            <Badge variant="destructive">OVERDUE</Badge>
          )}
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={handleDownloadPDF}>
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        {invoice.status === 'DRAFT' && (
          <Button onClick={handleSend} className="bg-cyan-600 hover:bg-cyan-700">
            <Send className="w-4 h-4 mr-2" />
            Send to Client
          </Button>
        )}
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
                  <Select 
                    value={selectedClientId} 
                    onValueChange={setSelectedClientId}
                    disabled={!canEdit}
                  >
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
                  <Select 
                    value={selectedProjectId} 
                    onValueChange={setSelectedProjectId}
                    disabled={!canEdit}
                  >
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
                    disabled={!canEdit}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terms">Payment Terms</Label>
                  <Input
                    id="terms"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Line Items</CardTitle>
              {canEdit && (
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
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button variant="outline" size="sm" onClick={handleAddLineItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {lineItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No line items</p>
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
                          disabled={!canEdit}
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
                          disabled={!canEdit}
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
                          disabled={!canEdit}
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
                      {canEdit && (
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
                      )}
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
                  disabled={!canEdit}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          {invoice.payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoice.payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{formatCurrency(payment.amount)}</div>
                        <div className="text-sm text-muted-foreground">
                          {payment.method} {payment.reference && `• ${payment.reference}`}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(payment.paidAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {canEdit && (
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
              )}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {(taxAmount > 0 || invoice.taxAmount) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax ({taxRate || invoice.taxRate}%)</span>
                    <span>{formatCurrency(taxAmount || invoice.taxAmount || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                {invoice.amountPaid > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount Paid</span>
                      <span className="text-green-600">{formatCurrency(invoice.amountPaid)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Amount Due</span>
                      <span className={invoice.amountDue > 0 ? 'text-red-600' : 'text-green-600'}>
                        {formatCurrency(invoice.amountDue)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {canEdit && (
                <div className="space-y-2 pt-4">
                  <Button
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Info */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice #</span>
                <span className="font-mono">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issue Date</span>
                <span>{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date</span>
                <span>{formatDate(invoice.dueDate)}</span>
              </div>
              {invoice.sentAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sent</span>
                  <span>{formatDate(invoice.sentAt)}</span>
                </div>
              )}
              {invoice.paidAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="text-green-600">{formatDate(invoice.paidAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
