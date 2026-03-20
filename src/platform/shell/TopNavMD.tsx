'use client';

import { TopNav } from '@/platform/components/TopNav';
import type { NavItem } from './useTopNav';

interface TopNavMDProps {
  items: NavItem[];
  activePath: string;
  userEmail: string | null;
  onSignOut: () => void;
}

export function TopNavMD({ items, userEmail, onSignOut }: TopNavMDProps) {
  return <TopNav items={items} showLabels={false} showThemeSwitcher={true} userEmail={userEmail} onSignOut={onSignOut} />;
}
