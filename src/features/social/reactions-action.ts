'use server';

import { eq, and } from 'drizzle-orm';
import { reactions } from '@/platform/db/schema';
import { type Result, Ok, Err } from '@/platform/lib/result';
import { getDb as getDatabase, hasDatabase } from '@/platform/db/client';

import { ALLOWED_EMOJIS, type Emoji } from './reaction-constants';

function getDb() {
  if (!hasDatabase()) return null;
  return getDatabase();
}

export async function toggleReaction(
  entityType: string,
  entityId: string,
  emoji: string,
  userId: string,
): Promise<Result<{ added: boolean }, Error>> {
  const db = getDb();
  if (!db) return Err(new Error('Database not configured'));
  if (!ALLOWED_EMOJIS.includes(emoji as Emoji)) return Err(new Error('Invalid emoji'));

  try {
    // Check if reaction exists
    const existing = await db
      .select()
      .from(reactions)
      .where(
        and(
          eq(reactions.entityType, entityType),
          eq(reactions.entityId, entityId),
          eq(reactions.userId, userId),
          eq(reactions.emoji, emoji),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      // Remove reaction
      await db.delete(reactions).where(eq(reactions.id, existing[0].id));
      return Ok({ added: false });
    } else {
      // Add reaction (ON CONFLICT handles race condition with duplicate key)
      try {
        await db.insert(reactions).values({ entityType, entityId, userId, emoji });
        return Ok({ added: true });
      } catch (insertErr: unknown) {
        // If duplicate key, treat as already exists — delete it (toggle off)
        const msg = insertErr instanceof Error ? insertErr.message : '';
        if (msg.includes('duplicate') || msg.includes('unique')) {
          const [dup] = await db.select().from(reactions).where(
            and(eq(reactions.entityType, entityType), eq(reactions.entityId, entityId), eq(reactions.userId, userId), eq(reactions.emoji, emoji)),
          ).limit(1);
          if (dup) await db.delete(reactions).where(eq(reactions.id, dup.id));
          return Ok({ added: false });
        }
        throw insertErr;
      }
    }
  } catch (err) {
    console.error('[social] toggleReaction failed:', err);
    return Err(new Error('Failed to toggle reaction'));
  }
}

export async function getReactionCounts(
  entityType: string,
  entityId: string,
  currentUserId?: string,
): Promise<{ counts: Record<string, number>; userReactions: string[] }> {
  const db = getDb();
  if (!db) return { counts: {}, userReactions: [] };

  try {
    const allReactions = await db
      .select()
      .from(reactions)
      .where(and(eq(reactions.entityType, entityType), eq(reactions.entityId, entityId)));

    const counts: Record<string, number> = {};
    const userReactions: string[] = [];

    for (const r of allReactions) {
      counts[r.emoji] = (counts[r.emoji] ?? 0) + 1;
      if (currentUserId && r.userId === currentUserId) {
        userReactions.push(r.emoji);
      }
    }

    return { counts, userReactions };
  } catch {
    return { counts: {}, userReactions: [] };
  }
}

// EMOJI_DISPLAY and ALLOWED_EMOJIS moved to reaction-constants.ts (non-server-action file)
