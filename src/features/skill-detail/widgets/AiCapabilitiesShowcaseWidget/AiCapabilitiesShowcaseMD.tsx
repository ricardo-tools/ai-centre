'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';
import { AiCapabilitiesShowcase } from '@/features/skill-detail/showcases/AiCapabilitiesShowcase';

export function AiCapabilitiesShowcaseMD(_props: RenderableWidget) {
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
      <AiCapabilitiesShowcase />
    </div>
  );
}
