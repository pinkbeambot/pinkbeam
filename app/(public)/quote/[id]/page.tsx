'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle, XCircle, Loader2, FileText, Printer, Download } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'

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
  lineItems: LineItem[]
  subtotal: number
  taxRate: number | null
  taxAmount: number | null
  total: number
  validUntil: string | null
  terms: string | null
  createdAt: string
  acceptedAt: string | null
  declinedAt: string | null
  declinedReason: string | null
  client: {
    name: string | null
    email: string
    company: string | null
  }
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-500',
  SENT: 'bg-blue-500',
  VIEWED: 'bg-purple-500',
  ACCEPTED: 'bg-green-500',
  DECLINED: 'bg-red-500',
  EXPIRED: 'bg-orange-500',
}

export default function PublicQuotePage() {
  const params = useParams()
  const quoteId = params.id as string
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [showAcceptDialog, setShowAcceptDialog] = useState(false)
  const [showDeclineDialog, setShowDeclineDialog] = useState(false)
  const [declineReason, setDeclineReason] = useState('')
  const [processing, setProcessing] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

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
    if (!agreedToTerms) {
      toast({
        title: 'Terms Required',
        description: 'Please agree to the terms and conditions',
        variant: 'destructive',
      })
      return
    }

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
          description: 'Quote accepted successfully! We will be in touch soon.',
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
          title: 'Quote Declined',
          description: 'Thank you for your feedback.',
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

  const isExpired = quote?.validUntil && new Date(quote.validUntil) < new Date()
  const canAct = quote?.status === 'SENT' || quote?.status === 'VIEWED'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Quote not found</h2>
          <p className="text-muted-foreground">The quote you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">PB</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">PinkBeam Labs</h1>
              <p className="text-sm text-muted-foreground">Quote #{quote.quoteNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* Quote Card */}
        <Card className="print:shadow-none print:border-none">
          <CardContent className="p-8 print:p-0">
            {/* Quote Header */}
            <div className="flex justify-between items-start mb-8 border-b pb-6">
              <div>
                <h1 className="text-4xl font-bold text-cyan-600 mb-2">QUOTE</h1>
                <p className="font-mono text-muted-foreground">{quote.quoteNumber}</p>
              </div>
              <div className="text-right">
                <Badge className={`${statusColors[quote.status]} text-white text-sm mb-2`}>
                  {quote.status}
                </Badge>
                {isExpired && (
                  <div>
                    <Badge variant="destructive">EXPIRED</Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Company & Client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-muted-foreground uppercase text-sm mb-2">From</h3>
                <p className="font-bold text-xl">PinkBeam Labs</p>
                <p className="text-muted-foreground">labs@pinkbeam.io</p>
                <p className="text-muted-foreground">www.pinkbeam.io</p>
              </div>
              <div>
                <h3 className="font-semibold text-muted-foreground uppercase text-sm mb-2">To</h3>
                <p className="font-bold text-xl">{quote.client.name || quote.client.email}</p>
                {quote.client.company && (
                  <p className="text-muted-foreground">{quote.client.company}</p>
                )}
                <p className="text-muted-foreground">{quote.client.email}</p>
              </div>
            </div>

            {/* Quote Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg print:bg-gray-100">
              <div>
                <p className="text-sm text-muted-foreground">Date Issued</p>
                <p className="font-medium">{formatDate(quote.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valid Until</p>
                <p className={`font-medium ${isExpired ? 'text-red-500' : ''}`}>
                  {quote.validUntil ? formatDate(quote.validUntil) : 'No expiration'}
                </p>
              </div>
            </div>

            {/* Title */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">{quote.title}</h2>
              {quote.description && (
                <p className="text-muted-foreground">{quote.description}</p>
              )}
            </div>

            {/* Line Items */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 font-semibold">Description</th>
                    <th className="text-center py-3 font-semibold w-20">Qty</th>
                    <th className="text-right py-3 font-semibold w-28">Unit Price</th>
                    <th className="text-right py-3 font-semibold w-28">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.lineItems.map((item, index) => (
                    <tr key={item.id || index} className="border-b">
                      <td className="py-4">{item.description}</td>
                      <td className="py-4 text-center">{item.quantity}</td>
                      <td className="py-4 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-4 text-right font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-full md:w-80 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(quote.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({quote.taxRate || 0}%)</span>
                  <span>{formatCurrency(quote.taxAmount || 0)}</span>
                </div>
                <div className="border-t-2 pt-3 flex justify-between font-bold text-xl">
                  <span>Total Due</span>
                  <span className="text-cyan-600">{formatCurrency(quote.total)}</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            {quote.terms && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg print:bg-gray-100">
                <h3 className="font-semibold mb-2">Terms & Conditions</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{quote.terms}</p>
              </div>
            )}

            {/* Status Messages */}
            {quote.status === 'ACCEPTED' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-bold text-lg">Quote Accepted</span>
                </div>
                <p className="text-green-600 mt-2">
                  Thank you! We have received your acceptance and will begin work shortly.
                </p>
              </div>
            )}

            {quote.status === 'DECLINED' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-3 text-red-700">
                  <XCircle className="w-6 h-6" />
                  <span className="font-bold text-lg">Quote Declined</span>
                </div>
                {quote.declinedReason && (
                  <p className="text-red-600 mt-2">
                    Reason: {quote.declinedReason}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {canAct && !isExpired && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t print:hidden">
                <Button 
                  onClick={() => setShowAcceptDialog(true)}
                  className="bg-green-600 hover:bg-green-700 text-lg py-6 px-8"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Accept Quote
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowDeclineDialog(true)}
                  className="text-lg py-6 px-8"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Decline
                </Button>
              </div>
            )}

            {isExpired && canAct && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
                <p className="text-orange-700 text-center font-medium">
                  This quote has expired. Please contact us for an updated quote.
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground print:hidden">
              <p>Questions? Contact us at labs@pinkbeam.io</p>
            </div>
          </CardContent>
        </Card>

        {/* Accept Dialog */}
        <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Accept this Quote?</AlertDialogTitle>
              <AlertDialogDescription>
                By accepting this quote, you agree to proceed with the project at the stated price. 
                A deposit may be required to begin work.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              {quote.terms && (
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                    I have read and agree to the terms and conditions
                  </Label>
                </div>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleAccept}
                className="bg-green-600 hover:bg-green-700"
                disabled={processing || (quote.terms && !agreedToTerms)}
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
                We&apos;re sorry this quote didn&apos;t meet your needs. 
                Please let us know why so we can improve.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g., Budget too high, timeline doesn't work, etc."
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
    </div>
  )
}