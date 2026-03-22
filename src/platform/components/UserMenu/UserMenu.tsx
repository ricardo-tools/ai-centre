'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { SignOut, UserCircle } from '@phosphor-icons/react';
import { DevIdentitySwitcher } from '@/platform/components/DevIdentitySwitcher';

interface UserMenuProps {
  userEmail: string;
  userId: string | null;
  showLabels?: boolean;
  onSignOut?: () => void;
}

export function UserMenu({ userEmail, userId, showLabels = true, onSignOut }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const toggleMenu = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const initial = userEmail[0]?.toUpperCase() ?? '?';

  // Compute dropdown position relative to the button
  const getMenuPosition = () => {
    if (!buttonRef.current) return { top: 0, right: 0 };
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    };
  };

  const dropdown =
    open && mounted
      ? createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              ...getMenuPosition(),
              minWidth: 240,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              zIndex: 500, /* --z-drawer */
              overflow: 'hidden',
            }}
          >
            {/* User info */}
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--color-text-heading)',
                  lineHeight: 1.4,
                }}
              >
                {userEmail}
              </div>
            </div>

            {/* Menu items */}
            <div style={{ padding: '4px 0' }}>
              {userId && (
                <Link
                  href={`/profile/${userId}`}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    fontSize: 13,
                    color: 'var(--color-text-body)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <UserCircle size={16} weight="regular" />
                  Profile
                </Link>
              )}
              {onSignOut && (
                <button
                  onClick={() => {
                    setOpen(false);
                    onSignOut();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '8px 16px',
                    fontSize: 13,
                    color: 'var(--color-text-body)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                  }}
                >
                  <SignOut size={16} weight="regular" />
                  Sign out
                </button>
              )}
            </div>

            {/* Dev identity switcher (dev only) */}
            {process.env.NODE_ENV === 'development' && (
              <div
                style={{
                  padding: '8px 16px',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <DevIdentitySwitcher />
              </div>
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        aria-label="User menu"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: 4,
          fontFamily: 'inherit',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--color-primary-muted)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {initial}
        </div>
        {showLabels && (
          <span
            style={{
              fontSize: 13,
              color: 'var(--color-topnav-text-muted)',
              maxWidth: 140,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {userEmail}
          </span>
        )}
      </button>
      {dropdown}
    </>
  );
}
