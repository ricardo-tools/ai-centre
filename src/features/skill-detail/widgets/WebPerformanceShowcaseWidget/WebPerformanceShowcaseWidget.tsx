'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { WebPerformanceShowcaseXS } from './WebPerformanceShowcaseXS';
import { WebPerformanceShowcaseSM } from './WebPerformanceShowcaseSM';
import { WebPerformanceShowcaseMD } from './WebPerformanceShowcaseMD';
import { WebPerformanceShowcaseLG } from './WebPerformanceShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: WebPerformanceShowcaseXS,
  sm: WebPerformanceShowcaseSM,
  md: WebPerformanceShowcaseMD,
  lg: WebPerformanceShowcaseLG,
};

export default function WebPerformanceShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

WebPerformanceShowcaseWidget.widgetName = 'web-performance-showcase' as const;
