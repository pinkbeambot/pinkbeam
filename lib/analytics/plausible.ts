/**
 * Plausible Analytics Integration
 * Privacy-friendly, GDPR-compliant analytics
 * Self-hosted friendly - no cookies required
 */

import { createHash } from "crypto";

export interface PlausibleConfig {
  domain: string;
  apiHost?: string;
  trackLocalhost?: boolean;
}

export interface PlausibleEvent {
  name: string;
  url?: string;
  domain?: string;
  referrer?: string;
  props?: Record<string, string | number | boolean>;
}

const DEFAULT_CONFIG: PlausibleConfig = {
  domain: typeof window !== "undefined" ? window.location.hostname : "",
  apiHost: "https://plausible.io",
  trackLocalhost: false,
};

let config: PlausibleConfig = { ...DEFAULT_CONFIG };
let isInitialized = false;

/**
 * Initialize Plausible Analytics
 */
export function initPlausible(userConfig?: Partial<PlausibleConfig>): void {
  if (typeof window === "undefined") return;

  config = { ...DEFAULT_CONFIG, ...userConfig };

  // Don't track localhost unless explicitly enabled
  if (
    window.location.hostname === "localhost" &&
    !config.trackLocalhost
  ) {
    console.log("[Plausible] Skipping tracking on localhost");
    return;
  }

  isInitialized = true;

  // Inject Plausible script
  const script = document.createElement("script");
  script.defer = true;
  script.setAttribute("data-domain", config.domain);
  script.src = `${config.apiHost}/js/script.js`;
  document.head.appendChild(script);

  // Initialize window.plausible
  const w = window as unknown as Record<string, unknown>;
  w.plausible = w.plausible || function (...args: unknown[]) {
    const p = w.plausible as unknown as { q: unknown[] };
    p.q = p.q || [];
    p.q.push(args);
  };
}

/**
 * Track a page view with Plausible
 */
export function trackPlausiblePageView(
  url?: string,
  referrer?: string
): void {
  if (typeof window === "undefined" || !isInitialized) return;

  const plausible = (
    window as unknown as Record<string, (event: string, options?: { u: string; r?: string }) => void>
  ).plausible;

  if (plausible) {
    plausible("pageview", {
      u: url || window.location.href,
      r: referrer || document.referrer,
    });
  }
}

/**
 * Track a custom event with Plausible
 */
export function trackPlausibleEvent(
  name: string,
  props?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined" || !isInitialized) return;

  const plausible = (
    window as unknown as Record<string, (event: string, options?: { props?: Record<string, unknown> }) => void>
  ).plausible;

  if (plausible) {
    plausible(name, props ? { props } : undefined);
  }
}

/**
 * Hash IP address for privacy (server-side use)
 * Uses SHA-256 with a daily salt for privacy
 */
export function hashIpForPrivacy(ip: string): string {
  const today = new Date().toISOString().split("T")[0];
  const salt = process.env.ANALYTICS_SALT || "pinkbeam-analytics-salt";
  return createHash("sha256")
    .update(`${ip}:${salt}:${today}`)
    .digest("hex")
    .substring(0, 16);
}

/**
 * Check if Plausible is initialized
 */
export function isPlausibleInitialized(): boolean {
  return isInitialized;
}

/**
 * Get current Plausible config
 */
export function getPlausibleConfig(): PlausibleConfig {
  return { ...config };
}