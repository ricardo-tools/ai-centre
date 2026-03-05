'use client';

import { usePathname } from 'next/navigation';
import { House, Books, Shapes, Rocket } from '@phosphor-icons/react';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';

export interface NavItem {
  href: string;
  label: string;
  icon: PhosphorIcon;
}

interface UseTopNavOptions {
  mock?: boolean;
}

interface UseTopNavResult {
  items: NavItem[];
  activePath: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: House },
  { href: '/skills', label: 'Skills', icon: Books },
  { href: '/archetypes', label: 'Archetypes', icon: Shapes },
  { href: '/generate', label: 'Generate', icon: Rocket },
];

export function useTopNav({ mock }: UseTopNavOptions = {}): UseTopNavResult {
  const pathname = mock ? '/' : usePathname();

  return {
    items: NAV_ITEMS,
    activePath: pathname,
  };
}
