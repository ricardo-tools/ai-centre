'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { NextjsAppRouterTurbopackShowcaseXS } from './NextjsAppRouterTurbopackShowcaseXS';
import { NextjsAppRouterTurbopackShowcaseSM } from './NextjsAppRouterTurbopackShowcaseSM';
import { NextjsAppRouterTurbopackShowcaseMD } from './NextjsAppRouterTurbopackShowcaseMD';
import { NextjsAppRouterTurbopackShowcaseLG } from './NextjsAppRouterTurbopackShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: NextjsAppRouterTurbopackShowcaseXS,
  sm: NextjsAppRouterTurbopackShowcaseSM,
  md: NextjsAppRouterTurbopackShowcaseMD,
  lg: NextjsAppRouterTurbopackShowcaseLG,
};

export default function NextjsAppRouterTurbopackShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

NextjsAppRouterTurbopackShowcaseWidget.widgetName = 'nextjs-app-router-turbopack-showcase' as const;
