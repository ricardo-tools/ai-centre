'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { ObservabilityShowcaseXS } from './ObservabilityShowcaseXS';
import { ObservabilityShowcaseSM } from './ObservabilityShowcaseSM';
import { ObservabilityShowcaseMD } from './ObservabilityShowcaseMD';
import { ObservabilityShowcaseLG } from './ObservabilityShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: ObservabilityShowcaseXS,
  sm: ObservabilityShowcaseSM,
  md: ObservabilityShowcaseMD,
  lg: ObservabilityShowcaseLG,
};

export default function ObservabilityShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

ObservabilityShowcaseWidget.widgetName = 'observability-showcase' as const;
