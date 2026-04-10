'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';
import { RoadmapShowcase } from '@/features/skill-detail/showcases/RoadmapShowcase';

export function RoadmapShowcaseMD(_props: RenderableWidget) {
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
      <RoadmapShowcase />
    </div>
  );
}
