'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { SecurityReviewShowcaseXS } from './SecurityReviewShowcaseXS';
import { SecurityReviewShowcaseSM } from './SecurityReviewShowcaseSM';
import { SecurityReviewShowcaseMD } from './SecurityReviewShowcaseMD';
import { SecurityReviewShowcaseLG } from './SecurityReviewShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: SecurityReviewShowcaseXS,
  sm: SecurityReviewShowcaseSM,
  md: SecurityReviewShowcaseMD,
  lg: SecurityReviewShowcaseLG,
};

export default function SecurityReviewShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

SecurityReviewShowcaseWidget.widgetName = 'security-review-showcase' as const;
