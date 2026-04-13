import { Suspense } from 'react';
import { ScreenRenderer } from '@/platform/screen-renderer/ScreenRenderer';
import { consentScreenConfig } from '@/platform/screens/OAuth/Consent.screen';

export default function OAuthConsentPage() {
  return (
    <Suspense>
      <ScreenRenderer config={consentScreenConfig} containerStyle={{ height: '100%' }} />
    </Suspense>
  );
}
