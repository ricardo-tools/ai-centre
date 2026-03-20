'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { EvalDrivenDevelopmentShowcaseXS } from './EvalDrivenDevelopmentShowcaseXS';
import { EvalDrivenDevelopmentShowcaseSM } from './EvalDrivenDevelopmentShowcaseSM';
import { EvalDrivenDevelopmentShowcaseMD } from './EvalDrivenDevelopmentShowcaseMD';
import { EvalDrivenDevelopmentShowcaseLG } from './EvalDrivenDevelopmentShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: EvalDrivenDevelopmentShowcaseXS,
  sm: EvalDrivenDevelopmentShowcaseSM,
  md: EvalDrivenDevelopmentShowcaseMD,
  lg: EvalDrivenDevelopmentShowcaseLG,
};

export default function EvalDrivenDevelopmentShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

EvalDrivenDevelopmentShowcaseWidget.widgetName = 'eval-driven-development-showcase' as const;
