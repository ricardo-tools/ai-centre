'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';
import { FlowProjectDocsShowcase } from '@/features/skill-detail/showcases/FlowProjectDocsShowcase';

export function FlowProjectDocsShowcaseMD(_props: RenderableWidget) {
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
      <FlowProjectDocsShowcase />
    </div>
  );
}
