import type { Metadata, Viewport } from "next";
import "../globals.css";
import { WebNavigation } from "@/components/web/navigation/WebNavigation";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Pink Beam Web — Website & SEO Services",
  description:
    "High-performance websites, SEO optimization, and ongoing maintenance. Starting at $2,000.",
  metadataBase: new URL("https://pinkbeam.io"),
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

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <WebNavigation />
      <main id="main-content" className="flex-1 pt-16 lg:pt-20" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
