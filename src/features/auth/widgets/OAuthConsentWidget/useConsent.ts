'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseConsentResult {
  isAllowing: boolean;
  isDenying: boolean;
  handleAllow: () => void;
  handleDeny: () => void;
}

export function useConsent(): UseConsentResult {
  const router = useRouter();
  const [isAllowing, setIsAllowing] = useState(false);
  const [isDenying, setIsDenying] = useState(false);

  const handleAllow = useCallback(() => {
    setIsAllowing(true);
    // Full navigation to API route — session + oauth-params cookie are already set
    window.location.href = '/api/auth/callback';
  }, []);

  const handleDeny = useCallback(() => {
    setIsDenying(true);
    router.push('/');
  }, [router]);

  return { isAllowing, isDenying, handleAllow, handleDeny };
}
