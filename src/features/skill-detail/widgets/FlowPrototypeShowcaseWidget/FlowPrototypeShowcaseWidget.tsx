'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { FlowPrototypeShowcaseXS } from './FlowPrototypeShowcaseXS';
import { FlowPrototypeShowcaseSM } from './FlowPrototypeShowcaseSM';
import { FlowPrototypeShowcaseMD } from './FlowPrototypeShowcaseMD';
import { FlowPrototypeShowcaseLG } from './FlowPrototypeShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: FlowPrototypeShowcaseXS,
  sm: FlowPrototypeShowcaseSM,
  md: FlowPrototypeShowcaseMD,
  lg: FlowPrototypeShowcaseLG,
};

export default function FlowPrototypeShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

FlowPrototypeShowcaseWidget.widgetName = 'flow-prototype-showcase' as const;
