'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { LocalDevelopmentShowcaseXS } from './LocalDevelopmentShowcaseXS';
import { LocalDevelopmentShowcaseSM } from './LocalDevelopmentShowcaseSM';
import { LocalDevelopmentShowcaseMD } from './LocalDevelopmentShowcaseMD';
import { LocalDevelopmentShowcaseLG } from './LocalDevelopmentShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: LocalDevelopmentShowcaseXS,
  sm: LocalDevelopmentShowcaseSM,
  md: LocalDevelopmentShowcaseMD,
  lg: LocalDevelopmentShowcaseLG,
};

export default function LocalDevelopmentShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

LocalDevelopmentShowcaseWidget.widgetName = 'local-development-showcase' as const;
