'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { SocialFeaturesShowcaseXS } from './SocialFeaturesShowcaseXS';
import { SocialFeaturesShowcaseSM } from './SocialFeaturesShowcaseSM';
import { SocialFeaturesShowcaseMD } from './SocialFeaturesShowcaseMD';
import { SocialFeaturesShowcaseLG } from './SocialFeaturesShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: SocialFeaturesShowcaseXS,
  sm: SocialFeaturesShowcaseSM,
  md: SocialFeaturesShowcaseMD,
  lg: SocialFeaturesShowcaseLG,
};

export default function SocialFeaturesShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

SocialFeaturesShowcaseWidget.widgetName = 'social-features-showcase' as const;
