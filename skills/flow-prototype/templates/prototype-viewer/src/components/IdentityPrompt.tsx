'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { enAU } from '../i18n/en-AU';

// ------------------------------------------------------------
// Props
// ------------------------------------------------------------

export interface IdentityPromptProps {
  open: boolean;
  onClose: () => void;
  onIdentify: (name: string) => void;
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export default function IdentityPrompt({ open, onClose, onIdentify }: IdentityPromptProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus when the modal opens; reset state when it closes.
  useEffect(() => {
    if (open) {
      setName('');
      setError('');
      // Defer slightly so the element is mounted and visible first.
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [open]);

  // Close on ESC
  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  function handleSubmit() {
    if (name.trim().length < 2) {
      setError(enAU.identity.nameRequired);
      return;
    }
    onIdentify(name.trim());
    setName('');
    setError('');
  }

  function handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit();
  }

  if (!open) return null;

  return (
    <>
      {/* Inject keyframe locally — voFadeIn is not in globals.css */}
      <style>{`
        @keyframes voFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        role="presentation"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          zIndex: 'var(--z-modal)' as unknown as number,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Dialog — stop propagation so clicks inside don't close */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="identity-prompt-title"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: 'var(--space-5)',
            width: '100%',
            maxWidth: 400,
            margin: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            animation: 'voFadeIn 200ms var(--ease-out) both',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <h2
              id="identity-prompt-title"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--color-text-heading)',
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              {enAU.identity.promptTitle}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 400,
                color: 'var(--color-text-muted)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {enAU.identity.promptSubtitle}
            </p>
          </div>

          {/* Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={handleKeyPress}
              placeholder={enAU.identity.namePlaceholder}
              autoComplete="name"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                fontWeight: 400,
                color: 'var(--color-text-body)',
                background: 'var(--color-bg-alt)',
                border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '10px var(--space-3)',
                outline: 'none',
                width: '100%',
                transition: 'border-color 150ms var(--ease-in-out)',
              }}
            />
            {error && (
              <span
                role="alert"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: 400,
                  color: 'var(--color-danger)',
                }}
              >
                {error}
              </span>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
            {/* Cancel */}
            <button
              type="button"
              onClick={onClose}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--color-text-body)',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0 var(--space-3)',
                height: 36,
                cursor: 'pointer',
                transition: 'background 150ms var(--ease-in-out), border-color 150ms var(--ease-in-out)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-alt)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              {enAU.identity.cancel}
            </button>

            {/* Primary — Start reviewing */}
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                color: '#FFFFFF',
                background: 'var(--color-primary)',
                border: '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                padding: '0 var(--space-3)',
                height: 36,
                cursor: 'pointer',
                transition: 'background 150ms var(--ease-in-out)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary-hover)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary)';
              }}
            >
              {enAU.identity.startReviewing}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
