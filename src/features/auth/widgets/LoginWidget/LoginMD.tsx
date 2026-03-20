'use client';

import { LoginForm } from './LoginForm';
import type { LoginSizeProps } from './types';

export function LoginMD(props: LoginSizeProps) {
  return <LoginForm {...props} />;
}
