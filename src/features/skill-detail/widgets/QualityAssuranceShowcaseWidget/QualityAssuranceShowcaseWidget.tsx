'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { QualityAssuranceShowcaseXS } from './QualityAssuranceShowcaseXS';
import { QualityAssuranceShowcaseSM } from './QualityAssuranceShowcaseSM';
import { QualityAssuranceShowcaseMD } from './QualityAssuranceShowcaseMD';
import { QualityAssuranceShowcaseLG } from './QualityAssuranceShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: QualityAssuranceShowcaseXS,
  sm: QualityAssuranceShowcaseSM,
  md: QualityAssuranceShowcaseMD,
  lg: QualityAssuranceShowcaseLG,
};

export default function QualityAssuranceShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

QualityAssuranceShowcaseWidget.widgetName = 'quality-assurance-showcase' as const;
