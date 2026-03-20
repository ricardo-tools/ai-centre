'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { TestingStrategyShowcaseXS } from './TestingStrategyShowcaseXS';
import { TestingStrategyShowcaseSM } from './TestingStrategyShowcaseSM';
import { TestingStrategyShowcaseMD } from './TestingStrategyShowcaseMD';
import { TestingStrategyShowcaseLG } from './TestingStrategyShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: TestingStrategyShowcaseXS,
  sm: TestingStrategyShowcaseSM,
  md: TestingStrategyShowcaseMD,
  lg: TestingStrategyShowcaseLG,
};

export default function TestingStrategyShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

TestingStrategyShowcaseWidget.widgetName = 'testing-strategy-showcase' as const;
