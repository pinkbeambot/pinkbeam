'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  UserCircle,
  FileText,
  DollarSign,
  Receipt,
  PenTool,
  MessageSquare,
  Settings,
  Menu,
  X,
  LogOut,
  BarChart3,
  Search,
  Webhook,
  Mail,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useGlobalSearch } from '@/components/search'

const navItems = [
  { href: '/web/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/web/admin/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/web/admin/clients', icon: Users, label: 'Clients' },
  { href: '/web/admin/team', icon: UserCircle, label: 'Team' },
  { href: '/web/admin/quotes', icon: FileText, label: 'Quotes' },
  { href: '/web/admin/finance', icon: DollarSign, label: 'Finance' },
  { href: '/web/admin/invoices', icon: Receipt, label: 'Invoices' },
  { href: '/web/admin/support', icon: MessageSquare, label: 'Support' },
  { href: '/web/admin/content', icon: PenTool, label: 'Content' },
  { href: '/web/admin/case-studies', icon: Briefcase, label: 'Case Studies' },
  { href: '/web/admin/emails', icon: Mail, label: 'Emails' },
  { href: '/web/admin/reports', icon: BarChart3, label: 'Reports' },
  { href: '/web/admin/webhooks', icon: Webhook, label: 'Webhooks' },
  { href: '/web/admin/settings', icon: Settings, label: 'Settings' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { open, setOpen, GlobalSearchComponent } = useGlobalSearch()

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-card border-r z-40 transition-transform duration-300",
        "lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/web/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <span className="font-bold text-lg">Admin</span>
              <span className="text-xs text-muted-foreground ml-1">Pink Beam</span>
            </div>
          </Link>
        </div>

        {/* Search Button */}
        <div className="p-4 pb-2">
          <Button 
            variant="outline" 
            className="w-full justify-between text-muted-foreground"
            onClick={() => setOpen(true)}
          >
            <span className="flex items-center">
              <Search className="w-4 h-4 mr-2" />
              Search...
            </span>
            <kbd className="hidden sm:inline-block text-xs bg-muted px-1.5 py-0.5 rounded">
              Cmd K
            </kbd>
          </Button>
        </div>

        {/* Global Search Dialog */}
        <GlobalSearchComponent />

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm",
                  isActive 
                    ? "bg-violet-500/10 text-violet-500 font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-2">
          <Button variant="ghost" className="w-full justify-start text-sm" asChild>
            <Link href="/">
              <LogOut className="w-4 h-4 mr-2" />
              Exit Admin
            </Link>
          </Button>
        </div>
      </aside>
    </>
  )
}
