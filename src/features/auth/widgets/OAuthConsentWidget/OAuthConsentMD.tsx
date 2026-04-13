'use client';

import { ConsentForm } from './ConsentForm';
import type { ConsentSizeProps } from './types';

export function OAuthConsentMD(props: ConsentSizeProps) {
  return <ConsentForm {...props} />;
}
