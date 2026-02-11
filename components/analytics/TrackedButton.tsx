"use client";

/**
 * TrackedButton Component
 * Button wrapper that automatically tracks CTA clicks
 */

import { useCallback, type ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useAnalyticsSafe } from "./AnalyticsProvider";

interface TrackedButtonProps extends ButtonProps {
  ctaName: string;
  location: string;
  additionalProps?: Record<string, unknown>;
  children: ReactNode;
}

export function TrackedButton({
  ctaName,
  location,
  additionalProps,
  onClick,
  children,
  ...props
}: TrackedButtonProps) {
  const { trackCTAClick } = useAnalyticsSafe();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // Track the CTA click
      if (trackCTAClick) {
        trackCTAClick(ctaName, location, additionalProps);
      }

      // Call original onClick if provided
      onClick?.(e);
    },
    [ctaName, location, additionalProps, onClick, trackCTAClick]
  );

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
