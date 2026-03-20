'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { AiMediaGenerationShowcaseXS } from './AiMediaGenerationShowcaseXS';
import { AiMediaGenerationShowcaseSM } from './AiMediaGenerationShowcaseSM';
import { AiMediaGenerationShowcaseMD } from './AiMediaGenerationShowcaseMD';
import { AiMediaGenerationShowcaseLG } from './AiMediaGenerationShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: AiMediaGenerationShowcaseXS,
  sm: AiMediaGenerationShowcaseSM,
  md: AiMediaGenerationShowcaseMD,
  lg: AiMediaGenerationShowcaseLG,
};

export default function AiMediaGenerationShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

AiMediaGenerationShowcaseWidget.widgetName = 'ai-media-generation-showcase' as const;
