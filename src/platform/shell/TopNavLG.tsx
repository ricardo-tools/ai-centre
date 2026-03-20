'use client';

import { TopNav } from '@/platform/components/TopNav';
import type { NavItem } from './useTopNav';

interface TopNavLGProps {
  items: NavItem[];
  activePath: string;
  userEmail: string | null;
  onSignOut: () => void;
}

export function TopNavLG({ items, userEmail, onSignOut }: TopNavLGProps) {
  return <TopNav items={items} showLabels={true} showThemeSwitcher={true} userEmail={userEmail} onSignOut={onSignOut} />;
}
