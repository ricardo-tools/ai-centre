'use client';

import { TopNav } from '@/platform/components/TopNav';
import type { NavItem } from './useTopNav';

interface TopNavLGProps {
  items: NavItem[];
  activePath: string;
  userEmail: string | null;
  userId: string | null;
  onSignOut: () => void;
}

export function TopNavLG({ items, userEmail, userId, onSignOut }: TopNavLGProps) {
  return <TopNav items={items} showLabels={true} showThemeSwitcher={true} userEmail={userEmail} userId={userId} onSignOut={onSignOut} />;
}
