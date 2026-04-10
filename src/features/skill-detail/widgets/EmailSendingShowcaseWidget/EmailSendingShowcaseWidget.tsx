'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { EmailSendingShowcaseXS } from './EmailSendingShowcaseXS';
import { EmailSendingShowcaseSM } from './EmailSendingShowcaseSM';
import { EmailSendingShowcaseMD } from './EmailSendingShowcaseMD';
import { EmailSendingShowcaseLG } from './EmailSendingShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: EmailSendingShowcaseXS,
  sm: EmailSendingShowcaseSM,
  md: EmailSendingShowcaseMD,
  lg: EmailSendingShowcaseLG,
};

export default function EmailSendingShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

EmailSendingShowcaseWidget.widgetName = 'email-sending-showcase' as const;
