'use client'

import { useState, useEffect } from 'react'
import { Search, Download, Plus, MoreVertical, Mail, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface Client {
  id: string
  name: string | null
  email: string
  company: string | null
  phone: string | null
  industry: string | null
  createdAt: string
  lastLoginAt: string | null
  subscriptions: Array<{
    status: string
    plan: { name: string }
  }>
  projects: Array<{
    status: string
  }>
}

interface Stats {
  totalClients: number
  activeClients: number
  totalMRR: number
  activeProjects: number
  newThisMonth: number
}

export function ClientManagementClient() {
  const [clients, setClients] = useState<Client[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  useEffect(() => {
    loadClients()
    loadStats()
  }, [])

  const loadClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const result = await response.json()

      if (result.success) {
        setClients(result.data)
      }
    } catch (error) {
      console.error('Failed to load clients:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const result = await response.json()

      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      !searchQuery ||
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchQuery.toLowerCase())

    const hasActiveSub = client.subscriptions.some((sub) => sub.status === 'ACTIVE')
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && hasActiveSub) ||
      (statusFilter === 'inactive' && !hasActiveSub)

    return matchesSearch && matchesStatus
  })

  const getClientStatus = (client: Client) => {
    const hasActiveSub = client.subscriptions.some((sub) => sub.status === 'ACTIVE')
    return hasActiveSub ? 'active' : 'inactive'
  }

  const getClientMRR = (client: Client) => {
    // Placeholder - would calculate from actual subscription data
    return client.subscriptions.length > 0 ? 997 : 0
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading clients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage all clients, subscriptions, and projects
          </p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Clients</p>
            <p className="text-2xl font-bold mt-1">{stats.totalClients}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Active Clients</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{stats.activeClients}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total MRR</p>
            <p className="text-2xl font-bold mt-1">${stats.totalMRR.toLocaleString()}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Active Projects</p>
            <p className="text-2xl font-bold mt-1">{stats.activeProjects}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">New This Month</p>
            <p className="text-2xl font-bold mt-1">+{stats.newThisMonth}</p>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </Card>

      {/* Client Table - Desktop */}
      <Card className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>MRR</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => {
                const status = getClientStatus(client)
                const mrr = getClientMRR(client)

                return (
                  <TableRow
                    key={client.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedClient(client)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{client.name || 'No name'}</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{client.company || '—'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {client.subscriptions.map((sub, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {sub.plan.name}
                          </Badge>
                        ))}
                        {client.subscriptions.length === 0 && <span className="text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {mrr > 0 ? `$${mrr}` : '—'}
                    </TableCell>
                    <TableCell>{client.projects.length}</TableCell>
                    <TableCell>
                      <Badge
                        variant={status === 'active' ? 'default' : 'secondary'}
                        className={cn(
                          status === 'active' && 'bg-green-500/10 text-green-600'
                        )}
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {client.lastLoginAt
                        ? format(new Date(client.lastLoginAt), 'MMM d, yyyy')
                        : 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Client Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredClients.length === 0 ? (
          <Card className="p-12">
            <p className="text-center text-muted-foreground">No clients found</p>
          </Card>
        ) : (
          filteredClients.map((client) => {
            const status = getClientStatus(client)
            const mrr = getClientMRR(client)

            return (
              <Card
                key={client.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedClient(client)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{client.name || 'No name'}</h3>
                    <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                    {client.company && (
                      <p className="text-sm text-muted-foreground mt-1">{client.company}</p>
                    )}
                  </div>
                  <Badge
                    variant={status === 'active' ? 'default' : 'secondary'}
                    className={cn(
                      'ml-2 shrink-0',
                      status === 'active' && 'bg-green-500/10 text-green-600'
                    )}
                  >
                    {status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground">MRR</p>
                    <p className="font-medium">{mrr > 0 ? `$${mrr}` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Projects</p>
                    <p className="font-medium">{client.projects.length}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground mb-1">Services</p>
                    <div className="flex flex-wrap gap-1">
                      {client.subscriptions.map((sub, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {sub.plan.name}
                        </Badge>
                      ))}
                      {client.subscriptions.length === 0 && (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-xs text-muted-foreground">
                    Last active:{' '}
                    {client.lastLoginAt
                      ? format(new Date(client.lastLoginAt), 'MMM d, yyyy')
                      : 'Never'}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
