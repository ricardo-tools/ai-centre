'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { StorageVercelBlobShowcaseXS } from './StorageVercelBlobShowcaseXS';
import { StorageVercelBlobShowcaseSM } from './StorageVercelBlobShowcaseSM';
import { StorageVercelBlobShowcaseMD } from './StorageVercelBlobShowcaseMD';
import { StorageVercelBlobShowcaseLG } from './StorageVercelBlobShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: StorageVercelBlobShowcaseXS,
  sm: StorageVercelBlobShowcaseSM,
  md: StorageVercelBlobShowcaseMD,
  lg: StorageVercelBlobShowcaseLG,
};

export default function StorageVercelBlobShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

StorageVercelBlobShowcaseWidget.widgetName = 'storage-vercel-blob-showcase' as const;
