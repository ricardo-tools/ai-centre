'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { BrandTokensReferenceShowcaseXS } from './BrandTokensReferenceShowcaseXS';
import { BrandTokensReferenceShowcaseSM } from './BrandTokensReferenceShowcaseSM';
import { BrandTokensReferenceShowcaseMD } from './BrandTokensReferenceShowcaseMD';
import { BrandTokensReferenceShowcaseLG } from './BrandTokensReferenceShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: BrandTokensReferenceShowcaseXS,
  sm: BrandTokensReferenceShowcaseSM,
  md: BrandTokensReferenceShowcaseMD,
  lg: BrandTokensReferenceShowcaseLG,
};

export default function BrandTokensReferenceShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

BrandTokensReferenceShowcaseWidget.widgetName = 'brand-tokens-reference-showcase' as const;
