'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bug } from '@phosphor-icons/react';

const DEV_IDENTITIES = [
  { label: 'Admin', userId: 'dev', email: 'dev@local', roleId: 'dev-admin-role', roleSlug: 'admin' },
  { label: 'Member', userId: 'dev-member', email: 'member@ezycollect.com.au', roleId: 'dev-member-role', roleSlug: 'member' },
  { label: 'User A', userId: 'user-a', email: 'alice@ezycollect.com.au', roleId: 'dev-member-role', roleSlug: 'member' },
  { label: 'User B', userId: 'user-b', email: 'bob@sidetrade.com', roleId: 'dev-member-role', roleSlug: 'member' },
];

/**
 * Dev-only identity switcher. Sets a cookie that getSession() reads in development mode.
 * Lets you test the app as different users/roles without a real database.
 */
export function DevIdentitySwitcher() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [currentLabel, setCurrentLabel] = useState('Admin');

  const switchIdentity = useCallback((identity: typeof DEV_IDENTITIES[number]) => {
    // Set cookie readable by server
    const value = encodeURIComponent(JSON.stringify({
      userId: identity.userId,
      email: identity.email,
      roleId: identity.roleId,
      roleSlug: identity.roleSlug,
    }));
    document.cookie = `dev-identity=${value}; path=/; max-age=86400`;
    setCurrentLabel(identity.label);
    setOpen(false);
    // Full page reload to re-read session on the server
    window.location.reload();
  }, []);

  // Only render in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 8px',
          borderRadius: 4,
          border: '1px dashed var(--color-warning)',
          background: 'var(--color-warning-muted)',
          color: 'var(--color-warning)',
          fontSize: 11,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <Bug size={12} weight="bold" />
        DEV: {currentLabel}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 100,
            minWidth: 200,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Switch Identity
          </div>
          {DEV_IDENTITIES.map((identity) => (
            <button
              key={identity.userId}
              onClick={() => switchIdentity(identity)}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: currentLabel === identity.label ? 'var(--color-primary-muted)' : 'transparent',
                color: 'var(--color-text-body)',
                fontSize: 13,
                fontFamily: 'inherit',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 500, color: 'var(--color-text-heading)' }}>{identity.label}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{identity.email} · {identity.roleSlug}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
