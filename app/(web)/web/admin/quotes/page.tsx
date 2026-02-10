'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  FileText, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FadeIn } from '@/components/animations'

const allQuotes = [
  { 
    id: 'Q-001', 
    client: 'Acme Corp', 
    email: 'contact@acmecorp.com',
    phone: '+1 (555) 123-4567',
    service: 'Website Redesign', 
    budget: '$5,000 - $10,000',
    amount: 5000, 
    status: 'new', 
    date: '2026-02-18',
    urgency: 'high',
    message: 'Need a complete redesign of our corporate website. Current site is outdated and not mobile-friendly.'
  },
  { 
    id: 'Q-002', 
    client: 'TechStart Inc', 
    email: 'hello@techstart.io',
    phone: '+1 (555) 987-6543',
    service: 'E-commerce Platform', 
    budget: '$10,000+',
    amount: 12000, 
    status: 'contacted', 
    date: '2026-02-17',
    urgency: 'medium',
    message: 'Looking to build a full e-commerce platform with payment processing and inventory management.'
  },
  { 
    id: 'Q-003', 
    client: 'Local Cafe', 
    email: 'owner@localcafe.com',
    service: 'Landing Page', 
    budget: '$1,000 - $3,000',
    amount: 1500, 
    status: 'proposal', 
    date: '2026-02-15',
    urgency: 'low',
    message: 'Need a simple landing page for our new location opening next month.'
  },
  { 
    id: 'Q-004', 
    client: 'Marketing Pro', 
    email: 'team@marketingpro.com',
    service: 'SEO Package', 
    budget: '$1,000 - $3,000',
    amount: 2000, 
    status: 'accepted', 
    date: '2026-02-14',
    urgency: 'medium',
    message: 'Monthly SEO services to improve our search rankings.'
  },
  { 
    id: 'Q-005', 
    client: 'Small Biz LLC', 
    email: 'info@smallbiz.com',
    service: 'Website Maintenance', 
    budget: '$500 - $1,000',
    amount: 800, 
    status: 'declined', 
    date: '2026-02-10',
    urgency: 'low',
    message: 'Monthly maintenance for our WordPress site.'
  },
]

const statusFilters = ['all', 'new', 'contacted', 'qualified', 'proposal', 'accepted', 'declined']

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'new': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'contacted': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'qualified': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'proposal': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    'accepted': 'bg-green-500/10 text-green-500 border-green-500/20',
    'declined': 'bg-red-500/10 text-red-500 border-red-500/20',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500'
}

export default function QuotesPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredQuotes = allQuotes.filter(quote => {
    const matchesSearch = quote.client.toLowerCase().includes(search.toLowerCase()) ||
                         quote.service.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || quote.status === filter
    return matchesSearch && matchesFilter
  })

  const newQuotesCount = allQuotes.filter(q => q.status === 'new').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Quote Requests</h1>
            <p className="text-muted-foreground mt-1">
              Manage and respond to quote requests
              {newQuotesCount > 0 && (
                <Badge className="ml-2 bg-red-500">{newQuotesCount} new</Badge>
              )}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search quotes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {statusFilters.map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Quotes Table */}
      <FadeIn delay={0.2}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Client</th>
                    <th className="text-left p-4 font-medium">Service</th>
                    <th className="text-left p-4 font-medium">Budget</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{quote.client}</p>
                          <p className="text-sm text-muted-foreground">{quote.email}</p>
                        </div>
                      </td>
                      <td className="p-4">{quote.service}</td>
                      <td className="p-4">{quote.budget}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={getStatusColor(quote.status)}>
                          {quote.status}
                        </Badge>
                      </td>
                      <td className="p-4">{new Date(quote.date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredQuotes.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No quotes found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Quote Pipeline Summary */}
      <FadeIn delay={0.3}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statusFilters.slice(1).map((status) => {
            const count = allQuotes.filter(q => q.status === status).length
            return (
              <Card key={status}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground capitalize">{status}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </FadeIn>
    </div>
  )
}
