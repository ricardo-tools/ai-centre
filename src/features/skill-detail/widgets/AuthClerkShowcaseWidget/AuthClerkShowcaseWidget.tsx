'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { AuthClerkShowcaseXS } from './AuthClerkShowcaseXS';
import { AuthClerkShowcaseSM } from './AuthClerkShowcaseSM';
import { AuthClerkShowcaseMD } from './AuthClerkShowcaseMD';
import { AuthClerkShowcaseLG } from './AuthClerkShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: AuthClerkShowcaseXS,
  sm: AuthClerkShowcaseSM,
  md: AuthClerkShowcaseMD,
  lg: AuthClerkShowcaseLG,
};

export default function AuthClerkShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

AuthClerkShowcaseWidget.widgetName = 'auth-clerk-showcase' as const;
