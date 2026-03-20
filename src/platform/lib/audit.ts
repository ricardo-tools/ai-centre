/**
 * Audit logging utility.
 * Call after every successful mutation to record who did what.
 * Falls back to console.log when DATABASE_URL is not configured (dev mode).
 */

type EntityType = 'skill' | 'archetype' | 'showcase' | 'user' | 'role' | 'invitation';
type AuditAction = 'created' | 'updated' | 'published' | 'archived' | 'deleted';

interface AuditEntry {
  entityType: EntityType;
  entityId: string;
  action: AuditAction;
  userId: string;
  metadata?: Record<string, unknown>;
}

export async function writeAuditEntry(entry: AuditEntry): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.log(`[audit] ${entry.action} ${entry.entityType}:${entry.entityId} by ${entry.userId}`, entry.metadata ?? '');
    return;
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const { auditLog } = await import('@/platform/db/schema');

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    await db.insert(auditLog).values({
      entityType: entry.entityType,
      entityId: entry.entityId,
      action: entry.action,
      userId: entry.userId,
      metadata: entry.metadata,
    });
  } catch (err) {
    // Audit logging should never crash the main operation
    console.error('[audit] failed to write entry:', err);
  }
}
