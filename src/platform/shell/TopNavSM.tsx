'use client';

import { useState } from 'react';
import Link from 'next/link';
import { List, X, SignOut, UserCircle } from '@phosphor-icons/react';
import { ThemeSwitcher } from '@/platform/components/ThemeSwitcher';
import type { NavItem } from './useTopNav';

interface TopNavSMProps {
  items: NavItem[];
  activePath: string;
  userEmail: string | null;
  onSignOut: () => void;
}

export function TopNavSM({ items, activePath, userEmail, onSignOut }: TopNavSMProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 48,
          paddingInline: 16,
          background: 'var(--color-topnav-bg)',
          borderBottom: '1px solid var(--color-topnav-border)',
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--color-text-heading)',
            textDecoration: 'none',
          }}
        >
          AI Centre
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-body)',
            cursor: 'pointer',
          }}
        >
          <List size={24} />
        </button>
      </header>

      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--color-bg)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '12px 16px',
            }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
                border: 'none',
                background: 'transparent',
                color: 'var(--color-text-body)',
                cursor: 'pointer',
              }}
            >
              <X size={24} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {items.map((item) => {
              const isActive = item.href === '/'
                ? activePath === '/'
                : activePath.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '16px 24px',
                    fontSize: 18,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive
                      ? 'var(--color-text-heading)'
                      : 'var(--color-text-muted)',
                    textDecoration: 'none',
                  }}
                >
                  <Icon size={22} weight={isActive ? 'fill' : 'regular'} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ThemeSwitcher />
            {userEmail && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <UserCircle size={20} weight="regular" style={{ color: 'var(--color-text-muted)' }} />
                  <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{userEmail}</span>
                </div>
                <button
                  onClick={onSignOut}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    fontSize: 13,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  <SignOut size={16} weight="regular" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
