'use client';

import { useState, useCallback } from 'react';
import { useRoles, type RawRole } from '@/features/role-management/useRoles';
import { getPermissionsByCategory, type Permission } from '@/platform/lib/permissions';
import { ConfirmDialog } from '@/platform/components/ConfirmDialog';

const permsByCategory = getPermissionsByCategory();

export function AdminRoles() {
  const { roles, loading, error, handleCreate, handleUpdate, handleDelete, isSubmitting } = useRoles();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ roleId: string; roleName: string } | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const showSuccess = useCallback((id: string) => {
    setSuccessId(id);
    setTimeout(() => setSuccessId(null), 2000);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 16, color: 'var(--color-text-muted)', fontSize: 13 }}>
        Loading roles...
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

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)' }}>
          Roles
        </h2>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
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
            Create Role
          </button>
        )}
      </div>

      {/* Create form */}
      {showCreateForm && (
        <RoleForm
          onSave={async (data) => {
            const ok = await handleCreate(data);
            if (ok) {
              setShowCreateForm(false);
              showSuccess('create');
            }
          }}
          onCancel={() => setShowCreateForm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Success feedback for create */}
      {successId === 'create' && (
        <div style={{ padding: 8, fontSize: 13, color: 'var(--color-success)', fontWeight: 500, marginBottom: 8 }}>
          Done
        </div>
      )}

      {/* Role list */}
      {roles.length === 0 ? (
        <div style={{ padding: 16, color: 'var(--color-text-muted)', fontSize: 13 }}>
          No roles defined.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              isEditing={editingRoleId === role.id}
              onEdit={() => setEditingRoleId(role.id)}
              onCancelEdit={() => setEditingRoleId(null)}
              onSaveEdit={async (data) => {
                const ok = await handleUpdate(role.id, data);
                if (ok) {
                  setEditingRoleId(null);
                  showSuccess(role.id);
                }
              }}
              onDelete={() => setDeleteConfirm({ roleId: role.id, roleName: role.name })}
              isSubmitting={isSubmitting}
              showSuccess={successId === role.id}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteConfirm !== null}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${deleteConfirm?.roleName ?? ''}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={isSubmitting}
        onConfirm={async () => {
          if (deleteConfirm) {
            const ok = await handleDelete(deleteConfirm.roleId);
            if (ok) {
              setDeleteConfirm(null);
            }
          }
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}

// ── Role Card ──────────────────────────────────────────────────────────

interface RoleCardProps {
  role: RawRole;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (data: { name: string; description: string; permissions: string[] }) => void;
  onDelete: () => void;
  isSubmitting: boolean;
  showSuccess: boolean;
}

function RoleCard({ role, isEditing, onEdit, onCancelEdit, onSaveEdit, onDelete, isSubmitting, showSuccess }: RoleCardProps) {
  const canEdit = !role.isSystem;
  const canDelete = !role.isSystem && role.userCount === 0;

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      {/* Card header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-heading)' }}>
            {role.name}
          </span>
          {role.isSystem && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 4,
                background: 'var(--color-primary-muted)',
                color: 'var(--color-primary)',
              }}
            >
              System
            </span>
          )}
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
            {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
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
            {role.userCount} user{role.userCount !== 1 ? 's' : ''}
          </span>
          {showSuccess && (
            <span style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 500 }}>
              Done
            </span>
          )}
        </div>
        {canEdit && !isEditing && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onEdit}
              style={{
                fontSize: 13,
                fontWeight: 500,
                padding: '4px 12px',
                borderRadius: 6,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text-body)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              disabled={!canDelete}
              title={!canDelete && role.userCount > 0 ? 'Cannot delete: users are assigned to this role' : undefined}
              style={{
                fontSize: 13,
                fontWeight: 500,
                padding: '4px 12px',
                borderRadius: 6,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: canDelete ? 'var(--color-danger)' : 'var(--color-text-muted)',
                cursor: canDelete ? 'pointer' : 'not-allowed',
                opacity: canDelete ? 1 : 0.5,
                fontFamily: 'inherit',
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      {role.description && (
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: isEditing ? 16 : 0, lineHeight: 1.4 }}>
          {role.description}
        </p>
      )}

      {/* View-only permissions for system roles */}
      {role.isSystem && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: 8 }}>
            Permissions
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {role.permissions.map((perm) => (
              <span
                key={perm}
                style={{
                  fontSize: 11,
                  fontFamily: 'monospace',
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: 'var(--color-bg-alt)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {perm}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Edit form */}
      {isEditing && (
        <RoleForm
          initial={{ name: role.name, description: role.description, permissions: role.permissions }}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

// ── Role Form (Create / Edit) ──────────────────────────────────────────

interface RoleFormProps {
  initial?: { name: string; description: string; permissions: string[] };
  onSave: (data: { name: string; description: string; permissions: string[] }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function RoleForm({ initial, onSave, onCancel, isSubmitting }: RoleFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set(initial?.permissions ?? []));
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(Object.keys(permsByCategory)));

  const togglePerm = (key: string) => {
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

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
      {/* Name input */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Role name"
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

      {/* Description textarea */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Role description"
          rows={2}
          style={{
            width: '100%',
            fontSize: 14,
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-body)',
            fontFamily: 'inherit',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Permission checklist grouped by category */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          Permissions
        </label>
        {Object.entries(permsByCategory).map(([category, perms]) => {
          const isExpanded = expandedCategories.has(category);
          const selectedCount = perms.filter((p) => selectedPerms.has(p.key)).length;
          return (
            <div
              key={category}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: 6,
                marginBottom: 8,
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => toggleCategory(category)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'var(--color-bg-alt)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>
                  {isExpanded ? '\u25BE' : '\u25B8'} {category}
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                  {selectedCount}/{perms.length}
                </span>
              </button>
              {isExpanded && (
                <div style={{ padding: '8px 12px' }}>
                  {perms.map((perm) => (
                    <label
                      key={perm.key}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        padding: '4px 0',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPerms.has(perm.key)}
                        onChange={() => togglePerm(perm.key)}
                        style={{ marginTop: 2 }}
                      />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-body)' }}>
                          {perm.label}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                          {perm.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          style={{
            fontSize: 13,
            fontWeight: 500,
            padding: '6px 16px',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-body)',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => onSave({ name, description, permissions: Array.from(selectedPerms) })}
          disabled={isSubmitting || !name.trim()}
          style={{
            fontSize: 13,
            fontWeight: 500,
            padding: '6px 16px',
            borderRadius: 6,
            border: 'none',
            background: 'var(--color-primary)',
            color: '#fff',
            cursor: isSubmitting || !name.trim() ? 'not-allowed' : 'pointer',
            opacity: isSubmitting || !name.trim() ? 0.6 : 1,
            fontFamily: 'inherit',
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
