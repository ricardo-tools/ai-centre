'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

export function ActivityNotificationsShowcaseSM(_props: RenderableWidget) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      <div style={{ padding: 20, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)' }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>Overview</h4>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>See the full showcase on a larger screen for visual demos and diagrams.</p>
      </div>
    </div>
  );
}
