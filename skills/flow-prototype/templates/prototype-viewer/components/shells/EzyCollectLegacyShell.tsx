'use client';

import { Gauge, ListBullets, ShieldCheck, ListDashes, Users, Book, Question, Bell } from '@phosphor-icons/react';
import BaseAppShell, { NavItem } from './BaseAppShell';

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: Gauge, key: 'dashboard', defaultExpanded: true,
    children: [
      { label: 'Company Pulse', key: 'company-pulse' },
      { label: 'Risk Portfolio', key: 'risk-portfolio' },
      { label: 'Credit Insights', key: 'credit-insights' },
    ] },
  { label: 'Your Tasks', icon: ListBullets, key: 'tasks' },
  { label: 'Credit Management', icon: ShieldCheck, key: 'credit', defaultExpanded: true,
    children: [
      { label: 'Credit Applications', key: 'credit-applications' },
      { label: 'Scores and Reports', key: 'scores-reports' },
    ] },
  { label: 'Forms', icon: ListDashes, key: 'forms' },
  { label: 'Customers', icon: Users, key: 'customers' },
  { label: 'Reports', icon: Book, key: 'reports', defaultExpanded: false,
    children: [{ label: 'Customer Contacts', key: 'customer-contacts' }] },
];

const STYLE_BLOCK = `.shell-ezycollect-legacy {
  --shell-outer-bg: transparent;
  --shell-sidebar-bg: #666666;
  --shell-sidebar-border: #E6E6E6;
  --shell-sidebar-text: #F7F7F8;
  --shell-nav-hover-bg: #FF6600;
  --shell-nav-active-accent: #FF6600;
  --shell-nav-submenu-bg: #555555;
  --shell-nav-submenu-border: #4B4B4B;
  --shell-topbar-bg: #FFFFFF;
  --shell-topbar-border: #E6E6E6;
  --shell-topbar-text: #333333;
  --shell-content-bg: #F8F8F8;
}`;

const cell = { padding: '0 7px', display: 'flex', alignItems: 'center' } as const;

function SidebarHeader() {
  return (
    <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF', borderRight: '1px solid #E6E6E6', flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logos/rectangle-color.png" alt="ezyCollect Logo" style={{ maxWidth: 150, maxHeight: 30 }} />
    </div>
  );
}

function SidebarFooter() {
  return (
    <div style={{ padding: '0 15px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FF6600', color: '#FFF', fontSize: 12, flexShrink: 0 }}>
      <span>Comprehensive Credit Report</span>
      <span style={{ padding: 'var(--space-1) var(--space-2)', background: 'rgba(255,255,255,0.2)', borderRadius: 3, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Purchase</span>
    </div>
  );
}

function TopBarLeft() {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: '0 12px', background: '#FF6600', color: '#FFF', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
        <Gauge size={14} weight="regular" /><span>Dashboard</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 13, color: '#333', whiteSpace: 'nowrap' }}>
        CREDIT INSIGHTS · <span style={{ color: '#999', marginLeft: 4 }}>My Plan</span>
      </div>
    </>
  );
}

function TopBarRight() {
  const hoverScale = {
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = 'scale(0.95)'; },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = 'scale(1)'; },
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, lineHeight: 1.5 }}>
      {/* Help */}
      <div style={cell}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#FF6600' }}>
          <Question size={18} weight="regular" />
          <span style={{ fontSize: 9, fontWeight: 700 }}>Help</span>
        </div>
      </div>
      {/* Auto-Collect */}
      <div style={{ padding: '0 5px 0 10px', display: 'flex', alignItems: 'center' }}>
        <div
          style={{ width: 140, height: 46, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#ED4C28', border: '1px solid #973A3A', borderRadius: 4, padding: '6px 10px', cursor: 'pointer', transition: 'transform 180ms ease-in-out' }}
          {...hoverScale}
        >
          <div style={{ display: 'inline-grid', textAlign: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9em', color: '#FFF' }}>Auto-Collect</span>
            <span style={{ fontSize: '0.9em', color: '#FFF' }}>Direct Debit Disabled</span>
          </div>
        </div>
      </div>
      {/* Sync */}
      <div style={cell}>
        <button
          style={{ height: 46, padding: '6px 25px', fontSize: 10, borderRadius: 3, background: '#1C2127', border: '1px solid #000', color: '#FFF', cursor: 'pointer', transition: 'all 0.2s ease-in-out', fontFamily: 'inherit', textAlign: 'center', whiteSpace: 'nowrap' }}
          title="01-Dec-2023 03:00"
          onMouseEnter={(e) => { e.currentTarget.style.background = '#070809'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#1C2127'; }}
        >
          <span style={{ display: 'block', fontWeight: 700, fontSize: '0.9em', lineHeight: '1.45em' }}>Last Sync: netsuite</span>
          <span style={{ display: 'block', fontSize: '0.9em', lineHeight: '1.45em' }}>01-Dec-2023 03:00</span>
        </button>
      </div>
      {/* Org switcher */}
      <div style={cell}>
        <button
          style={{ display: 'flex', alignItems: 'center', height: 46, padding: '6px 10px', background: 'rgb(22,157,214)', border: '1px solid #0C597A', borderRadius: 3, color: '#FFF', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, transition: 'all 0.2s ease-in-out' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#1280B0'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgb(22,157,214)'; }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9em' }}>Organisation</div>
            <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 145 }}>netsu40</div>
          </div>
          <span style={{ marginLeft: 4, display: 'inline-block', borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #FFF' }} />
        </button>
      </div>
      {/* Avatar */}
      <div style={{ ...cell, cursor: 'pointer' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#666' }}>RH</div>
      </div>
      {/* Bell */}
      <div
        style={{ padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF', color: '#169DD6', cursor: 'pointer', transition: 'all 0.2s ease-in-out', alignSelf: 'stretch' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#FF6600'; e.currentTarget.style.color = '#FFF'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#FFF'; e.currentTarget.style.color = '#169DD6'; }}
      >
        <Bell size={16} weight="regular" />
      </div>
    </div>
  );
}

export default function EzyCollectLegacyShell({ activeNav = 'company-pulse', children }: { activeNav?: string; children: React.ReactNode }) {
  return (
    <BaseAppShell
      shellClassName="shell-ezycollect-legacy"
      shellStyleBlock={STYLE_BLOCK}
      fontFamily="'Open Sans', 'Roboto', 'Raleway', sans-serif"
      activeNav={activeNav}
      sidebar={{ width: 200, collapsible: true, header: <SidebarHeader />, search: true, navItems, footer: <SidebarFooter /> }}
      topbar={{ height: 60, left: <TopBarLeft />, right: <TopBarRight /> }}
    >
      {children}
    </BaseAppShell>
  );
}
