'use client'

import { useState } from 'react'
import { Users, Search, Mail, Phone, FolderKanban, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FadeIn } from '@/components/animations'

const allClients = [
  { 
    id: '1', 
    name: 'Acme Corp', 
    email: 'contact@acmecorp.com',
    phone: '+1 (555) 123-4567',
    industry: 'Technology',
    projects: 2,
    totalSpent: 8000,
    status: 'active'
  },
  { 
    id: '2', 
    name: 'TechStart Inc', 
    email: 'hello@techstart.io',
    industry: 'Startup',
    projects: 1,
    totalSpent: 12000,
    status: 'active'
  },
  { 
    id: '3', 
    name: 'Marketing Pro', 
    email: 'team@marketingpro.com',
    industry: 'Marketing',
    projects: 3,
    totalSpent: 15000,
    status: 'active'
  },
  { 
    id: '4', 
    name: 'Local Cafe', 
    email: 'owner@localcafe.com',
    industry: 'Food & Beverage',
    projects: 1,
    totalSpent: 1500,
    status: 'lead'
  },
  { 
    id: '5', 
    name: 'Content Co', 
    email: 'info@contentco.com',
    industry: 'Media',
    projects: 1,
    totalSpent: 2000,
    status: 'inactive'
  },
]

export default function ClientsPage() {
  const [search, setSearch] = useState('')

  const filteredClients = allClients.filter(client => 
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Clients</h1>
            <p className="text-muted-foreground mt-1">
              Manage your client relationships
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client, index) => (
          <FadeIn key={client.id} delay={0.1 + index * 0.05}>
            <Card className="h-full hover:border-violet-500/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-violet-500" />
                  </div>
                  <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                    {client.status}
                  </Badge>
                </div>

                <h3 className="font-semibold text-lg mb-1">{client.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{client.industry}</p>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {client.email}
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {client.phone}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FolderKanban className="w-4 h-4" />
                    {client.projects} projects
                  </div>
                  <p className="font-medium">${client.totalSpent.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
