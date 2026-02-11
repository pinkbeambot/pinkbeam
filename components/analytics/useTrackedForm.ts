"use client";

/**
 * useTrackedForm Hook
 * Hook to add tracking to form submissions
 */

import { useCallback } from "react";
import { useAnalyticsSafe } from "./AnalyticsProvider";

interface UseTrackedFormOptions {
  formName: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useTrackedForm({ formName, onSuccess, onError }: UseTrackedFormOptions) {
  const { trackFormSubmission } = useAnalyticsSafe();

  const trackSubmit = useCallback(
    async <T,>(submitFn: () => Promise<T>): Promise<T | undefined> => {
      try {
        const result = await submitFn();
        if (trackFormSubmission) {
          trackFormSubmission(formName, true);
        }
        onSuccess?.();
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        if (trackFormSubmission) {
          trackFormSubmission(formName, false, { error: err.message });
        }
        onError?.(err);
        throw error;
      }
    },
    [formName, onSuccess, onError, trackFormSubmission]
  );

  return { trackSubmit };
}
