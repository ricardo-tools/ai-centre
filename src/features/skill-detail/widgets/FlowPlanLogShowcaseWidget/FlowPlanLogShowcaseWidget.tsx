'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { FlowPlanLogShowcaseXS } from './FlowPlanLogShowcaseXS';
import { FlowPlanLogShowcaseSM } from './FlowPlanLogShowcaseSM';
import { FlowPlanLogShowcaseMD } from './FlowPlanLogShowcaseMD';
import { FlowPlanLogShowcaseLG } from './FlowPlanLogShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: FlowPlanLogShowcaseXS,
  sm: FlowPlanLogShowcaseSM,
  md: FlowPlanLogShowcaseMD,
  lg: FlowPlanLogShowcaseLG,
};

export default function FlowPlanLogShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

FlowPlanLogShowcaseWidget.widgetName = 'flow-plan-log-showcase' as const;
