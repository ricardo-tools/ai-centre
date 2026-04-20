'use client';

import { Globe, LockSimple, LinkSimple } from '@phosphor-icons/react';

export type Visibility = 'public' | 'private' | 'link_only';

interface VisibilitySelectorProps {
  value: Visibility;
  onChange: (v: Visibility) => void;
  disabled?: boolean;
}

const OPTIONS: { value: Visibility; label: string; description: string; Icon: typeof Globe }[] = [
  { value: 'public', label: 'Public', description: 'Visible to everyone in the gallery', Icon: Globe },
  { value: 'private', label: 'Private', description: 'Only you and people you share with', Icon: LockSimple },
  { value: 'link_only', label: 'Link only', description: 'Anyone with the link can access', Icon: LinkSimple },
];

export function VisibilitySelector({ value, onChange, disabled }: VisibilitySelectorProps) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => !disabled && onChange(opt.value)}
            disabled={disabled}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '10px 8px',
              borderRadius: 8,
              border: `1.5px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: active ? 'var(--color-primary-muted)' : 'var(--color-surface)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: disabled ? 0.5 : 1,
              transition: 'border-color 150ms, background 150ms',
            }}
          >
            <opt.Icon
              size={20}
              weight={active ? 'fill' : 'regular'}
              style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: active ? 'var(--color-primary)' : 'var(--color-text-heading)' }}>
              {opt.label}
            </span>
            <span style={{ fontSize: 10, color: 'var(--color-text-muted)', lineHeight: 1.3, textAlign: 'center' }}>
              {opt.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
