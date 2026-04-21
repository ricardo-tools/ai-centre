'use client';

import { usePathname } from 'next/navigation';
import { ScreenRenderer } from '@/platform/screen-renderer/ScreenRenderer';
import { appShellConfig } from '@/platform/screens/AppShell/AppShell.screen';
import { ThemeSwitcher } from '@/platform/components/ThemeSwitcher';

const SHELL_EXCLUDED_PATHS = ['/login', '/oauth/consent'];
/** Pages that render inside the shell but need edge-to-edge layout (no content padding) */
const FLUSH_LAYOUT_PATHS = ['/chat', '/'];

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExcluded = SHELL_EXCLUDED_PATHS.includes(pathname);

  if (isExcluded) {
    return (
      <div style={{ height: '100vh', overflow: 'auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
          <ThemeSwitcher showLabel={false} />
        </div>
        {children}
      </div>
    );
  }

  const isFlush = FLUSH_LAYOUT_PATHS.includes(pathname);

  return (
    <ScreenRenderer
      config={appShellConfig}
      containerStyle={{ height: '100vh', overflow: 'hidden' }}
      slots={{
        'main-content': (
          <div className={isFlush ? undefined : 'main-content'} style={{ overflowY: 'auto', height: '100%' }}>
            {children}
          </div>
        ),
      }}
    />
  );
}
