'use client';

export function AdminHeader() {
  return (
    <div style={{ marginBottom: 8 }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--color-text-heading)',
          marginBottom: 4,
        }}
      >
        Admin
      </h1>
      <p
        style={{
          fontSize: 14,
          color: 'var(--color-text-muted)',
          lineHeight: 1.5,
        }}
      >
        Manage users, roles, and review the audit trail.
      </p>
    </div>
  );
}
