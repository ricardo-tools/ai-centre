'use client';

import type { RenderableWidget, SizeVariant } from '@/platform/screen-renderer/types';
import { useConsent } from './useConsent';
import { OAuthConsentXS } from './OAuthConsentXS';
import { OAuthConsentSM } from './OAuthConsentSM';
import { OAuthConsentMD } from './OAuthConsentMD';
import { OAuthConsentLG } from './OAuthConsentLG';
import type { ConsentSizeProps } from './types';

type OAuthConsentWidgetProps = RenderableWidget;

const SIZE_MAP: Record<SizeVariant, React.ComponentType<ConsentSizeProps>> = {
  xs: OAuthConsentXS,
  sm: OAuthConsentSM,
  md: OAuthConsentMD,
  lg: OAuthConsentLG,
};

export const widgetName = 'OAuthConsentWidget';

export function OAuthConsentWidget({ size }: OAuthConsentWidgetProps) {
  const { isAllowing, isDenying, handleAllow, handleDeny } = useConsent();

  const SizeComponent = SIZE_MAP[size] ?? SIZE_MAP.lg;
  return (
    <SizeComponent
      isAllowing={isAllowing}
      isDenying={isDenying}
      onAllow={handleAllow}
      onDeny={handleDeny}
    />
  );
}
