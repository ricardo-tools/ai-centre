'use client';

import type { SizeVariant, RenderableWidget } from '@/screen-renderer/types';
import { DesignExcellenceShowcaseXS } from './DesignExcellenceShowcaseXS';
import { DesignExcellenceShowcaseSM } from './DesignExcellenceShowcaseSM';
import { DesignExcellenceShowcaseMD } from './DesignExcellenceShowcaseMD';
import { DesignExcellenceShowcaseLG } from './DesignExcellenceShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: DesignExcellenceShowcaseXS,
  sm: DesignExcellenceShowcaseSM,
  md: DesignExcellenceShowcaseMD,
  lg: DesignExcellenceShowcaseLG,
};

export default function DesignExcellenceShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

DesignExcellenceShowcaseWidget.widgetName = 'design-excellence-showcase' as const;
