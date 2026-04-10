'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { AuthorizationShowcaseXS } from './AuthorizationShowcaseXS';
import { AuthorizationShowcaseSM } from './AuthorizationShowcaseSM';
import { AuthorizationShowcaseMD } from './AuthorizationShowcaseMD';
import { AuthorizationShowcaseLG } from './AuthorizationShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: AuthorizationShowcaseXS,
  sm: AuthorizationShowcaseSM,
  md: AuthorizationShowcaseMD,
  lg: AuthorizationShowcaseLG,
};

export default function AuthorizationShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

AuthorizationShowcaseWidget.widgetName = 'authorization-showcase' as const;
