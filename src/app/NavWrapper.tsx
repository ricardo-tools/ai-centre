'use client';

import { usePathname } from 'next/navigation';
import { ScreenRenderer } from '@/platform/screen-renderer/ScreenRenderer';
import { appShellConfig } from '@/platform/screens/AppShell/AppShell.screen';

const SHELL_EXCLUDED_PATHS = ['/login'];

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExcluded = SHELL_EXCLUDED_PATHS.includes(pathname);

  if (isExcluded) {
    return (
      <div style={{ height: '100vh', overflow: 'auto' }}>
        {children}
      </div>
    );
  }

  return (
    <ScreenRenderer
      config={appShellConfig}
      containerStyle={{ height: '100vh', overflow: 'hidden' }}
      slots={{
        'main-content': (
          <div className="main-content" style={{ overflowY: 'auto', height: '100%' }}>
            {children}
          </div>
        ),
      }}
    />
  );
}
