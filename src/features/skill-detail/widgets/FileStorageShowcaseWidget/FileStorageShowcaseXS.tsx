'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

export function FileStorageShowcaseXS(_props: RenderableWidget) {
  return (
    <div style={{ padding: 24, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)' }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 16 }}>
        Key Takeaways
      </h3>
      <p style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.5 }}>
        View the full Skill in Practice showcase on a larger screen.
      </p>
    </div>
  );
}
