'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { FlowProjectDocsShowcaseXS } from './FlowProjectDocsShowcaseXS';
import { FlowProjectDocsShowcaseSM } from './FlowProjectDocsShowcaseSM';
import { FlowProjectDocsShowcaseMD } from './FlowProjectDocsShowcaseMD';
import { FlowProjectDocsShowcaseLG } from './FlowProjectDocsShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: FlowProjectDocsShowcaseXS,
  sm: FlowProjectDocsShowcaseSM,
  md: FlowProjectDocsShowcaseMD,
  lg: FlowProjectDocsShowcaseLG,
};

export default function FlowProjectDocsShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

FlowProjectDocsShowcaseWidget.widgetName = 'flow-project-docs-showcase' as const;
