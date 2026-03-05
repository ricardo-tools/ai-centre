'use client';

import { TopNav } from '@/components/TopNav';
import type { NavItem } from './useTopNav';

interface TopNavMDProps {
  items: NavItem[];
  activePath: string;
}

export function TopNavMD({ items }: TopNavMDProps) {
  return <TopNav items={items} showLabels={false} showThemeSwitcher={true} />;
}
