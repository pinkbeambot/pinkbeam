"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  UserCog,
  FolderKanban,
  DollarSign,
  MessageSquare,
  Globe,
  Code2,
  Lightbulb,
  MessageCircle,
  Settings,
  Users,
  HelpCircle,
  CreditCard,
  Menu,
  X,
  Bell,
  User,
  ChevronRight,
  FileText,
  Clock,
  Zap,
  BarChart3,
  Headphones,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/components/portal/UserRoleProvider";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

interface CollapsibleService {
  name: string;
  basePath: string;
  color: string;
  activeColor: string;
  items: NavItem[];
}

const adminOverview: NavSection = {
  label: "Overview",
  items: [
    { name: "Portal Home", href: "/portal", icon: Home, color: "text-foreground" },
  ],
};

const adminSection: NavSection = {
  label: "Admin",
  items: [
    { name: "Clients", href: "/portal/admin/clients", icon: UserCog },
    { name: "Projects", href: "/portal/admin/projects", icon: FolderKanban },
    { name: "Revenue", href: "/portal/admin/revenue", icon: DollarSign, color: "text-emerald-500" },
    { name: "Messages", href: "/portal/admin/messages", icon: MessageSquare },
  ],
};

const adminServices: CollapsibleService[] = [
  {
    name: "Web",
    basePath: "/portal/admin/web",
    color: "text-violet-400",
    activeColor: "bg-violet-500/10",
    items: [
      { name: "Overview", href: "/portal/admin/web", icon: Globe },
      { name: "Quotes", href: "/portal/admin/web/quotes", icon: FileText },
      { name: "Projects", href: "/portal/admin/web/projects", icon: FolderKanban },
      { name: "Clients", href: "/portal/admin/web/clients", icon: UserCog },
      { name: "Invoices", href: "/portal/admin/web/invoices", icon: DollarSign },
      { name: "Support", href: "/portal/admin/web/support", icon: Headphones },
      { name: "Content", href: "/portal/admin/web/content", icon: FileText },
      { name: "Reports", href: "/portal/admin/web/reports", icon: BarChart3 },
      { name: "Settings", href: "/portal/admin/web/settings", icon: Settings },
    ],
  },
  {
    name: "Labs",
    basePath: "/portal/admin/labs",
    color: "text-cyan-400",
    activeColor: "bg-cyan-500/10",
    items: [
      { name: "Overview", href: "/portal/admin/labs", icon: Code2 },
      { name: "Projects", href: "/portal/admin/labs/projects", icon: FolderKanban },
      { name: "Sprints", href: "/portal/admin/labs/sprints", icon: Zap },
      { name: "Quotes", href: "/portal/admin/labs/quotes", icon: FileText },
      { name: "Invoices", href: "/portal/admin/labs/invoices", icon: DollarSign },
      { name: "Time", href: "/portal/admin/labs/time", icon: Clock },
      { name: "Settings", href: "/portal/admin/labs/settings", icon: Settings },
    ],
  },
  {
    name: "Solutions",
    basePath: "/portal/admin/solutions",
    color: "text-amber-400",
    activeColor: "bg-amber-500/10",
    items: [
      { name: "Overview", href: "/portal/admin/solutions", icon: Lightbulb },
      { name: "Engagements", href: "/portal/admin/solutions/engagements", icon: Users },
      { name: "Documents", href: "/portal/admin/solutions/documents", icon: FileText },
      { name: "Schedule", href: "/portal/admin/solutions/schedule", icon: Calendar },
    ],
  },
];

const adminSystem: NavSection = {
  label: "System",
  items: [
    { name: "Chat with VALIS", href: "/portal/chat", icon: MessageCircle },
    { name: "Settings", href: "/portal/settings", icon: Settings },
  ],
};

const clientOverview: NavSection = {
  label: "Overview",
  items: [
    { name: "Portal Home", href: "/portal", icon: Home, color: "text-foreground" },
  ],
};

const clientServices: NavSection = {
  label: "Your Services",
  items: [
    { name: "AI Employees", href: "/portal/agents", icon: Users, color: "text-pink-500" },
    { name: "Projects", href: "/portal/projects", icon: FolderKanban },
    { name: "Support", href: "/portal/support", icon: HelpCircle },
  ],
};

