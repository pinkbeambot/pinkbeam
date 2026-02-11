"use client";

import * as React from "react";
import Link from "next/link";
import { Twitter, Linkedin, Github, Youtube, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/animations/FadeIn";
import { getFieldErrors, newsletterSchema } from "@/lib/validation";

// Footer link data
const footerLinks = {
  product: {
    title: "Services",
    links: [
      { label: "AI Employees", href: "/agents" },
      { label: "Web Services", href: "/web" },
      { label: "Custom Development", href: "/labs" },
      { label: "Consulting", href: "/solutions" },
      { label: "Pricing", href: "/agents/pricing" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Blog", href: "/blog" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Help Center", href: "/help" },
      { label: "Webinars", href: "/webinars" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Partners", href: "/partners" },
      { label: "Contact", href: "/contact" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "GDPR", href: "/gdpr" },
      { label: "Security", href: "/security" },
    ],
  },
};

// Social links
const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/pinkbeam", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/pinkbeam", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/pinkbeam", label: "GitHub" },
  { icon: Youtube, href: "https://youtube.com/pinkbeam", label: "YouTube" },
];

// Logo component
function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-beam">
        <span className="text-white font-display font-bold text-sm">PB</span>
        <div className="absolute inset-0 rounded-lg bg-gradient-beam blur-md opacity-50" />
      </div>
      <span className="font-display font-bold text-xl tracking-tight">
        <span className="text-gradient-beam">Pink</span>
        <span className="text-foreground"> Beam</span>
      </span>
    </Link>
  );
}

// Newsletter form
function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [emailError, setEmailError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = newsletterSchema.safeParse({ email });
    if (!validation.success) {
      const fieldErrors = getFieldErrors(validation.error);
      setEmailError(fieldErrors.email ?? "Please enter a valid email");
      return;
    }

    setIsSubmitting(true);
    setEmailError(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <div className="space-y-3">
      <h2 className="font-display font-semibold text-sm text-foreground">
        Subscribe to our newsletter
      </h2>
      <p className="text-sm text-muted-foreground">
        Get the latest updates on AI employees and automation tips.
      </p>
      {isSubmitted ? (
        <div className="p-3 rounded-lg bg-success-500/10 border border-success-500/20">
          <p className="text-sm text-success-600 dark:text-success-500">
            Thanks for subscribing! Check your inbox soon.
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? "newsletter-email-error" : undefined}
              className={cn(
                "flex-1",
                emailError && "border-destructive focus-visible:ring-destructive/30"
              )}
              required
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="shrink-0"
            >
              {isSubmitting ? (
                <span className="animate-spin">⟳</span>
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span className="sr-only">Subscribe</span>
            </Button>
          </form>
          {emailError && (
            <p id="newsletter-email-error" className="text-xs text-destructive">
              {emailError}
            </p>
          )}
        </>
      )}
    </div>
  );
}

// Footer column component
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="space-y-3">
      <h2 className="font-display font-semibold text-sm text-foreground">
        {title}
      </h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Social links component
function SocialLinks() {
  return (
    <div className="flex items-center gap-3">
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted hover:bg-pink-500/10 hover:text-pink-500 transition-colors"
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
}

// Main Footer Component
export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <FadeIn direction="up" once>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-6">
              <Logo />
              <p className="text-sm text-muted-foreground max-w-xs">
                Build your AI workforce with autonomous employees that handle
                research, sales, support, and creative work—without the $12K/month
                price tag.
              </p>
              <SocialLinks />
            </div>

            {/* Links Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-8">
              <FooterColumn
                title={footerLinks.product.title}
                links={footerLinks.product.links}
              />
              <FooterColumn
                title={footerLinks.resources.title}
                links={footerLinks.resources.links}
              />
              <FooterColumn
                title={footerLinks.company.title}
                links={footerLinks.company.links}
              />
              <FooterColumn
                title={footerLinks.legal.title}
                links={footerLinks.legal.links}
              />
            </div>

            {/* Newsletter Column */}
            <div className="lg:col-span-3">
              <NewsletterForm />
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} Pink Beam, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
