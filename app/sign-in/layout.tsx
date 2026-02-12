import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — Pink Beam',
  description: 'Sign in to your Pink Beam account to manage your AI employees, projects, and services.',
  robots: { index: false, follow: false },
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
