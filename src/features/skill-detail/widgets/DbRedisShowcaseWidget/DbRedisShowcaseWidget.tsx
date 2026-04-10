'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { DbRedisShowcaseXS } from './DbRedisShowcaseXS';
import { DbRedisShowcaseSM } from './DbRedisShowcaseSM';
import { DbRedisShowcaseMD } from './DbRedisShowcaseMD';
import { DbRedisShowcaseLG } from './DbRedisShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: DbRedisShowcaseXS,
  sm: DbRedisShowcaseSM,
  md: DbRedisShowcaseMD,
  lg: DbRedisShowcaseLG,
};

export default function DbRedisShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

DbRedisShowcaseWidget.widgetName = 'db-redis-showcase' as const;
