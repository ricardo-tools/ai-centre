'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { ClaudeApiShowcaseXS } from './ClaudeApiShowcaseXS';
import { ClaudeApiShowcaseSM } from './ClaudeApiShowcaseSM';
import { ClaudeApiShowcaseMD } from './ClaudeApiShowcaseMD';
import { ClaudeApiShowcaseLG } from './ClaudeApiShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: ClaudeApiShowcaseXS,
  sm: ClaudeApiShowcaseSM,
  md: ClaudeApiShowcaseMD,
  lg: ClaudeApiShowcaseLG,
};

export default function ClaudeApiShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

ClaudeApiShowcaseWidget.widgetName = 'claude-api-showcase' as const;
