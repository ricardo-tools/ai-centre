'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { FlowShowcaseXS } from './FlowShowcaseXS';
import { FlowShowcaseSM } from './FlowShowcaseSM';
import { FlowShowcaseMD } from './FlowShowcaseMD';
import { FlowShowcaseLG } from './FlowShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: FlowShowcaseXS,
  sm: FlowShowcaseSM,
  md: FlowShowcaseMD,
  lg: FlowShowcaseLG,
};

export default function FlowShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

FlowShowcaseWidget.widgetName = 'flow-showcase' as const;
