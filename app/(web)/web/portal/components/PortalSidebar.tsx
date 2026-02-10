'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  Receipt, 
  MessageSquare, 
  Settings,
  Menu,
  X,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/web/portal', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/web/portal/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/web/portal/files', icon: FileText, label: 'Files' },
  { href: '/web/portal/invoices', icon: Receipt, label: 'Invoices' },
  { href: '/web/portal/support', icon: MessageSquare, label: 'Support' },
  { href: '/web/portal/settings', icon: Settings, label: 'Settings' },
]

export function PortalSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

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
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PB</span>
            </div>
            <span className="font-bold text-lg">Client Portal</span>
          </Link>
        </div>

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
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-violet-500/10 text-violet-500 font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
              <User className="w-4 h-4 text-violet-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Client</p>
              <p className="text-xs text-muted-foreground truncate">client@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
