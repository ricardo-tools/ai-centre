'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { InteractionMotionShowcaseXS } from './InteractionMotionShowcaseXS';
import { InteractionMotionShowcaseSM } from './InteractionMotionShowcaseSM';
import { InteractionMotionShowcaseMD } from './InteractionMotionShowcaseMD';
import { InteractionMotionShowcaseLG } from './InteractionMotionShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: InteractionMotionShowcaseXS,
  sm: InteractionMotionShowcaseSM,
  md: InteractionMotionShowcaseMD,
  lg: InteractionMotionShowcaseLG,
};

export default function InteractionMotionShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

InteractionMotionShowcaseWidget.widgetName = 'interaction-motion-showcase' as const;
