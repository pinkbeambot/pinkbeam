/**
 * Analytics Library
 * Unified tracking for page views and custom events
 * Supports both Plausible (privacy-friendly) and custom event logging
 */

import {
  initPlausible,
  trackPlausiblePageView,
  trackPlausibleEvent,
  hashIpForPrivacy,
  isPlausibleInitialized,
  type PlausibleConfig,
} from "./analytics/plausible";

// Re-export types and utilities
export { hashIpForPrivacy, isPlausibleInitialized, type PlausibleConfig };

export interface AnalyticsConfig {
  plausible?: PlausibleConfig;
  enableCustomTracking?: boolean;
  enablePlausible?: boolean;
}

export interface PageViewData {
  url: string;
  title: string;
  path: string;
  referrer?: string;
}

export interface EventData {
  name: string;
  properties?: Record<string, unknown>;
  category?: string;
}

export interface TrackOptions {
  includePlausible?: boolean;
  includeCustom?: boolean;
}

let analyticsConfig: AnalyticsConfig = {
  enableCustomTracking: true,
  enablePlausible: true,
};

/**
 * Initialize analytics
 */
export function initAnalytics(config: AnalyticsConfig = {}): void {
  analyticsConfig = { ...analyticsConfig, ...config };

  if (analyticsConfig.enablePlausible && config.plausible) {
    initPlausible(config.plausible);
  }

  if (typeof window !== "undefined") {
    // Track initial page view
    trackPageView(window.location.href, document.title);
  }
}

/**
 * Track a page view
 */
export function trackPageView(
  url: string,
  title?: string,
  options: TrackOptions = {}
): void {
  const opts = {
    includePlausible: true,
    includeCustom: true,
    ...options,
  };

  const path = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost").pathname;

  // Track with Plausible
  if (opts.includePlausible && analyticsConfig.enablePlausible) {
    trackPlausiblePageView(url, typeof document !== "undefined" ? document.referrer : undefined);
  }

  // Track with custom API
  if (opts.includeCustom && analyticsConfig.enableCustomTracking) {
    sendToAnalyticsAPI({
      type: "pageview",
      name: title || path,
      path,
      url,
      referrer: typeof document !== "undefined" ? document.referrer : undefined,
    });
  }
}

/**
 * Track a custom event
 */
export function trackEvent(
  name: string,
  properties?: Record<string, unknown>,
  options: TrackOptions = {}
): void {
  const opts = {
    includePlausible: true,
    includeCustom: true,
    ...options,
  };

  // Track with Plausible
  if (opts.includePlausible && analyticsConfig.enablePlausible) {
    // Convert properties to Plausible format (strings/numbers/booleans only)
    const plausibleProps: Record<string, string | number | boolean> = {};
    if (properties) {
      for (const [key, value] of Object.entries(properties)) {
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          plausibleProps[key] = value;
        } else {
          plausibleProps[key] = String(value);
        }
      }
    }
    trackPlausibleEvent(name, plausibleProps);
  }

  // Track with custom API
  if (opts.includeCustom && analyticsConfig.enableCustomTracking) {
    sendToAnalyticsAPI({
      type: "event",
      name,
      path: typeof window !== "undefined" ? window.location.pathname : undefined,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      metadata: properties,
    });
  }
}

/**
 * Track external link click
 */
export function trackExternalLink(
  url: string,
  linkText?: string
): void {
  trackEvent("external_link_click", {
    url,
    link_text: linkText,
    domain: new URL(url).hostname,
  });
}

/**
 * Track CTA button click
 */
export function trackCTAClick(
  ctaName: string,
  location: string,
  additionalProps?: Record<string, unknown>
): void {
  trackEvent("cta_click", {
    cta_name: ctaName,
    location,
    ...additionalProps,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmission(
  formName: string,
  success: boolean,
  additionalProps?: Record<string, unknown>
): void {
  trackEvent("form_submission", {
    form_name: formName,
    success,
    ...additionalProps,
  });
}

/**
 * Track navigation click
 */
export function trackNavigationClick(
  itemName: string,
  section: string
): void {
  trackEvent("navigation_click", {
    item_name: itemName,
    section,
  });
}

/**
 * Track service interaction
 */
export function trackServiceInteraction(
  serviceName: string,
  action: string,
  additionalProps?: Record<string, unknown>
): void {
  trackEvent("service_interaction", {
    service_name: serviceName,
    action,
    ...additionalProps,
  });
}

/**
 * Send analytics data to custom API
 */
async function sendToAnalyticsAPI(data: {
  type: "pageview" | "event";
  name: string;
  path?: string;
  url?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  // Don't block the main thread
  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    navigator.sendBeacon("/api/analytics/track", blob);
  } else {
    // Fallback to fetch with keepalive
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        keepalive: true,
      });
    } catch {
      // Silently fail - analytics should never break the app
    }
  }
}

/**
 * Get current analytics configuration
 */
export function getAnalyticsConfig(): AnalyticsConfig {
  return { ...analyticsConfig };
}