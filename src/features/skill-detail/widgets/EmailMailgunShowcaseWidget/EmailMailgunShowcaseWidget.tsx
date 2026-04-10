'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { EmailMailgunShowcaseXS } from './EmailMailgunShowcaseXS';
import { EmailMailgunShowcaseSM } from './EmailMailgunShowcaseSM';
import { EmailMailgunShowcaseMD } from './EmailMailgunShowcaseMD';
import { EmailMailgunShowcaseLG } from './EmailMailgunShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: EmailMailgunShowcaseXS,
  sm: EmailMailgunShowcaseSM,
  md: EmailMailgunShowcaseMD,
  lg: EmailMailgunShowcaseLG,
};

export default function EmailMailgunShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

EmailMailgunShowcaseWidget.widgetName = 'email-mailgun-showcase' as const;
