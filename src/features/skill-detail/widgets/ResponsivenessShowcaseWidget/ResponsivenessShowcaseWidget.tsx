'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { ResponsivenessShowcaseXS } from './ResponsivenessShowcaseXS';
import { ResponsivenessShowcaseSM } from './ResponsivenessShowcaseSM';
import { ResponsivenessShowcaseMD } from './ResponsivenessShowcaseMD';
import { ResponsivenessShowcaseLG } from './ResponsivenessShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: ResponsivenessShowcaseXS,
  sm: ResponsivenessShowcaseSM,
  md: ResponsivenessShowcaseMD,
  lg: ResponsivenessShowcaseLG,
};

export default function ResponsivenessShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

ResponsivenessShowcaseWidget.widgetName = 'responsiveness-showcase' as const;
