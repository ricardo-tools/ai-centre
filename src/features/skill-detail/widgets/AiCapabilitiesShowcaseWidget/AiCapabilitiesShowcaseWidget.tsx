'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { AiCapabilitiesShowcaseXS } from './AiCapabilitiesShowcaseXS';
import { AiCapabilitiesShowcaseSM } from './AiCapabilitiesShowcaseSM';
import { AiCapabilitiesShowcaseMD } from './AiCapabilitiesShowcaseMD';
import { AiCapabilitiesShowcaseLG } from './AiCapabilitiesShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: AiCapabilitiesShowcaseXS,
  sm: AiCapabilitiesShowcaseSM,
  md: AiCapabilitiesShowcaseMD,
  lg: AiCapabilitiesShowcaseLG,
};

export default function AiCapabilitiesShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

AiCapabilitiesShowcaseWidget.widgetName = 'ai-capabilities-showcase' as const;