const clientAccount: NavSection = {
  label: "Account",
  items: [
    { name: "Billing", href: "/portal/billing", icon: CreditCard },
    { name: "Chat with VALIS", href: "/portal/chat", icon: MessageCircle },
    { name: "Settings", href: "/portal/settings", icon: Settings },
  ],
};

function SidebarNavSection({
  section,
  pathname,
  onNavigate,
}: {
  section: NavSection;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div>
      <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {section.label}
      </h3>
      <ul className="space-y-1">
        {section.items.map((item) => {
          const isActive =
            item.href === "/portal"
              ? pathname === "/portal"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={onNavigate}
              >
                <item.icon className={cn("w-5 h-5", isActive && item.color)} />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CollapsibleServiceSection({
  service,
  pathname,
  expanded,
  onToggle,
  onNavigate,
}: {
  service: CollapsibleService;
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const isChildActive = pathname.startsWith(service.basePath);

  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isChildActive
            ? service.activeColor
            : "hover:bg-muted"
        )}
      >
        <span className={service.color}>{service.name}</span>
        <ChevronRight
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            expanded && "rotate-90"
          )}
        />
      </button>
      {expanded && (
        <ul className="mt-1 ml-3 space-y-1 border-l border-border pl-3">
          {service.items.map((item) => {
            const isActive =
              item.href === service.basePath
                ? pathname === service.basePath
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors",
                    isActive
                      ? cn(service.activeColor, service.color, "font-medium")
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={onNavigate}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Sidebar({
  isAdmin,
  isClient,
  pathname,
  open,
  onClose,
  userName,
  userEmail,
}: {
  isAdmin: boolean;
  isClient: boolean;
  pathname: string;
  open: boolean;
  onClose: () => void;
  userName: string | null;
  userEmail: string | null;
}) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  useEffect(() => {
    for (const service of adminServices) {
      if (
        pathname.startsWith(service.basePath) &&
        !expandedSections.includes(service.name)
      ) {
        setExpandedSections((prev) => [...prev, service.name]);
      }
    }
    // Only run when pathname changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleSection = (name: string) => {
    setExpandedSections((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
                Pink Beam
              </span>
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                isAdmin
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  : "bg-primary/10 text-primary"
              )}>
                {isAdmin ? "Admin" : "Portal"}
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
            {isAdmin && (
              <>
                <SidebarNavSection section={adminOverview} pathname={pathname} onNavigate={onClose} />
                <SidebarNavSection section={adminSection} pathname={pathname} onNavigate={onClose} />

                <div>
                  <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Services
                  </h3>
                  <div className="space-y-1">
                    {adminServices.map((service) => (
                      <CollapsibleServiceSection
                        key={service.name}
                        service={service}
                        pathname={pathname}
                        expanded={expandedSections.includes(service.name)}
                        onToggle={() => toggleSection(service.name)}
                        onNavigate={onClose}
                      />
                    ))}
                  </div>
                </div>

                <SidebarNavSection section={adminSystem} pathname={pathname} onNavigate={onClose} />
              </>
            )}

            {isClient && (
              <>
                <SidebarNavSection section={clientOverview} pathname={pathname} onNavigate={onClose} />
                <SidebarNavSection section={clientServices} pathname={pathname} onNavigate={onClose} />
                <SidebarNavSection section={clientAccount} pathname={pathname} onNavigate={onClose} />
              </>
            )}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                isAdmin
                  ? "bg-gradient-to-br from-amber-500 to-orange-600"
                  : "bg-gradient-to-br from-pink-500 to-violet-500"
              )}>
                {userName ? userName.charAt(0).toUpperCase() : userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{userName || "User"}</p>
                  {isAdmin && (
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{userEmail || "user@example.com"}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function PortalLayout({
  children,
  userName,
  userEmail,
}: {
  children: React.ReactNode;
  userName: string | null;
  userEmail: string | null;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { isAdmin, isClient } = useUserRole();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isAdmin={isAdmin}
        isClient={isClient}
        pathname={pathname}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userName}
        userEmail={userEmail}
      />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-4 ml-auto">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
