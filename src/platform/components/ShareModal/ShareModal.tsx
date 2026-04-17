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
} from '@phosphor-icons/react';

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
}

// ── Helpers ──────────────────────────────────────────────────────────

const EXPIRY_OPTIONS = [
  { label: '1 day', hours: 24 },
  { label: '7 days', hours: 168 },
  { label: '30 days', hours: 720 },
  { label: 'Never', hours: 0 },
] as const;

function PermBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: '2px 6px',
        borderRadius: 3,
        background: active ? 'var(--color-primary-muted)' : 'var(--color-bg-alt)',
        color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
      }}
    >
      {label}
    </span>
  );
}

// ── Component ────────────────────────────────────────────────────────

export function ShareModal({ resourceType, resourceId, isOpen, onClose }: ShareModalProps) {
  const [shares, setShares] = useState<ShareEntry[]>([]);
  const [loading, setLoading] = useState(false);

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

  // Revoking state
  const [revokingId, setRevokingId] = useState<string | null>(null);

  // ── Fetch shares ───────────────────────────────────────────────────

  const fetchShares = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/shares?resourceType=${resourceType}&resourceId=${resourceId}`,
      );
      if (res.ok) {
        const data = await res.json();
        setShares(data.shares ?? []);
      }
    } catch {
      // silently fail — user will see empty list
    }
    setLoading(false);
  }, [resourceType, resourceId]);

  useEffect(() => {
    if (isOpen) {
      fetchShares();
      setCreatedLinkUrl(null);
      setLinkCopied(false);
    }
  }, [isOpen, fetchShares]);

  // ── Add person ─────────────────────────────────────────────────────

  const handleAddPerson = useCallback(async () => {
    if (!email.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceType,
          resourceId,
          granteeUserId: email.trim(),
          canView: true,
          canDownload: addCanDownload,
          canShare: addCanShare,
        }),
      });
      if (res.ok) {
        setEmail('');
        setAddCanDownload(false);
        setAddCanShare(false);
        await fetchShares();
      }
    } catch {
      // silent
    }
    setAdding(false);
  }, [email, addCanDownload, addCanShare, resourceType, resourceId, fetchShares]);

  // ── Revoke user ────────────────────────────────────────────────────

  const handleRevokeUser = useCallback(async (granteeId: string) => {
    setRevokingId(granteeId);
    try {
      await fetch('/api/shares', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceType, resourceId, granteeUserId: granteeId }),
      });
      await fetchShares();
    } catch {
      // silent
    }
    setRevokingId(null);
  }, [resourceType, resourceId, fetchShares]);

  // ── Revoke link ────────────────────────────────────────────────────

  const handleRevokeLink = useCallback(async (shareId: string) => {
    setRevokingId(shareId);
    try {
      await fetch('/api/shares/link', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareId }),
      });
      await fetchShares();
    } catch {
      // silent
    }
    setRevokingId(null);
  }, [fetchShares]);

  // ── Create link ────────────────────────────────────────────────────

  const handleCreateLink = useCallback(async () => {
    setCreatingLink(true);
    setCreatedLinkUrl(null);
    try {
      const res = await fetch('/api/shares/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceType,
          resourceId,
          canView: true,
          canDownload: linkCanDownload,
          canShare: linkCanShare,
          expiresInHours: linkExpiry || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const url = `${window.location.origin}/shared?token=${data.token}`;
        setCreatedLinkUrl(url);
        await fetchShares();
      }
    } catch {
      // silent
    }
    setCreatingLink(false);
  }, [resourceType, resourceId, linkCanDownload, linkCanShare, linkExpiry, fetchShares]);

  const handleCopyLink = useCallback(() => {
    if (!createdLinkUrl) return;
    navigator.clipboard.writeText(createdLinkUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }, [createdLinkUrl]);

  // ── Render ─────────────────────────────────────────────────────────

  if (!isOpen) return null;

  const userShares = shares.filter((s) => s.granteeType === 'user');
  const linkShares = shares.filter((s) => s.granteeType === 'link');

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

  const checkboxRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'var(--color-text-body)',
    cursor: 'pointer',
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

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9000,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 520,
          maxHeight: '85vh',
          overflowY: 'auto',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 16,
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
          zIndex: 9001,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShareNetwork size={20} weight="bold" style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-heading)' }}>
              Share {resourceType === 'showcase' ? 'Showcase' : 'Skill'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: 'var(--color-text-muted)',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── People with access ── */}
        <div>
          <h4 style={sectionTitleStyle}>
            <UserCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            People with access
          </h4>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 12 }}>
              <SpinnerGap size={14} style={{ animation: 'spin 1s linear infinite' }} /> Loading...
            </div>
          ) : userShares.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
              No one else has access yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {userShares.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 8px',
                    borderRadius: 6,
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <UserCircle size={18} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--color-text-body)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.granteeId}
                  </span>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <PermBadge label="View" active={s.canView} />
                    <PermBadge label="Download" active={s.canDownload} />
                    <PermBadge label="Share" active={s.canShare} />
                  </div>
                  <button
                    onClick={() => handleRevokeUser(s.granteeId)}
                    disabled={revokingId === s.granteeId}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: revokingId === s.granteeId ? 'not-allowed' : 'pointer',
                      padding: 4,
                      color: 'var(--color-danger)',
                      display: 'flex',
                      opacity: revokingId === s.granteeId ? 0.5 : 1,
                      flexShrink: 0,
                    }}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Add person ── */}
        <div>
          <h4 style={sectionTitleStyle}>
            <Plus size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Add person
          </h4>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or user ID"
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddPerson(); }}
            />
            <button
              onClick={handleAddPerson}
              disabled={adding || !email.trim()}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: 'none',
                background: adding || !email.trim() ? 'var(--color-text-muted)' : 'var(--color-primary)',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: adding || !email.trim() ? 'not-allowed' : 'pointer',
                opacity: adding || !email.trim() ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {adding ? <SpinnerGap size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />}
              Add
            </button>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <label style={checkboxRowStyle}>
              <input type="checkbox" checked disabled style={{ accentColor: 'var(--color-primary)' }} />
              Can view
            </label>
            <label style={checkboxRowStyle}>
              <input
                type="checkbox"
                checked={addCanDownload}
                onChange={(e) => setAddCanDownload(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              Can download
            </label>
            <label style={checkboxRowStyle}>
              <input
                type="checkbox"
                checked={addCanShare}
                onChange={(e) => setAddCanShare(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              Can reshare
            </label>
          </div>
        </div>

        {/* ── Share links ── */}
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
              {linkShares.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 8px',
                    borderRadius: 6,
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                  }}
                >
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
                  </div>
                  <button
                    onClick={() => handleRevokeLink(s.id)}
                    disabled={revokingId === s.id}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: revokingId === s.id ? 'not-allowed' : 'pointer',
                      padding: 4,
                      color: 'var(--color-danger)',
                      display: 'flex',
                      opacity: revokingId === s.id ? 0.5 : 1,
                      flexShrink: 0,
                    }}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Create share link ── */}
        <div>
          <h4 style={sectionTitleStyle}>Create share link</h4>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <label style={checkboxRowStyle}>
                <input type="checkbox" checked disabled style={{ accentColor: 'var(--color-primary)' }} />
                Can view
              </label>
              <label style={checkboxRowStyle}>
                <input
                  type="checkbox"
                  checked={linkCanDownload}
                  onChange={(e) => setLinkCanDownload(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                Can download
              </label>
              <label style={checkboxRowStyle}>
                <input
                  type="checkbox"
                  checked={linkCanShare}
                  onChange={(e) => setLinkCanShare(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                Can reshare
              </label>
            </div>
            <select
              value={linkExpiry}
              onChange={(e) => setLinkExpiry(Number(e.target.value))}
              style={{
                ...inputStyle,
                padding: '6px 10px',
              }}
            >
              {EXPIRY_OPTIONS.map((opt) => (
                <option key={opt.hours} value={opt.hours}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreateLink}
            disabled={creatingLink}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-body)',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: creatingLink ? 'not-allowed' : 'pointer',
              opacity: creatingLink ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {creatingLink ? <SpinnerGap size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <LinkIcon size={14} />}
            Create link
          </button>

          {/* Created link URL */}
          {createdLinkUrl && (
            <div
              style={{
                marginTop: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 10px',
                borderRadius: 6,
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
              }}
            >
              <input
                type="text"
                value={createdLinkUrl}
                readOnly
                style={{
                  ...inputStyle,
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  fontSize: 12,
                  color: 'var(--color-text-muted)',
                }}
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                onClick={handleCopyLink}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  color: linkCopied ? 'var(--color-success)' : 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  flexShrink: 0,
                }}
              >
                {linkCopied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
