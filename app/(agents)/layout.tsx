import type { Metadata, Viewport } from "next";
import "../globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Pink Beam Agents — Hire AI Employees for $397/Month",
  description:
    "Build your AI workforce with Pink Beam. Hire AI employees for research, sales, support, content, and design starting at $397/month. Replace $12K+ human salaries.",
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

export default function AgentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Navigation />
      <main id="main-content" className="flex-1 pt-16 lg:pt-20" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
