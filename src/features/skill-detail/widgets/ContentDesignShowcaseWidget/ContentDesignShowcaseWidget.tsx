'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { ContentDesignShowcaseXS } from './ContentDesignShowcaseXS';
import { ContentDesignShowcaseSM } from './ContentDesignShowcaseSM';
import { ContentDesignShowcaseMD } from './ContentDesignShowcaseMD';
import { ContentDesignShowcaseLG } from './ContentDesignShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: ContentDesignShowcaseXS,
  sm: ContentDesignShowcaseSM,
  md: ContentDesignShowcaseMD,
  lg: ContentDesignShowcaseLG,
};

export default function ContentDesignShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

ContentDesignShowcaseWidget.widgetName = 'content-design-showcase' as const;
