'use client';

import { useState, useRef, useCallback } from 'react';
import { PushPin, CaretDown, Layout, User } from '@phosphor-icons/react';
import type { AppShell } from '../domain/types';
import { enAU } from '../i18n/en-AU';
import IdentityBadge from './IdentityBadge';
import Portal from './Portal';
import useAnchorPosition from '../hooks/useAnchorPosition';
import useOutsideClick from '../hooks/useOutsideClick';

// ------------------------------------------------------------
// Shell options
// ------------------------------------------------------------

const SHELL_OPTIONS: { value: AppShell | 'none'; label: string }[] = [
  { value: 'ezycollect-legacy', label: enAU.shells['ezycollect-legacy'] },
  { value: 'new-workflows', label: enAU.shells['new-workflows'] },
  { value: 'simplypaid', label: enAU.shells.simplypaid },
  { value: 'none', label: enAU.shells.none },
];

// ------------------------------------------------------------
// Props
// ------------------------------------------------------------

export interface FloatingToolbarProps {
  /** Current app shell selection */
  currentShell: AppShell | 'none';
  onShellChange: (shell: AppShell | 'none') => void;
  /** Review mode state */
  reviewActive: boolean;
  onToggleReview: () => void;
  /** Number of open pins for badge */
  openPinCount: number;
  /** Current user identity (null = not identified) */
  identity: { name: string; initials: string } | null;
  /** Fires when user needs to identify before review */
  onRequestIdentity: () => void;
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export default function FloatingToolbar({
  currentShell,
  onShellChange,
  reviewActive,
  onToggleReview,
  openPinCount,
  identity,
  onRequestIdentity,
}: FloatingToolbarProps) {
  const t = enAU.toolbar;

  // Shell dropdown state
  const [shellOpen, setShellOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pos = useAnchorPosition(triggerRef, shellOpen, { side: 'top', gap: 8, align: 'left' });
  useOutsideClick(shellOpen, [triggerRef, dropdownRef], () => setShellOpen(false));

  const currentLabel =
    SHELL_OPTIONS.find((o) => o.value === currentShell)?.label ?? t.noShell;

  const handleShellSelect = useCallback(
    (value: AppShell | 'none') => {
      onShellChange(value);
      setShellOpen(false);
    },
    [onShellChange],
  );

  const handleReviewClick = useCallback(() => {
    if (identity) {
      onToggleReview();
    } else {
      onRequestIdentity();
    }
  }, [identity, onToggleReview, onRequestIdentity]);

  // Shared separator style
  const separator: React.CSSProperties = {
    width: 1,
    alignSelf: 'stretch',
    margin: '4px 0',
    background: 'var(--color-border)',
    flexShrink: 0,
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 'var(--z-toast)' as unknown as number,
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '8px 16px',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--color-text-body)',
          whiteSpace: 'nowrap',
        }}
      >
        {/* ── Shell selector ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layout size={16} weight="regular" style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          <span
            style={{
              color: 'var(--color-text-muted)',
              fontSize: 12,
              fontWeight: 500,
              // Collapse label on narrow screens via media query workaround:
              // We use a max-width + overflow approach since inline styles can't do @media
            }}
            className="floating-toolbar__shell-label"
          >
            {t.shellLabel}:
          </span>
          <button
            ref={triggerRef}
            onClick={() => setShellOpen((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'var(--color-bg-alt)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 8px',
              fontSize: 13,
              fontWeight: 500,
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-heading)',
              cursor: 'pointer',
              lineHeight: 1.2,
            }}
          >
            {currentLabel}
            <CaretDown
              size={12}
              weight="bold"
              style={{
                color: 'var(--color-text-muted)',
                transform: shellOpen ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.15s var(--ease-in-out)',
              }}
            />
          </button>
        </div>

        {/* ── Separator ── */}
        <div style={{ ...separator, margin: '4px 16px' }} />

        {/* ── Identity badge ── */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {identity ? (
            <IdentityBadge initials={identity.initials} name={identity.name} size={28} />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                flexShrink: 0,
              }}
            >
              <User size={14} weight="regular" style={{ color: 'var(--color-text-muted)' }} />
            </div>
          )}
        </div>

        {/* ── Separator ── */}
        <div style={{ ...separator, margin: '4px 16px' }} />

        {/* ── Review toggle ── */}
        <button
          onClick={handleReviewClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: reviewActive ? 'var(--color-primary)' : 'var(--color-bg-alt)',
            border: reviewActive ? '1px solid transparent' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 12px',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            color: reviewActive ? '#FFFFFF' : 'var(--color-text-heading)',
            cursor: 'pointer',
            lineHeight: 1.2,
            transition: 'background 0.15s var(--ease-in-out), color 0.15s var(--ease-in-out)',
          }}
        >
          <PushPin
            size={16}
            weight={reviewActive ? 'fill' : 'regular'}
            style={{ flexShrink: 0 }}
          />
          <span>{t.reviewLabel}</span>
          {openPinCount > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                padding: '0 4px',
                fontSize: 11,
                fontWeight: 700,
                lineHeight: 1,
                background: reviewActive
                  ? 'rgba(255, 255, 255, 0.25)'
                  : 'var(--color-primary-muted)',
                color: reviewActive ? '#FFFFFF' : 'var(--color-primary)',
              }}
            >
              {openPinCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Shell dropdown (portal) ── */}
      {shellOpen && pos && (
        <Portal>
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              // Position above the trigger, aligned left
              top: pos.top,
              left: pos.left,
              transform: 'translateY(-100%)',
              zIndex: 'var(--z-toast)' as unknown as number,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '4px 0',
              minWidth: 180,
              fontFamily: 'var(--font-body)',
            }}
          >
            {SHELL_OPTIONS.map((option) => {
              const selected = option.value === currentShell;
              return (
                <div
                  key={option.value}
                  onClick={() => handleShellSelect(option.value)}
                  style={{
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: selected ? 600 : 400,
                    color: selected
                      ? 'var(--color-primary)'
                      : 'var(--color-text-body)',
                    cursor: 'pointer',
                    background: 'transparent',
                    transition: 'background 0.1s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      'var(--color-bg-alt)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      'transparent';
                  }}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        </Portal>
      )}

      {/* ── Responsive style tag for narrow screens ── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 639px) {
              .floating-toolbar__shell-label {
                display: none !important;
              }
            }
          `,
        }}
      />
    </>
  );
}
