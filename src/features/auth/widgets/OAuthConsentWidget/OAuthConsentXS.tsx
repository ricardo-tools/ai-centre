'use client';

import { ConsentForm } from './ConsentForm';
import type { ConsentSizeProps } from './types';

export function OAuthConsentXS(props: ConsentSizeProps) {
  return <ConsentForm {...props} compact />;
}
