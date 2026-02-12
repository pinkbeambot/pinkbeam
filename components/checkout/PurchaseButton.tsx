'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PurchaseButtonProps {
  planSlug: string;
  mode?: 'subscription' | 'one-time';
  billingCycle?: 'monthly' | 'annual';
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function PurchaseButton({
  planSlug,
  mode = 'subscription',
  billingCycle = 'monthly',
  children = 'Purchase',
  variant = 'default',
  size = 'default',
  className,
}: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    try {
      setIsLoading(true);

      const endpoint = mode === 'one-time' ? '/api/checkout/one-time' : '/api/checkout/subscription';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planSlug,
          billingCycle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to sign-in
          router.push('/sign-in?redirect=/agents/pricing');
          return;
        }
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
