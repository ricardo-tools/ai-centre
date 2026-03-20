'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { PptxExportShowcaseXS } from './PptxExportShowcaseXS';
import { PptxExportShowcaseSM } from './PptxExportShowcaseSM';
import { PptxExportShowcaseMD } from './PptxExportShowcaseMD';
import { PptxExportShowcaseLG } from './PptxExportShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: PptxExportShowcaseXS,
  sm: PptxExportShowcaseSM,
  md: PptxExportShowcaseMD,
  lg: PptxExportShowcaseLG,
};

export default function PptxExportShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

PptxExportShowcaseWidget.widgetName = 'pptx-export-showcase' as const;
