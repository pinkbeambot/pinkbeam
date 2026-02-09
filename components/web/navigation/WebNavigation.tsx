"use client";

import * as React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, ChevronRight, Globe, Palette, BarChart3, ArrowRight, User, LogOut } from "lucide-react";
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

// Web services data for dropdown
const webServices = [
  {
    id: "design",
    name: "Custom Design",
    description: "Beautiful, conversion-focused websites",
    icon: Palette,
    href: "/web#design",
  },
  {
    id: "seo",
    name: "SEO Optimization",
    description: "Rank higher, get found faster",
    icon: BarChart3,
    href: "/web#seo",
  },
  {
    id: "maintenance",
    name: "Maintenance",
    description: "24/7 monitoring and updates",
    icon: Globe,
    href: "/web#maintenance",
  },
];

// Navigation links
const navLinks = [
  { label: "Services", href: "#services", hasDropdown: true },
  { label: "Pricing", href: "/web/pricing", hasDropdown: false },
  { label: "Showcase", href: "/web/showcase", hasDropdown: false },
  { label: "About", href: "/about", hasDropdown: false },
  { label: "Contact", href: "/contact", hasDropdown: false },
];

// Service data for "all services" dropdown
const allServices = [
  {
    id: "agents",
    name: "Agents",
    description: "AI employees for your business",
    href: "/agents",
  },
  {
    id: "labs",
    name: "Labs",
    description: "Custom software development",
    href: "/labs",
  },
  {
    id: "solutions",
    name: "Solutions",
    description: "Strategic consulting",
    href: "/solutions",
  },
];

// Logo component
function Logo({ className }: { className?: string }) {
  return (
    <Link href="/web" className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600">
        <span className="text-white font-display font-bold text-sm">PB</span>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 blur-md opacity-50" />
      </div>
      <span className="font-display font-bold text-xl tracking-tight">
        <span className="text-gradient-violet">Pink</span>
        <span className="text-foreground"> Beam</span>
      </span>
      <span className="hidden sm:inline-flex text-xs font-medium text-muted-foreground ml-1 px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-500">
        Web
      </span>
    </Link>
  );
}

// Service Card for dropdown
function ServiceCard({ service }: { service: typeof webServices[0] }) {
  const Icon = service.icon;
  return (
    <Link
      href={service.href}
      className="group flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-muted"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-500 shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-display font-semibold text-sm text-foreground">
          {service.name}
        </span>
        <p className="text-xs text-muted-foreground mt-0.5">
          {service.description}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
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
            <AvatarFallback className="bg-violet-500 text-white text-sm font-medium">
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
          <Link href="/web/dashboard" className="cursor-pointer">
            <Globe className="mr-2 h-4 w-4" />
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
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAllServicesOpen, setIsAllServicesOpen] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const allServicesTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsServicesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 150);
  };

  const handleAllServicesEnter = () => {
    if (allServicesTimeoutRef.current) clearTimeout(allServicesTimeoutRef.current);
    setIsAllServicesOpen(true);
  };

  const handleAllServicesLeave = () => {
    allServicesTimeoutRef.current = setTimeout(() => {
      setIsAllServicesOpen(false);
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
                animate={{ rotate: isServicesOpen ? 180 : 0 }}
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

          {/* Services Dropdown */}
          <AnimatePresence>
            {link.hasDropdown && isServicesOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="absolute top-full left-0 pt-2"
                style={{ width: "320px" }}
              >
                <div
                  className="bg-popover border border-border rounded-xl shadow-void-lg p-4"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="space-y-1">
                    {webServices.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                  
                  {/* All Services Link */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <div
                      className="relative"
                      onMouseEnter={handleAllServicesEnter}
                      onMouseLeave={handleAllServicesLeave}
                    >
                      <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-violet-500 hover:bg-violet-500/10 rounded-lg transition-colors">
                        <span>All Pink Beam Services</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      
                      {/* All Services Sub-menu */}
                      <AnimatePresence>
                        {isAllServicesOpen && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-0 left-full ml-2 w-56 p-2 bg-popover border border-border rounded-xl shadow-void-lg"
                          >
                            {allServices.map((service) => (
                              <Link
                                key={service.id}
                                href={service.href}
                                className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                              >
                                <span className="font-medium">{service.name}</span>
                                <p className="text-xs text-muted-foreground">{service.description}</p>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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
  const [expandedSection, setExpandedSection] = useState<string | null>("services");

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
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600">
              <span className="text-white font-display font-bold text-sm">PB</span>
            </div>
            <span className="font-display font-bold text-xl">
              <span className="text-gradient-violet">Pink</span>
              <span className="text-foreground"> Beam</span>
            </span>
            <span className="text-xs font-medium text-violet-500 ml-1 px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-500/10">
              Web
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-140px)] overflow-y-auto">
          {/* User Section (if logged in) */}
          {user && (
            <div className="p-4 border-b border-border bg-muted/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-violet-500 text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <SheetClose asChild>
                  <Link href="/web/dashboard">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Globe className="h-4 w-4" />
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

          {/* Services Section */}
          <div className="border-b border-border">
            <button
              onClick={() => toggleSection("services")}
              className="flex items-center justify-between w-full p-4 text-left"
            >
              <span className="font-display font-semibold text-foreground">Web Services</span>
              <motion.span
                animate={{ rotate: expandedSection === "services" ? 180 : 0 }}
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
              {expandedSection === "services" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    {webServices.map((service) => (
                      <SheetClose key={service.id} asChild>
                        <Link
                          href={service.href}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-violet-500 shrink-0">
                            <service.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-display font-semibold text-sm text-foreground">
                              {service.name}
                            </span>
                            <p className="text-xs text-muted-foreground truncate">
                              {service.description}
                            </p>
                          </div>
                        </Link>
                      </SheetClose>
                    ))}
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

          {/* All Services */}
          <div className="p-4 border-b border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">All Pink Beam Services</p>
            <div className="space-y-1">
              {allServices.map((service) => (
                <SheetClose key={service.id} asChild>
                  <Link
                    href={service.href}
                    className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <span className="font-medium">{service.name}</span>
                  </Link>
                </SheetClose>
              ))}
            </div>
          </div>

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
                  <Button className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:opacity-90" size="lg">
                    Get Started
                  </Button>
                </Link>
              </SheetClose>
              <p className="text-xs text-center text-muted-foreground">
                Starting at $2,000. Free consultation.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Main Navigation Component
export function WebNavigation() {
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
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    
    getUser();

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
                        <Button className="bg-gradient-to-r from-violet-500 to-violet-600 hover:opacity-90" size="sm">
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
