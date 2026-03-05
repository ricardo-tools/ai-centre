import type { Metadata } from 'next';
import { Jost } from 'next/font/google';
import './globals.css';
import { ScreenRenderer } from '@/screen-renderer/ScreenRenderer';
import { appShellConfig } from '@/screens/AppShell/AppShell.screen';

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Centre',
  description: 'AI-assisted project generation and skill marketplace',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <ScreenRenderer
          config={appShellConfig}
          containerStyle={{ height: '100vh', overflow: 'hidden' }}
          slots={{
            'main-content': (
              <div style={{ overflowY: 'auto', height: '100%', padding: '32px 48px' }}>
                <div style={{ maxWidth: 1200, marginInline: 'auto' }}>
                  {children}
                </div>
              </div>
            ),
          }}
        />
      </body>
    </html>
  );
}
