'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { requestOtp, verifyOtp } from '@/features/auth/action';

type Step = 'email' | 'verify';

interface UseLoginResult {
  step: Step;
  email: string;
  setEmail: (email: string) => void;
  code: string;
  setCode: (code: string) => void;
  isLoading: boolean;
  error: string | null;
  attemptsRemaining: number | null;
  handleRequestOtp: () => Promise<void>;
  handleVerifyOtp: () => Promise<void>;
  handleBack: () => void;
}

export function useLogin(): UseLoginResult {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

  const handleRequestOtp = useCallback(async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await requestOtp(email);
      if (result.ok) {
        setStep('verify');
        setCode('');
        setAttemptsRemaining(null);
      } else {
        setError(result.error.code ?? 'unknown');
      }
    } catch {
      setError('unknown');
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  const handleVerifyOtp = useCallback(async () => {
    if (code.length !== 6) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyOtp(email, code);
      if (result.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError(result.error.code ?? 'unknown');
        // Extract attempts remaining from error message if present
        const match = result.error.message.match(/(\d+) attempts remaining/);
        if (match) {
          setAttemptsRemaining(parseInt(match[1], 10));
        }
      }
    } catch {
      setError('unknown');
    } finally {
      setIsLoading(false);
    }
  }, [email, code, router]);

  const handleBack = useCallback(() => {
    setStep('email');
    setCode('');
    setError(null);
    setAttemptsRemaining(null);
  }, []);

  return {
    step,
    email,
    setEmail,
    code,
    setCode,
    isLoading,
    error,
    attemptsRemaining,
    handleRequestOtp,
    handleVerifyOtp,
    handleBack,
  };
}
