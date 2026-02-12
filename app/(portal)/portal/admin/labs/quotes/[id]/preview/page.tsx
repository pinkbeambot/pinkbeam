'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Download, Printer, CheckCircle, XCircle, Loader2, FileText } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface LineItem {
  id: string
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
  createdAt: string
  sentAt: string | null
  acceptedAt: string | null
  declinedAt: string | null
  declinedReason: string | null
  client: {
    id: string
    name: string | null
    email: string
    company: string | null
    phone: string | null
  }
  project: {
    id: string
    title: string
  } | null
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-500',
  SENT: 'bg-blue-500',
  VIEWED: 'bg-purple-500',
  ACCEPTED: 'bg-green-500',
  DECLINED: 'bg-red-500',
  EXPIRED: 'bg-orange-500',
}

export default function QuotePreviewPage() {
  const router = useRouter()
  const params = useParams()
  const quoteId = params.id as string
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [showAcceptDialog, setShowAcceptDialog] = useState(false)
  const [showDeclineDialog, setShowDeclineDialog] = useState(false)
  const [declineReason, setDeclineReason] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch(`/api/labs/quotes/${quoteId}`)
        const result = await response.json()

        if (result.success) {
          setQuote(result.data)
          // If quote is SENT, mark it as VIEWED
          if (result.data.status === 'SENT') {
            await fetch(`/api/labs/quotes/${quoteId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'VIEWED' }),
            })
          }
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to fetch quote',
            variant: 'destructive',
          })
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch quote',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
  }, [quoteId, toast])

  const handleAccept = async () => {
    setProcessing(true)
    try {
      const response = await fetch(`/api/labs/quotes/${quoteId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Quote accepted successfully',
        })
        setQuote(prev => prev ? { ...prev, status: 'ACCEPTED', acceptedAt: new Date().toISOString() } : null)
        setShowAcceptDialog(false)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to accept quote',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to accept quote',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleDecline = async () => {
    setProcessing(true)
    try {
      const response = await fetch(`/api/labs/quotes/${quoteId}/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: declineReason }),
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Quote declined',
        })
        setQuote(prev => prev ? { 
          ...prev, 
          status: 'DECLINED', 
          declinedAt: new Date().toISOString(),
          declinedReason: declineReason 
        } : null)
        setShowDeclineDialog(false)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to decline quote',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to decline quote',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const isExpired = quote?.validUntil ? new Date(quote.validUntil) < new Date() : false

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Quote not found</h2>
        <Link href="/portal/admin/labs/quotes">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quotes
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 print:p-0">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Link href={`/portal/admin/labs/quotes/${quoteId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Quote Preview</h1>
            <p className="text-muted-foreground">{quote.quoteNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Quote Document */}
      <Card className="print:shadow-none print:border-none">
        <CardContent className="p-8 print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-cyan-600 mb-2">QUOTE</h1>
              <p className="text-muted-foreground font-mono">{quote.quoteNumber}</p>
            </div>
            <div className="text-right">
              <Badge className={`${statusColors[quote.status]} text-white text-sm`}>
                {quote.status}
              </Badge>
              {isExpired && (
                <Badge variant="destructive" className="ml-2">
                  EXPIRED
                </Badge>
              )}
            </div>
          </div>

          {/* Company & Client Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-muted-foreground mb-2">FROM</h3>
              <p className="font-bold text-lg">PinkBeam Labs</p>
              <p className="text-muted-foreground">labs@pinkbeam.io</p>
            </div>
            <div>
              <h3 className="font-semibold text-muted-foreground mb-2">TO</h3>
              <p className="font-bold text-lg">{quote.client.name || quote.client.email}</p>
              {quote.client.company && (
                <p className="text-muted-foreground">{quote.client.company}</p>
              )}
              <p className="text-muted-foreground">{quote.client.email}</p>
              {quote.client.phone && (
                <p className="text-muted-foreground">{quote.client.phone}</p>
              )}
            </div>
          </div>

          {/* Quote Details */}
          <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(quote.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valid Until</p>
              <p className={`font-medium ${isExpired ? 'text-red-500' : ''}`}>
                {quote.validUntil ? formatDate(quote.validUntil) : 'No expiration'}
              </p>
            </div>
            {quote.project && (
              <div>
                <p className="text-sm text-muted-foreground">Project</p>
                <p className="font-medium">{quote.project.title}</p>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">{quote.title}</h2>
            {quote.description && (
              <p className="text-muted-foreground">{quote.description}</p>
            )}
          </div>

          {/* Line Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-3 font-semibold">Description</th>
                  <th className="text-center py-3 font-semibold w-24">Qty</th>
                  <th className="text-right py-3 font-semibold w-32">Unit Price</th>
                  <th className="text-right py-3 font-semibold w-32">Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.lineItems.map((item, index) => (
                  <tr key={item.id || index} className="border-b">
                    <td className="py-3">{item.description}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 text-right font-medium">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(quote.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({quote.taxRate || 0}%)</span>
                <span>{formatCurrency(quote.taxAmount || 0)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-cyan-600">{formatCurrency(quote.total)}</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          {quote.terms && (
            <div className="mb-8">
              <h3 className="font-semibold mb-2">Terms & Conditions</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{quote.terms}</p>
            </div>
          )}

          {/* Status Messages */}
          {quote.status === 'ACCEPTED' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Quote Accepted</span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Accepted on {quote.acceptedAt && formatDate(quote.acceptedAt)}
              </p>
            </div>
          )}

          {quote.status === 'DECLINED' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-2 text-red-700">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Quote Declined</span>
              </div>
              {quote.declinedReason && (
                <p className="text-red-600 text-sm mt-1">
                  Reason: {quote.declinedReason}
                </p>
              )}
            </div>
          )}

          {/* Client Actions */}
          {quote.status === 'SENT' || quote.status === 'VIEWED' ? (
            <div className="flex gap-4 justify-center pt-8 border-t print:hidden">
              <Button 
                onClick={() => setShowAcceptDialog(true)}
                className="bg-green-600 hover:bg-green-700"
                disabled={isExpired}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept Quote
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowDeclineDialog(true)}
                disabled={isExpired}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Decline
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Accept Dialog */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept this Quote?</AlertDialogTitle>
            <AlertDialogDescription>
              By accepting this quote, you agree to the terms and pricing outlined above. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAccept}
              className="bg-green-600 hover:bg-green-700"
              disabled={processing}
            >
              {processing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Accept Quote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Decline Dialog */}
      <AlertDialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline this Quote?</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for declining this quote. This helps us improve our service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Tell us why you're declining..."
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDecline}
              className="bg-red-600 hover:bg-red-700"
              disabled={processing}
            >
              {processing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Decline Quote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}