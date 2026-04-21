'use client';

import { Shuffle, FileText, Buildings, CaretDown, Sun, Moon, CloudSun, Circle, type Icon as PhosphorIcon } from '@phosphor-icons/react';
import BaseAppShell from './BaseAppShell';

const navTabs: { label: string; icon: PhosphorIcon; key: string }[] = [
  { label: 'Workflow', icon: Shuffle, key: 'workflow' },
  { label: 'Templates', icon: FileText, key: 'templates' },
];

const font = "Inter, system-ui, sans-serif";

const STYLE_BLOCK = `.shell-new-workflows {
  --shell-outer-bg: var(--color-bg);
  --shell-topbar-bg: var(--color-surface);
  --shell-topbar-border: var(--color-border);
  --shell-content-bg: transparent;
}`;

const themeOptions = [
  { icon: Sun, title: 'Light', active: true },
  { icon: Moon, title: 'Dark', active: false },
  { icon: CloudSun, title: 'Sunset', active: false },
  { icon: Circle, title: 'Black', active: false },
] as const;

function TopBarLeft({ activeNav }: { activeNav: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 32 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logos/rectangle-color.png" alt="Ezy logo" style={{ width: 178.359, height: 48, objectFit: 'contain' }} />
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 32 }}>
        {navTabs.map((item) => {
          const isActive = item.key === activeNav;
          const Icon = item.icon;
          return (
            <div key={item.key} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
              borderRadius: 8, fontFamily: font, fontSize: 14, fontWeight: isActive ? 500 : 400,
              color: isActive ? 'var(--color-text-heading)' : 'var(--color-text-body)',
              background: isActive ? 'rgb(248, 250, 252)' : 'transparent',
              cursor: 'default', transition: 'background 150ms, color 150ms',
            }}>
              <Icon size={16} weight="regular" />
              {item.label}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

function TopBarRight() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingRight: 32 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
        borderRadius: 8, fontFamily: font, fontSize: 14, color: 'var(--color-text-body)', cursor: 'pointer',
      }}>
        <Buildings size={18} weight="regular" />
        <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>neworgtestallan5</span>
        <CaretDown size={14} weight="regular" />
      </div>
      <div style={{ width: 1, height: 20, background: 'var(--color-border)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: 2, borderRadius: 8, background: 'var(--color-border-light)' }}>
        {themeOptions.map((t) => {
          const TIcon = t.icon;
          return (
            <div key={t.title} title={t.title} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28,
              borderRadius: 6, background: t.active ? 'var(--color-surface)' : 'transparent',
              boxShadow: t.active ? 'var(--shadow-sm)' : 'none',
              color: t.active ? 'var(--color-text-heading)' : 'var(--color-text-muted)',
              cursor: 'pointer', transition: 'all 150ms',
            }}>
              <TIcon size={16} weight={t.title === 'Black' ? 'fill' : 'regular'} />
            </div>
          );
        })}
      </div>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--color-border)',
        background: 'var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', cursor: 'pointer',
      }}>RH</div>
    </div>
  );
}

export default function NewWorkflowsShell({ activeNav = 'workflow', children }: { activeNav?: string; children: React.ReactNode }) {
  return (
    <BaseAppShell
      shellClassName="shell-new-workflows"
      shellStyleBlock={STYLE_BLOCK}
      fontFamily={font}
      activeNav={activeNav}
      topbar={{ height: 80, left: <TopBarLeft activeNav={activeNav} />, right: <TopBarRight /> }}
    >
      {children}
    </BaseAppShell>
  );
}
