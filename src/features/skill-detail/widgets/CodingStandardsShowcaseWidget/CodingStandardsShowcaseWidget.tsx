'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { CodingStandardsShowcaseXS } from './CodingStandardsShowcaseXS';
import { CodingStandardsShowcaseSM } from './CodingStandardsShowcaseSM';
import { CodingStandardsShowcaseMD } from './CodingStandardsShowcaseMD';
import { CodingStandardsShowcaseLG } from './CodingStandardsShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: CodingStandardsShowcaseXS,
  sm: CodingStandardsShowcaseSM,
  md: CodingStandardsShowcaseMD,
  lg: CodingStandardsShowcaseLG,
};

export default function CodingStandardsShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

CodingStandardsShowcaseWidget.widgetName = 'coding-standards-showcase' as const;
