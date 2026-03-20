'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';
import { TestingStrategyShowcase } from '@/features/skill-detail/showcases/TestingStrategyShowcase';

export function TestingStrategyShowcaseMD(_props: RenderableWidget) {
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
      <TestingStrategyShowcase />
    </div>
  );
}
