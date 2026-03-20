'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { PlaywrightE2eShowcaseXS } from './PlaywrightE2eShowcaseXS';
import { PlaywrightE2eShowcaseSM } from './PlaywrightE2eShowcaseSM';
import { PlaywrightE2eShowcaseMD } from './PlaywrightE2eShowcaseMD';
import { PlaywrightE2eShowcaseLG } from './PlaywrightE2eShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: PlaywrightE2eShowcaseXS,
  sm: PlaywrightE2eShowcaseSM,
  md: PlaywrightE2eShowcaseMD,
  lg: PlaywrightE2eShowcaseLG,
};

export default function PlaywrightE2eShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

PlaywrightE2eShowcaseWidget.widgetName = 'playwright-e2e-showcase' as const;
