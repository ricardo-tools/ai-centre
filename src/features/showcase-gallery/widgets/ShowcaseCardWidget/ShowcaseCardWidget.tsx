'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { ShowcaseCardLG } from './ShowcaseCardLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: ShowcaseCardLG,
  sm: ShowcaseCardLG,
  md: ShowcaseCardLG,
  lg: ShowcaseCardLG,
};

export function ShowcaseCardWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}
