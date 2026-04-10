'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { RoadmapShowcaseXS } from './RoadmapShowcaseXS';
import { RoadmapShowcaseSM } from './RoadmapShowcaseSM';
import { RoadmapShowcaseMD } from './RoadmapShowcaseMD';
import { RoadmapShowcaseLG } from './RoadmapShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: RoadmapShowcaseXS,
  sm: RoadmapShowcaseSM,
  md: RoadmapShowcaseMD,
  lg: RoadmapShowcaseLG,
};

export default function RoadmapShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

RoadmapShowcaseWidget.widgetName = 'roadmap-showcase' as const;
