'use client';

import type { RenderableWidget } from '@/screen-renderer/types';
import { DesignExcellenceShowcase } from '@/app/skills/[slug]/showcases/DesignExcellenceShowcase';

export function DesignExcellenceShowcaseMD(_props: RenderableWidget) {
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
      <DesignExcellenceShowcase />
    </div>
  );
}
