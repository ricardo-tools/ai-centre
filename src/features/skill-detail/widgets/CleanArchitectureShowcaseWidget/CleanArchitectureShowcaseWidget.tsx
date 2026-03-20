'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { CleanArchitectureShowcaseXS } from './CleanArchitectureShowcaseXS';
import { CleanArchitectureShowcaseSM } from './CleanArchitectureShowcaseSM';
import { CleanArchitectureShowcaseMD } from './CleanArchitectureShowcaseMD';
import { CleanArchitectureShowcaseLG } from './CleanArchitectureShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: CleanArchitectureShowcaseXS,
  sm: CleanArchitectureShowcaseSM,
  md: CleanArchitectureShowcaseMD,
  lg: CleanArchitectureShowcaseLG,
};

export default function CleanArchitectureShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

CleanArchitectureShowcaseWidget.widgetName = 'clean-architecture-showcase' as const;
