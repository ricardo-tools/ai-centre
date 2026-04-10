import type { Metadata } from 'next';
import { Jost } from 'next/font/google';
import './globals.css';
import { getSession } from '@/platform/lib/auth';
import { SessionProvider } from '@/platform/lib/SessionContext';
import { NavigationProgress } from '@/platform/components/NavigationProgress';
import { ShellLayout } from './NavWrapper';
import { ChatDrawerLazy } from './ChatDrawerLazy';

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Centre',
  description: 'AI-assisted project generation and skill marketplace',
  icons: {
    icon: [
      { url: '/logos/square-color.png', media: '(prefers-color-scheme: light)' },
      { url: '/logos/square-dark-favicon.svg', media: '(prefers-color-scheme: dark)' },
    ],
  },
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
          <ShellLayout>
            {children}
          </ShellLayout>
          {session && <ChatDrawerLazy />}
        </SessionProvider>
      </body>
    </html>
  );
}
