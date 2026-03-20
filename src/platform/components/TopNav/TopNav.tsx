'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { SignOut, UserCircle } from '@phosphor-icons/react';
import { ThemeSwitcher } from '@/platform/components/ThemeSwitcher';
import { DevIdentitySwitcher } from '@/platform/components/DevIdentitySwitcher';

export interface NavItem {
  href: string;
  label: string;
  icon: PhosphorIcon;
}

interface TopNavProps {
  items: NavItem[];
  brandName?: string;
  showLabels?: boolean;
  showThemeSwitcher?: boolean;
  userEmail?: string | null;
  onSignOut?: () => void;
}

export function TopNav({ items, brandName = 'AI Centre', showLabels = true, showThemeSwitcher = true, userEmail, onSignOut }: TopNavProps) {
  const pathname = usePathname();
  const compact = !showLabels;

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 56,
        paddingInline: compact ? 12 : 24,
        background: 'var(--color-topnav-bg)',
        borderBottom: '1px solid var(--color-topnav-border)',
        gap: 0,
        position: 'relative',
        zIndex: 200,
      }}
    >
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: compact ? 0 : 10,
          textDecoration: 'none',
          marginRight: compact ? 16 : 32,
          flexShrink: 0,
        }}
      >
        {/* Theme-aware logo: colour on light/legacy, white on dark/night */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/rectangle-color.png"
          alt="ezyCollect by Sidetrade"
          className="logo-color"
          style={{ height: 20, display: 'block' }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/rectangle-white.png"
          alt="ezyCollect by Sidetrade"
          className="logo-white"
          style={{ height: 20, display: 'none' }}
        />
        {!compact && (
          <>
            <span style={{ width: 1, height: 18, background: 'var(--color-border)', marginInline: 2 }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)', letterSpacing: '-0.01em' }}>{brandName}</span>
          </>
        )}
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1, height: '100%' }}>
        {items.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                paddingInline: compact ? 10 : 16,
                height: '100%',
                color: isActive
                  ? 'var(--color-topnav-text)'
                  : 'var(--color-topnav-text-muted)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                transition: 'color 150ms, border-color 150ms',
              }}
            >
              <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
              {showLabels && item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 4 : 8, flexShrink: 0 }}>
        {showLabels && <DevIdentitySwitcher />}
        {showThemeSwitcher && <ThemeSwitcher />}
        {userEmail && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                paddingLeft: compact ? 8 : 12,
                borderLeft: '1px solid var(--color-topnav-border)',
                marginLeft: 4,
              }}
            >
              <UserCircle size={20} weight="regular" style={{ color: 'var(--color-topnav-text-muted)' }} />
              {showLabels && (
                <span
                  style={{
                    fontSize: 13,
                    color: 'var(--color-topnav-text-muted)',
                    maxWidth: 160,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {userEmail}
                </span>
              )}
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  title="Sign out"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    borderRadius: 4,
                    color: 'var(--color-topnav-text-muted)',
                    minHeight: 44,
                    minWidth: 44,
                  }}
                >
                  <SignOut size={18} weight="regular" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
