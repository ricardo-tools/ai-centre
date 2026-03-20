'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, EnvelopeSimple, SpinnerGap } from '@phosphor-icons/react';
import { useLocale } from '@/platform/screen-renderer/LocaleContext';
import type { TranslationKey } from '@/platform/i18n';

interface LoginFormProps {
  step: 'email' | 'verify';
  email: string;
  setEmail: (email: string) => void;
  code: string;
  setCode: (code: string) => void;
  isLoading: boolean;
  error: string | null;
  attemptsRemaining: number | null;
  onRequestOtp: () => void;
  onVerifyOtp: () => void;
  onBack: () => void;
  compact?: boolean;
}

function getErrorMessage(error: string, attemptsRemaining: number | null, t: (key: TranslationKey) => string): string {
  switch (error) {
    case 'invalidDomain':
      return t('login.invalidDomain');
    case 'invalidCode':
      return t('login.invalidCode').replace('{remaining}', String(attemptsRemaining ?? 0));
    case 'expired':
      return t('login.expired');
    case 'tooManyAttempts':
      return t('login.tooManyAttempts');
    default:
      return 'Something went wrong. Please try again.';
  }
}

export function LoginForm({
  step,
  email,
  setEmail,
  code,
  setCode,
  isLoading,
  error,
  attemptsRemaining,
  onRequestOtp,
  onVerifyOtp,
  onBack,
  compact = false,
}: LoginFormProps) {
  const { t } = useLocale();
  const [resendCooldown, setResendCooldown] = useState(0);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = code.padEnd(6, '').split('').slice(0, 6);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Auto-focus first digit input when entering verify step
  useEffect(() => {
    if (step === 'verify') {
      setTimeout(() => digitRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;

      const newDigits = [...digits];
      if (value.length > 1) {
        // Paste handling
        const pasted = value.replace(/\D/g, '').slice(0, 6);
        const newCode = (code.slice(0, index) + pasted).slice(0, 6);
        setCode(newCode);
        const focusIndex = Math.min(index + pasted.length, 5);
        digitRefs.current[focusIndex]?.focus();
        return;
      }

      newDigits[index] = value;
      const newCode = newDigits.join('');
      setCode(newCode);

      if (value && index < 5) {
        digitRefs.current[index + 1]?.focus();
      }
    },
    [code, digits, setCode]
  );

  const handleDigitKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        digitRefs.current[index - 1]?.focus();
      }
      if (e.key === 'Enter') {
        const codeComplete = digits.every((d) => d !== '' && d !== ' ');
        if (codeComplete) onVerifyOtp();
      }
    },
    [digits, onVerifyOtp]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      if (pasted) {
        setCode(pasted);
        const focusIndex = Math.min(pasted.length, 5);
        digitRefs.current[focusIndex]?.focus();
      }
    },
    [setCode]
  );

  const handleResend = useCallback(() => {
    if (resendCooldown > 0) return;
    onRequestOtp();
    setResendCooldown(60);
  }, [resendCooldown, onRequestOtp]);

  const cardPadding = compact ? 24 : 40;
  const cardMaxWidth = compact ? 360 : 420;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: compact ? 16 : 32,
        background: 'var(--color-bg)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: cardMaxWidth,
          background: 'var(--color-surface)',
          borderRadius: 16,
          border: '1px solid var(--color-border)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Header with logo */}
        <div
          style={{
            background: 'var(--color-bg-alt)',
            padding: `${compact ? 24 : 32}px ${cardPadding}px`,
            textAlign: 'center',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              justifyContent: 'center',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/square-color.png"
              alt="ezyCollect"
              className="logo-color"
              style={{ height: 28 }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/square-white.svg"
              alt="ezyCollect"
              className="logo-white"
              style={{ height: 28 }}
            />
            <span
              style={{
                fontSize: compact ? 18 : 20,
                fontWeight: 700,
                color: 'var(--color-text-heading)',
                letterSpacing: '-0.01em',
              }}
            >
              {t('app.name')}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: cardPadding }}>
          {step === 'email' ? (
            <EmailStep
              email={email}
              setEmail={setEmail}
              isLoading={isLoading}
              error={error}
              attemptsRemaining={attemptsRemaining}
              onSubmit={onRequestOtp}
              compact={compact}
              t={t}
            />
          ) : (
            <VerifyStep
              email={email}
              digits={digits}
              isLoading={isLoading}
              error={error}
              attemptsRemaining={attemptsRemaining}
              resendCooldown={resendCooldown}
              digitRefs={digitRefs}
              onDigitChange={handleDigitChange}
              onDigitKeyDown={handleDigitKeyDown}
              onPaste={handlePaste}
              onVerify={onVerifyOtp}
              onResend={handleResend}
              onBack={onBack}
              compact={compact}
              t={t}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EmailStep({
  email,
  setEmail,
  isLoading,
  error,
  attemptsRemaining,
  onSubmit,
  compact,
  t,
}: {
  email: string;
  setEmail: (v: string) => void;
  isLoading: boolean;
  error: string | null;
  attemptsRemaining: number | null;
  onSubmit: () => void;
  compact: boolean;
  t: (key: TranslationKey) => string;
}) {
  return (
    <>
      <div
        style={{
          fontSize: compact ? 18 : 22,
          fontWeight: 600,
          color: 'var(--color-text-heading)',
          marginBottom: 8,
        }}
      >
        {t('login.title')}
      </div>
      <div
        style={{
          fontSize: 14,
          color: 'var(--color-text-muted)',
          marginBottom: 24,
          lineHeight: 1.5,
        }}
      >
        {t('login.domainHint')}
      </div>

      <label
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--color-text-body)',
          marginBottom: 8,
        }}
      >
        {t('login.emailLabel')}
      </label>
      <div
        className="search-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          border: '2px solid var(--color-border)',
          borderRadius: 8,
          padding: '12px 12px',
          background: 'var(--color-bg)',
          marginBottom: 16,
          transition: 'border-color 150ms',
        }}
      >
        <EnvelopeSimple size={20} weight="regular" style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
        <input
          type="email"
          placeholder={t('login.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit();
          }}
          disabled={isLoading}
          autoFocus
          autoComplete="email"
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            fontFamily: 'inherit',
            fontSize: 15,
            color: 'var(--color-text-body)',
            outline: 'none',
          }}
        />
      </div>

      {error && (
        <div
          style={{
            fontSize: 13,
            color: 'var(--color-danger)',
            marginBottom: 16,
            padding: '8px 12px',
            background: 'var(--color-danger-muted)',
            borderRadius: 8,
            lineHeight: 1.5,
          }}
        >
          {getErrorMessage(error, attemptsRemaining, t)}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isLoading || !email.trim()}
        style={{
          width: '100%',
          padding: '14px 16px',
          background: isLoading || !email.trim() ? 'var(--color-text-muted)' : 'var(--color-primary)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 600,
          fontFamily: 'inherit',
          cursor: isLoading || !email.trim() ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: isLoading || !email.trim() ? 0.5 : 1,
          transition: 'background 150ms, opacity 150ms',
        }}
      >
        {isLoading ? (
          <SpinnerGap size={20} weight="bold" style={{ animation: 'spin 1s linear infinite' }} />
        ) : null}
        {t('login.sendCode')}
      </button>
    </>
  );
}

