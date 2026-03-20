'use client';

import { LoginForm } from './LoginForm';
import type { LoginSizeProps } from './types';

export function LoginXS(props: LoginSizeProps) {
  return <LoginForm {...props} compact />;
}
