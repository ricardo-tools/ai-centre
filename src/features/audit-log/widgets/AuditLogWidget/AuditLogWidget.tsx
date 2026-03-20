'use client';

import type { RenderableWidget, SizeVariant } from '@/platform/screen-renderer/types';
import { useAuditLog } from './useAuditLog';
import { AuditLogXS } from './AuditLogXS';
import { AuditLogSM } from './AuditLogSM';
import { AuditLogMD } from './AuditLogMD';
import { AuditLogLG } from './AuditLogLG';

import type { RawAuditEntry } from '@/features/audit-log/action';

type AuditLogSizeProps = {
  entries: RawAuditEntry[];
};

const SIZE_MAP: Record<SizeVariant, React.ComponentType<AuditLogSizeProps>> = {
  xs: AuditLogXS,
  sm: AuditLogSM,
  md: AuditLogMD,
  lg: AuditLogLG,
};

export const widgetName = 'AuditLogWidget';

export function AuditLogWidget({ size }: RenderableWidget) {
  const { entries, loading, error } = useAuditLog();

  if (loading) {
    return (
      <div style={{ padding: 16, color: 'var(--color-text-muted)', fontSize: 13 }}>
        Loading audit log...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 16, color: 'var(--color-danger, #ef4444)', fontSize: 13 }}>
        {error}
      </div>
    );
  }

  const SizeComponent = SIZE_MAP[size] ?? SIZE_MAP.lg;
  return <SizeComponent entries={entries} />;
}
