'use client';

import type { RawAuditEntry } from '@/features/audit-log/action';
import { AuditLogLG } from './AuditLogLG';

interface AuditLogMDProps {
  entries: RawAuditEntry[];
}

export function AuditLogMD({ entries }: AuditLogMDProps) {
  return <AuditLogLG entries={entries} />;
}
