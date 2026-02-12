import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Portal — Pink Beam",
  robots: { index: false, follow: false },
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

export default function PortalRouteGroupLayout({
  children,
}: { children: React.ReactNode }) {
  return <>{children}</>;
}
