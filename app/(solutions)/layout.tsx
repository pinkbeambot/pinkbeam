import type { Metadata, Viewport } from "next";
import "../globals.css";
import { SolutionsNavigation } from "@/components/solutions/navigation/SolutionsNavigation";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Pink Beam Solutions — Strategic Consulting",
  description:
    "Strategic consulting for digital transformation and AI adoption. Workshops, assessments, and ongoing advisory.",
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

export default function SolutionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <SolutionsNavigation />
      <main id="main-content" className="flex-1 pt-16 lg:pt-20" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
