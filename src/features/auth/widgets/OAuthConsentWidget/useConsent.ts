'use client';

import { useState, useCallback } from 'react';

interface UseConsentResult {
  isAllowing: boolean;
  isDenying: boolean;
  handleAllow: () => void;
  handleDeny: () => void;
}

export function useConsent(): UseConsentResult {
  const [isAllowing, setIsAllowing] = useState(false);
  const [isDenying, setIsDenying] = useState(false);

  const handleAllow = useCallback(() => {
    setIsAllowing(true);
    // Full navigation to API route — session + oauth-params cookie are already set
    window.location.href = '/api/auth/callback';
  }, []);

  const handleDeny = useCallback(() => {
    setIsDenying(true);
    // Redirect to deny endpoint — reads oauth-params cookie and redirects
    // to CLI's localhost callback with error=access_denied
    window.location.href = '/api/auth/deny';
  }, []);

  return { isAllowing, isDenying, handleAllow, handleDeny };
}
