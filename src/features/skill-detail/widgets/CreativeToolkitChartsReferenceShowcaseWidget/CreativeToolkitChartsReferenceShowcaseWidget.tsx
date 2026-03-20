'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { CreativeToolkitChartsReferenceShowcaseXS } from './CreativeToolkitChartsReferenceShowcaseXS';
import { CreativeToolkitChartsReferenceShowcaseSM } from './CreativeToolkitChartsReferenceShowcaseSM';
import { CreativeToolkitChartsReferenceShowcaseMD } from './CreativeToolkitChartsReferenceShowcaseMD';
import { CreativeToolkitChartsReferenceShowcaseLG } from './CreativeToolkitChartsReferenceShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: CreativeToolkitChartsReferenceShowcaseXS,
  sm: CreativeToolkitChartsReferenceShowcaseSM,
  md: CreativeToolkitChartsReferenceShowcaseMD,
  lg: CreativeToolkitChartsReferenceShowcaseLG,
};

export default function CreativeToolkitChartsReferenceShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

CreativeToolkitChartsReferenceShowcaseWidget.widgetName = 'creative-toolkit-charts-reference-showcase' as const;
