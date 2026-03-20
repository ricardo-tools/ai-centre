'use client';

import { AuditLogWidget } from '@/features/audit-log/widgets/AuditLogWidget/AuditLogWidget';
import { useBreakpoint } from '@/platform/screen-renderer/useBreakpoint';

export function AdminAuditLog() {
  const size = useBreakpoint();

  return (
    <section>
      <h2
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--color-text-heading)',
          marginBottom: 16,
        }}
      >
        Audit Log
      </h2>
      <AuditLogWidget size={size} />
    </section>
  );
}
