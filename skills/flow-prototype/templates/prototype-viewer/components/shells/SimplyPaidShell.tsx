'use client';

import { useState } from 'react';
import { FileDashed, Money, ClockClockwise, FileText, BellSimple, type Icon as PhosphorIcon } from '@phosphor-icons/react';
import BaseAppShell from './BaseAppShell';

const navItems: { label: string; icon: PhosphorIcon; key: string }[] = [
  { label: 'Invoices', icon: FileDashed, key: 'invoices' },
  { label: 'One-off Payments', icon: Money, key: 'payments' },
  { label: 'Payment History', icon: ClockClockwise, key: 'history' },
  { label: 'Statements', icon: FileText, key: 'statements' },
];

const font = "-apple-system, 'system-ui', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";

const STYLE_BLOCK = `.shell-simplypaid {
  --shell-outer-bg: #F2F3F4;
  --shell-sidebar-bg: #FFFFFF;
  --shell-sidebar-border: #E5E7EB;
  --shell-content-bg: transparent;
}`;

function CustomNav({ activeNav }: { activeNav: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 -8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map((item) => {
          const show = item.key === activeNav || hovered === item.key;
          const Icon = item.icon;
          return (
            <li key={item.key}>
              <a
                onMouseEnter={() => setHovered(item.key)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                  padding: 'var(--space-2)', borderRadius: 6, fontSize: 12, fontWeight: 500,
                  textTransform: 'uppercase', textDecoration: 'none',
                  color: show ? '#FFF' : '#416595', background: show ? '#0070BA' : '#FFF',
                  cursor: 'pointer', marginBottom: 4, transition: 'background 0.15s ease, color 0.15s ease',
                }}
              >
                {item.label}
                <Icon size={24} weight="regular" style={{ flexShrink: 0, marginLeft: 12 }} />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarHeader() {
  return (
    <>
      <div style={{ height: 48, marginTop: 32, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logos/rectangle-color.png" alt="logo" style={{ maxHeight: 36, maxWidth: 160 }} />
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        gap: 'var(--space-3)', padding: 'var(--space-1) 0', marginBottom: 'var(--space-1)', cursor: 'pointer',
      }}>
        <BellSimple size={28} weight="regular" style={{ color: '#169DD6', flexShrink: 0, animation: 'sp-bell-ring 4s 0.7s ease-in-out infinite' }} />
        <span style={{ fontSize: 14, color: '#5E6470' }}>Enable Reminders</span>
      </div>
      <div style={{ padding: '16px 0', color: '#5E6470' }}>
        <h5 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title="Everett Fine Wines">
          Everett Fine Wines
        </h5>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11 }}>Total Balance:</span>
          <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'right' }}>KSh 176,597.16</span>
        </div>
      </div>
    </>
  );
}

export default function SimplyPaidShell({ activeNav = 'invoices', children }: { activeNav?: string; children: React.ReactNode }) {
  return (
    <BaseAppShell
      shellClassName="shell-simplypaid"
      shellStyleBlock={STYLE_BLOCK}
      fontFamily={font}
      activeNav={activeNav}
      sidebar={{ width: 230, header: <SidebarHeader />, navSlot: <CustomNav activeNav={activeNav} />, padding: '0 24px 16px' }}
    >
      {children}
    </BaseAppShell>
  );
}
