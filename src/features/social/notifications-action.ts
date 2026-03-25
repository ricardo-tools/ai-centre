'use server';

import { eq, and, desc, isNull, sql } from 'drizzle-orm';
import { notifications, users } from '@/platform/db/schema';
import { type Result, Ok, Err, ValidationError } from '@/platform/lib/result';
import { getDb as getDatabase, hasDatabase } from '@/platform/db/client';

function getDb() {
  if (!hasDatabase()) return null;
  return getDatabase();
}

export interface NotificationData {
  id: string;
  userId: string;
  type: string;
  entityType: string;
  entityId: string;
  actorId: string;
  actorName: string;
  title: string;
  body: string | null;
  readAt: string | null;
  createdAt: string;
}

export async function getNotifications(
  userId: string,
  limit: number = 20,
): Promise<Result<{ items: NotificationData[]; unreadCount: number }, Error>> {
  const db = getDb();
  if (!db) {
    return Ok({ items: [], unreadCount: 0 });
  }

  try {
    // Fetch recent notifications (both read and unread)
    const rows = await db
      .select({
        id: notifications.id,
        userId: notifications.userId,
        type: notifications.type,
        entityType: notifications.entityType,
        entityId: notifications.entityId,
        actorId: notifications.actorId,
        actorName: users.name,
        title: notifications.title,
        body: notifications.body,
        readAt: notifications.readAt,
        createdAt: notifications.createdAt,
      })
      .from(notifications)
      .leftJoin(users, eq(notifications.actorId, users.id))
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);

    // Count unread
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          isNull(notifications.readAt),
        ),
      );

    const unreadCount = Number(countResult[0]?.count ?? 0);

    const items: NotificationData[] = rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      type: r.type,
      entityType: r.entityType,
      entityId: r.entityId,
      actorId: r.actorId,
      actorName: r.actorName ?? 'Unknown',
      title: r.title,
      body: r.body,
      readAt: r.readAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
    }));

    return Ok({ items, unreadCount });
  } catch (err) {
    console.error('[notifications] getNotifications failed:', err);
    return Ok({ items: [], unreadCount: 0 });
  }
}

export async function markNotificationRead(
  id: string,
): Promise<Result<{ success: boolean }, Error>> {
  const db = getDb();
  if (!db) {
    return Err(new ValidationError('NO_DB', 'Database not available'));
  }

  try {
    await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(eq(notifications.id, id));
    return Ok({ success: true });
  } catch (err) {
    console.error('[notifications] markNotificationRead failed:', err);
    return Err(err instanceof Error ? err : new Error('Unknown error'));
  }
}

export async function markAllRead(
  userId: string,
): Promise<Result<{ success: boolean }, Error>> {
  const db = getDb();
  if (!db) {
    return Err(new ValidationError('NO_DB', 'Database not available'));
  }

  try {
    await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(notifications.userId, userId),
          isNull(notifications.readAt),
        ),
      );
    return Ok({ success: true });
  } catch (err) {
    console.error('[notifications] markAllRead failed:', err);
    return Err(err instanceof Error ? err : new Error('Unknown error'));
  }
}

export async function createNotification(
  userId: string,
  type: string,
  entityType: string,
  entityId: string,
  actorId: string,
  title: string,
  body?: string,
): Promise<Result<{ id: string }, Error>> {
  const db = getDb();
  if (!db) {
    return Err(new ValidationError('NO_DB', 'Database not available'));
  }

  // Don't notify yourself
  if (userId === actorId) {
    return Ok({ id: '' });
  }

  try {
    const rows = await db
      .insert(notifications)
      .values({
        userId,
        type,
        entityType,
        entityId,
        actorId,
        title,
        body: body ?? null,
      })
      .returning();

    return Ok({ id: (rows[0] as Record<string, unknown>)?.id as string ?? '' });
  } catch (err) {
    console.error('[notifications] createNotification failed:', err);
    return Err(err instanceof Error ? err : new Error('Unknown error'));
  }
}
