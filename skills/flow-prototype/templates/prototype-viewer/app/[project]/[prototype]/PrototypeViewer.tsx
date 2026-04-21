'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Shell from '../../../components/Shell';
import ShellSelector from '../../../components/shells/ShellSelector';
import CommentPanel from '../../../src/widgets/CommentPanelWidget/CommentPanel';
import TagBadge from '../../../src/components/TagBadge';
import ErrorBoundary from '../../../src/components/ErrorBoundary';
import FloatingToolbar from '../../../src/components/FloatingToolbar';
import ReviewOverlay from '../../../src/components/ReviewOverlay';
import PinThreadPanel from '../../../src/components/PinThreadPanel';
import IdentityPrompt from '../../../src/components/IdentityPrompt';
import { useIdentity } from '../../../src/hooks/useIdentity';
import { usePins } from '../../../src/hooks/usePins';
import { ChatCircle } from '@phosphor-icons/react';
import type { AppShell } from '../../../src/domain/types';
import { enAU } from '../../../src/i18n/en-AU';

// ------------------------------------------------------------
// Serialized types (server → client boundary)
// ------------------------------------------------------------

interface SerializedProject {
  slug: string;
  name: string;
  description: string;
}

interface SerializedPrototype {
  slug: string;
  projectSlug: string;
  name: string;
  agent: string;
  shell: string;
  tags: string[];
  commentCount: number;
  formattedUpdatedAt: string;
  updatedAt: string;
  createdAt: string;
}

interface PrototypeViewerProps {
  project: SerializedProject;
  prototype: SerializedPrototype;
  prototypes: SerializedPrototype[];
  allProjects: { slug: string; name: string }[];
}

// ------------------------------------------------------------
// Dynamic prototype loader
// ------------------------------------------------------------

function PrototypeLoader({ projectSlug, prototypeSlug }: { projectSlug: string; prototypeSlug: string }) {
  const [PrototypeComponent, setPrototypeComponent] = useState<React.ComponentType | null>(null);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    setPrototypeComponent(null);
    setLoadError(null);
    import(`../../../projects/${projectSlug}/${prototypeSlug}/page`)
      .then((mod) => setPrototypeComponent(() => mod.default))
      .catch((err: unknown) => setLoadError(err instanceof Error ? err : new Error(String(err))));
  }, [projectSlug, prototypeSlug]);

  if (loadError) throw loadError;
  if (!PrototypeComponent) return <PrototypeLoadingFallback />;
  return <PrototypeComponent />;
}

// ------------------------------------------------------------
// Main viewer
// ------------------------------------------------------------

