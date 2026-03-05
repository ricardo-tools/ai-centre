'use client';

import type { RenderableWidget } from '@/screen-renderer/types';
import { AppLayoutShowcase } from '@/app/skills/[slug]/showcases/AppLayoutShowcase';

export function AppLayoutShowcaseMD(_props: RenderableWidget) {
  return (
    <div
      style={{
        padding: 24,
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        background: 'var(--color-surface)',
        overflow: 'hidden',
      }}
    >
      <AppLayoutShowcase />
    </div>
  );
}
