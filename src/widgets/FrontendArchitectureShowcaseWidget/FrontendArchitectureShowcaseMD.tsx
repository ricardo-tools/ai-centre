'use client';

import type { RenderableWidget } from '@/screen-renderer/types';
import { FrontendArchitectureShowcase } from '@/app/skills/[slug]/showcases/FrontendArchitectureShowcase';

export function FrontendArchitectureShowcaseMD(_props: RenderableWidget) {
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
      <FrontendArchitectureShowcase />
    </div>
  );
}
