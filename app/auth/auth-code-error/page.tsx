import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default function AuthCodeErrorPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h1 className="text-xl font-semibold">Authentication Error</h1>
          </div>
          <CardDescription>
            There was a problem with the authentication process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This could happen if:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
            <li>The confirmation link has expired</li>
            <li>The link was already used</li>
            <li>There was a network error</li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Link href="/sign-in" className="w-full">
            <Button className="w-full">
              Try signing in again
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Go back home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}
