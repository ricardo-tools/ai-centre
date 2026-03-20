'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { StrategicContextShowcaseXS } from './StrategicContextShowcaseXS';
import { StrategicContextShowcaseSM } from './StrategicContextShowcaseSM';
import { StrategicContextShowcaseMD } from './StrategicContextShowcaseMD';
import { StrategicContextShowcaseLG } from './StrategicContextShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: StrategicContextShowcaseXS,
  sm: StrategicContextShowcaseSM,
  md: StrategicContextShowcaseMD,
  lg: StrategicContextShowcaseLG,
};

export default function StrategicContextShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

StrategicContextShowcaseWidget.widgetName = 'strategic-context-showcase' as const;
