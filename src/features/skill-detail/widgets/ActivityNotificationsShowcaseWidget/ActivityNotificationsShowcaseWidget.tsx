'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { ActivityNotificationsShowcaseXS } from './ActivityNotificationsShowcaseXS';
import { ActivityNotificationsShowcaseSM } from './ActivityNotificationsShowcaseSM';
import { ActivityNotificationsShowcaseMD } from './ActivityNotificationsShowcaseMD';
import { ActivityNotificationsShowcaseLG } from './ActivityNotificationsShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: ActivityNotificationsShowcaseXS,
  sm: ActivityNotificationsShowcaseSM,
  md: ActivityNotificationsShowcaseMD,
  lg: ActivityNotificationsShowcaseLG,
};

export default function ActivityNotificationsShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

ActivityNotificationsShowcaseWidget.widgetName = 'activity-notifications-showcase' as const;