function VerifyStep({
  email,
  digits,
  isLoading,
  error,
  attemptsRemaining,
  resendCooldown,
  digitRefs,
  onDigitChange,
  onDigitKeyDown,
  onPaste,
  onVerify,
  onResend,
  onBack,
  compact,
  t,
}: {
  email: string;
  digits: string[];
  isLoading: boolean;
  error: string | null;
  attemptsRemaining: number | null;
  resendCooldown: number;
  digitRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onDigitChange: (index: number, value: string) => void;
  onDigitKeyDown: (index: number, e: React.KeyboardEvent) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
  compact: boolean;
  t: (key: TranslationKey) => string;
}) {
  const codeComplete = digits.every((d) => d !== '' && d !== ' ');

  return (
    <>
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'none',
          border: 'none',
          color: 'var(--color-text-muted)',
          fontSize: 13,
          fontFamily: 'inherit',
          cursor: 'pointer',
          padding: '4px 0',
          marginBottom: 16,
          transition: 'color 150ms',
        }}
      >
        <ArrowLeft size={16} weight="regular" />
        Back
      </button>

      <div
        style={{
          fontSize: compact ? 18 : 22,
          fontWeight: 600,
          color: 'var(--color-text-heading)',
          marginBottom: 8,
        }}
      >
        {t('login.checkEmail')}
      </div>
      <div
        style={{
          fontSize: 14,
          color: 'var(--color-text-muted)',
          marginBottom: 32,
          lineHeight: 1.5,
        }}
      >
        {t('login.codeSentTo')} <strong style={{ color: 'var(--color-text-body)' }}>{email}</strong>
      </div>

      {/* OTP digit inputs */}
      <div
        style={{
          display: 'flex',
          gap: compact ? 8 : 10,
          justifyContent: 'center',
          marginBottom: 32,
        }}
        onPaste={onPaste}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              digitRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digit === ' ' ? '' : digit}
            onChange={(e) => onDigitChange(i, e.target.value)}
            onKeyDown={(e) => onDigitKeyDown(i, e)}
            disabled={isLoading}
            autoComplete="one-time-code"
            className="otp-digit"
            style={{
              width: compact ? 44 : 48,
              height: compact ? 52 : 56,
              textAlign: 'center',
              fontSize: compact ? 22 : 24,
              fontWeight: 700,
              fontFamily: 'inherit',
              border: '2px solid var(--color-border)',
              borderRadius: 8,
              background: 'var(--color-bg)',
              color: 'var(--color-text-heading)',
              outline: 'none',
              transition: 'border-color 150ms, box-shadow 150ms',
            }}
          />
        ))}
      </div>

      {error && (
        <div
          style={{
            fontSize: 13,
            color: 'var(--color-danger)',
            marginBottom: 16,
            textAlign: 'center',
            padding: '8px 12px',
            background: 'var(--color-danger-muted)',
            borderRadius: 8,
            lineHeight: 1.5,
          }}
        >
          {getErrorMessage(error, attemptsRemaining, t)}
        </div>
      )}

      <button
        onClick={onVerify}
        disabled={isLoading || !codeComplete}
        style={{
          width: '100%',
          padding: '14px 16px',
          background: isLoading || !codeComplete ? 'var(--color-text-muted)' : 'var(--color-primary)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 600,
          fontFamily: 'inherit',
          cursor: isLoading || !codeComplete ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: isLoading || !codeComplete ? 0.5 : 1,
          marginBottom: 16,
          transition: 'background 150ms, opacity 150ms',
        }}
      >
        {isLoading ? (
          <SpinnerGap size={20} weight="bold" style={{ animation: 'spin 1s linear infinite' }} />
        ) : null}
        {t('login.verify')}
      </button>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onResend}
          disabled={resendCooldown > 0}
          style={{
            background: 'none',
            border: 'none',
            color: resendCooldown > 0 ? 'var(--color-text-muted)' : 'var(--color-primary)',
            fontSize: 13,
            fontFamily: 'inherit',
            cursor: resendCooldown > 0 ? 'default' : 'pointer',
            padding: '4px 8px',
            transition: 'color 150ms',
          }}
        >
          {resendCooldown > 0
            ? t('login.resendIn').replace('{seconds}', String(resendCooldown))
            : t('login.resend')}
        </button>
      </div>
    </>
  );
}
