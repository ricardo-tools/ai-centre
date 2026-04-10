'use client';

import type { SizeVariant, RenderableWidget } from '@/platform/screen-renderer/types';
import { AuthCustomOtpShowcaseXS } from './AuthCustomOtpShowcaseXS';
import { AuthCustomOtpShowcaseSM } from './AuthCustomOtpShowcaseSM';
import { AuthCustomOtpShowcaseMD } from './AuthCustomOtpShowcaseMD';
import { AuthCustomOtpShowcaseLG } from './AuthCustomOtpShowcaseLG';

const variants: Record<SizeVariant, React.ComponentType<RenderableWidget>> = {
  xs: AuthCustomOtpShowcaseXS,
  sm: AuthCustomOtpShowcaseSM,
  md: AuthCustomOtpShowcaseMD,
  lg: AuthCustomOtpShowcaseLG,
};

export default function AuthCustomOtpShowcaseWidget(props: RenderableWidget) {
  const Component = variants[props.size];
  return <Component {...props} />;
}

AuthCustomOtpShowcaseWidget.widgetName = 'auth-custom-otp-showcase' as const;
