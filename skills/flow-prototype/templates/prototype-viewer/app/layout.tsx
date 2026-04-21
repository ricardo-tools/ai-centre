import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prototypes',
  description: 'Local prototype viewer for exploring UI/UX ideas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
