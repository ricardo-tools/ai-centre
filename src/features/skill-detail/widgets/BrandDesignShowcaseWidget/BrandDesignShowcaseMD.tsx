'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';
import { BrandDesignShowcase } from '@/app/skills/[slug]/showcases/BrandDesignShowcase';

export function BrandDesignShowcaseMD(_props: RenderableWidget) {
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
      <BrandDesignShowcase />
    </div>
  );
}
