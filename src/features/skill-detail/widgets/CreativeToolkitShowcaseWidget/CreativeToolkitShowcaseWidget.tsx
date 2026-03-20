'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { CreativeToolkitShowcaseXS } from './CreativeToolkitShowcaseXS';
import { CreativeToolkitShowcaseSM } from './CreativeToolkitShowcaseSM';
import { CreativeToolkitShowcaseMD } from './CreativeToolkitShowcaseMD';
import { CreativeToolkitShowcaseLG } from './CreativeToolkitShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: CreativeToolkitShowcaseXS,
  sm: CreativeToolkitShowcaseSM,
  md: CreativeToolkitShowcaseMD,
  lg: CreativeToolkitShowcaseLG,
};

export default function CreativeToolkitShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

CreativeToolkitShowcaseWidget.widgetName = 'creative-toolkit-showcase' as const;
