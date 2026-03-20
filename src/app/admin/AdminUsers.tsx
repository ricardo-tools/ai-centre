'use client';

import { useState, useEffect, useCallback } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { UserListWidget } from '@/features/user-management/widgets/UserListWidget/UserListWidget';
import { useRoles, type RawRole } from '@/features/role-management/useRoles';
import { useBreakpoint } from '@/platform/screen-renderer/useBreakpoint';

/** Raw invitation shape from the server action */
interface RawInvitation {
  id: string;
  email: string;
  roleId: string;
  roleName: string;
  inviterName: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export function AdminUsers() {
  const { roles } = useRoles();
  const size = useBreakpoint();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [invitations, setInvitations] = useState<RawInvitation[]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  const loadInvitations = useCallback(async () => {
    try {
      const { fetchInvitations } = await import('@/features/user-management/invite-action');
      const result = await fetchInvitations();
      if (result.ok) {
        setInvitations(result.value as RawInvitation[]);
      }
    } catch {
      // Invite actions may not exist yet - gracefully ignore
    }
  }, []);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  const handleInvite = async (email: string, roleId: string) => {
    setInviteLoading(true);
    setInviteError(null);
    try {
      const { inviteUser } = await import('@/features/user-management/invite-action');
      const result = await inviteUser(email, roleId);
      if (result.ok) {
        setShowInviteForm(false);
        setInviteSuccess('Invitation sent');
        setTimeout(() => setInviteSuccess(null), 2000);
        await loadInvitations();
      } else {
        setInviteError(result.error.message);
      }
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'Failed to send invitation');
    }
    setInviteLoading(false);
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const { cancelInvitation } = await import('@/features/user-management/invite-action');
      const result = await cancelInvitation(invitationId);
      if (result.ok) {
        await loadInvitations();
      }
    } catch {
      // Gracefully ignore
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      const { resendInvitation } = await import('@/features/user-management/invite-action');
      await resendInvitation(invitationId);
    } catch {
      // Gracefully ignore
    }
  };

  const pendingInvitations = invitations.filter((inv) => inv.status === 'pending');

  return (
    <section>
      {/* Header with invite button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)' }}>
          Users
        </h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {inviteSuccess && (
            <span style={{ fontSize: 13, color: 'var(--color-success)', fontWeight: 500 }}>
              {inviteSuccess}
            </span>
          )}
          {!showInviteForm && (
            <button
              onClick={() => setShowInviteForm(true)}
              style={{
                fontSize: 13,
                fontWeight: 500,
                padding: '6px 16px',
                borderRadius: 6,
                border: 'none',
                background: 'var(--color-primary)',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Invite User
            </button>
          )}
        </div>
      </div>

      {/* Invite form */}
      {showInviteForm && (
        <InviteForm
          roles={roles}
          onSubmit={handleInvite}
          onCancel={() => { setShowInviteForm(false); setInviteError(null); }}
          loading={inviteLoading}
          error={inviteError}
        />
      )}

      {/* Pending invitations */}
      {pendingInvitations.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Pending Invitations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pendingInvitations.map((inv) => (
              <div
                key={inv.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-heading)' }}>
                    {inv.email}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'var(--color-bg-alt)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {inv.roleName}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    Invited by {inv.inviterName}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleResendInvitation(inv.id)}
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      padding: '4px 10px',
                      borderRadius: 4,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      color: 'var(--color-text-body)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Resend
                  </button>
                  <button
                    onClick={() => handleCancelInvitation(inv.id)}
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      padding: '4px 10px',
                      borderRadius: 4,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      color: 'var(--color-danger)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User list */}
      <UserListWidget size={size} />
    </section>
  );
}

// ── Invite Form ─────────────────────────────────────────────────────────

interface InviteFormProps {
  roles: RawRole[];
  onSubmit: (email: string, roleId: string) => void;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
}

function InviteForm({ roles, onSubmit, onCancel, loading, error }: InviteFormProps) {
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState(roles.find((r) => r.slug === 'member')?.id ?? roles[0]?.id ?? '');

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@ezycollect.com.au"
            style={{
              width: '100%',
              fontSize: 14,
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-body)',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>
            Role
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              style={{
                width: '100%',
                fontSize: 14,
                padding: '8px 12px',
                paddingRight: 32,
                borderRadius: 6,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text-body)',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <CaretDown
              size={14}
              weight="bold"
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--color-text-muted)',
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flex: '1 1 300px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              fontSize: 13,
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-body)',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(email, roleId)}
            disabled={loading || !email.trim()}
            style={{
              fontSize: 13,
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: 'var(--color-primary)',
              color: '#fff',
              cursor: loading || !email.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !email.trim() ? 0.6 : 1,
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Sending...' : 'Send Invite'}
          </button>
        </div>
      </div>
      {error && (
        <p style={{ fontSize: 13, color: 'var(--color-danger)', marginTop: 8 }}>{error}</p>
      )}
    </div>
  );
}
