'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { AppLayoutPatternsReferenceShowcaseXS } from './AppLayoutPatternsReferenceShowcaseXS';
import { AppLayoutPatternsReferenceShowcaseSM } from './AppLayoutPatternsReferenceShowcaseSM';
import { AppLayoutPatternsReferenceShowcaseMD } from './AppLayoutPatternsReferenceShowcaseMD';
import { AppLayoutPatternsReferenceShowcaseLG } from './AppLayoutPatternsReferenceShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: AppLayoutPatternsReferenceShowcaseXS,
  sm: AppLayoutPatternsReferenceShowcaseSM,
  md: AppLayoutPatternsReferenceShowcaseMD,
  lg: AppLayoutPatternsReferenceShowcaseLG,
};

export default function AppLayoutPatternsReferenceShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

AppLayoutPatternsReferenceShowcaseWidget.widgetName = 'app-layout-patterns-reference-showcase' as const;
