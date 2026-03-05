'use client';

import type { SizeVariant, RenderableWidget } from '@/screen-renderer/types';
import { AppLayoutShowcaseXS } from './AppLayoutShowcaseXS';
import { AppLayoutShowcaseSM } from './AppLayoutShowcaseSM';
import { AppLayoutShowcaseMD } from './AppLayoutShowcaseMD';
import { AppLayoutShowcaseLG } from './AppLayoutShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: AppLayoutShowcaseXS,
  sm: AppLayoutShowcaseSM,
  md: AppLayoutShowcaseMD,
  lg: AppLayoutShowcaseLG,
};

export default function AppLayoutShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

AppLayoutShowcaseWidget.widgetName = 'app-layout-showcase' as const;
