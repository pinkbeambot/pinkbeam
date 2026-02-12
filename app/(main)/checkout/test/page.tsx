import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PurchaseButton } from '@/components/checkout/PurchaseButton';

export default function CheckoutTestPage() {
  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Checkout Test Page</h1>
          <p className="text-muted-foreground">
            Test Stripe checkout integration with test card: <code className="bg-muted px-2 py-1 rounded">4242 4242 4242 4242</code>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* AI Agents */}
          <Card>
            <CardHeader>
              <CardTitle>AI Agents - Sarah (Starter)</CardTitle>
              <CardDescription>$397/month subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <PurchaseButton planSlug="agents-sarah-starter" billingCycle="monthly" className="w-full">
                Subscribe Monthly
              </PurchaseButton>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Agents - Mike (Professional)</CardTitle>
              <CardDescription>$797/month subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <PurchaseButton planSlug="agents-mike-professional" billingCycle="monthly" className="w-full">
                Subscribe Monthly
              </PurchaseButton>
            </CardContent>
          </Card>

          {/* Web Services */}
          <Card>
            <CardHeader>
              <CardTitle>Web - Starter Website</CardTitle>
              <CardDescription>$2,000 one-time + $99/mo maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <PurchaseButton
                planSlug="web-starter-one-time"
                mode="one-time"
                className="w-full"
              >
                Buy One-Time ($2,000)
              </PurchaseButton>
              <PurchaseButton
                planSlug="web-starter-monthly"
                mode="subscription"
                billingCycle="monthly"
                variant="outline"
                className="w-full"
              >
                Maintenance ($99/mo)
              </PurchaseButton>
            </CardContent>
          </Card>

          {/* Labs */}
          <Card>
            <CardHeader>
              <CardTitle>Labs - Monthly Retainer (Light)</CardTitle>
              <CardDescription>$5,000/month development support</CardDescription>
            </CardHeader>
            <CardContent>
              <PurchaseButton planSlug="labs-retainer-light" billingCycle="monthly" className="w-full">
                Subscribe Monthly
              </PurchaseButton>
            </CardContent>
          </Card>

          {/* Solutions */}
          <Card>
            <CardHeader>
              <CardTitle>Solutions - AI Strategy Workshop</CardTitle>
              <CardDescription>$2,500 one-time workshop</CardDescription>
            </CardHeader>
            <CardContent>
              <PurchaseButton
                planSlug="solutions-workshop-ai-one-time"
                mode="one-time"
                className="w-full"
              >
                Book Workshop ($2,500)
              </PurchaseButton>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Solutions - Fractional CTO</CardTitle>
              <CardDescription>$5,000/month retainer</CardDescription>
            </CardHeader>
            <CardContent>
              <PurchaseButton planSlug="solutions-fractional-cto-monthly" billingCycle="monthly" className="w-full">
                Subscribe Monthly
              </PurchaseButton>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>Test Card Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Success:</p>
                <code className="bg-background px-2 py-1 rounded">4242 4242 4242 4242</code>
              </div>
              <div>
                <p className="font-medium">Requires Authentication:</p>
                <code className="bg-background px-2 py-1 rounded">4000 0025 0000 3155</code>
              </div>
              <div>
                <p className="font-medium">Declined:</p>
                <code className="bg-background px-2 py-1 rounded">4000 0000 0000 9995</code>
              </div>
              <div>
                <p className="font-medium">Expiry / CVC:</p>
                <p>Any future date / Any 3 digits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
