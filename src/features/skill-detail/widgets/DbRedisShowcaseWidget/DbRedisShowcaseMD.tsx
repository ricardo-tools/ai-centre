'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';
import { DbRedisShowcase } from '@/features/skill-detail/showcases/DbRedisShowcase';

export function DbRedisShowcaseMD(_props: RenderableWidget) {
  return (
    <div style={{ padding: 24, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)', overflow: 'hidden' }}>
      <DbRedisShowcase />
    </div>
  );
}
