'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { FileStorageShowcaseXS } from './FileStorageShowcaseXS';
import { FileStorageShowcaseSM } from './FileStorageShowcaseSM';
import { FileStorageShowcaseMD } from './FileStorageShowcaseMD';
import { FileStorageShowcaseLG } from './FileStorageShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: FileStorageShowcaseXS,
  sm: FileStorageShowcaseSM,
  md: FileStorageShowcaseMD,
  lg: FileStorageShowcaseLG,
};

export default function FileStorageShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

FileStorageShowcaseWidget.widgetName = 'file-storage-showcase' as const;
