'use client';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant?: 'danger' | 'default';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 900, /* --z-overlay (backdrop behind modal) */
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.4)',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          maxWidth: 420,
          width: '90%',
          background: 'var(--color-surface)',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.16)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--color-text-heading)',
            marginBottom: 8,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: 'var(--color-text-muted)',
            lineHeight: 1.5,
            marginBottom: 24,
          }}
        >
          {message}
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
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
            onClick={onConfirm}
            disabled={loading}
            style={{
              fontSize: 13,
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: isDanger ? 'var(--color-danger)' : 'var(--color-primary)',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
