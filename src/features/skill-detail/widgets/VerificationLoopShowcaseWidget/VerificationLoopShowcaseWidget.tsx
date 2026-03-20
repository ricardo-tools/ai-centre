'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { VerificationLoopShowcaseXS } from './VerificationLoopShowcaseXS';
import { VerificationLoopShowcaseSM } from './VerificationLoopShowcaseSM';
import { VerificationLoopShowcaseMD } from './VerificationLoopShowcaseMD';
import { VerificationLoopShowcaseLG } from './VerificationLoopShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: VerificationLoopShowcaseXS,
  sm: VerificationLoopShowcaseSM,
  md: VerificationLoopShowcaseMD,
  lg: VerificationLoopShowcaseLG,
};

export default function VerificationLoopShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

VerificationLoopShowcaseWidget.widgetName = 'verification-loop-showcase' as const;
