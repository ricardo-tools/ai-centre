'use client';

import { useState } from 'react';
import { PushPin, CheckCircle } from '@phosphor-icons/react';
import type { Pin } from '../domain/Pin';
import { enAU } from '../i18n/en-AU';

// ------------------------------------------------------------
// Props
// ------------------------------------------------------------

export interface PinMarkerProps {
  pin: Pin;
  onClick: () => void;
  isResolved: boolean;
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '\u2026';
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export default function PinMarker({ pin, onClick, isResolved }: PinMarkerProps) {
  const [hovered, setHovered] = useState(false);

  const dotSize = 24;
  const initials = getInitials(pin.author);

  return (
    <>
      {/* Inject keyframes locally — same pattern as IdentityPrompt */}
      <style>{`
        @keyframes voScaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div
        role="button"
        tabIndex={0}
        aria-label={truncate(pin.text, 40)}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onClick();
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          cursor: 'pointer',
          zIndex: hovered ? 10 : 1,
        }}
      >
        {/* --- Collapsed dot --- */}
        <div
          title={truncate(pin.text, 40)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: isResolved
              ? 'var(--color-success-muted)'
              : 'var(--color-primary)',
            color: isResolved
              ? 'var(--color-success)'
              : 'var(--color-surface)',
            opacity: isResolved ? 0.5 : 1,
            border: isResolved
              ? '1px solid var(--color-success)'
              : '2px solid var(--color-surface)',
            boxShadow: 'var(--shadow-md)',
            transition: 'transform 150ms var(--ease-out), box-shadow 150ms var(--ease-out)',
            transform: hovered ? 'scale(1.15)' : 'scale(1)',
            flexShrink: 0,
          }}
        >
          {isResolved ? (
            <CheckCircle size={14} weight="fill" />
          ) : (
            <PushPin size={14} weight="fill" />
          )}
        </div>

        {/* --- Expanded hover card --- */}
        {hovered && (
          <div
            style={{
              position: 'absolute',
              top: dotSize + 4,
              left: 0,
              minWidth: 180,
              maxWidth: 240,
              padding: 'var(--space-2)',
              background: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-lg)',
              animation: 'voScaleIn 150ms var(--ease-out) both',
              opacity: isResolved ? 0.6 : 1,
              pointerEvents: 'none',
            }}
          >
            {/* Text preview */}
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-heading)',
                lineHeight: 1.4,
                marginBottom: 'var(--space-1)',
              }}
            >
              {truncate(pin.text, 40)}
            </div>

            {/* Author + reply count */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: 11,
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-muted)',
              }}
            >
              {/* Author initials badge */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: 'var(--color-bg-alt)',
                  fontSize: 9,
                  fontWeight: 600,
                  color: 'var(--color-text-body)',
                  flexShrink: 0,
                }}
              >
                {initials}
              </span>
              <span>{pin.author}</span>
              {pin.replyCount > 0 && (
                <>
                  <span style={{ color: 'var(--color-border)' }}>{'\u00B7'}</span>
                  <span>{enAU.review.pinReplies(pin.replyCount)}</span>
                </>
              )}
              {isResolved && (
                <>
                  <span style={{ color: 'var(--color-border)' }}>{'\u00B7'}</span>
                  <span style={{ color: 'var(--color-success)' }}>{enAU.review.pinResolved}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
