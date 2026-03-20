'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { AccessibilityShowcaseXS } from './AccessibilityShowcaseXS';
import { AccessibilityShowcaseSM } from './AccessibilityShowcaseSM';
import { AccessibilityShowcaseMD } from './AccessibilityShowcaseMD';
import { AccessibilityShowcaseLG } from './AccessibilityShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: AccessibilityShowcaseXS,
  sm: AccessibilityShowcaseSM,
  md: AccessibilityShowcaseMD,
  lg: AccessibilityShowcaseLG,
};

export default function AccessibilityShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

AccessibilityShowcaseWidget.widgetName = 'accessibility-showcase' as const;
