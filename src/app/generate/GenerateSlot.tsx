'use client';

import { CompositionWizardWidget } from '@/features/generate-project/widgets/CompositionWizardWidget/CompositionWizardWidget';
import { AlphaBanner } from '@/platform/components/AlphaBanner';

export function GenerateSlot() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AlphaBanner message="Project generation is in early development — downloads may not work as expected." />
      <CompositionWizardWidget size="lg" />
    </div>
  );
}
