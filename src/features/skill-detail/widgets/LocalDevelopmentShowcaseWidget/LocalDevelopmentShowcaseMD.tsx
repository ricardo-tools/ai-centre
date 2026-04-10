'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';
import { LocalDevelopmentShowcase } from '@/features/skill-detail/showcases/LocalDevelopmentShowcase';

export function LocalDevelopmentShowcaseMD(_props: RenderableWidget) {
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
      <LocalDevelopmentShowcase />
    </div>
  );
}
