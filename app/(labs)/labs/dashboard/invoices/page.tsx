'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Loader2, Eye, Send, Download, MoreHorizontal, Trash2, FileText, DollarSign, CreditCard } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface Invoice {
  id: string
  invoiceNumber: string
  status: string
  subtotal: number
  taxAmount: number | null
  total: number
  amountPaid: number
  amountDue: number
  issueDate: string
  dueDate: string
  sentAt: string | null
  paidAt: string | null
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
  }>
  _count: {
    lineItems: number
    payments: number
  }
}

const statusOptions = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Sent' },
  { value: 'VIEWED', label: 'Viewed' },
  { value: 'PARTIAL', label: 'Partial' },
  { value: 'PAID', label: 'Paid' },
  { value: 'OVERDUE', label: 'Overdue' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-500',
  SENT: 'bg-blue-500',
  VIEWED: 'bg-purple-500',
  PARTIAL: 'bg-orange-500',
  PAID: 'bg-green-500',
  OVERDUE: 'bg-red-500',
  CANCELLED: 'bg-gray-400',
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null)
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('transfer')
  const [paymentReference, setPaymentReference] = useState('')
  const [recordingPayment, setRecordingPayment] = useState(false)
  const { toast } = useToast()

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)

      const response = await fetch(`/api/labs/invoices?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setInvoices(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch invoices',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch invoices',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [statusFilter, searchQuery, sortBy, sortOrder, toast])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const handleSend = async (id: string) => {
    try {
      const response = await fetch(`/api/labs/invoices/${id}/send`, {
        method: 'POST',
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Invoice sent successfully',
        })
        fetchInvoices()
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

  const handleDownloadPDF = async (id: string, invoiceNumber: string) => {
    try {
      const response = await fetch(`/api/labs/invoices/${id}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Invoice-${invoiceNumber}.html`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to download invoice',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download invoice',
        variant: 'destructive',
      })
    }
  }

  const handleRecordPayment = async () => {
    if (!paymentInvoice || !paymentAmount) return

    try {
      setRecordingPayment(true)
      const response = await fetch(`/api/labs/invoices/${paymentInvoice.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          method: paymentMethod,
          reference: paymentReference || undefined,
        }),
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Payment recorded successfully',
        })
        setPaymentInvoice(null)
        setPaymentAmount('')
        setPaymentReference('')
        fetchInvoices()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to record payment',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record payment',
        variant: 'destructive',
      })
    } finally {
      setRecordingPayment(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteInvoiceId) return

    try {
      const response = await fetch(`/api/labs/invoices/${deleteInvoiceId}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Invoice deleted successfully',
        })
        fetchInvoices()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete invoice',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete invoice',
        variant: 'destructive',
      })
    } finally {
      setDeleteInvoiceId(null)
    }
  }

  const openPaymentDialog = (invoice: Invoice) => {
    setPaymentInvoice(invoice)
    setPaymentAmount(invoice.amountDue.toString())
    setPaymentMethod('transfer')
    setPaymentReference('')
  }

  const isOverdue = (invoice: Invoice) => {
    return new Date(invoice.dueDate) < new Date() && 
           ['SENT', 'VIEWED', 'PARTIAL'].includes(invoice.status)
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Invoices"
        description="Create and manage client invoices"
      />

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search invoices..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="invoiceNumber">Invoice #</SelectItem>
              <SelectItem value="total">Total Amount</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          <Link href="/labs/dashboard/invoices/reports">
            <Button variant="outline" className="w-full sm:w-auto">
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </Button>
          </Link>
          <Link href="/labs/dashboard/invoices/new">
            <Button className="bg-cyan-600 hover:bg-cyan-700 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No invoices found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first invoice to get started
              </p>
              <Link href="/labs/dashboard/invoices/new">
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Invoice #</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Due</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Due Date</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-sm">{invoice.invoiceNumber}</td>
                      <td className="py-3 px-4">
                        <div>{invoice.client.name || invoice.client.email}</div>
                        {invoice.client.company && (
                          <div className="text-sm text-muted-foreground">{invoice.client.company}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Badge className={`${statusColors[invoice.status]} text-white`}>
                            {invoice.status}
                          </Badge>
                          {isOverdue(invoice) && (
                            <span className="text-xs text-red-500 font-medium">OVERDUE</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={invoice.amountDue > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                          {formatCurrency(invoice.amountDue)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={isOverdue(invoice) ? 'text-red-500' : ''}>
                          {formatDate(invoice.dueDate)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/labs/dashboard/invoices/${invoice.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadPDF(invoice.id, invoice.invoiceNumber)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            {invoice.status === 'DRAFT' && (
                              <DropdownMenuItem onClick={() => handleSend(invoice.id)}>
                                <Send className="w-4 h-4 mr-2" />
                                Send to Client
                              </DropdownMenuItem>
                            )}
                            {invoice.amountDue > 0 && (
                              <DropdownMenuItem onClick={() => openPaymentDialog(invoice)}>
                                <DollarSign className="w-4 h-4 mr-2" />
                                Record Payment
                              </DropdownMenuItem>
                            )}
                            {invoice.status !== 'PAID' && invoice._count.payments === 0 && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => setDeleteInvoiceId(invoice.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteInvoiceId} onOpenChange={() => setDeleteInvoiceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the invoice.
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

      {/* Record Payment Dialog */}
      <Dialog open={!!paymentInvoice} onOpenChange={() => setPaymentInvoice(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for invoice {paymentInvoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">{paymentInvoice && formatCurrency(paymentInvoice.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Already Paid:</span>
              <span className="font-medium">{paymentInvoice && formatCurrency(paymentInvoice.amountPaid)}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-muted-foreground">Amount Due:</span>
              <span className="font-medium text-red-600">{paymentInvoice && formatCurrency(paymentInvoice.amountDue)}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={paymentInvoice?.amountDue}
                  className="pl-10"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference (Optional)</Label>
              <Input
                id="reference"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="Check number, transaction ID, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentInvoice(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRecordPayment}
              disabled={recordingPayment || !paymentAmount || parseFloat(paymentAmount) <= 0}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {recordingPayment ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
