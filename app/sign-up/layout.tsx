import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up — Pink Beam',
  description: 'Create your Pink Beam account to access AI employees, custom development, and strategic consulting services.',
  robots: { index: false, follow: false },
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
