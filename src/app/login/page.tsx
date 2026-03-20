import { ScreenRenderer } from '@/platform/screen-renderer/ScreenRenderer';
import { loginScreenConfig } from '@/platform/screens/Login/Login.screen';

export default function LoginPage() {
  return <ScreenRenderer config={loginScreenConfig} containerStyle={{ height: '100%' }} />;
}
