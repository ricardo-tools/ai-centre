'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';
import { SkillReviewShowcase } from '@/features/skill-detail/showcases/SkillReviewShowcase';

export function SkillReviewShowcaseMD(_props: RenderableWidget) {
  return (
    <div style={{ padding: 24, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)', overflow: 'hidden' }}>
      <SkillReviewShowcase />
    </div>
  );
}
