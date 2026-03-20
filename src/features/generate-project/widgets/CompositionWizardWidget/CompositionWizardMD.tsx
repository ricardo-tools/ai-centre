'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';
import type { UseCompositionWizardResult } from './useCompositionWizard';
import { CompositionWizardLG } from './CompositionWizardLG';

interface CompositionWizardMDProps extends RenderableWidget {
  wizard: UseCompositionWizardResult;
}

export function CompositionWizardMD({ wizard }: CompositionWizardMDProps) {
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
      <CompositionWizardLG wizard={wizard} />
    </div>
  );
}
