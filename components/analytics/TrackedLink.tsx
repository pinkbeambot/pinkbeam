"use client";

/**
 * TrackedLink Component
 * Link wrapper that automatically tracks navigation and external link clicks
 */

import { useCallback, type ReactNode } from "react";
import Link from "next/link";
import { useAnalyticsSafe } from "./AnalyticsProvider";

interface TrackedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  linkName: string;
  section: string;
  isExternal?: boolean;
  linkText?: string;
}

export function TrackedLink({
  href,
  children,
  className,
  linkName,
  section,
  isExternal,
  linkText,
}: TrackedLinkProps) {
  const { trackNavigationClick, trackExternalLink } = useAnalyticsSafe();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isExternal || href.startsWith("http")) {
        // Track as external link
        if (trackExternalLink) {
          trackExternalLink(href, linkText || linkName);
        }
      } else {
        // Track as navigation
        if (trackNavigationClick) {
          trackNavigationClick(linkName, section);
        }
      }
    },
    [href, isExternal, linkName, linkText, section, trackExternalLink, trackNavigationClick]
  );

  if (isExternal || href.startsWith("http")) {
    return (
      <a
        href={href}
        className={className}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
