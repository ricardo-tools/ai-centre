'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { checkDeployStatus } from '@/features/showcase-gallery/action';

interface UseDeployPollingResult {
  deployStatus: string;
  deployUrl: string | null;
  deployError: string | null;
  /** Granular Vercel build step: QUEUED, INITIALIZING, BUILDING, READY, ERROR */
  deployStep: string | null;
  resetStatus: (status: string) => void;
}

const POLL_INTERVAL_MS = 5000;

/**
 * Polls deploy status for a showcase upload.
 * Only polls when status is 'pending' or 'building'.
 * Stops automatically when status transitions to 'ready', 'failed', or 'none'.
 */
export function useDeployPolling(
  showcaseId: string,
  initialStatus: string,
  initialUrl: string | null,
): UseDeployPollingResult {
  const [deployStatus, setDeployStatus] = useState(initialStatus);
  const [deployUrl, setDeployUrl] = useState(initialUrl);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [deployStep, setDeployStep] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Only poll if status is pending or building
    if (deployStatus !== 'pending' && deployStatus !== 'building') return;

    const poll = async () => {
      const result = await checkDeployStatus(showcaseId);
      if (result.ok) {
        setDeployStatus(result.value.deployStatus);
        setDeployUrl(result.value.deployUrl);
        setDeployError(result.value.deployError);
        setDeployStep(result.value.deployStep);
      }
    };

    // Poll immediately on mount
    poll();

    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [showcaseId, deployStatus]);

  const resetStatus = useCallback((status: string) => {
    setDeployStatus(status);
    setDeployUrl(null);
    setDeployError(null);
    setDeployStep(null);
  }, []);

  return { deployStatus, deployUrl, deployError, deployStep, resetStatus };
}
