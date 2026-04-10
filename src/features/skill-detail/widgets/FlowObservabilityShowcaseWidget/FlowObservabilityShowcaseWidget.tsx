'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { FlowObservabilityShowcaseXS } from './FlowObservabilityShowcaseXS';
import { FlowObservabilityShowcaseSM } from './FlowObservabilityShowcaseSM';
import { FlowObservabilityShowcaseMD } from './FlowObservabilityShowcaseMD';
import { FlowObservabilityShowcaseLG } from './FlowObservabilityShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: FlowObservabilityShowcaseXS,
  sm: FlowObservabilityShowcaseSM,
  md: FlowObservabilityShowcaseMD,
  lg: FlowObservabilityShowcaseLG,
};

export default function FlowObservabilityShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

FlowObservabilityShowcaseWidget.widgetName = 'flow-observability-showcase' as const;
