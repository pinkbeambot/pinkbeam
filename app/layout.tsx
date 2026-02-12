import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsProvider } from "@/components/analytics";
import { CookieBanner } from "@/components/CookieBanner";
import { ToastProvider } from "@/components/ui/error-handling/ToastProvider";
import { OfflineBanner } from "@/components/ui/error-handling/OfflineBanner";
import { HelpWidget } from "@/components/ui/help-widget";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pink Beam — AI-Powered Business Solutions",
  description:
    "Pink Beam offers AI employees, website services, custom software development, and strategic consulting. Build your AI workforce or hire experts.",
  metadataBase: new URL("https://pinkbeam.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pink Beam — AI-Powered Business Solutions",
    description:
      "Pink Beam offers AI employees, website services, custom software development, and strategic consulting.",
    type: "website",
    siteName: "Pink Beam",
    locale: "en_US",
    url: "https://pinkbeam.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pink Beam — AI-Powered Business Solutions",
    description:
      "Pink Beam offers AI employees, website services, custom software development, and strategic consulting.",
    creator: "@pinkbeam",
    site: "@pinkbeam",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#FF006E",
      },
    ],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0F" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background text-foreground`}
        style={{ color: "var(--foreground)", backgroundColor: "var(--background)" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Suspense fallback={null}>
            <AnalyticsProvider
              config={{
                enablePlausible: process.env.NODE_ENV === "production",
                enableCustomTracking: true,
                plausible: {
                  domain: "pinkbeam.io",
                  apiHost: process.env.NEXT_PUBLIC_PLAUSIBLE_HOST || "https://plausible.io",
                  trackLocalhost: false,
                },
              }}
            >
              {/* Skip to main content link for accessibility */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Skip to main content
              </a>
              <OfflineBanner />
              {children}
              <CookieBanner />
              <ToastProvider />
              <HelpWidget />
            </AnalyticsProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
