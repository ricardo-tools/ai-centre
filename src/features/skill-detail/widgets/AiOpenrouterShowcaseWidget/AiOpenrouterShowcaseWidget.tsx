'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { AiOpenrouterShowcaseXS } from './AiOpenrouterShowcaseXS';
import { AiOpenrouterShowcaseSM } from './AiOpenrouterShowcaseSM';
import { AiOpenrouterShowcaseMD } from './AiOpenrouterShowcaseMD';
import { AiOpenrouterShowcaseLG } from './AiOpenrouterShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: AiOpenrouterShowcaseXS,
  sm: AiOpenrouterShowcaseSM,
  md: AiOpenrouterShowcaseMD,
  lg: AiOpenrouterShowcaseLG,
};

export default function AiOpenrouterShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

AiOpenrouterShowcaseWidget.widgetName = 'ai-openrouter-showcase' as const;
