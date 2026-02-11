"use client";

/**
 * Analytics Provider
 * Context provider for analytics tracking
 * Initialize on app mount and track route changes in Next.js App Router
 */

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  initAnalytics,
  trackPageView,
  trackEvent,
  trackExternalLink,
  trackCTAClick,
  trackFormSubmission,
  trackNavigationClick,
  trackServiceInteraction,
  type AnalyticsConfig,
  type TrackOptions,
} from "@/lib/analytics";

interface AnalyticsContextValue {
  trackPageView: (url: string, title?: string, options?: TrackOptions) => void;
  trackEvent: (
    name: string,
    properties?: Record<string, unknown>,
    options?: TrackOptions
  ) => void;
  trackExternalLink: (url: string, linkText?: string) => void;
  trackCTAClick: (
    ctaName: string,
    location: string,
    additionalProps?: Record<string, unknown>
  ) => void;
  trackFormSubmission: (
    formName: string,
    success: boolean,
    additionalProps?: Record<string, unknown>
  ) => void;
  trackNavigationClick: (itemName: string, section: string) => void;
  trackServiceInteraction: (
    serviceName: string,
    action: string,
    additionalProps?: Record<string, unknown>
  ) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
  config?: AnalyticsConfig;
}

export function AnalyticsProvider({
  children,
  config,
}: AnalyticsProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize analytics on mount
  useEffect(() => {
    initAnalytics(config);
  }, [config]);

  // Track page view on route change
  useEffect(() => {
    if (pathname) {
      const url =
        pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      const fullUrl = typeof window !== "undefined" ? window.location.href : url;
      const title = typeof document !== "undefined" ? document.title : pathname;

      // Small delay to ensure page title is updated
      const timeoutId = setTimeout(() => {
        trackPageView(fullUrl, title);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [pathname, searchParams]);

  const contextValue: AnalyticsContextValue = {
    trackPageView: useCallback((url, title, options) => {
      trackPageView(url, title, options);
    }, []),

    trackEvent: useCallback((name, properties, options) => {
      trackEvent(name, properties, options);
    }, []),

    trackExternalLink: useCallback((url, linkText) => {
      trackExternalLink(url, linkText);
    }, []),

    trackCTAClick: useCallback((ctaName, location, additionalProps) => {
      trackCTAClick(ctaName, location, additionalProps);
    }, []),

    trackFormSubmission: useCallback((formName, success, additionalProps) => {
      trackFormSubmission(formName, success, additionalProps);
    }, []),

    trackNavigationClick: useCallback((itemName, section) => {
      trackNavigationClick(itemName, section);
    }, []),

    trackServiceInteraction: useCallback(
      (serviceName, action, additionalProps) => {
        trackServiceInteraction(serviceName, action, additionalProps);
      },
      []
    ),
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

/**
 * Hook to use analytics in components
 */
export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return context;
}

/**
 * Hook that returns analytics methods safely (returns no-ops if outside provider)
 */
export function useAnalyticsSafe(): Partial<AnalyticsContextValue> {
  const context = useContext(AnalyticsContext);
  if (!context) {
    return {
      trackPageView: () => {},
      trackEvent: () => {},
      trackExternalLink: () => {},
      trackCTAClick: () => {},
      trackFormSubmission: () => {},
      trackNavigationClick: () => {},
      trackServiceInteraction: () => {},
    };
  }
  return context;
}