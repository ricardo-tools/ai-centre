'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';
import { PlaywrightE2eShowcase } from '@/features/skill-detail/showcases/PlaywrightE2eShowcase';

export function PlaywrightE2eShowcaseMD(_props: RenderableWidget) {
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
      <PlaywrightE2eShowcase />
    </div>
  );
}
