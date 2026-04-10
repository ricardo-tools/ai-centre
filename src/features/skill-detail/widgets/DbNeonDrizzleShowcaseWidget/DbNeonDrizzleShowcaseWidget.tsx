'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { DbNeonDrizzleShowcaseXS } from './DbNeonDrizzleShowcaseXS';
import { DbNeonDrizzleShowcaseSM } from './DbNeonDrizzleShowcaseSM';
import { DbNeonDrizzleShowcaseMD } from './DbNeonDrizzleShowcaseMD';
import { DbNeonDrizzleShowcaseLG } from './DbNeonDrizzleShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: DbNeonDrizzleShowcaseXS,
  sm: DbNeonDrizzleShowcaseSM,
  md: DbNeonDrizzleShowcaseMD,
  lg: DbNeonDrizzleShowcaseLG,
};

export default function DbNeonDrizzleShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

DbNeonDrizzleShowcaseWidget.widgetName = 'db-neon-drizzle-showcase' as const;
