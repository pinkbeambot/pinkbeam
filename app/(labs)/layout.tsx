import type { Metadata, Viewport } from "next";
import "../globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Pink Beam Labs — Custom Software Development",
  description:
    "Custom software development for startups and enterprises. Web apps, mobile apps, APIs, and AI solutions.",
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

export default function LabsLayout({
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
