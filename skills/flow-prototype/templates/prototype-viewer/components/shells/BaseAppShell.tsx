'use client';

import { useState } from 'react';
import { CaretDown, CaretUp, MagnifyingGlass, List, type Icon as PhosphorIcon } from '@phosphor-icons/react';

/* Shared types */
export interface NavChild { label: string; key: string }

export interface NavItem {
  label: string;
  icon: PhosphorIcon;
  key: string;
  defaultExpanded?: boolean;
  children?: NavChild[];
}

export interface BaseAppShellProps {
  shellClassName: string;
  shellStyleBlock: string;
  fontFamily?: string;
  activeNav?: string;
  children: React.ReactNode;
  sidebar?: {
    width: number;
    collapsible?: boolean;
    header?: React.ReactNode;
    search?: boolean;
    navItems?: NavItem[];
    navSlot?: React.ReactNode;
    footer?: React.ReactNode;
    padding?: string;
  };
  topbar?: {
    height: number;
    left?: React.ReactNode;
    center?: React.ReactNode;
    right?: React.ReactNode;
  };
  contentBackground?: string;
}

/* Default expandable sidebar nav */
function DefaultSidebarNav({ items, activeNav }: { items: NavItem[]; activeNav: string }) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
    () => new Set(items.filter((i) => i.defaultExpanded).map((i) => i.key)),
  );
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const toggle = (key: string) =>
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const accent = { position: 'absolute' as const, left: 0, top: 0, bottom: 0, width: 3, background: 'var(--shell-nav-active-accent)' };

  return (
    <nav style={{ flex: 1, background: 'var(--shell-sidebar-bg)', overflowY: 'auto' }}>
      {items.map((item) => {
        const active = item.key === activeNav;
        const parentActive = item.children?.some((c) => c.key === activeNav);
        const hovered = hoveredKey === item.key;
        const expanded = expandedKeys.has(item.key);
        const Icon = item.icon;
        return (
          <div key={item.key}>
            <div
              onClick={item.children ? () => toggle(item.key) : undefined}
              onMouseEnter={() => setHoveredKey(item.key)}
              onMouseLeave={() => setHoveredKey(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                padding: '13px 15px', fontSize: 13, fontWeight: 600,
                color: 'var(--shell-sidebar-text, #F7F7F8)',
                cursor: item.children ? 'pointer' : 'default', position: 'relative',
                background: hovered ? 'var(--shell-nav-hover-bg, transparent)' : 'transparent',
                transition: 'background 0.15s ease',
              }}
            >
              {(active || parentActive) && <span style={accent} />}
              <Icon size={16} weight="regular" style={{ opacity: 0.9, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.children && (expanded
                ? <CaretUp size={12} weight="regular" style={{ opacity: 0.6 }} />
                : <CaretDown size={12} weight="regular" style={{ opacity: 0.6 }} />
              )}
            </div>
            {item.children && expanded && (
              <div style={{
                background: 'var(--shell-nav-submenu-bg, #555)',
                borderTop: '1px solid var(--shell-nav-submenu-border, #4B4B4B)',
                borderBottom: '1px solid var(--shell-nav-submenu-border, #4B4B4B)',
              }}>
                {item.children.map((child) => {
                  const childActive = child.key === activeNav;
                  const childHovered = hoveredKey === child.key;
                  return (
                    <div
                      key={child.key}
                      onMouseEnter={() => setHoveredKey(child.key)}
                      onMouseLeave={() => setHoveredKey(null)}
                      style={{
                        padding: '8px 15px 8px 40px', fontSize: 13,
                        fontWeight: childActive ? 600 : 400,
                        color: childActive ? '#FFF' : 'rgba(247,247,248,0.7)',
                        cursor: 'pointer', position: 'relative',
                        background: childHovered ? 'var(--shell-nav-hover-bg, transparent)' : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {childActive && <span style={accent} />}
                      {child.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* BaseAppShell — shared structure for all shell replicas */
export default function BaseAppShell({
  shellClassName, shellStyleBlock, fontFamily = 'var(--font-body)',
  activeNav = '', children, sidebar, topbar, contentBackground,
}: BaseAppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const hasSidebar = !!sidebar;
  const hasTopbar = !!topbar;
  const collapsible = sidebar?.collapsible ?? false;
  const sw = sidebar?.width ?? 200;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shellStyleBlock }} />
      <div
        className={shellClassName}
        style={{
          display: 'flex', flexDirection: hasTopbar && !hasSidebar ? 'column' : 'row',
          flex: 1, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
          overflow: 'hidden', fontFamily, fontWeight: 400, position: 'relative',
          background: 'var(--shell-outer-bg, transparent)', WebkitFontSmoothing: 'antialiased',
        }}
      >
        {hasSidebar && (
          <aside style={{
            width: collapsible ? (sidebarOpen ? sw : 0) : sw,
            minWidth: collapsible ? (sidebarOpen ? sw : 0) : sw,
            display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden',
            background: 'var(--shell-sidebar-bg)',
            borderRight: '1px solid var(--shell-sidebar-border, transparent)',
            padding: sidebar.padding ?? '0',
            transition: collapsible ? 'width 0.2s ease-in-out, min-width 0.2s ease-in-out' : 'none',
          }}>
            {sidebar.header}
            {sidebar.search && (
              <div style={{ background: 'var(--shell-sidebar-bg)', padding: 'var(--space-2)' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                  padding: 'var(--space-1) var(--space-2)',
                  background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-sm)',
                }}>
                  <MagnifyingGlass size={14} weight="regular" style={{ color: '#F7F7F8' }} />
                  <span style={{ fontSize: 13, color: 'rgba(247,247,248,0.6)' }}>Search</span>
                </div>
              </div>
            )}
            {sidebar.navSlot ?? (sidebar.navItems && <DefaultSidebarNav items={sidebar.navItems} activeNav={activeNav} />)}
            {sidebar.footer}
          </aside>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {hasTopbar && (
            <header style={{
              height: topbar.height, flexShrink: 0, display: 'flex', alignItems: 'stretch',
              borderBottom: '1px solid var(--shell-topbar-border, var(--color-border))',
              background: 'var(--shell-topbar-bg, var(--color-surface))',
            }}>
              {collapsible && (
                <div
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, cursor: 'pointer', flexShrink: 0 }}
                >
                  <List size={18} weight="regular" style={{ color: 'var(--shell-topbar-text, #333)' }} />
                </div>
              )}
              {topbar.left}
              {topbar.center && <div style={{ display: 'flex', alignItems: 'center' }}>{topbar.center}</div>}
              <div style={{ flex: 1 }} />
              {topbar.right}
            </header>
          )}
          <div style={{
            flex: 1, padding: 'var(--space-4)', overflow: 'auto',
            background: contentBackground ?? 'var(--shell-content-bg, transparent)',
          }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
