'use server';

import { requirePermission } from '@/platform/lib/guards';
import { type Result, Ok, Err } from '@/platform/lib/result';

export interface RawAuditEntry {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  userId: string;
  userName: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export async function fetchAuditLog(): Promise<Result<RawAuditEntry[], Error>> {
  const auth = await requirePermission('audit:view');
  if (!auth.ok) return auth;

  if (!process.env.DATABASE_URL) {
    return Ok([]);
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const { desc, eq } = require('drizzle-orm');
    const { auditLog, users } = await import('@/platform/db/schema');

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    const rows = await db
      .select({
        id: auditLog.id,
        entityType: auditLog.entityType,
        entityId: auditLog.entityId,
        action: auditLog.action,
        userId: auditLog.userId,
        userName: users.name,
        metadata: auditLog.metadata,
        createdAt: auditLog.createdAt,
      })
      .from(auditLog)
      .leftJoin(users, eq(auditLog.userId, users.id))
      .orderBy(desc(auditLog.createdAt))
      .limit(100);

    const mapped: RawAuditEntry[] = rows.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      entityType: row.entityType as string,
      entityId: row.entityId as string,
      action: row.action as string,
      userId: row.userId as string,
      userName: (row.userName as string) ?? 'Unknown',
      metadata: row.metadata as Record<string, unknown> | null,
      createdAt: (row.createdAt as Date).toISOString(),
    }));

    return Ok(mapped);
  } catch (err) {
    console.error('[audit-log] fetchAuditLog failed:', err);
    return Err(new Error('Failed to load audit log. Please try again.'));
  }
}
