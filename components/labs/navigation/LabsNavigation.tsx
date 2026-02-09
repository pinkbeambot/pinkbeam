"use client";

import * as React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Globe, Code2, Lightbulb, Users, User, LogOut } from "lucide-react";
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

// Service data for dropdown
const services = [
  {
    id: "agents",
    name: "Agents",
    description: "AI employees for your business",
    icon: Users,
    href: "/agents",
  },
  {
    id: "web",
    name: "Web",
    description: "Website & SEO services",
    icon: Globe,
    href: "/web",
  },
  {
    id: "labs",
    name: "Labs",
    description: "Custom software development",
    icon: Code2,
    href: "/labs",
  },
  {
    id: "solutions",
    name: "Solutions",
    description: "Strategic consulting",
    icon: Lightbulb,
    href: "/solutions",
  },
];

// Labs-specific nav links
const navLinks = [
  { label: "Services", href: "/labs#services", hasDropdown: false },
  { label: "Process", href: "/labs#process", hasDropdown: false },
  { label: "Case Studies", href: "/labs#case-studies", hasDropdown: false },
  { label: "Contact", href: "/contact", hasDropdown: false },
];

// Logo component
function Logo({ className }: { className?: string }) {
  return (
    <Link href="/labs" className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-beam">
        <span className="text-white font-display font-bold text-sm">PB</span>
        <div className="absolute inset-0 rounded-lg bg-gradient-beam blur-md opacity-50" />
      </div>
      <span className="font-display font-bold text-xl tracking-tight">
        <span className="text-gradient-beam">Pink</span>
        <span className="text-foreground"> Beam</span>
      </span>
      <span className="text-xs font-medium text-muted-foreground ml-1 px-2 py-0.5 rounded-full border">
        Labs
      </span>
    </Link>
  );
}

// Service Card for dropdown
function ServiceCard({ service }: { service: typeof services[0] }) {
  const Icon = service.icon;
  return (
    <Link
      href={service.href}
      className="group flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-muted"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-pink-500 shrink-0">
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
    </Link>
  );
}

export function LabsNavigation() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Check auth status
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Handle scroll for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/labs");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href.startsWith("#")) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Services
                <motion.span
                  animate={{ rotate: isServicesOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-60">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.span>
              </button>
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-72 p-3 rounded-xl border bg-popover shadow-lg"
                  >
                    <div className="space-y-1">
                      {services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.filter(l => l.label !== "Services").map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors rounded-md",
                  isActive(link.href)
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-beam text-white text-xs">
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/agents/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button size="sm" className="bg-gradient-beam hover:opacity-90" asChild>
                  <Link href="/labs#contact">Start Project</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground px-2">Pink Beam Services</p>
                    {services.map((service) => (
                      <SheetClose key={service.id} asChild>
                        <Link
                          href={service.href}
                          className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-pink-500 shrink-0">
                            <service.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                  
                  <div className="space-y-1 pt-4 border-t">
                    {navLinks.filter(l => l.label !== "Services").map((link) => (
                      <SheetClose key={link.label} asChild>
                        <Link
                          href={link.href}
                          className="block px-2 py-3 text-lg font-medium hover:bg-muted rounded-lg transition-colors"
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  {!user && (
                    <div className="space-y-3 pt-4 border-t">
                      <SheetClose asChild>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/sign-in">Sign in</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button className="w-full bg-gradient-beam hover:opacity-90" asChild>
                          <Link href="/labs#contact">Start Project</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
