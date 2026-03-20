'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { SkillCreationShowcaseXS } from './SkillCreationShowcaseXS';
import { SkillCreationShowcaseSM } from './SkillCreationShowcaseSM';
import { SkillCreationShowcaseMD } from './SkillCreationShowcaseMD';
import { SkillCreationShowcaseLG } from './SkillCreationShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: SkillCreationShowcaseXS,
  sm: SkillCreationShowcaseSM,
  md: SkillCreationShowcaseMD,
  lg: SkillCreationShowcaseLG,
};

export default function SkillCreationShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

SkillCreationShowcaseWidget.widgetName = 'skill-creation-showcase' as const;