export default function PrototypeViewer({
  project,
  prototype,
  prototypes,
  allProjects,
}: PrototypeViewerProps) {
  // ── Shell state ──
  const [shell, setShell] = useState<AppShell | 'none'>(
    (prototype.shell as AppShell) || 'ezycollect-legacy',
  );

  // ── Review mode state ──
  const [reviewActive, setReviewActive] = useState(false);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [showIdentityPrompt, setShowIdentityPrompt] = useState(false);

  // ── Existing state ──
  const [commentsOpen, setCommentsOpen] = useState(false);

  // ── Hooks ──
  const { identity, setIdentity, isIdentified } = useIdentity();
  const { pins, openCount, createPin, resolvePin, deletePin } = usePins(
    project.slug,
    prototype.slug,
  );

  // ── Keyboard shortcut: ESC closes panels ──
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (selectedPinId) {
          setSelectedPinId(null);
        } else if (commentsOpen) {
          setCommentsOpen(false);
        }
      }
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedPinId, commentsOpen]);

  // ── Review toggle with identity gate ──
  const handleToggleReview = useCallback(() => {
    if (!isIdentified) {
      setShowIdentityPrompt(true);
      return;
    }
    setReviewActive((prev) => !prev);
  }, [isIdentified]);

  // ── Identity prompt callback ──
  const handleIdentify = useCallback(
    (name: string) => {
      setIdentity(name);
      setShowIdentityPrompt(false);
      setReviewActive(true);
    },
    [setIdentity],
  );

  // ── Pin placement handler ──
  const handlePlacePin = useCallback(
    (xPercent: number, yPercent: number, text: string) => {
      if (!identity) return;
      void createPin(xPercent, yPercent, text, identity.name);
    },
    [identity, createPin],
  );

  // ── Pin thread actions ──
  const handleResolvePin = useCallback(
    (pinId: string, resolvedBy: string) => {
      void resolvePin(pinId, resolvedBy);
      setSelectedPinId(null);
    },
    [resolvePin],
  );

  const handleDeletePin = useCallback(
    (pinId: string) => {
      void deletePin(pinId);
      setSelectedPinId(null);
    },
    [deletePin],
  );

  // ── Prototype inner content (reused in normal + fullscreen) ──
  const prototypeInner = (
    <ErrorBoundary>
      <Suspense fallback={<PrototypeLoadingFallback />}>
        <PrototypeLoader
          projectSlug={project.slug}
          prototypeSlug={prototype.slug}
        />
      </Suspense>
    </ErrorBoundary>
  );

  // ── Wrap prototype in shell (or not) ──
  const wrappedPrototype =
    shell !== 'none' ? (
      <ShellSelector shell={shell as AppShell}>{prototypeInner}</ShellSelector>
    ) : (
      prototypeInner
    );

  // ── Fullscreen content includes the toolbar + overlay ──
  const fullScreenContent = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        {wrappedPrototype}
        <ReviewOverlay
          active={reviewActive}
          pins={pins}
          onPinClick={(id) => setSelectedPinId(id)}
          onPlacePin={handlePlacePin}
          showResolved={false}
        />
      </div>
    </div>
  );

  // ── Selected pin object ──
  const selectedPin = selectedPinId
    ? pins.find((p) => p.id === selectedPinId) ?? null
    : null;

  return (
    <Shell
      projects={allProjects}
      prototypes={prototypes.map((p) => ({
        slug: p.slug,
        projectSlug: p.projectSlug,
        name: p.name,
        agent: p.agent,
        tags: p.tags,
        updatedAt: p.updatedAt,
        createdAt: p.createdAt,
      }))}
      currentProject={{ slug: project.slug, name: project.name }}
      currentPrototype={{ slug: prototype.slug, name: prototype.name }}
      fullScreenContent={fullScreenContent}
    >
      {/* Main content area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {/* Prototype container -- relative positioned for overlay */}
        <div style={{ position: 'relative', minHeight: 900, display: 'flex', flexDirection: 'column' }}>
          {wrappedPrototype}

          {/* Review overlay sits on top */}
          <ReviewOverlay
            active={reviewActive}
            pins={pins}
            onPinClick={(id) => setSelectedPinId(id)}
            onPlacePin={handlePlacePin}
            showResolved={false}
          />
        </div>

        {/* Prototype info bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-2) var(--space-3)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 13 }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>
              {prototype.name}
            </span>
            <TagBadge label={prototype.agent} variant="agent" />
            {prototype.tags.map((t) => (
              <TagBadge key={t} label={t} />
            ))}
            <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
              {prototype.formattedUpdatedAt}
            </span>
          </div>
          <button
            onClick={() => setCommentsOpen(!commentsOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-1) var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text-body)',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <ChatCircle size={14} weight={commentsOpen ? 'fill' : 'regular'} />
            {enAU.common.notes}
          </button>
        </div>
      </div>

      {/* Comment panel (existing slide-out) */}
      <CommentPanel
        projectSlug={project.slug}
        prototypeSlug={prototype.slug}
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
      />

      {/* Pin thread panel (slide-out when a pin is selected) */}
      <PinThreadPanel
        pin={selectedPin}
        onClose={() => setSelectedPinId(null)}
        onResolve={handleResolvePin}
        onDelete={handleDeletePin}
        currentUser={identity?.name ?? ''}
      />

      {/* Identity prompt modal */}
      <IdentityPrompt
        open={showIdentityPrompt}
        onClose={() => setShowIdentityPrompt(false)}
        onIdentify={handleIdentify}
      />

      {/* Floating toolbar -- fixed position, always visible */}
      <FloatingToolbar
        currentShell={shell}
        onShellChange={setShell}
        reviewActive={reviewActive}
        onToggleReview={handleToggleReview}
        openPinCount={openCount}
        identity={identity}
        onRequestIdentity={() => setShowIdentityPrompt(true)}
      />
    </Shell>
  );
}

// ------------------------------------------------------------
// Loading fallback
// ------------------------------------------------------------

function PrototypeLoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-6)',
        color: 'var(--color-text-muted)',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          animation: 'spin 700ms linear infinite',
        }}
      />
      <span style={{ fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-body)' }}>
        {enAU.prototype.loading}
      </span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
