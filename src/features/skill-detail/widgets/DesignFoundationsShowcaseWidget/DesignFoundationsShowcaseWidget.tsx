'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { DesignFoundationsShowcaseXS } from './DesignFoundationsShowcaseXS';
import { DesignFoundationsShowcaseSM } from './DesignFoundationsShowcaseSM';
import { DesignFoundationsShowcaseMD } from './DesignFoundationsShowcaseMD';
import { DesignFoundationsShowcaseLG } from './DesignFoundationsShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: DesignFoundationsShowcaseXS,
  sm: DesignFoundationsShowcaseSM,
  md: DesignFoundationsShowcaseMD,
  lg: DesignFoundationsShowcaseLG,
};

export default function DesignFoundationsShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

DesignFoundationsShowcaseWidget.widgetName = 'design-foundations-showcase' as const;
