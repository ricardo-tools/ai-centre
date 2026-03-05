'use client';

import { TopNav } from './TopNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <div className="app-shell__topnav">
        <TopNav />
      </div>
      <main className="app-shell__main" style={{ padding: '32px 48px' }}>
        <div style={{ maxWidth: 1200, marginInline: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
