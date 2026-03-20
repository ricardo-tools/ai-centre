'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { SkillReviewShowcaseXS } from './SkillReviewShowcaseXS';
import { SkillReviewShowcaseSM } from './SkillReviewShowcaseSM';
import { SkillReviewShowcaseMD } from './SkillReviewShowcaseMD';
import { SkillReviewShowcaseLG } from './SkillReviewShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: SkillReviewShowcaseXS,
  sm: SkillReviewShowcaseSM,
  md: SkillReviewShowcaseMD,
  lg: SkillReviewShowcaseLG,
};

export default function SkillReviewShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

SkillReviewShowcaseWidget.widgetName = 'skill-review-showcase' as const;
