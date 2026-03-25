'use server';

import { eq, and } from 'drizzle-orm';
import { bookmarks } from '@/platform/db/schema';
import { type Result, Ok, Err } from '@/platform/lib/result';
import { getDb as getDatabase, hasDatabase } from '@/platform/db/client';

function getDb() {
  if (!hasDatabase()) return null;
  return getDatabase();
}

export async function toggleBookmark(
  entityType: string,
  entityId: string,
  userId: string,
): Promise<Result<{ bookmarked: boolean }, Error>> {
  const db = getDb();
  if (!db) return Err(new Error('Database not configured'));

  try {
    const existing = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.entityType, entityType),
          eq(bookmarks.entityId, entityId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      await db.delete(bookmarks).where(eq(bookmarks.id, existing[0].id));
      return Ok({ bookmarked: false });
    } else {
      await db.insert(bookmarks).values({ userId, entityType, entityId });
      return Ok({ bookmarked: true });
    }
  } catch (err) {
    console.error('[social] toggleBookmark failed:', err);
    return Err(new Error('Failed to toggle bookmark'));
  }
}

export async function isBookmarked(
  userId: string,
  entityType: string,
  entityId: string,
): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    const result = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.entityType, entityType),
          eq(bookmarks.entityId, entityId),
        ),
      )
      .limit(1);
    return result.length > 0;
  } catch {
    return false;
  }
}

export async function getMyBookmarks(
  userId: string,
  entityType?: string,
): Promise<Array<{ entityType: string; entityId: string; createdAt: Date }>> {
  const db = getDb();
  if (!db) return [];
  try {
    const query = entityType
      ? db
          .select()
          .from(bookmarks)
          .where(and(eq(bookmarks.userId, userId), eq(bookmarks.entityType, entityType)))
      : db.select().from(bookmarks).where(eq(bookmarks.userId, userId));
    const results = await query;
    return results.map((b) => ({
      entityType: b.entityType,
      entityId: b.entityId,
      createdAt: b.createdAt,
    }));
  } catch {
    return [];
  }
}
