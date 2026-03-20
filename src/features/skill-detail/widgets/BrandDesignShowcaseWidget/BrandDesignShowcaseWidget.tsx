'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { BrandDesignShowcaseXS } from './BrandDesignShowcaseXS';
import { BrandDesignShowcaseSM } from './BrandDesignShowcaseSM';
import { BrandDesignShowcaseMD } from './BrandDesignShowcaseMD';
import { BrandDesignShowcaseLG } from './BrandDesignShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: BrandDesignShowcaseXS,
  sm: BrandDesignShowcaseSM,
  md: BrandDesignShowcaseMD,
  lg: BrandDesignShowcaseLG,
};

export default function BrandDesignShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

BrandDesignShowcaseWidget.widgetName = 'brand-design-showcase' as const;
