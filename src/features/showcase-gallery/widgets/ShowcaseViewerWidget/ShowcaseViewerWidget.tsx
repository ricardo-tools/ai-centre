'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowsOut, ArrowsIn, DownloadSimple, User, FileHtml, FileZip, SpinnerGap, Trash, LinkSimple, PencilSimple, Check, X, UploadSimple, WarningCircle } from '@phosphor-icons/react';

import type { RawShowcaseUpload } from '@/features/showcase-gallery/action';
import { deleteShowcase, updateShowcase, getSignedShowcaseUrl, retryDeploy } from '@/features/showcase-gallery/action';
import { useDeployPolling } from '@/features/showcase-gallery/hooks/useDeployPolling';
import { toggleReaction, getReactionCounts } from '@/features/social/reactions-action';
import { trackShowcaseView, getShowcaseViewCount } from '@/features/social/action';
import { toggleBookmark, isBookmarked as checkIsBookmarked } from '@/features/social/bookmarks-action';
import { useSession } from '@/platform/lib/SessionContext';
import { SkillPicker } from '@/platform/components/SkillPicker';
import { ReactionBar } from '@/platform/components/ReactionBar';
import { BookmarkButton } from '@/platform/components/BookmarkButton';
import { CommentThread } from '@/platform/components/CommentThread';
import { Eye, ChatCircle } from '@phosphor-icons/react';

/** Convert a blob URL to an authenticated proxy URL for private Vercel Blob storage. */
function blobProxy(url: string): string {
  if (!url || url.startsWith('file://') || url.startsWith('/')) return url;
  return `/api/blob?url=${encodeURIComponent(url)}`;
}

interface ShowcaseViewerWidgetProps {
  showcase: RawShowcaseUpload;
  signedDeployUrl?: string | null;
}


const NAV_HEIGHT = 56;
const BAR_HEIGHT = 44;

const DEPLOY_STEPS = [
  { key: 'queued', label: 'Queued', matches: ['QUEUED'] },
  { key: 'initializing', label: 'Installing dependencies', matches: ['INITIALIZING'] },
  { key: 'building', label: 'Building project', matches: ['BUILDING'] },
  { key: 'deploying', label: 'Deploying to edge', matches: ['READY'] },
] as const;

function DeployStepIndicator({ step, deployStatus }: { step: string | null; deployStatus: string }) {
  const activeIdx = step
    ? DEPLOY_STEPS.findIndex(s => (s.matches as readonly string[]).includes(step))
    : deployStatus === 'pending' ? -1 : 0;

  return (
    <>
      {DEPLOY_STEPS.map((s, i) => {
        const isDone = i < activeIdx || (step === 'READY');
        const isActive = i === activeIdx && step !== 'READY';
        return (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: isDone ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : 'var(--color-border)',
              boxShadow: isActive ? '0 0 0 3px var(--color-primary-muted)' : undefined,
            }} />
            <span style={{
              color: isDone ? 'var(--color-success)' : isActive ? 'var(--color-text-heading)' : 'var(--color-text-muted)',
              fontWeight: isActive ? 600 : 400,
            }}>
              {s.label}{isDone ? ' \u2713' : isActive ? '...' : ''}
            </span>
          </div>
        );
      })}
    </>
  );
}

