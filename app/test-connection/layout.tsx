import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Test Connection — Pink Beam',
  robots: { index: false, follow: false },
}

export default function TestConnectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
