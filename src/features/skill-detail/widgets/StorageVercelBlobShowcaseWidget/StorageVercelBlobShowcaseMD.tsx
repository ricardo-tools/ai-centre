'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';
import { StorageVercelBlobShowcase } from '@/features/skill-detail/showcases/StorageVercelBlobShowcase';

export function StorageVercelBlobShowcaseMD(_props: RenderableWidget) {
  return (
    <div style={{ padding: 24, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)', overflow: 'hidden' }}>
      <StorageVercelBlobShowcase />
    </div>
  );
}
