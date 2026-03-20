export interface LoginSizeProps {
  step: 'email' | 'verify';
  email: string;
  setEmail: (email: string) => void;
  code: string;
  setCode: (code: string) => void;
  isLoading: boolean;
  error: string | null;
  attemptsRemaining: number | null;
  onRequestOtp: () => void;
  onVerifyOtp: () => void;
  onBack: () => void;
}
