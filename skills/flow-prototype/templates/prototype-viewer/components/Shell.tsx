'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { House, ArrowLeft, CaretRight, CornersOut, CornersIn } from '@phosphor-icons/react';
import ThemeSwitcher from './ThemeSwitcher';
import { groupPrototypesByVersion } from '../src/acl/sidebar.mapper';
import type { SidebarPrototype } from '../src/acl/sidebar.mapper';
import { enAU } from '../src/i18n/en-AU';

interface SidebarProject {
  slug: string;
  name: string;
}

interface ShellProps {
  children: React.ReactNode;
  projects?: SidebarProject[];
  prototypes?: SidebarPrototype[];
  currentProject?: { slug: string; name: string } | null;
  currentPrototype?: { slug: string; name: string } | null;
  fullScreenContent?: React.ReactNode;
}

function formatShortDate(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${date} ${time}`;
}

export default function Shell({
  children,
  projects = [],
  prototypes = [],
  currentProject,
  currentPrototype,
  fullScreenContent,
}: ShellProps) {
  const pathname = usePathname();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const isHome = pathname === '/';
  const isProject = !!currentProject && !currentPrototype;
  const isPrototype = !!currentProject && !!currentPrototype;

  const sidebarGroups = useMemo(
    () => groupPrototypesByVersion(prototypes, enAU.sidebar.versionLabels),
    [prototypes],
  );

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape' && isFullScreen) setIsFullScreen(false);
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullScreen]);

  // Full screen mode
  if (isFullScreen && fullScreenContent) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-modal)' as unknown as number, background: 'var(--color-bg)', overflow: 'auto' }}>
        <button
          onClick={() => setIsFullScreen(false)}
          style={{
            position: 'absolute',
            top: 'var(--space-2)',
            right: 'var(--space-2)',
            zIndex: 'var(--z-toast)' as unknown as number,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-body)',
            cursor: 'pointer',
          }}
        >
          <CornersIn size={18} weight="regular" />
        </button>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {fullScreenContent}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 'var(--sidebar-width-full)',
          minWidth: 'var(--sidebar-width-full)',
          height: '100vh',
          flexShrink: 0,
          background: 'var(--color-sidebar-bg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Brand area */}
        <div
          style={{
            padding: 'var(--space-3)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-sidebar-text-active)',
              letterSpacing: '0.02em',
            }}
          >
            Prototypes
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflow: 'auto', padding: 'var(--space-2)' }}>
          {isHome || !currentProject ? (
            <>
              {/* Home link */}
              <Link
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 13,
                  fontWeight: pathname === '/' ? 600 : 400,
                  color: pathname === '/' ? 'var(--color-sidebar-text-active)' : 'var(--color-sidebar-text)',
                  background: pathname === '/' ? 'var(--color-sidebar-hover)' : 'transparent',
                  marginBottom: 'var(--space-1)',
                }}
              >
                <House size={14} weight={pathname === '/' ? 'fill' : 'regular'} />
                Home
              </Link>

              {/* Section label */}
              <div
                style={{
                  padding: 'var(--space-3) var(--space-2) var(--space-1)',
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-sidebar-text)',
                }}
              >
                Projects
              </div>

              {projects.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  style={{
                    display: 'block',
                    padding: 'var(--space-1) var(--space-2)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    fontWeight: 400,
                    color: 'var(--color-sidebar-text)',
                    marginBottom: 1,
                  }}
                >
                  {p.name}
                </Link>
              ))}
            </>
          ) : (
            <>
              {/* Back to home */}
              <Link
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 13,
                  color: 'var(--color-sidebar-text)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                <ArrowLeft size={12} weight="regular" />
                Home
              </Link>

              {/* Project name link */}
              <Link
                href={`/${currentProject.slug}`}
                style={{
                  display: 'block',
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 13,
                  fontWeight: isProject ? 600 : 400,
                  color: isProject ? 'var(--color-sidebar-text-active)' : 'var(--color-sidebar-text)',
                  background: isProject ? 'var(--color-sidebar-hover)' : 'transparent',
                  marginBottom: 'var(--space-2)',
                }}
              >
                {currentProject.name}
              </Link>

              {/* Prototypes section */}
              <div
                style={{
                  padding: 'var(--space-3) var(--space-2) var(--space-1)',
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-sidebar-text)',
                }}
              >
                Prototypes
              </div>

              {sidebarGroups.map((group) => (
                  <div key={group.version}>
                    <div
                      style={{
                        padding: '6px var(--space-2) 2px',
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {group.label}
                    </div>
                    {group.items.map((proto) => {
                      const isActive = currentPrototype?.slug === proto.slug;
                      return (
                        <Link
                          key={proto.slug}
                          href={`/${proto.projectSlug}/${proto.slug}`}
                          style={{
                            display: 'block',
                            padding: 'var(--space-1) var(--space-2)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 13,
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? 'var(--color-sidebar-text-active)' : 'var(--color-sidebar-text)',
                            background: isActive ? 'var(--color-sidebar-hover)' : 'transparent',
                            marginBottom: 1,
                            position: 'relative',
                            paddingLeft: isActive ? 18 : 10,
                          }}
                        >
                          {isActive && (
                            <span
                              style={{
                                position: 'absolute',
                                left: 6,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 4,
                                height: 4,
                                borderRadius: '50%',
                                background: 'var(--color-primary)',
                              }}
                            />
                          )}
                          <div>{proto.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--color-sidebar-text)', fontWeight: 400, marginTop: 1 }}>
                            {proto.agent} · {formatShortDate(proto.createdAt)}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ))}
            </>
          )}
        </nav>

        {/* Logo at bottom of sidebar */}
        <div
          style={{
            padding: 'var(--space-3)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/rectangle-white.png"
            alt="ezyCollect"
            style={{ maxWidth: 100, maxHeight: 20, opacity: 0.5 }}
          />
        </div>
      </aside>

      {/* Main column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* TopBar */}
        <header
          style={{
            height: 48,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingInline: 'var(--space-3)',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
          }}
        >
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, minWidth: 0 }}>
            <Link
              href="/"
              style={{
                color: isHome ? 'var(--color-text-heading)' : 'var(--color-text-muted)',
                fontWeight: isHome ? 600 : 400,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Home
            </Link>
            {currentProject && (
              <>
                <CaretRight size={10} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                <Link
                  href={`/${currentProject.slug}`}
                  style={{
                    color: isProject ? 'var(--color-text-heading)' : 'var(--color-text-muted)',
                    fontWeight: isProject ? 600 : 400,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {currentProject.name}
                </Link>
              </>
            )}
            {currentPrototype && (
              <>
                <CaretRight size={10} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                <span
                  style={{
                    color: 'var(--color-text-heading)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {currentPrototype.name}
                </span>
              </>
            )}
          </nav>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <ThemeSwitcher />
            {isPrototype && (
              <button
                onClick={() => setIsFullScreen(true)}
                title="Full screen"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-body)',
                  cursor: 'pointer',
                  transition: 'background 150ms var(--ease-in-out)',
                }}
              >
                <CornersOut size={18} weight="regular" />
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto', background: 'var(--color-bg)', padding: 'var(--space-4)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
