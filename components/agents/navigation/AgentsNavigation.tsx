"use client";

import * as React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronRight, Search, BarChart3, Users, Headphones, PenTool, Palette, Video, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

// Employee data for mega-menu
const employees = [
  {
    id: "sarah",
    name: "Sarah",
    role: "Market Intelligence Analyst",
    description: "Monitors competitors, tracks industry trends, delivers weekly briefs",
    icon: Search,
    color: "bg-pink-500",
    href: "/agents/employees/researcher",
  },
  {
    id: "mike",
    name: "Mike",
    role: "Sales Development Representative",
    description: "Identifies prospects, crafts outreach, books meetings",
    icon: Users,
    color: "bg-accent-purple",
    href: "/agents/employees/sdr",
  },
  {
    id: "alex",
    name: "Alex",
    role: "Customer Support Specialist",
    description: "Handles tier-1 tickets, responds 24/7 in under 2 minutes",
    icon: Headphones,
    color: "bg-accent-cyan",
    href: "/agents/employees/support",
  },
  {
    id: "casey",
    name: "Casey",
    role: "Content Marketing Specialist",
    description: "Writes blogs, social content, email sequences in your voice",
    icon: PenTool,
    color: "bg-accent-amber",
    href: "/agents/employees/content",
  },
  {
    id: "lumen",
    name: "LUMEN",
    role: "Visual Designer",
    description: "Creates graphics, decks, ad creatives, brand assets",
    icon: Palette,
    color: "bg-accent-indigo",
    href: "/agents/employees/designer",
  },
  {
    id: "flux",
    name: "FLUX",
    role: "Motion Designer",
    description: "Produces short-form video, animated explainers, social clips",
    icon: Video,
    color: "bg-pink-400",
    href: "/agents/employees/video",
  },
];

// Navigation links
const navLinks = [
  { label: "Products", href: "#products", hasDropdown: true },
  { label: "Pricing", href: "/agents/pricing", hasDropdown: false },
  { label: "Resources", href: "#resources", hasDropdown: false },
  { label: "About", href: "/about", hasDropdown: false },
  { label: "Contact", href: "/contact", hasDropdown: false },
];

// Logo component
function Logo({ className }: { className?: string }) {
  return (
    <Link href="/agents" className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-beam">
        <span className="text-white font-display font-bold text-sm">PB</span>
        <div className="absolute inset-0 rounded-lg bg-gradient-beam blur-md opacity-50" />
      </div>
      <span className="font-display font-bold text-xl tracking-tight">
        <span className="text-gradient-beam">Pink</span>
        <span className="text-foreground"> Beam</span>
      </span>
      <span className="text-xs font-medium text-muted-foreground ml-1 px-2 py-0.5 rounded-full border">
        Agents
      </span>
    </Link>
  );
}

// Employee Card for mega-menu
function EmployeeCard({ employee }: { employee: typeof employees[0] }) {
  const Icon = employee.icon;
  return (
    <Link
      href={employee.href}
      className="group flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-muted"
    >
      <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg shrink-0", employee.color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-sm text-foreground">
            {employee.name}
          </span>
          <span className="text-xs text-muted-foreground">— {employee.role}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {employee.description}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
    </Link>
  );
}

// Mobile Employee Card
function MobileEmployeeCard({ employee }: { employee: typeof employees[0] }) {
  const Icon = employee.icon;
  return (
    <Link
      href={employee.href}
      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background/50"
    >
      <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg shrink-0", employee.color)}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-display font-semibold text-sm text-foreground">
          {employee.name}
        </span>
        <p className="text-xs text-muted-foreground truncate">
          {employee.role}
        </p>
      </div>
    </Link>
  );
}

// User Avatar Dropdown Component
function UserDropdown({ user, onSignOut }: { user: SupabaseUser; onSignOut: () => void }) {
  const initials = user.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center gap-2 p-2">
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/agents/dashboard" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Desktop Navigation
function DesktopNav() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsProductsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProductsOpen(false);
    }, 150);
  };

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {navLinks.map((link) => (
        <div
          key={link.label}
          className="relative"
          onMouseEnter={link.hasDropdown ? handleMouseEnter : undefined}
          onMouseLeave={link.hasDropdown ? handleMouseLeave : undefined}
        >
          <Link
            href={link.href}
            className={cn(
              "flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-md",
              link.hasDropdown && "pr-3"
            )}
          >
            {link.label}
            {link.hasDropdown && (
              <motion.span
                animate={{ rotate: isProductsOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="opacity-60"
                >
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
            )}
          </Link>

          {/* Mega Menu Dropdown */}
          <AnimatePresence>
            {link.hasDropdown && isProductsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="absolute top-full left-0 pt-2"
                style={{ width: "480px" }}
              >
                <div
                  className="bg-popover border border-border rounded-xl shadow-void-lg p-4"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Meet Your AI Team
                    </span>
                    <Link
                      href="/agents#employees"
                      className="text-xs text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1"
                    >
                      View all
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {employees.map((employee) => (
                      <EmployeeCard key={employee.id} employee={employee} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  );
}

// Mobile Navigation
function MobileNav({ user, onSignOut }: { user: SupabaseUser | null; onSignOut: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("products");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : 'U';

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-beam">
              <span className="text-white font-display font-bold text-sm">PB</span>
            </div>
            <span className="font-display font-bold text-xl">
              <span className="text-gradient-beam">Pink</span>
              <span className="text-foreground"> Beam</span>
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-140px)] overflow-y-auto">
          {/* User Section (if logged in) */}
          {user && (
            <div className="p-4 border-b border-border bg-muted/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <SheetClose asChild>
                  <Link href="/agents/dashboard">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                </SheetClose>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={() => {
                    onSignOut();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="border-b border-border">
            <button
              onClick={() => toggleSection("products")}
              className="flex items-center justify-between w-full p-4 text-left"
            >
              <span className="font-display font-semibold text-foreground">Products</span>
              <motion.span
                animate={{ rotate: expandedSection === "products" ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
            </button>
            <AnimatePresence>
              {expandedSection === "products" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider px-2">
                      Meet Your AI Team
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {employees.map((employee) => (
                        <MobileEmployeeCard key={employee.id} employee={employee} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Other Links */}
          {navLinks.filter(l => !l.hasDropdown).map((link) => (
            <SheetClose asChild key={link.label}>
              <Link
                href={link.href}
                className="flex items-center justify-between p-4 border-b border-border font-display font-semibold text-foreground hover:bg-muted transition-colors"
              >
                {link.label}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </SheetClose>
          ))}

          {/* CTA Section */}
          {!user && (
            <div className="mt-auto p-4 space-y-3">
              <SheetClose asChild>
                <Link href="/sign-in">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/sign-up">
                  <Button className="w-full" variant="beam" size="lg">
                    Get Started
                  </Button>
                </Link>
              </SheetClose>
              <p className="text-xs text-center text-muted-foreground">
                No credit card required. 14-day free trial.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Main Navigation Component
export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check auth state on mount and subscribe to changes
  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    
    getUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-void-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              
              {!loading && (
                <>
                  {user ? (
                    <UserDropdown user={user} onSignOut={handleSignOut} />
                  ) : (
                    <>
                      <Link
                        href="/sign-in"
                        className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors px-3 py-2"
                      >
                        Sign In
                      </Link>
                      <Link href="/sign-up">
                        <Button variant="beam" size="sm" className="shadow-beam">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <MobileNav user={user} onSignOut={handleSignOut} />
          </div>
        </div>
      </div>
    </header>
  );
}

export { Navigation as AgentsNavigation };
