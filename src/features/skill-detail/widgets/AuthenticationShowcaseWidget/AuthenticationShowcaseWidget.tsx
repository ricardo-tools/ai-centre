'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { AuthenticationShowcaseXS } from './AuthenticationShowcaseXS';
import { AuthenticationShowcaseSM } from './AuthenticationShowcaseSM';
import { AuthenticationShowcaseMD } from './AuthenticationShowcaseMD';
import { AuthenticationShowcaseLG } from './AuthenticationShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: AuthenticationShowcaseXS,
  sm: AuthenticationShowcaseSM,
  md: AuthenticationShowcaseMD,
  lg: AuthenticationShowcaseLG,
};

export default function AuthenticationShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

AuthenticationShowcaseWidget.widgetName = 'authentication-showcase' as const;
