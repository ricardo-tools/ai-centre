'use client';

import type { SizeVariant, RenderableWidget } from '@/screen-renderer/types';
import { PresentationShowcaseXS } from './PresentationShowcaseXS';
import { PresentationShowcaseSM } from './PresentationShowcaseSM';
import { PresentationShowcaseMD } from './PresentationShowcaseMD';
import { PresentationShowcaseLG } from './PresentationShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: PresentationShowcaseXS,
  sm: PresentationShowcaseSM,
  md: PresentationShowcaseMD,
  lg: PresentationShowcaseLG,
};

export default function PresentationShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

PresentationShowcaseWidget.widgetName = 'presentation-showcase' as const;
