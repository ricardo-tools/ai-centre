'use client';

import type { RenderableWidget, SizeVariant } from '@/platform/screen-renderer/types';
import { useLogin } from './useLogin';
import { LoginXS } from './LoginXS';
import { LoginSM } from './LoginSM';
import { LoginMD } from './LoginMD';
import { LoginLG } from './LoginLG';
import type { LoginSizeProps } from './types';

type LoginWidgetProps = RenderableWidget;

const SIZE_MAP: Record<SizeVariant, React.ComponentType<LoginSizeProps>> = {
  xs: LoginXS,
  sm: LoginSM,
  md: LoginMD,
  lg: LoginLG,
};

export const widgetName = 'LoginWidget';

export function LoginWidget({ size }: LoginWidgetProps) {
  const {
    step,
    email,
    setEmail,
    code,
    setCode,
    isLoading,
    error,
    attemptsRemaining,
    handleRequestOtp,
    handleVerifyOtp,
    handleBack,
  } = useLogin();

  const SizeComponent = SIZE_MAP[size] ?? SIZE_MAP.lg;
  return (
    <SizeComponent
      step={step}
      email={email}
      setEmail={setEmail}
      code={code}
      setCode={setCode}
      isLoading={isLoading}
      error={error}
      attemptsRemaining={attemptsRemaining}
      onRequestOtp={handleRequestOtp}
      onVerifyOtp={handleVerifyOtp}
      onBack={handleBack}
    />
  );
}
