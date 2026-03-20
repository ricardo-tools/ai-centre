'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { PrintDesignShowcaseXS } from './PrintDesignShowcaseXS';
import { PrintDesignShowcaseSM } from './PrintDesignShowcaseSM';
import { PrintDesignShowcaseMD } from './PrintDesignShowcaseMD';
import { PrintDesignShowcaseLG } from './PrintDesignShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: PrintDesignShowcaseXS,
  sm: PrintDesignShowcaseSM,
  md: PrintDesignShowcaseMD,
  lg: PrintDesignShowcaseLG,
};

export default function PrintDesignShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

PrintDesignShowcaseWidget.widgetName = 'print-design-showcase' as const;
