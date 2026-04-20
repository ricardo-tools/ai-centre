'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ShareNetwork,
  UserCircle,
  Link as LinkIcon,
  Trash,
  Copy,
  Plus,
  X,
  SpinnerGap,
  Check,
  Crown,
} from '@phosphor-icons/react';
import { VisibilitySelector, type Visibility } from './VisibilitySelector';
import { PermissionCheckbox } from './PermissionCheckbox';

// ── Types ────────────────────────────────────────────────────────────

interface ShareEntry {
  id: string;
  granteeType: 'user' | 'link';
  granteeId: string;
  canView: boolean;
  canDownload: boolean;
  canShare: boolean;
  expiresAt: string | null;
  createdAt: string;
}

interface ShareModalProps {
  resourceType: 'showcase' | 'skill';
  resourceId: string;
  isOpen: boolean;
  onClose: () => void;
  isOwner?: boolean;
  currentVisibility?: Visibility;
  onVisibilityChange?: (v: Visibility) => void;
}

// ── Constants ───────────────────────────────────────────────────────

const EXPIRY_OPTIONS = [
  { label: '1 day', hours: 24 },
  { label: '7 days', hours: 168 },
  { label: '30 days', hours: 720 },
  { label: 'Never', hours: 0 },
] as const;

const inputStyle: React.CSSProperties = {
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg)',
  color: 'var(--color-text-body)',
  fontSize: 13,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 10,
  marginTop: 0,
};

// ── Component ───────────────────────────────────────────────────────

