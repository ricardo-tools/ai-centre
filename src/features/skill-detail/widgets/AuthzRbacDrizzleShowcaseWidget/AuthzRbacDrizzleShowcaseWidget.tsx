'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { AuthzRbacDrizzleShowcaseXS } from './AuthzRbacDrizzleShowcaseXS';
import { AuthzRbacDrizzleShowcaseSM } from './AuthzRbacDrizzleShowcaseSM';
import { AuthzRbacDrizzleShowcaseMD } from './AuthzRbacDrizzleShowcaseMD';
import { AuthzRbacDrizzleShowcaseLG } from './AuthzRbacDrizzleShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: AuthzRbacDrizzleShowcaseXS,
  sm: AuthzRbacDrizzleShowcaseSM,
  md: AuthzRbacDrizzleShowcaseMD,
  lg: AuthzRbacDrizzleShowcaseLG,
};

export default function AuthzRbacDrizzleShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

AuthzRbacDrizzleShowcaseWidget.widgetName = 'authz-rbac-drizzle-showcase' as const;
