'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';
import { FlowObservabilityShowcase } from '@/features/skill-detail/showcases/FlowObservabilityShowcase';

export function FlowObservabilityShowcaseMD(_props: RenderableWidget) {
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
      <FlowObservabilityShowcase />
    </div>
  );
}
