import type { Metadata } from 'next';
import { Jost } from 'next/font/google';
import './globals.css';
import { ScreenRenderer } from '@/platform/screen-renderer/ScreenRenderer';
import { appShellConfig } from '@/platform/screens/AppShell/AppShell.screen';
import { getSession } from '@/platform/lib/auth';
import { SessionProvider } from '@/platform/lib/SessionContext';
import { NavigationProgress } from '@/platform/components/NavigationProgress';

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Centre',
  description: 'AI-assisted project generation and skill marketplace',
  icons: { icon: '/logos/square-color.png' },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var saved = localStorage.getItem('ai-centre-theme');
                if (saved) {
                  document.documentElement.setAttribute('data-theme', saved);
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.setAttribute('data-theme', 'night');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={jost.className} style={{ background: 'var(--color-bg)', color: 'var(--color-text-body)' }}>
        <SessionProvider session={session}>
          <NavigationProgress />
          <ScreenRenderer
            config={appShellConfig}
            containerStyle={{ height: '100vh', overflow: 'hidden' }}
            slots={{
              'main-content': (
                <div className="main-content" style={{ overflowY: 'auto', height: '100%' }}>
                  <div style={{ maxWidth: 1200, marginInline: 'auto' }}>
                    {children}
                  </div>
                </div>
              ),
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
