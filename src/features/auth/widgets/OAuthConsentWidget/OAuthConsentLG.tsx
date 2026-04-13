'use client';

import { ConsentForm } from './ConsentForm';
import type { ConsentSizeProps } from './types';

export function OAuthConsentLG(props: ConsentSizeProps) {
  return <ConsentForm {...props} />;
}
