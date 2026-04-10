'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { FlowProjectReferenceShowcaseXS } from './FlowProjectReferenceShowcaseXS';
import { FlowProjectReferenceShowcaseSM } from './FlowProjectReferenceShowcaseSM';
import { FlowProjectReferenceShowcaseMD } from './FlowProjectReferenceShowcaseMD';
import { FlowProjectReferenceShowcaseLG } from './FlowProjectReferenceShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: FlowProjectReferenceShowcaseXS,
  sm: FlowProjectReferenceShowcaseSM,
  md: FlowProjectReferenceShowcaseMD,
  lg: FlowProjectReferenceShowcaseLG,
};

export default function FlowProjectReferenceShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

FlowProjectReferenceShowcaseWidget.widgetName = 'flow-project-reference-showcase' as const;
