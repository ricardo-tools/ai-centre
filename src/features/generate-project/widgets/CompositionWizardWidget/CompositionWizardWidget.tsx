'use client';

import type { RenderableWidget, SizeVariant } from '@/platform/screen-renderer/types';
import { useCompositionWizard } from './useCompositionWizard';
import { CompositionWizardXS } from './CompositionWizardXS';
import { CompositionWizardSM } from './CompositionWizardSM';
import { CompositionWizardMD } from './CompositionWizardMD';
import { CompositionWizardLG } from './CompositionWizardLG';

interface CompositionWizardWidgetProps extends RenderableWidget {
  mock?: boolean;
}

export function CompositionWizardWidget({ size }: CompositionWizardWidgetProps) {
  const wizard = useCompositionWizard();

  switch (size) {
    case 'xs':
      return <CompositionWizardXS size={size} wizard={wizard} />;
    case 'sm':
      return <CompositionWizardSM size={size} wizard={wizard} />;
    case 'md':
      return <CompositionWizardMD size={size} wizard={wizard} />;
    case 'lg':
    default:
      return <CompositionWizardLG wizard={wizard} />;
  }
}
