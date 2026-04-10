'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { UserManagementShowcaseXS } from './UserManagementShowcaseXS';
import { UserManagementShowcaseSM } from './UserManagementShowcaseSM';
import { UserManagementShowcaseMD } from './UserManagementShowcaseMD';
import { UserManagementShowcaseLG } from './UserManagementShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: UserManagementShowcaseXS,
  sm: UserManagementShowcaseSM,
  md: UserManagementShowcaseMD,
  lg: UserManagementShowcaseLG,
};

export default function UserManagementShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

UserManagementShowcaseWidget.widgetName = 'user-management-showcase' as const;
