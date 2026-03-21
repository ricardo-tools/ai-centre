'use server';

import { eq, and } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { reactions } from '@/platform/db/schema';
import { type Result, Ok, Err } from '@/platform/lib/result';

const ALLOWED_EMOJIS = ['thumbsup', 'heart', 'rocket', 'eyes', 'tada'] as const;
type Emoji = (typeof ALLOWED_EMOJIS)[number];

const EMOJI_DISPLAY: Record<Emoji, string> = {
  thumbsup: '\u{1F44D}',
  heart: '\u2764\uFE0F',
  rocket: '\u{1F680}',
  eyes: '\u{1F440}',
  tada: '\u{1F389}',
};

function getDb() {
  if (!process.env.DATABASE_URL) return null;
  const s = neon(process.env.DATABASE_URL);
  return drizzle(s);
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
      // Add reaction
      await db.insert(reactions).values({ entityType, entityId, userId, emoji });
      return Ok({ added: true });
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

export { EMOJI_DISPLAY, ALLOWED_EMOJIS };
