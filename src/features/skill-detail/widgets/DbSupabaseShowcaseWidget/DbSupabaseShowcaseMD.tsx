'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';
import { DbSupabaseShowcase } from '@/features/skill-detail/showcases/DbSupabaseShowcase';

export function DbSupabaseShowcaseMD(_props: RenderableWidget) {
  return (
    <div style={{ padding: 24, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)', overflow: 'hidden' }}>
      <DbSupabaseShowcase />
    </div>
  );
}
