'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { FlowPlanningShowcaseXS } from './FlowPlanningShowcaseXS';
import { FlowPlanningShowcaseSM } from './FlowPlanningShowcaseSM';
import { FlowPlanningShowcaseMD } from './FlowPlanningShowcaseMD';
import { FlowPlanningShowcaseLG } from './FlowPlanningShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: FlowPlanningShowcaseXS,
  sm: FlowPlanningShowcaseSM,
  md: FlowPlanningShowcaseMD,
  lg: FlowPlanningShowcaseLG,
};

export default function FlowPlanningShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

FlowPlanningShowcaseWidget.widgetName = 'flow-planning-showcase' as const;
