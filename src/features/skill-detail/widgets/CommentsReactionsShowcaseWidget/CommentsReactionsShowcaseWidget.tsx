'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { CommentsReactionsShowcaseXS } from './CommentsReactionsShowcaseXS';
import { CommentsReactionsShowcaseSM } from './CommentsReactionsShowcaseSM';
import { CommentsReactionsShowcaseMD } from './CommentsReactionsShowcaseMD';
import { CommentsReactionsShowcaseLG } from './CommentsReactionsShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: CommentsReactionsShowcaseXS,
  sm: CommentsReactionsShowcaseSM,
  md: CommentsReactionsShowcaseMD,
  lg: CommentsReactionsShowcaseLG,
};

export default function CommentsReactionsShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

CommentsReactionsShowcaseWidget.widgetName = 'comments-reactions-showcase' as const;
