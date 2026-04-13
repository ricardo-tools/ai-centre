'use client';

import { ShieldCheck, SpinnerGap } from '@phosphor-icons/react';
import { useLocale } from '@/platform/screen-renderer/LocaleContext';

interface ConsentFormProps {
  isAllowing: boolean;
  isDenying: boolean;
  onAllow: () => void;
  onDeny: () => void;
  compact?: boolean;
}

export function ConsentForm({
  isAllowing,
  isDenying,
  onAllow,
  onDeny,
  compact = false,
}: ConsentFormProps) {
  const { t } = useLocale();
  const cardPadding = compact ? 24 : 40;
  const cardMaxWidth = compact ? 360 : 420;
  const isProcessing = isAllowing || isDenying;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: compact ? 16 : 32,
        background: 'var(--color-bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradient orbs — decorative background */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%', width: '50vw', height: '50vw',
        borderRadius: '50%', background: 'var(--color-primary-muted)', opacity: 0.4,
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%', width: '40vw', height: '40vw',
        borderRadius: '50%', background: 'var(--color-secondary-muted, rgba(59, 130, 246, 0.08))', opacity: 0.3,
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <div
        style={{
          width: '100%',
          maxWidth: cardMaxWidth,
          background: 'var(--color-surface)',
          borderRadius: 16,
          border: '1px solid var(--color-border)',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header — logo + branding */}
        <div
          style={{
            padding: `${compact ? 28 : 40}px ${cardPadding}px ${compact ? 20 : 28}px`,
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: compact ? 12 : 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/rectangle-color.png" alt="ezyCollect" className="logo-color" style={{ height: compact ? 22 : 26 }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/rectangle-white.png" alt="ezyCollect" className="logo-white" style={{ height: compact ? 22 : 26 }} />
            <div style={{ width: 1, height: compact ? 18 : 22, background: 'var(--color-border)' }} />
            <span style={{ fontSize: compact ? 16 : 18, fontWeight: 700, color: 'var(--color-text-heading)', letterSpacing: '-0.01em' }}>
              {t('app.name')}
            </span>
          </div>
          <p style={{
            fontSize: compact ? 12 : 13, color: 'var(--color-text-muted)',
            margin: 0, lineHeight: 1.5,
          }}>
            The AI skill library for every team
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--color-border)', margin: `0 ${cardPadding}px` }} />

        {/* Body — consent content */}
        <div style={{ padding: `${compact ? 24 : 32}px ${cardPadding}px ${cardPadding}px` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <ShieldCheck size={compact ? 22 : 26} weight="fill" style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <div
              style={{
                fontSize: compact ? 18 : 22,
                fontWeight: 600,
                color: 'var(--color-text-heading)',
              }}
            >
              Authorize CLI Access
            </div>
          </div>

          <div
            style={{
              fontSize: 14,
              color: 'var(--color-text-muted)',
              marginBottom: 24,
              lineHeight: 1.5,
            }}
          >
            A CLI tool is requesting access to your account. This will allow it to:
          </div>

          {/* Permission list */}
          <div
            style={{
              background: 'var(--color-bg)',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              padding: compact ? 12 : 16,
              marginBottom: 24,
            }}
          >
            {[
              'Download skills from the catalog',
              'Manage your workspace settings',
            ].map((perm) => (
              <div
                key={perm}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 0',
                  fontSize: 14,
                  color: 'var(--color-text-body)',
                }}
              >
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--color-success)', flexShrink: 0,
                }} />
                {perm}
              </div>
            ))}
          </div>

          {/* Allow button */}
          <button
            onClick={onAllow}
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: isProcessing ? 'var(--color-text-muted)' : 'var(--color-primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: isProcessing ? 0.5 : 1,
              marginBottom: 12,
              transition: 'background 150ms, opacity 150ms',
            }}
          >
            {isAllowing ? (
              <SpinnerGap size={20} weight="bold" style={{ animation: 'spin 1s linear infinite' }} />
            ) : null}
            Allow Access
          </button>

          {/* Deny button */}
          <button
            onClick={onDeny}
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 500,
              fontFamily: 'inherit',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.5 : 1,
              transition: 'opacity 150ms',
            }}
          >
            {isDenying ? (
              <SpinnerGap size={20} weight="bold" style={{ animation: 'spin 1s linear infinite' }} />
            ) : null}
            Deny
          </button>
        </div>
      </div>

      {/* Footer — subtle branding */}
      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 24, opacity: 0.6, position: 'relative', zIndex: 1 }}>
        ezyCollect by Sidetrade
      </p>
    </div>
  );
}
