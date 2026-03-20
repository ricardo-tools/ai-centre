'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { McpServerPatternsShowcaseXS } from './McpServerPatternsShowcaseXS';
import { McpServerPatternsShowcaseSM } from './McpServerPatternsShowcaseSM';
import { McpServerPatternsShowcaseMD } from './McpServerPatternsShowcaseMD';
import { McpServerPatternsShowcaseLG } from './McpServerPatternsShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: McpServerPatternsShowcaseXS,
  sm: McpServerPatternsShowcaseSM,
  md: McpServerPatternsShowcaseMD,
  lg: McpServerPatternsShowcaseLG,
};

export default function McpServerPatternsShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

McpServerPatternsShowcaseWidget.widgetName = 'mcp-server-patterns-showcase' as const;
