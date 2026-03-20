'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { UserExperienceShowcaseXS } from './UserExperienceShowcaseXS';
import { UserExperienceShowcaseSM } from './UserExperienceShowcaseSM';
import { UserExperienceShowcaseMD } from './UserExperienceShowcaseMD';
import { UserExperienceShowcaseLG } from './UserExperienceShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: UserExperienceShowcaseXS,
  sm: UserExperienceShowcaseSM,
  md: UserExperienceShowcaseMD,
  lg: UserExperienceShowcaseLG,
};

export default function UserExperienceShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

UserExperienceShowcaseWidget.widgetName = 'user-experience-showcase' as const;
