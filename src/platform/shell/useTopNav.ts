'use client';

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { House, Books, Toolbox, Rocket, Images, ChatCircle, GearSix } from '@phosphor-icons/react';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { useSession } from '@/platform/lib/SessionContext';
import { signOut } from '@/features/auth/action';

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
  userEmail: string | null;
  userId: string | null;
  onSignOut: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: House },
  { href: '/skills', label: 'Skills', icon: Books },
  { href: '/toolkits', label: 'Toolkits', icon: Toolbox },
  { href: '/generate', label: 'Generate', icon: Rocket },
  { href: '/gallery', label: 'Gallery', icon: Images },
  { href: '/chat', label: 'Chat', icon: ChatCircle },
];

export function useTopNav({ mock }: UseTopNavOptions = {}): UseTopNavResult {
  const pathname = mock ? '/' : usePathname();
  const session = useSession();

  const handleSignOut = useCallback(() => {
    signOut();
  }, []);

  const items = session?.roleSlug === 'admin'
    ? [...NAV_ITEMS, { href: '/admin', label: 'Admin', icon: GearSix }]
    : NAV_ITEMS;

  return {
    items,
    activePath: pathname,
    userEmail: session?.email ?? null,
    userId: session?.userId ?? null,
    onSignOut: handleSignOut,
  };
}
