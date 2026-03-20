'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { BackendPatternsShowcaseXS } from './BackendPatternsShowcaseXS';
import { BackendPatternsShowcaseSM } from './BackendPatternsShowcaseSM';
import { BackendPatternsShowcaseMD } from './BackendPatternsShowcaseMD';
import { BackendPatternsShowcaseLG } from './BackendPatternsShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: BackendPatternsShowcaseXS,
  sm: BackendPatternsShowcaseSM,
  md: BackendPatternsShowcaseMD,
  lg: BackendPatternsShowcaseLG,
};

export default function BackendPatternsShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

BackendPatternsShowcaseWidget.widgetName = 'backend-patterns-showcase' as const;