export function ShowcaseViewerWidget({ showcase, signedDeployUrl }: ShowcaseViewerWidgetProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Deploy status polling for ZIP projects
  const { deployStatus, deployUrl: polledDeployUrl, deployError, deployStep, resetStatus } = useDeployPolling(
    showcase.id,
    showcase.deployStatus,
    showcase.deployUrl,
  );

  // Retry deploy state
  const [retrying, setRetrying] = useState(false);

  // Track the signed deploy URL — starts from prop, updated when polling detects ready
  const [resolvedSignedUrl, setResolvedSignedUrl] = useState(signedDeployUrl ?? null);

  // When deploy transitions to ready, fetch a signed URL for the iframe
  useEffect(() => {
    if (deployStatus === 'ready' && polledDeployUrl && !resolvedSignedUrl) {
      getSignedShowcaseUrl(showcase.id).then((url) => {
        if (url) setResolvedSignedUrl(url);
      });
    }
  }, [deployStatus, polledDeployUrl, resolvedSignedUrl, showcase.id]);

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
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [viewCount, setViewCount] = useState<number>(0);
  const [showComments, setShowComments] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Track view and fetch view count on mount
  useEffect(() => {
    trackShowcaseView(showcase.id);
    getShowcaseViewCount(showcase.id).then(setViewCount);
  }, [showcase.id]);

  // Fetch reaction counts on mount
  useEffect(() => {
    getReactionCounts('showcase', showcase.id, session?.userId).then(({ counts, userReactions: ur }) => {
      setReactionCounts(counts);
      setUserReactions(ur);
    });
  }, [showcase.id, session?.userId]);

  const handleToggleReaction = useCallback(
    async (emoji: string): Promise<{ added: boolean } | null> => {
      if (!session) return null;
      const result = await toggleReaction('showcase', showcase.id, emoji, session.userId);
      if (result.ok) return result.value;
      return null;
    },
    [session, showcase.id],
  );

  // Fetch bookmark state on mount
  useEffect(() => {
    if (session?.userId) {
      checkIsBookmarked(session.userId, 'showcase', showcase.id).then(setBookmarked);
    }
  }, [showcase.id, session?.userId]);

  const handleToggleBookmark = useCallback(async (): Promise<{ bookmarked: boolean } | null> => {
    if (!session) return null;
    const result = await toggleBookmark('showcase', showcase.id, session.userId);
    if (result.ok) {
      setBookmarked(result.value.bookmarked);
      return result.value;
    }
    return null;
  }, [session, showcase.id]);

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

  const handleRetryDeploy = useCallback(async () => {
    setRetrying(true);
    try {
      const result = await retryDeploy(showcase.id);
      if (result.ok) {
        console.info('[showcase-viewer] retryDeploy succeeded, restarting polling');
        resetStatus('pending');
      } else {
        console.error('[showcase-viewer] retryDeploy failed:', result.error.message);
      }
    } catch (err) {
      console.error('[showcase-viewer] retryDeploy error:', err);
    }
    setRetrying(false);
  }, [showcase.id, resetStatus]);

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
        zIndex: 300, /* --z-fixed */
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

        <Link href={`/profile/${showcase.userId}`} style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, textDecoration: 'none' }}>
          <User size={12} /> {showcase.userName}
        </Link>
        <span style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>{date}</span>
        {viewCount > 0 && (
          <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0, fontSize: 12 }}>
            <Eye size={12} /> {viewCount}
          </span>
        )}

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

          {/* Comments toggle */}
          <button
            onClick={() => setShowComments((v) => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 4, border: '1px solid var(--color-border)', background: showComments ? 'var(--color-primary-muted)' : 'var(--color-surface)', color: showComments ? 'var(--color-primary)' : 'var(--color-text-body)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <ChatCircle size={12} weight={showComments ? 'fill' : 'regular'} /> Comments
          </button>

          {/* Bookmark */}
          {session && (
            <BookmarkButton
              isBookmarked={bookmarked}
              onToggle={handleToggleBookmark}
              size={14}
            />
          )}

          {/* Share link */}
          <button
            onClick={handleShare}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 4, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: copied ? 'var(--color-success)' : 'var(--color-text-body)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {copied ? <><Check size={12} /> Copied!</> : <><LinkSimple size={12} /> Share</>}
          </button>

          {/* Fullscreen — available for HTML and deployed ZIP */}
          <button
            onClick={() => setIsFullscreen(true)}
            disabled={showcase.fileType === 'zip' && !resolvedSignedUrl}
            style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 4,
              border: '1px solid var(--color-border)', background: 'var(--color-surface)',
              color: (showcase.fileType === 'zip' && !resolvedSignedUrl) ? 'var(--color-text-muted)' : 'var(--color-text-body)',
              fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
              cursor: (showcase.fileType === 'zip' && !resolvedSignedUrl) ? 'not-allowed' : 'pointer',
              opacity: (showcase.fileType === 'zip' && !resolvedSignedUrl) ? 0.5 : 1,
            }}
          >
            <ArrowsOut size={12} /> Fullscreen
          </button>

          {/* Download */}
          <a
            href={blobProxy(showcase.blobUrl)}
            download={showcase.fileName}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 4, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-body)', textDecoration: 'none', fontSize: 12, fontWeight: 500 }}
          >
            <DownloadSimple size={12} /> Download
          </a>
        </div>
      </div>

      {/* ── Reaction bar ── */}
      <div
        style={{
          padding: '6px 16px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
        }}
      >
        <ReactionBar
          entityType="showcase"
          entityId={showcase.id}
          initialCounts={reactionCounts}
          initialUserReactions={userReactions}
          onToggle={handleToggleReaction}
        />
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
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex' }}>
        {/* Comments slide-out panel */}
        {showComments && (
          <div
            style={{
              width: 380,
              maxWidth: '100%',
              borderRight: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              overflowY: 'auto',
              padding: '20px 16px',
              flexShrink: 0,
            }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginTop: 0, marginBottom: 16 }}>
              Comments
            </h3>
            <CommentThread
              entityType="showcase"
              entityId={showcase.id}
              currentUserId={session?.userId}
              isAdmin={session?.roleSlug === 'admin'}
            />
          </div>
        )}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {showcase.fileType === 'html' ? (
          <iframe
            src={blobProxy(showcase.blobUrl)}
            title={showcase.title}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            sandbox="allow-scripts allow-same-origin"
          />
        ) : resolvedSignedUrl ? (
          <iframe
            src={resolvedSignedUrl}
            title={showcase.title}
            data-testid="showcase-preview-iframe"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        ) : (deployStatus === 'pending' || deployStatus === 'building') ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              background: 'var(--color-bg)',
            }}
            data-testid="deploy-status-message"
          >
            <style>{`@keyframes deploy-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <SpinnerGap
              size={32}
              weight="bold"
              style={{ color: 'var(--color-primary)', animation: 'deploy-spin 1s linear infinite', marginBottom: 16 }}
              data-testid="deploy-spinner"
            />
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>
              Deploying your project...
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 12 }}>
              This usually takes 30{'\u2013'}60 seconds
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
              <DeployStepIndicator step={deployStep} deployStatus={deployStatus} />
            </div>
          </div>
        ) : deployStatus === 'failed' ? (
          <div
            data-testid="deploy-failed"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              background: 'var(--color-bg)',
              gap: 8,
            }}
          >
            <WarningCircle size={32} weight="bold" style={{ color: 'var(--color-danger)', marginBottom: 8 }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)' }}>
              Deploy failed
            </div>
            <div
              data-testid="deploy-error-message"
              style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 500, textAlign: 'center' }}
            >
              {deployError ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span>Build failed. You can retry or download the ZIP to run locally.</span>
                  <code style={{
                    display: 'block',
                    padding: '8px 12px',
                    borderRadius: 4,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    fontSize: 11,
                    fontFamily: 'monospace',
                    textAlign: 'left',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: 120,
                    overflow: 'auto',
                    color: 'var(--color-danger)',
                  }}>{deployError}</code>
                </div>
              ) : (
                'Something went wrong while deploying this project. You can retry the deployment or download the ZIP to run it locally.'
              )}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button
                data-testid="deploy-retry-btn"
                onClick={handleRetryDeploy}
                disabled={retrying}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 20px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: retrying ? 'not-allowed' : 'pointer',
                  opacity: retrying ? 0.6 : 1,
                  fontFamily: 'inherit',
                }}
              >
                {retrying && (
                  <SpinnerGap
                    size={14}
                    weight="bold"
                    style={{ animation: 'deploy-spin 1s linear infinite' }}
                  />
                )}
                {retrying ? 'Retrying...' : 'Retry Deploy'}
              </button>
              <a
                data-testid="deploy-download-fallback"
                href={blobProxy(showcase.blobUrl)}
                download={showcase.fileName}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 20px',
                  borderRadius: 6,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-body)',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                }}
              >
                <DownloadSimple size={14} />
                Download ZIP instead
              </a>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              background: 'var(--color-bg)',
              gap: 8,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)' }}>
              No preview available
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              This project has not been deployed yet.
            </div>
            <a
              href={blobProxy(showcase.blobUrl)}
              download={showcase.fileName}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 12,
                padding: '8px 20px',
                borderRadius: 6,
                background: 'var(--color-primary)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <DownloadSimple size={14} />
              Download ZIP
            </a>
          </div>
        )}
      </div>
      </div>

      {/* ── Fullscreen overlay (portaled to body to escape overflow context) ── */}
      {isFullscreen && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999, /* --z-fullscreen */
            background: 'var(--color-bg)',
          }}
        >
          {showcase.fileType === 'html' ? (
            <iframe
              src={blobProxy(showcase.blobUrl)}
              title={showcase.title}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              sandbox="allow-scripts allow-same-origin"
            />
          ) : resolvedSignedUrl ? (
            <iframe
              src={resolvedSignedUrl}
              title={showcase.title}
              data-testid="showcase-fullscreen-iframe"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: 14 }}>
              No preview available
            </div>
          )}
          <button
            onClick={() => setIsFullscreen(false)}
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 10000, /* --z-fullscreen + 1 (exit button above fullscreen) */
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
