'use client';

import { TopNav } from '@/components/TopNav';
import type { NavItem } from './useTopNav';

interface TopNavLGProps {
  items: NavItem[];
  activePath: string;
}

export function TopNavLG({ items }: TopNavLGProps) {
  return <TopNav items={items} showLabels={true} showThemeSwitcher={true} />;
}
