'use client';

import type { SizeVariant, RenderableWidget } from '@/screen-renderer/types';
import { FrontendArchitectureShowcaseXS } from './FrontendArchitectureShowcaseXS';
import { FrontendArchitectureShowcaseSM } from './FrontendArchitectureShowcaseSM';
import { FrontendArchitectureShowcaseMD } from './FrontendArchitectureShowcaseMD';
import { FrontendArchitectureShowcaseLG } from './FrontendArchitectureShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: FrontendArchitectureShowcaseXS,
  sm: FrontendArchitectureShowcaseSM,
  md: FrontendArchitectureShowcaseMD,
  lg: FrontendArchitectureShowcaseLG,
};

export default function FrontendArchitectureShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

FrontendArchitectureShowcaseWidget.widgetName = 'frontend-architecture-showcase' as const;
