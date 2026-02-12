import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function SuccessContent({ sessionId }: { sessionId?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your purchase has been completed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              You'll receive a confirmation email shortly with your order details.
            </p>
            {sessionId && (
              <p className="text-xs font-mono text-muted-foreground break-all">
                Session ID: {sessionId}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/portal">Go to Portal</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function CheckoutSuccessPage(props: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const searchParams = await props.searchParams;
  const sessionId = searchParams.session_id;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent sessionId={sessionId} />
    </Suspense>
  );
}
