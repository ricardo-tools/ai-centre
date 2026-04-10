'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { DatabaseDesignShowcaseXS } from './DatabaseDesignShowcaseXS';
import { DatabaseDesignShowcaseSM } from './DatabaseDesignShowcaseSM';
import { DatabaseDesignShowcaseMD } from './DatabaseDesignShowcaseMD';
import { DatabaseDesignShowcaseLG } from './DatabaseDesignShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: DatabaseDesignShowcaseXS,
  sm: DatabaseDesignShowcaseSM,
  md: DatabaseDesignShowcaseMD,
  lg: DatabaseDesignShowcaseLG,
};

export default function DatabaseDesignShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

DatabaseDesignShowcaseWidget.widgetName = 'database-design-showcase' as const;
