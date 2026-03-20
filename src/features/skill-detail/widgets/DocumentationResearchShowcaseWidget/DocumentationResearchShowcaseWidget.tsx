'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { DocumentationResearchShowcaseXS } from './DocumentationResearchShowcaseXS';
import { DocumentationResearchShowcaseSM } from './DocumentationResearchShowcaseSM';
import { DocumentationResearchShowcaseMD } from './DocumentationResearchShowcaseMD';
import { DocumentationResearchShowcaseLG } from './DocumentationResearchShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: DocumentationResearchShowcaseXS,
  sm: DocumentationResearchShowcaseSM,
  md: DocumentationResearchShowcaseMD,
  lg: DocumentationResearchShowcaseLG,
};

export default function DocumentationResearchShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

DocumentationResearchShowcaseWidget.widgetName = 'documentation-research-showcase' as const;
