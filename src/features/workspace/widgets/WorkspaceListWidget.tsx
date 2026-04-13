'use client';

import { PencilSimple } from '@phosphor-icons/react';
import { useWorkspaceList } from './useWorkspaceList';
import { QuotaBar } from './QuotaBar';
import { QuotaEditDialog } from './QuotaEditDialog';

function formatMB(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))}`;
}

const headerStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--color-text-muted)',
  padding: '8px 16px',
  textAlign: 'left',
  borderBottom: '2px solid var(--color-border)',
};

const cellStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid var(--color-border)',
  fontSize: 14,
  color: 'var(--color-text-body)',
  verticalAlign: 'middle',
};

export function WorkspaceListWidget() {
  const {
    workspaces,
    loading,
    error,
    editingUserId,
    saving,
    openEdit,
    closeEdit,
    handleSave,
  } = useWorkspaceList();

  if (loading) {
    return (
      <div style={{ padding: 16, color: 'var(--color-text-muted)', fontSize: 13 }}>
        Loading workspaces...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 16, color: 'var(--color-danger)', fontSize: 13 }}>
        {error}
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 14 }}>
        No users found. Invite users to see their workspace quotas.
      </div>
    );
  }

  const editingWorkspace = workspaces.find((w) => w.userId === editingUserId);

  return (
    <>
      <table
        data-testid="workspace-list"
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: 'var(--color-surface)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr>
            <th style={{ ...headerStyle, width: '25%' }}>User</th>
            <th style={{ ...headerStyle, width: '20%' }}>Skills</th>
            <th style={{ ...headerStyle, width: '20%' }}>Schemas</th>
            <th style={{ ...headerStyle, width: '25%' }}>Storage (MB)</th>
            <th style={{ ...headerStyle, width: '10%', textAlign: 'right' }}></th>
          </tr>
        </thead>
        <tbody>
          {workspaces.map((w) => (
            <tr key={w.userId}>
              <td style={{ ...cellStyle, fontWeight: 500, color: 'var(--color-text-heading)' }}>
                <div>{w.name ?? 'No name'}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 400 }}>{w.email}</div>
              </td>
              <td style={cellStyle}>
                <QuotaBar
                  used={w.quotas.skillsUsed}
                  limit={w.quotas.skillLimit}
                  label="skills"
                />
              </td>
              <td style={cellStyle}>
                <QuotaBar
                  used={w.quotas.schemasUsed}
                  limit={w.quotas.schemaLimit}
                  label="schemas"
                />
              </td>
              <td style={cellStyle}>
                <QuotaBar
                  used={w.quotas.storageUsedBytes}
                  limit={w.quotas.storageLimitBytes}
                  label="storage"
                  formatValue={(n) => formatMB(n)}
                />
              </td>
              <td style={{ ...cellStyle, textAlign: 'right' }}>
                <button
                  data-testid={`edit-quotas-${w.userId}`}
                  onClick={() => openEdit(w.userId)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 13,
                    padding: '6px 12px',
                    borderRadius: 4,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-body)',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontFamily: 'inherit',
                  }}
                >
                  <PencilSimple size={14} />
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingWorkspace && (
        <QuotaEditDialog
          open={editingUserId !== null}
          email={editingWorkspace.email}
          initialValues={{
            skillLimit: editingWorkspace.quotas.skillLimit,
            schemaLimit: editingWorkspace.quotas.schemaLimit,
            storageLimitMB: Math.round(editingWorkspace.quotas.storageLimitBytes / (1024 * 1024)),
          }}
          loading={saving}
          onSave={handleSave}
          onCancel={closeEdit}
        />
      )}
    </>
  );
}
