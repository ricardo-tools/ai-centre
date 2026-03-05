'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

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
}

export function TopNav({ items, brandName = 'AI Centre', showLabels = true, showThemeSwitcher = true }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 56,
        paddingInline: 24,
        background: 'var(--color-topnav-bg)',
        borderBottom: '1px solid var(--color-topnav-border)',
        gap: 0,
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--color-text-heading)',
          textDecoration: 'none',
          marginRight: 32,
          flexShrink: 0,
        }}
      >
        {brandName}
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
                paddingInline: 16,
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

      {showThemeSwitcher && <ThemeSwitcher />}
    </header>
  );
}
