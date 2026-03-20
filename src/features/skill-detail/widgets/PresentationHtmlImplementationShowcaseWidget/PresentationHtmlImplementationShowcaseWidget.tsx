'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { PresentationHtmlImplementationShowcaseXS } from './PresentationHtmlImplementationShowcaseXS';
import { PresentationHtmlImplementationShowcaseSM } from './PresentationHtmlImplementationShowcaseSM';
import { PresentationHtmlImplementationShowcaseMD } from './PresentationHtmlImplementationShowcaseMD';
import { PresentationHtmlImplementationShowcaseLG } from './PresentationHtmlImplementationShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: PresentationHtmlImplementationShowcaseXS,
  sm: PresentationHtmlImplementationShowcaseSM,
  md: PresentationHtmlImplementationShowcaseMD,
  lg: PresentationHtmlImplementationShowcaseLG,
};

export default function PresentationHtmlImplementationShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

PresentationHtmlImplementationShowcaseWidget.widgetName = 'presentation-html-implementation-showcase' as const;
