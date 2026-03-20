'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowsOut, ArrowsIn, DownloadSimple, User, FileHtml, FileZip, SpinnerGap, Trash, LinkSimple, PencilSimple, Check, X, UploadSimple } from '@phosphor-icons/react';
import sdk from '@stackblitz/sdk';
import type { RawShowcaseUpload } from '@/features/showcase-gallery/action';
import { deleteShowcase, updateShowcase } from '@/features/showcase-gallery/action';
import { useSession } from '@/platform/lib/SessionContext';
import { SkillPicker } from '@/platform/components/SkillPicker';

interface ShowcaseViewerWidgetProps {
  showcase: RawShowcaseUpload;
}

type LoadingPhase = 'fetching' | 'extracting' | 'installing' | 'starting' | 'ready' | 'error';

const PHASE_LABELS: Record<LoadingPhase, string> = {
  fetching: 'Fetching project files...',
  extracting: 'Extracting archive...',
  installing: 'Installing dependencies...',
  starting: 'Starting dev server...',
  ready: '',
  error: 'Failed to load preview',
};

const NAV_HEIGHT = 56;
const BAR_HEIGHT = 44;

export function ShowcaseViewerWidget({ showcase }: ShowcaseViewerWidgetProps) {
  const iframeRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<LoadingPhase>(showcase.fileType === 'html' ? 'ready' : 'fetching');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const session = useSession();
  const router = useRouter();

  const canDelete = session && (session.userId === showcase.userId || session.roleSlug === 'admin');
  const isOwner = session && session.userId === showcase.userId;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(showcase.title);
  const [editDescription, setEditDescription] = useState(showcase.description ?? '');
  const [editSkills, setEditSkills] = useState<string[]>(showcase.skillIds);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);
  const editFileRef = useRef<HTMLInputElement>(null);
  const [availableSkills, setAvailableSkills] = useState<{ slug: string; title: string }[]>([]);

  // Fetch available skills when editing starts
  useEffect(() => {
    if (editing) {
      import('@/features/skill-library/action').then((m) => m.fetchAllSkills()).then((result) => {
        if (result.ok) {
          setAvailableSkills(result.value.map((s: { slug: string; title: string }) => ({ slug: s.slug, title: s.title })));
        }
      });
    }
  }, [editing]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleStartEdit = useCallback(() => {
    setEditTitle(showcase.title);
    setEditDescription(showcase.description ?? '');
    setEditSkills([...showcase.skillIds]);
    setEditFile(null);
    setEditing(true);
  }, [showcase]);

  const handleSaveEdit = useCallback(async () => {
    setUpdating(true);
    setDeleteError(null);
    const formData = new FormData();
    formData.set('title', editTitle.trim());
    formData.set('description', editDescription.trim());
    formData.set('skillIds', JSON.stringify(editSkills));
    if (editFile) formData.set('file', editFile);
    try {
      const result = await updateShowcase(showcase.id, formData);
      if (result.ok) {
        setEditing(false);
        window.location.reload();
      } else {
        setDeleteError(result.error.message);
      }
    } catch {
      setDeleteError('Update failed');
    }
    setUpdating(false);
  }, [showcase.id, editTitle, editDescription, editSkills, editFile]);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const result = await deleteShowcase(showcase.id);
      if (result.ok) {
        router.push('/gallery');
      } else {
        setDeleteError(result.error.message);
        setConfirmDelete(false);
        setDeleting(false);
      }
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Delete failed');
      setConfirmDelete(false);
      setDeleting(false);
    }
  }, [showcase.id, router]);

  // ESC key exits fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const date = new Date(showcase.createdAt).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const FileIcon = showcase.fileType === 'html' ? FileHtml : FileZip;
  const typeLabel = showcase.fileType === 'html' ? 'HTML' : 'Next.js';

  // Boot StackBlitz for ZIP projects
  useEffect(() => {
    if (showcase.fileType !== 'zip' || !iframeRef.current) return;

    let cancelled = false;

    async function boot() {
      try {
        setPhase('fetching');
        const res = await fetch(showcase.blobUrl);
        if (!res.ok) throw new Error('Failed to fetch project');
        const blob = await res.blob();

        setPhase('extracting');
        const JSZip = (await import('jszip')).default;
        const zip = await JSZip.loadAsync(blob);

        const files: Record<string, string> = {};
        for (const [path, zipEntry] of Object.entries(zip.files)) {
          if (!zipEntry.dir) {
            files[path] = await zipEntry.async('string');
          }
        }

        if (cancelled) return;
        setPhase('installing');

        await sdk.embedProject(
          iframeRef.current!,
          {
            title: showcase.title,
            description: showcase.description ?? '',
            template: 'node',
            files,
          },
          {
            height: '100%',
            width: '100%',
            view: 'preview',
            hideNavigation: true,
            hideDevTools: true,
            terminalHeight: 0,
          },
        );

        if (!cancelled) {
          setPhase('starting');
          setTimeout(() => { if (!cancelled) setPhase('ready'); }, 5000);
        }
      } catch (err) {
        if (!cancelled) {
          setPhase('error');
          setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
        }
      }
    }

    boot();
    return () => { cancelled = true; };
  }, [showcase]);

  /*
   * position:fixed to escape all parent containers.
   * Sits below the navbar, covers full viewport width and remaining height.
   */
  return (
    <div
      style={{
        position: 'fixed',
        top: NAV_HEIGHT,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg)',
      }}
    >
      {/* ── Detail bar ── */}
      <div
        style={{
          minHeight: BAR_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 16px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          fontSize: 13,
          flexWrap: 'wrap',
        }}
      >
        <Link
          href="/gallery"
          style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-muted)', textDecoration: 'none' }}
        >
          <ArrowLeft size={14} />
        </Link>

        <div style={{ width: 1, height: 20, background: 'var(--color-border)' }} />

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 8px',
            borderRadius: 4,
            background: showcase.fileType === 'html' ? 'var(--color-primary-muted)' : 'var(--color-bg-alt)',
            color: showcase.fileType === 'html' ? 'var(--color-primary)' : 'var(--color-secondary)',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          <FileIcon size={12} weight="bold" />
          {typeLabel}
        </div>

        <span style={{ fontWeight: 600, color: 'var(--color-text-heading)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
          {showcase.title}
        </span>

        <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <User size={12} /> {showcase.userName}
        </span>
        <span style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>{date}</span>

        {showcase.skillIds.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            {showcase.skillIds.slice(0, 3).map((slug) => (
              <Link
                key={slug}
                href={`/skills/${slug}`}
                style={{ fontSize: 10, fontWeight: 500, padding: '1px 6px', borderRadius: 3, background: 'var(--color-bg-alt)', color: 'var(--color-secondary)', textDecoration: 'none' }}
              >
                {slug}
              </Link>
            ))}
            {showcase.skillIds.length > 3 && (
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>+{showcase.skillIds.length - 3}</span>
            )}
          </div>
        )}

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {deleteError && <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>{deleteError}</span>}

          {canDelete && !confirmDelete && (
            <button
              onClick={() => { setConfirmDelete(true); setDeleteError(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 4, border: '1px solid var(--color-danger)', background: 'transparent', color: 'var(--color-danger)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <Trash size={12} /> Delete
            </button>
          )}

          {canDelete && confirmDelete && (
            <>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Delete?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: 'var(--color-danger)', color: '#FFFFFF', fontSize: 12, fontWeight: 500, cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.6 : 1, fontFamily: 'inherit' }}
              >
                {deleting ? '...' : 'Yes'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: 'transparent', color: 'var(--color-text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                No
              </button>
            </>
          )}

          {/* Edit — owner only */}
          {isOwner && !editing && (
            <button
              onClick={handleStartEdit}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 4, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-body)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <PencilSimple size={12} /> Edit
            </button>
          )}

          {/* Share link */}
          <button
            onClick={handleShare}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 4, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: copied ? 'var(--color-success)' : 'var(--color-text-body)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {copied ? <><Check size={12} /> Copied!</> : <><LinkSimple size={12} /> Share</>}
          </button>

          {/* Fullscreen (HTML only — ZIP has no meaningful fullscreen view) */}
          {showcase.fileType !== 'zip' && (
            <button
              onClick={() => setIsFullscreen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 4, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-body)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <ArrowsOut size={12} /> Fullscreen
            </button>
          )}

          {/* Download */}
          <a
            href={showcase.blobUrl}
            download={showcase.fileName}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 4, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-body)', textDecoration: 'none', fontSize: 12, fontWeight: 500 }}
          >
            <DownloadSimple size={12} /> Download
          </a>
        </div>
      </div>

      {/* ── Edit form panel (slides down when editing) ── */}
      {editing && (
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text-body)', fontSize: 13, fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Optional description"
                style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text-body)', fontSize: 13, fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
            {/* Skills */}
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skills used</label>
              <SkillPicker
                available={availableSkills}
                selected={editSkills}
                onChange={setEditSkills}
              />
            </div>

            {/* Replace file */}
            <div>
              <input
                ref={editFileRef}
                type="file"
                accept=".html,.zip"
                style={{ display: 'none' }}
                onChange={(e) => { if (e.target.files?.[0]) setEditFile(e.target.files[0]); }}
              />
              <button
                onClick={() => editFileRef.current?.click()}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 4, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-body)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
              >
                <UploadSimple size={12} /> {editFile ? editFile.name : 'Replace file (optional)'}
              </button>
            </div>

            {/* Save / Cancel */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleSaveEdit}
                disabled={updating || !editTitle.trim()}
                style={{ padding: '6px 16px', borderRadius: 4, border: 'none', background: 'var(--color-primary)', color: '#FFFFFF', fontSize: 12, fontWeight: 600, cursor: updating ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: updating ? 0.6 : 1 }}
              >
                {updating ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setEditing(false)}
                disabled={updating}
                style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Full preview area ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {showcase.fileType === 'html' ? (
          <iframe
            src={showcase.blobUrl}
            title={showcase.title}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <>
            <div ref={iframeRef} style={{ width: '100%', height: '100%' }} />
            {phase !== 'ready' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-bg)',
                  zIndex: 10,
                }}
              >
                {phase === 'error' ? (
                  <>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-danger)', marginBottom: 8 }}>Failed to load preview</div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>{errorMsg}</div>
                    <a href={showcase.blobUrl} download={showcase.fileName} style={{ padding: '8px 16px', borderRadius: 6, background: 'var(--color-primary)', color: '#FFFFFF', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                      Download ZIP instead
                    </a>
                  </>
                ) : (
                  <>
                    <SpinnerGap size={32} weight="bold" style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite', marginBottom: 16 }} />
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-heading)', marginBottom: 4 }}>{PHASE_LABELS[phase]}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>This may take 20-30 seconds</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                      {(['fetching', 'extracting', 'installing', 'starting'] as const).map((p) => {
                        const phases = ['fetching', 'extracting', 'installing', 'starting'] as const;
                        const ci = phases.indexOf(phase as typeof phases[number]);
                        const ti = phases.indexOf(p);
                        return (
                          <div key={p} style={{ width: 8, height: 8, borderRadius: '50%', background: ti === ci ? 'var(--color-primary)' : ti < ci ? 'var(--color-success)' : 'var(--color-border)' }} />
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Fullscreen overlay (portaled to body to escape overflow context) ── */}
      {isFullscreen && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'var(--color-bg)',
          }}
        >
          {showcase.fileType === 'html' ? (
            <iframe
              src={showcase.blobUrl}
              title={showcase.title}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: 14 }}>
              Fullscreen preview is available for HTML showcases. Use the embedded viewer below.
            </div>
          )}
          <button
            onClick={() => setIsFullscreen(false)}
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 10000,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-body)',
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: 'inherit',
            }}
          >
            <ArrowsIn size={14} /> Exit fullscreen
          </button>
        </div>,
        document.body,
      )}
    </div>
  );
}
