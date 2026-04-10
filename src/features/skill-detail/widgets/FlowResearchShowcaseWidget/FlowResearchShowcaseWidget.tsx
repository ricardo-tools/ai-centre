'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { FlowResearchShowcaseXS } from './FlowResearchShowcaseXS';
import { FlowResearchShowcaseSM } from './FlowResearchShowcaseSM';
import { FlowResearchShowcaseMD } from './FlowResearchShowcaseMD';
import { FlowResearchShowcaseLG } from './FlowResearchShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: FlowResearchShowcaseXS,
  sm: FlowResearchShowcaseSM,
  md: FlowResearchShowcaseMD,
  lg: FlowResearchShowcaseLG,
};

export default function FlowResearchShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

FlowResearchShowcaseWidget.widgetName = 'flow-research-showcase' as const;
