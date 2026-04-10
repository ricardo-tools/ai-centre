'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { DbSupabaseShowcaseXS } from './DbSupabaseShowcaseXS';
import { DbSupabaseShowcaseSM } from './DbSupabaseShowcaseSM';
import { DbSupabaseShowcaseMD } from './DbSupabaseShowcaseMD';
import { DbSupabaseShowcaseLG } from './DbSupabaseShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: DbSupabaseShowcaseXS,
  sm: DbSupabaseShowcaseSM,
  md: DbSupabaseShowcaseMD,
  lg: DbSupabaseShowcaseLG,
};

export default function DbSupabaseShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

DbSupabaseShowcaseWidget.widgetName = 'db-supabase-showcase' as const;
