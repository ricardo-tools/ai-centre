'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';
import { SocialFeaturesShowcase } from '@/features/skill-detail/showcases/SocialFeaturesShowcase';

export function SocialFeaturesShowcaseMD(_props: RenderableWidget) {
  return (
    <div style={{ padding: 24, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)', overflow: 'hidden' }}>
      <SocialFeaturesShowcase />
    </div>
  );
}
