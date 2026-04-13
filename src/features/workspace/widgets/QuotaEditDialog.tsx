'use client';

import { useState, useEffect } from 'react';

interface QuotaEditDialogProps {
  open: boolean;
  email: string;
  initialValues: {
    skillLimit: number;
    schemaLimit: number;
    storageLimitMB: number;
  };
  loading: boolean;
  onSave: (values: { skillLimit: number; schemaLimit: number; storageLimitBytes: number }) => void;
  onCancel: () => void;
}

export function QuotaEditDialog({
  open,
  email,
  initialValues,
  loading,
  onSave,
  onCancel,
}: QuotaEditDialogProps) {
  const [skillLimit, setSkillLimit] = useState(initialValues.skillLimit);
  const [schemaLimit, setSchemaLimit] = useState(initialValues.schemaLimit);
  const [storageMB, setStorageMB] = useState(initialValues.storageLimitMB);

  useEffect(() => {
    setSkillLimit(initialValues.skillLimit);
    setSchemaLimit(initialValues.schemaLimit);
    setStorageMB(initialValues.storageLimitMB);
  }, [initialValues]);

  if (!open) return null;

  const handleSave = () => {
    onSave({
      skillLimit,
      schemaLimit,
      storageLimitBytes: storageMB * 1024 * 1024,
    });
  };

  const inputStyle: React.CSSProperties = {
    width: 80,
    fontSize: 14,
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    color: 'var(--color-text-body)',
    fontFamily: 'inherit',
    textAlign: 'right',
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 14,
    color: 'var(--color-text-body)',
    marginBottom: 16,
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.4)',
      }}
      onClick={onCancel}
    >
      <div
        data-testid="quota-edit-dialog"
        style={{
          maxWidth: 380,
          width: '90%',
          background: 'var(--color-surface)',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.16)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>
          Edit Quotas
        </h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24 }}>
          {email}
        </p>

        <div style={labelStyle}>
          <span>Skill limit</span>
          <input
            type="number"
            min={0}
            value={skillLimit}
            onChange={(e) => setSkillLimit(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={labelStyle}>
          <span>Schema limit</span>
          <input
            type="number"
            min={0}
            value={schemaLimit}
            onChange={(e) => setSchemaLimit(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={labelStyle}>
          <span>Storage (MB)</span>
          <input
            type="number"
            min={0}
            value={storageMB}
            onChange={(e) => setStorageMB(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
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
              opacity: loading ? 0.5 : 1,
              fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            data-testid="quota-save"
            onClick={handleSave}
            disabled={loading}
            style={{
              fontSize: 13,
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: 'var(--color-primary)',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