export function ShareModal({
  resourceType,
  resourceId,
  isOpen,
  onClose,
  isOwner = true,
  currentVisibility = 'public',
  onVisibilityChange,
}: ShareModalProps) {
  const [shares, setShares] = useState<ShareEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState<Visibility>(currentVisibility);

  // Add person
  const [email, setEmail] = useState('');
  const [addCanDownload, setAddCanDownload] = useState(false);
  const [addCanShare, setAddCanShare] = useState(false);
  const [adding, setAdding] = useState(false);

  // Create link
  const [linkCanDownload, setLinkCanDownload] = useState(false);
  const [linkCanShare, setLinkCanShare] = useState(false);
  const [linkExpiry, setLinkExpiry] = useState(168);
  const [creatingLink, setCreatingLink] = useState(false);
  const [createdLinkUrl, setCreatedLinkUrl] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Sync visibility from prop
  useEffect(() => { setVisibility(currentVisibility); }, [currentVisibility]);

  // ── Fetch shares ──────────────────────────────────────────────────

  const fetchShares = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shares?resourceType=${resourceType}&resourceId=${resourceId}`);
      if (res.ok) {
        const data = await res.json();
        setShares(data.shares ?? []);
      }
    } catch { /* empty */ }
    setLoading(false);
  }, [resourceType, resourceId]);

  useEffect(() => {
    if (isOpen) {
      fetchShares();
      setCreatedLinkUrl(null);
      setLinkCopied(false);
    }
  }, [isOpen, fetchShares]);

  // ── Visibility change ─────────────────────────────────────────────

  const handleVisibilityChange = useCallback(async (v: Visibility) => {
    setVisibility(v);
    onVisibilityChange?.(v);
    try {
      await fetch('/api/shares/visibility', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceType, resourceId, visibility: v }),
      });
    } catch { /* silent */ }
  }, [resourceType, resourceId, onVisibilityChange]);

  // ── Add person ────────────────────────────────────────────────────

  const handleAddPerson = useCallback(async () => {
    if (!email.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceType, resourceId,
          granteeUserId: email.trim(),
          canView: true, canDownload: addCanDownload, canShare: addCanShare,
        }),
      });
      if (res.ok) {
        setEmail('');
        setAddCanDownload(false);
        setAddCanShare(false);
        await fetchShares();
      }
    } catch { /* silent */ }
    setAdding(false);
  }, [email, addCanDownload, addCanShare, resourceType, resourceId, fetchShares]);

  // ── Update permission inline ──────────────────────────────────────

  const handleUpdatePermission = useCallback(async (
    granteeId: string,
    field: 'canView' | 'canDownload' | 'canShare',
    value: boolean,
  ) => {
    setUpdatingId(granteeId);
    // Optimistic update
    setShares(prev => prev.map(s =>
      s.granteeId === granteeId && s.granteeType === 'user'
        ? { ...s, [field]: value }
        : s
    ));
    try {
      const share = shares.find(s => s.granteeId === granteeId && s.granteeType === 'user');
      if (share) {
        await fetch('/api/shares', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resourceType, resourceId,
            granteeUserId: granteeId,
            canView: field === 'canView' ? value : share.canView,
            canDownload: field === 'canDownload' ? value : share.canDownload,
            canShare: field === 'canShare' ? value : share.canShare,
          }),
        });
      }
    } catch { /* silent */ }
    setUpdatingId(null);
  }, [resourceType, resourceId, shares]);

  // ── Revoke ────────────────────────────────────────────────────────

  const handleRevoke = useCallback(async (granteeId: string, type: 'user' | 'link', shareId: string) => {
    setUpdatingId(shareId);
    try {
      if (type === 'user') {
        await fetch('/api/shares', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resourceType, resourceId, granteeUserId: granteeId }),
        });
      } else {
        await fetch('/api/shares/link', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shareId }),
        });
      }
      await fetchShares();
    } catch { /* silent */ }
    setUpdatingId(null);
  }, [resourceType, resourceId, fetchShares]);

  // ── Create link ───────────────────────────────────────────────────

  const handleCreateLink = useCallback(async () => {
    setCreatingLink(true);
    setCreatedLinkUrl(null);
    try {
      const res = await fetch('/api/shares/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceType, resourceId,
          canView: true, canDownload: linkCanDownload, canShare: linkCanShare,
          expiresInHours: linkExpiry || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCreatedLinkUrl(`${window.location.origin}/shared?token=${data.token}`);
        await fetchShares();
      }
    } catch { /* silent */ }
    setCreatingLink(false);
  }, [resourceType, resourceId, linkCanDownload, linkCanShare, linkExpiry, fetchShares]);

  const handleCopyLink = useCallback((url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }, []);

  // ── Render ────────────────────────────────────────────────────────

  if (!isOpen) return null;

  const userShares = shares.filter(s => s.granteeType === 'user');
  const linkShares = shares.filter(s => s.granteeType === 'link');
  const canManage = isOwner;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9000 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '100%', maxWidth: 540, maxHeight: '85vh', overflowY: 'auto',
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
        zIndex: 9001, padding: 24, display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShareNetwork size={20} weight="bold" style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-heading)' }}>
              Share {resourceType === 'showcase' ? 'Showcase' : 'Skill'}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-muted)', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {/* Visibility (owner only) */}
        {canManage && (
          <div>
            <h4 style={sectionTitleStyle}>Visibility</h4>
            <VisibilitySelector value={visibility} onChange={handleVisibilityChange} />
          </div>
        )}

        {/* People with access */}
        <div>
          <h4 style={sectionTitleStyle}>
            <UserCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            People with access
          </h4>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 12 }}>
              <SpinnerGap size={14} style={{ animation: 'spin 1s linear infinite' }} /> Loading...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Owner row */}
              {canManage && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
                  borderRadius: 6, background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                }}>
                  <Crown size={16} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--color-text-body)', flex: 1 }}>You (owner)</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)' }}>Full access</span>
                </div>
              )}
              {userShares.length === 0 && (
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
                  No one else has access yet.
                </p>
              )}
              {userShares.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
                  borderRadius: 6, background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                }}>
                  <UserCircle size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--color-text-body)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                    {s.granteeId}
                  </span>
                  {canManage ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                      <PermissionCheckbox label="View" checked={s.canView} onChange={v => handleUpdatePermission(s.granteeId, 'canView', v)} disabled={updatingId === s.granteeId} />
                      <PermissionCheckbox label="Download" checked={s.canDownload} onChange={v => handleUpdatePermission(s.granteeId, 'canDownload', v)} disabled={updatingId === s.granteeId} />
                      <PermissionCheckbox label="Reshare" checked={s.canShare} onChange={v => handleUpdatePermission(s.granteeId, 'canShare', v)} disabled={updatingId === s.granteeId} />
                      <button
                        onClick={() => handleRevoke(s.granteeId, 'user', s.id)}
                        disabled={updatingId === s.id}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-danger)', display: 'flex', flexShrink: 0 }}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      <PermBadge label="View" active={s.canView} />
                      <PermBadge label="DL" active={s.canDownload} />
                      <PermBadge label="Share" active={s.canShare} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add person */}
        <div>
          <h4 style={sectionTitleStyle}>
            <Plus size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Add person
          </h4>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email or user ID"
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={e => { if (e.key === 'Enter') handleAddPerson(); }}
            />
            <button
              onClick={handleAddPerson}
              disabled={adding || !email.trim()}
              style={{
                padding: '8px 16px', borderRadius: 6, border: 'none',
                background: adding || !email.trim() ? 'var(--color-text-muted)' : 'var(--color-primary)',
                color: '#FFFFFF', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                cursor: adding || !email.trim() ? 'not-allowed' : 'pointer',
                opacity: adding || !email.trim() ? 0.5 : 1,
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              {adding ? <SpinnerGap size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />}
              Add
            </button>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <PermissionCheckbox label="Can view" checked disabled onChange={() => {}} />
            <PermissionCheckbox label="Can download" checked={addCanDownload} onChange={setAddCanDownload} />
            <PermissionCheckbox label="Can reshare" checked={addCanShare} onChange={setAddCanShare} />
          </div>
        </div>

        {/* Share links */}
        <div>
          <h4 style={sectionTitleStyle}>
            <LinkIcon size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Share links
          </h4>
          {linkShares.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 8px' }}>
              No share links created yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {linkShares.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
                  borderRadius: 6, background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                }}>
                  <LinkIcon size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: 'var(--color-text-body)' }}>
                      Link created {new Date(s.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                      {s.expiresAt ? `Expires ${new Date(s.expiresAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'No expiry'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <PermBadge label="View" active={s.canView} />
                    <PermBadge label="DL" active={s.canDownload} />
                    <PermBadge label="Share" active={s.canShare} />
                  </div>
                  {canManage && (
                    <>
                      <button
                        onClick={() => handleCopyLink(`${window.location.origin}/shared?token=${s.granteeId}`)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-primary)', display: 'flex', flexShrink: 0 }}
                        title="Copy link URL"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => handleRevoke(s.granteeId, 'link', s.id)}
                        disabled={updatingId === s.id}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-danger)', display: 'flex', opacity: updatingId === s.id ? 0.5 : 1, flexShrink: 0 }}
                      >
                        <Trash size={14} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create share link (owner only) */}
        {canManage && (
          <div>
            <h4 style={sectionTitleStyle}>Create share link</h4>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <PermissionCheckbox label="Can view" checked disabled onChange={() => {}} />
                <PermissionCheckbox label="Can download" checked={linkCanDownload} onChange={setLinkCanDownload} />
                <PermissionCheckbox label="Can reshare" checked={linkCanShare} onChange={setLinkCanShare} />
              </div>
              <select
                value={linkExpiry}
                onChange={e => setLinkExpiry(Number(e.target.value))}
                style={{ ...inputStyle, padding: '6px 10px' }}
              >
                {EXPIRY_OPTIONS.map(opt => (
                  <option key={opt.hours} value={opt.hours}>{opt.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleCreateLink}
              disabled={creatingLink}
              style={{
                padding: '8px 16px', borderRadius: 6, border: '1px solid var(--color-border)',
                background: 'var(--color-surface)', color: 'var(--color-text-body)',
                fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                cursor: creatingLink ? 'not-allowed' : 'pointer', opacity: creatingLink ? 0.5 : 1,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {creatingLink ? <SpinnerGap size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <LinkIcon size={14} />}
              Create link
            </button>
            {createdLinkUrl && (
              <div style={{
                marginTop: 10, display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 6, background: 'var(--color-bg)', border: '1px solid var(--color-border)',
              }}>
                <input
                  type="text" value={createdLinkUrl} readOnly
                  style={{ ...inputStyle, flex: 1, border: 'none', background: 'transparent', padding: 0, fontSize: 12, color: 'var(--color-text-muted)' }}
                  onClick={e => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={() => handleCopyLink(createdLinkUrl)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    color: linkCopied ? 'var(--color-success)' : 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit', flexShrink: 0,
                  }}
                >
                  {linkCopied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────

function PermBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 3,
      background: active ? 'var(--color-primary-muted)' : 'var(--color-bg-alt)',
      color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
    }}>
      {label}
    </span>
  );
}
