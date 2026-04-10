'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { FlowTddShowcaseXS } from './FlowTddShowcaseXS';
import { FlowTddShowcaseSM } from './FlowTddShowcaseSM';
import { FlowTddShowcaseMD } from './FlowTddShowcaseMD';
import { FlowTddShowcaseLG } from './FlowTddShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: FlowTddShowcaseXS,
  sm: FlowTddShowcaseSM,
  md: FlowTddShowcaseMD,
  lg: FlowTddShowcaseLG,
};

export default function FlowTddShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

FlowTddShowcaseWidget.widgetName = 'flow-tdd-showcase' as const;
